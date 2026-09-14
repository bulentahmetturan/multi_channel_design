// Visual Quality P2, Category 2 -- validates product-image-geometry.schema.json
// against the two real Kaduse product cutout analyses. Dependency-free, same
// approach as curation.test.mjs (Node's built-in test runner + a small
// hand-rolled JSON Schema subset validator), extended here with minimal
// `$ref`/`$defs` resolution since this schema factors out rect/point shapes.
// Run with: node --test design-system/schemas/src/product-image-geometry.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');

function loadJson(relPath) {
  return JSON.parse(readFileSync(path.join(repoRoot, relPath), 'utf-8'));
}

function resolveRef(schema, root) {
  if (schema && typeof schema === 'object' && typeof schema.$ref === 'string') {
    const key = schema.$ref.replace('#/$defs/', '');
    return root.$defs[key];
  }
  return schema;
}

// Minimal validator -- returns an array of error strings (empty = valid).
function validate(schemaIn, value, root, pointer = '') {
  const schema = resolveRef(schemaIn, root);
  const errors = [];
  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${pointer}: expected const ${JSON.stringify(schema.const)}, got ${JSON.stringify(value)}`);
    return errors;
  }
  if (schema.enum !== undefined && !schema.enum.includes(value)) {
    errors.push(`${pointer}: expected one of ${JSON.stringify(schema.enum)}, got ${JSON.stringify(value)}`);
    return errors;
  }
  if (schema.type === 'object') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      errors.push(`${pointer}: expected object`);
      return errors;
    }
    for (const req of schema.required ?? []) {
      if (!(req in value)) errors.push(`${pointer}: missing required property "${req}"`);
    }
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const key of Object.keys(value)) {
        if (!allowed.has(key)) errors.push(`${pointer}: unexpected additional property "${key}"`);
      }
    }
    for (const [key, subSchema] of Object.entries(schema.properties ?? {})) {
      if (key in value) errors.push(...validate(subSchema, value[key], root, `${pointer}.${key}`));
    }
    return errors;
  }
  if (schema.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(`${pointer}: expected string`);
      return errors;
    }
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${pointer}: shorter than minLength ${schema.minLength}`);
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) errors.push(`${pointer}: does not match pattern ${schema.pattern}`);
    return errors;
  }
  if (schema.type === 'number') {
    if (typeof value !== 'number') {
      errors.push(`${pointer}: expected number`);
      return errors;
    }
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${pointer}: below minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${pointer}: above maximum ${schema.maximum}`);
    return errors;
  }
  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${pointer}: expected array`);
      return errors;
    }
    if (schema.items) value.forEach((v, i) => errors.push(...validate(schema.items, v, root, `${pointer}[${i}]`)));
    return errors;
  }
  return errors;
}

function assertValid(schema, value, label) {
  const errors = validate(schema, value, schema, label);
  assert.deepEqual(errors, [], `${label} failed schema validation:\n${errors.join('\n')}`);
}

const geometrySchema = loadJson('design-system/schemas/src/product-image-geometry.schema.json');
const assets = [
  'channels/kaduse-medikal/product-catalog/assets/classic-iii-5620-kadusesite-cutout.metadata.json',
  'channels/kaduse-medikal/product-catalog/assets/stethoscope-cutout.metadata.json',
].map(loadJson);

test('both real Kaduse product cutout analyses validate against product-image-geometry.schema.json', () => {
  for (const asset of assets) {
    assertValid(geometrySchema, asset, `product-image-geometry:${asset.sourceFile}`);
  }
});

test('every analysis records a real, non-empty analysisMethod (not a hand-authored estimate)', () => {
  for (const asset of assets) {
    assert.ok(asset.analysisMethod.includes('analyze_product_image.py'));
  }
});

test('visiblePixelBounds is a tight crop, strictly smaller than the full canvas', () => {
  for (const asset of assets) {
    const { canvas, visiblePixelBounds: b } = asset;
    assert.ok(b.width <= canvas.width && b.height <= canvas.height);
    assert.ok(b.width * b.height < canvas.width * canvas.height, 'the visible bounds must be a real crop, not the full canvas rectangle');
  }
});

test('a chestpiece candidate, when present, is explicitly labeled a heuristic, never asserted as verified', () => {
  for (const asset of assets) {
    if (asset.chestpieceCandidate) {
      assert.match(asset.chestpieceCandidate.note, /heuristic|not a verified/i);
    }
  }
});

test('every suggested crop stays fully within the real canvas bounds (regression: an earlier version clamped width/height to the canvas but never re-clamped x/y, letting x+width or y+height overshoot by a few px whenever the unclamped box already sat near an edge)', () => {
  for (const asset of assets) {
    for (const [family, rect] of Object.entries(asset.suggestedCrops)) {
      assert.ok(rect.x >= 0, `${asset.sourceFile} ${family}: x < 0`);
      assert.ok(rect.y >= 0, `${asset.sourceFile} ${family}: y < 0`);
      assert.ok(rect.x + rect.width <= asset.canvas.width, `${asset.sourceFile} ${family}: x+width (${rect.x + rect.width}) exceeds canvas width (${asset.canvas.width})`);
      assert.ok(rect.y + rect.height <= asset.canvas.height, `${asset.sourceFile} ${family}: y+height (${rect.y + rect.height}) exceeds canvas height (${asset.canvas.height})`);
    }
  }
});

test('every criticalRegions entry states why it is critical (no bare flag with no reason)', () => {
  for (const asset of assets) {
    for (const region of asset.criticalRegions) {
      assert.ok(region.reason.length > 10);
    }
  }
});
