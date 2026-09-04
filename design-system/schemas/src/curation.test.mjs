// Batch A5-D -- validates the three new curation schemas (Post Archetype,
// Evaluation Case, Visual Direction) and the real Kaduse data instances
// against them. Deliberately dependency-free: this repo is still in its
// foundation stage (no test runner installed at the root), so this uses
// only Node's built-in test runner + a small hand-rolled JSON Schema
// subset validator (type/required/properties/additionalProperties/enum/
// const/pattern) -- enough for these three flat, non-$ref schemas. Run
// with: node --test design-system/schemas/src/curation.test.mjs
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

// Minimal validator -- returns an array of error strings (empty = valid).
function validate(schema, value, pointer = '') {
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
      if (key in value) errors.push(...validate(subSchema, value[key], `${pointer}.${key}`));
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
  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${pointer}: expected array`);
      return errors;
    }
    if (schema.items) value.forEach((v, i) => errors.push(...validate(schema.items, v, `${pointer}[${i}]`)));
    return errors;
  }
  return errors;
}

function assertValid(schema, value, label) {
  const errors = validate(schema, value, label);
  assert.deepEqual(errors, [], `${label} failed schema validation:\n${errors.join('\n')}`);
}

const postArchetypeSchema = loadJson('design-system/schemas/src/post-archetype.schema.json');
const evaluationCaseSchema = loadJson('design-system/schemas/src/evaluation-case.schema.json');
const visualDirectionSchema = loadJson('design-system/schemas/src/visual-direction.schema.json');

const postArchetypes = loadJson('channels/kaduse-medikal/content/post-archetypes.json');
const evaluationCase = loadJson('channels/kaduse-medikal/content/evaluation-cases/product-promotion-message-led-sparse-v1.json');
const directionFiles = ['01', '02', '03', '04'].map((n) =>
  loadJson(`channels/kaduse-medikal/content/visual-directions/product-promotion-message-led-sparse-v1-direction-${n}.json`)
);

// --- 11/12: Post Archetype -------------------------------------------------
test('11. arbitrary channel-owned Post Archetype IDs are allowed (kebab-case pattern only, no closed enum)', () => {
  for (const archetype of postArchetypes.archetypes) {
    assertValid(postArchetypeSchema, archetype, `post-archetype:${archetype.id}`);
  }
  // The schema's `id` field is pattern-constrained, not enum-constrained --
  // proving no closed global list exists.
  assert.equal(postArchetypeSchema.properties.id.enum, undefined);
  assert.ok(postArchetypeSchema.properties.id.pattern);
});

test('12. Post Archetype is distinct from publishing shape (no shared field/vocabulary)', () => {
  const archetypeKeys = Object.keys(postArchetypeSchema.properties);
  assert.ok(!archetypeKeys.includes('publishingShape'));
  assert.ok(!archetypeKeys.includes('narrativeStructure'));
  assert.ok(!archetypeKeys.includes('densityBand'));
});

// --- 13/14/15: Evaluation Case ---------------------------------------------
test('13. Evaluation Case requires a real content reference/payload', () => {
  assertValid(evaluationCaseSchema, evaluationCase, 'evaluation-case');
  assert.equal(evaluationCase.content.isAuthoritative, true);
  assert.ok(evaluationCase.content.provenance.length > 0);
});

test('14. Evaluation Case records derived density/narrative/publishingShape evidence', () => {
  assert.equal(evaluationCase.derivedProfile.densityBand, 'SPARSE');
  assert.equal(evaluationCase.derivedProfile.narrativeStructure, 'SINGLE_STATEMENT');
  assert.equal(evaluationCase.derivedProfile.publishingShape, 'SINGLE_POST');
  assert.ok(evaluationCase.derivedProfile.computedBy.includes('channel-content-os'));
});

test('15. no ContentStyle field is required (or present) on Evaluation Case', () => {
  const requiredKeys = evaluationCaseSchema.required;
  for (const forbidden of ['contentStyle', 'contentVariant', 'contentProfile']) {
    assert.ok(!requiredKeys.includes(forbidden));
    assert.ok(!(forbidden in evaluationCase));
  }
  // `notes` exists but is explicitly documented as non-authoritative and is
  // NOT in `required`.
  assert.ok(!evaluationCaseSchema.required.includes('notes'));
});

// --- 16/17/18/19: Visual Direction -----------------------------------------
test('16. every Visual Direction belongs to the Evaluation Case', () => {
  for (const direction of directionFiles) {
    assertValid(visualDirectionSchema, direction, `visual-direction:${direction.id}`);
    assert.equal(direction.evaluationCaseId, evaluationCase.id);
  }
});

test('17. CANDIDATE/APPROVED/REJECTED/RETIRED all validate', () => {
  const base = directionFiles[0];
  for (const status of ['CANDIDATE', 'APPROVED', 'REJECTED', 'RETIRED']) {
    assertValid(visualDirectionSchema, { ...base, status }, `status:${status}`);
  }
});

test('18. an invalid status fails', () => {
  const base = directionFiles[0];
  const errors = validate(visualDirectionSchema, { ...base, status: 'PUBLISHED' }, 'invalid-status');
  assert.ok(errors.length > 0);
});

test('19. approval does not imply production readiness -- no such status/field exists in the model', () => {
  assert.ok(!visualDirectionSchema.properties.status.enum.includes('PRODUCTION_READY'));
  assert.ok(!visualDirectionSchema.properties.status.enum.includes('PUBLISHED'));
  // typography.productionApproved is structurally locked to false at this stage.
  assert.equal(visualDirectionSchema.properties.typography.properties.productionApproved.const, false);
  for (const direction of directionFiles) {
    assert.equal(direction.typography.productionApproved, false);
    assert.equal(direction.status, 'CANDIDATE'); // none pre-approved by this batch
  }
});

test('all four real Kaduse directions reference real provenance, not "the repo chose this"', () => {
  for (const direction of directionFiles) {
    assert.ok(direction.layout.provenance.length > 20);
    assert.notEqual(direction.layout.provenance.trim(), 'the repo chose this');
  }
});

test('no artifact path is invented -- EXTERNAL_EVALUATION_HISTORY carries no `path`', () => {
  for (const direction of directionFiles) {
    assert.equal(direction.artifact.kind, 'EXTERNAL_EVALUATION_HISTORY');
    assert.equal(direction.artifact.path, undefined);
  }
});
