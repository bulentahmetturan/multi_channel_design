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
const research = loadJson('channels/kaduse-medikal/content/policies/research.json');
const kaduseNews = loadJson('channels/kaduse-medikal/content/policies/kaduse-news.json');
const newsSources = loadJson('channels/kaduse-medikal/content/news-sources.json');

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
test('12. no layout/typography/art-direction/composition keys exist in any policy file', () => {
  const banned = ['layout', 'typography', 'font', 'fontFamily', 'artDirection', 'composition', 'canvas', 'compositionMode', 'colorPalette'];
  const serialized = JSON.stringify(promotion) + JSON.stringify(comparison) + JSON.stringify(research) + JSON.stringify(kaduseNews) + JSON.stringify(newsSources);
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

// 15: other candidate archetypes remain unregistered (as of Batch K2A)
test('15. the other candidate post types remain unregistered', () => {
  const registeredIds = registry.archetypes.map((a) => a.id);
  assert.deepEqual(registeredIds.sort(), ['kaduse-news', 'product-comparison', 'product-promotion', 'research']);
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

// --- Batch K2B: Research archetype -----------------------------------------

test('16. canonical Research archetype ID is exactly "research"', () => {
  const entry = findArchetype('research');
  assert.ok(entry, 'research missing from registry');
  assert.equal(entry.id, 'research');
  assert.equal(research.archetypeId, 'research');
});

test('17. Research is USER_APPROVED', () => {
  const entry = findArchetype('research');
  assert.equal(entry.status, 'ACTIVE');
  assert.equal(research.approvalStatus, 'USER_APPROVED');
});

test('18. old candidate "clinical-evidence-research-summary" is not an active canonical archetype', () => {
  const registeredIds = registry.archetypes.map((a) => a.id);
  assert.ok(!registeredIds.includes('clinical-evidence-research-summary'));
  assert.equal(research.supersedes.candidateLabel, 'Clinical Evidence / Research Summary');
});

test('19. Research is study-centric, not event-centric', () => {
  assert.equal(research.centricity, 'SOURCE_STUDY_CENTRIC');
  assert.equal(research.primaryEditorialQuestion, 'What did the study examine, and what did it find?');
});

test('20. Kaduse News is explicitly not merged into Research, and Research is unaffected by its registration', () => {
  assert.equal(research.boundaryWithKaduseNews.kaduseNews.centricity, 'event/development-centric');
  assert.equal(research.boundaryWithKaduseNews.kaduseNews.archetypeId, 'kaduse-news');
  assert.equal(research.boundaryWithKaduseNews.kaduseNews.status, 'REGISTERED');
  const registeredIds = registry.archetypes.map((a) => a.id);
  assert.ok(!registeredIds.includes('medical-news'));
});

test('21. evidence-safety rule forbids association-to-causation overstatement', () => {
  assert.ok(research.evidenceSafetyRule.rule.includes('association into causation'));
  assert.ok(research.evidenceSafetyRule.forbiddenPattern.length > 20);
});

test('22. existing Product Promotion and Product Comparison policies remain unchanged by the Research addition', () => {
  const ids = promotion.subtypes.map((s) => s.id).sort();
  assert.deepEqual(ids, ['same-series-variant-showcase', 'single-product-hero-promotion']);
  assert.equal(comparison.cardinality.requiredDistinctSeriesCount, 2);
});

// --- Batch N1: Kaduse News + Global News Hub architecture lock -------------

test('23. Kaduse News canonical archetype id is exactly "kaduse-news" and is USER_APPROVED', () => {
  const entry = findArchetype('kaduse-news');
  assert.ok(entry, 'kaduse-news missing from registry');
  assert.equal(entry.id, 'kaduse-news');
  assert.equal(entry.status, 'ACTIVE');
  assert.equal(kaduseNews.archetypeId, 'kaduse-news');
  assert.equal(kaduseNews.approvalStatus, 'USER_APPROVED');
});

test('24. Kaduse News includes external medical/industry news', () => {
  const area = kaduseNews.coverageAreas.externalMedicalIndustryNews;
  assert.ok(area.examples.includes('FDA approval'));
  assert.ok(area.examples.includes('WHO development'));
});

test('25. Kaduse News includes Kaduse/company news', () => {
  const area = kaduseNews.coverageAreas.kaduseCompanyNews;
  assert.ok(area.examples.includes('new product arrival'));
  assert.ok(area.examples.includes('company announcement'));
});

test('26. a separate canonical "medical-news" archetype is absent, and its retirement is recorded', () => {
  const registeredIds = registry.archetypes.map((a) => a.id);
  assert.ok(!registeredIds.includes('medical-news'));
  assert.ok(kaduseNews.supersedes.note.includes('Medical News'));
  assert.ok(kaduseNews.supersedes.note.toLowerCase().includes('retired'));
});

test('27. Research remains separate and its own approved semantics are unchanged', () => {
  const entry = findArchetype('research');
  assert.equal(entry.status, 'ACTIVE');
  assert.equal(research.approvalStatus, 'USER_APPROVED');
  assert.equal(research.centricity, 'SOURCE_STUDY_CENTRIC');
  assert.equal(kaduseNews.boundaryWithResearch.research.archetypeId, 'research');
  assert.ok(kaduseNews.boundaryWithResearch.rule.includes('never collapsed'));
});

test('28. Kaduse News source pack holds real, user-approved subscriptions as of Batch N2-FINAL (supersedes the Batch N1 empty placeholder)', () => {
  assert.equal(newsSources.status, 'ACTIVE_SUBSCRIPTIONS');
  assert.equal(newsSources.subscriptions.length, 59);
  assert.equal(newsSources.subscriptionCount, newsSources.subscriptions.length);
  assert.ok(newsSources.sourceRecordContract.fields.length > 0);
  // every subscription references a global source/target by ID only -- no
  // duplicated publisher/URL metadata (full cross-repo proof lives in
  // news-source-mapping.test.mjs).
  for (const sub of newsSources.subscriptions) {
    assert.ok(sub.sourceId && sub.targetId && sub.channelId === 'kaduse-medikal');
  }
});

test('29. Kaduse News policy names the Global News Hub as engine owner, and channel config stays here', () => {
  assert.ok(kaduseNews.sourcingModel.engineOwner.includes('channel-content-os'));
  assert.ok(kaduseNews.sourcingModel.channelConfigOwner.includes('multi_channel_design'));
  assert.equal(kaduseNews.sourcingModel.sourcePackPath, 'channels/kaduse-medikal/content/news-sources.json');
});

test('30. the top-level radar/ scaffold is retired (no directory, no stray files)', () => {
  assert.ok(!existsSync(path.join(repoRoot, 'radar')));
});

test('31. ADR-0003 exists and explicitly supersedes ADR-0002\'s radar-location decision', () => {
  const adr3 = readFileSync(path.join(repoRoot, 'docs/decisions/0003-global-news-hub-supersedes-radar-location.md'), 'utf-8');
  assert.ok(adr3.includes('Global News Hub'));
  assert.ok(adr3.includes('Supersedes'));
  const adr2 = readFileSync(path.join(repoRoot, 'docs/decisions/0002-portfolio-architecture.md'), 'utf-8');
  assert.ok(adr2.includes('Superseded in part by ADR-0003'));
});
