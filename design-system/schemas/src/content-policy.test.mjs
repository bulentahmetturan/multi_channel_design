// Batch K2A -- validates the two approved Kaduse content policies (Product
// Promotion, Product Comparison) and their interaction with the existing
// A5-D curation state. Dependency-free (Node's built-in test runner), same
// convention as curation.test.mjs. Run with:
// node --test design-system/schemas/src/content-policy.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');

function loadJson(relPath) {
  return JSON.parse(readFileSync(path.join(repoRoot, relPath), 'utf-8'));
}

const registry = loadJson('channels/kaduse-medikal/content/post-archetypes.json');
const promotion = loadJson('channels/kaduse-medikal/content/policies/product-promotion.json');
const comparison = loadJson('channels/kaduse-medikal/content/policies/product-comparison.json');

function findArchetype(id) {
  return registry.archetypes.find((a) => a.id === id);
}

// 1/2: both archetypes approved
test('1. product-promotion is approved', () => {
  const entry = findArchetype('product-promotion');
  assert.ok(entry, 'product-promotion missing from registry');
  assert.equal(entry.status, 'ACTIVE');
  assert.equal(promotion.approvalStatus, 'USER_APPROVED');
  assert.equal(promotion.archetypeId, 'product-promotion');
});

test('2. product-comparison is approved', () => {
  const entry = findArchetype('product-comparison');
  assert.ok(entry, 'product-comparison missing from registry');
  assert.equal(entry.status, 'ACTIVE');
  assert.equal(comparison.approvalStatus, 'USER_APPROVED');
  assert.equal(comparison.archetypeId, 'product-comparison');
});

// 3/4: exact subtype set, joint-promotion removed
test('3. Product Promotion has exactly the two approved subtypes', () => {
  const ids = promotion.subtypes.map((s) => s.id).sort();
  assert.deepEqual(ids, ['same-series-variant-showcase', 'single-product-hero-promotion']);
});

test('4. Different Products / Joint Promotion does not exist as an active subtype', () => {
  const activeIds = promotion.subtypes.map((s) => s.id);
  assert.ok(!activeIds.includes('different-products-joint-promotion'));
  const removed = promotion.removedSubtypes.find((s) => s.id === 'different-products-joint-promotion');
  assert.ok(removed, 'expected a removedSubtypes record explaining the removal');
  assert.ok(removed.removedReason.length > 20);
});

// 5/6/7: comparison cardinality
test('5. Product Comparison requires exactly two different series', () => {
  assert.equal(comparison.cardinality.requiredProductCount, 2);
  assert.equal(comparison.cardinality.requiredDistinctSeriesCount, 2);
});

test('6. same-series comparison is forbidden', () => {
  assert.equal(comparison.cardinality.sameSeriesComparisonForbidden, true);
  assert.equal(comparison.cardinality.minDistinctSeries, 2);
});

test('7. 3+ series comparison is forbidden', () => {
  assert.equal(comparison.cardinality.threeOrMoreSeriesComparisonForbidden, true);
  assert.equal(comparison.cardinality.maxDistinctSeries, 2);
});

// 8/9/10/11: comparison content structure
test('8. objective differences are the primary comparison content', () => {
  assert.equal(comparison.content.primary.priority, 'PRIMARY');
  assert.ok(comparison.content.primary.candidateDimensions.length > 0);
});

test('9. common points are allowed as secondary, optional content', () => {
  assert.equal(comparison.content.commonPoints.priority, 'SECONDARY');
  assert.equal(comparison.content.commonPoints.optional, true);
});

test('10. small evidence-grounded guidance is allowed, marked secondary', () => {
  assert.equal(comparison.content.guidance.priority, 'SECONDARY');
  assert.equal(comparison.content.guidance.optional, true);
});

test('11. no unsupported suitability claims are canonicalized', () => {
  const forbidden = comparison.content.guidance.forbiddenClaims;
  assert.ok(forbidden.includes('best for medical students'));
  assert.ok(forbidden.includes('best for cardiologists'));
  assert.ok(forbidden.length >= 4);
});

// 12: no design decisions stored in either policy file
test('12. no layout/typography/art-direction/composition keys exist in either policy file', () => {
  const banned = ['layout', 'typography', 'font', 'fontFamily', 'artDirection', 'composition', 'canvas', 'compositionMode', 'colorPalette'];
  const serialized = JSON.stringify(promotion) + JSON.stringify(comparison);
  for (const term of banned) {
    // case-sensitive key-shaped check: term as a JSON key ("term":)
    assert.ok(!serialized.includes(`"${term}":`), `found banned design key "${term}"`);
  }
});

// 13: product catalog remains the authoritative source
test('13. product catalog remains the authoritative product-data source', () => {
  assert.equal(promotion.productTruthSource, 'channels/kaduse-medikal/product-catalog/');
  assert.equal(comparison.productTruthSource, 'channels/kaduse-medikal/product-catalog/');
  assert.ok(existsSync(path.join(repoRoot, 'channels/kaduse-medikal/product-catalog/products.json')));
});

// 14: existing evaluation case untouched
test('14. existing Product Promotion evaluation case remains unchanged', () => {
  const evalCase = loadJson('channels/kaduse-medikal/content/evaluation-cases/product-promotion-message-led-sparse-v1.json');
  assert.equal(evalCase.derivedProfile.densityBand, 'SPARSE');
  assert.equal(evalCase.derivedProfile.narrativeStructure, 'SINGLE_STATEMENT');
  const directionStatuses = ['01', '02', '03', '04'].map(
    (n) => loadJson(`channels/kaduse-medikal/content/visual-directions/product-promotion-message-led-sparse-v1-direction-${n}.json`).status
  );
  assert.deepEqual(directionStatuses, ['CANDIDATE', 'CANDIDATE', 'CANDIDATE', 'CANDIDATE']);
});

// 15: other 9 candidate archetypes remain unregistered
test('15. the other 9 candidate post types remain unregistered', () => {
  const registeredIds = registry.archetypes.map((a) => a.id);
  assert.deepEqual(registeredIds.sort(), ['product-comparison', 'product-promotion']);
  const forbiddenCandidateIds = [
    'medical-news',
    'special-day',
    'clinical-education',
    'stethoscope-usage',
    'product-selection-guide',
    'testimonial-ugc',
    'campaign-offer-giveaway',
    'clinical-evidence-research-summary',
    'community-event-social-responsibility',
  ];
  for (const id of forbiddenCandidateIds) {
    assert.ok(!registeredIds.includes(id));
  }
});
