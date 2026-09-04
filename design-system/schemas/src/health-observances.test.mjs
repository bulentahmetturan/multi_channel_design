// Batch O2 -- validates Kaduse's own health/profession/awareness observance
// calendar (channels/kaduse-medikal/content/health-observances.json). This is
// Kaduse-owned truth end-to-end, so this test is fully local -- no sibling
// repo dependency, same discipline as observance-mapping.test.mjs and
// news-source-subscriptions.test.mjs.
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

const health = loadJson('channels/kaduse-medikal/content/health-observances.json');
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validClasses = new Set([
  'HEALTHCARE_PROFESSION_DAY',
  'HEALTHCARE_PROFESSION_WEEK',
  'HEALTH_AWARENESS_DAY',
  'HEALTH_AWARENESS_WEEK',
  'HEALTH_AWARENESS_MONTH',
]);
const validDateRuleKinds = new Set(['FIXED_DATE', 'FIXED_RANGE', 'MONTH', 'VARIABLE_ANNUAL_DATE']);

test('1. exactly 57 Kaduse-only health observances are registered', () => {
  assert.equal(health.observances.length, 57);
  assert.equal(health.observanceCount, health.observances.length);
});

test('2. every health observance ID is unique and syntactically valid', () => {
  const ids = health.observances.map((o) => o.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, idPattern, `malformed id ${id}`);
});

test('3. only the five authorised classes exist', () => {
  const classes = new Set(health.observances.map((o) => o.class));
  for (const c of classes) assert.ok(validClasses.has(c), `unauthorised class ${c}`);
  assert.equal(classes.size, 5);
});

test('class distribution matches the exact authoritative breakdown (4/3/5/11/34)', () => {
  const byClass = {};
  for (const o of health.observances) byClass[o.class] = (byClass[o.class] ?? 0) + 1;
  assert.equal(byClass.HEALTHCARE_PROFESSION_DAY, 4);
  assert.equal(byClass.HEALTHCARE_PROFESSION_WEEK, 3);
  assert.equal(byClass.HEALTH_AWARENESS_MONTH, 5);
  assert.equal(byClass.HEALTH_AWARENESS_WEEK, 11);
  assert.equal(byClass.HEALTH_AWARENESS_DAY, 34);
});

test('4. lead-time policy is structurally represented and consistently applied per class', () => {
  const policy = health.leadTimePolicy;
  assert.equal(policy.HEALTHCARE_PROFESSION_DAY, 6);
  assert.equal(policy.HEALTHCARE_PROFESSION_WEEK, 6);
  assert.equal(policy.HEALTH_AWARENESS_DAY, 4);
  assert.equal(policy.HEALTH_AWARENESS_WEEK, 5);
  assert.equal(policy.HEALTH_AWARENESS_MONTH, 6);
  for (const o of health.observances) {
    assert.equal(o.defaultLeadDays, policy[o.class], `${o.id} defaultLeadDays does not match its class policy`);
  }
});

test('5. month observances prepare before month start (MONTH date rule + non-zero lead days)', () => {
  const monthObservances = health.observances.filter((o) => o.dateRule.kind === 'MONTH');
  assert.equal(monthObservances.length, 5);
  for (const o of monthObservances) {
    assert.equal(o.class, 'HEALTH_AWARENESS_MONTH');
    assert.ok(o.defaultLeadDays > 0, `${o.id} must have positive lead days to prepare before month start`);
    assert.ok(o.dateRule.month >= 1 && o.dateRule.month <= 12);
  }
});

test('6. variable annual dates are never fabricated -- exactly 3, all explicitly unresolved', () => {
  const variableObservances = health.observances.filter((o) => o.dateRule.kind === 'VARIABLE_ANNUAL_DATE');
  assert.equal(variableObservances.length, 3);
  for (const o of variableObservances) {
    assert.equal(o.dateRule.yearSpecificDateStatus, 'UNRESOLVED_NO_ALGORITHM_INVENTED');
    assert.ok(o.dateRule.resolutionMechanism.length > 10);
  }
  const ids = variableObservances.map((o) => o.id).sort();
  assert.deepEqual(ids, ['kaduse-world-hospice-palliative-care-day', 'kaduse-world-kidney-day', 'kaduse-world-leprosy-day'].sort());
});

test('date rule kinds are exactly the four authorised kinds, matching declared counts', () => {
  for (const o of health.observances) {
    assert.ok(validDateRuleKinds.has(o.dateRule.kind), `${o.id} has unauthorised date rule kind ${o.dateRule.kind}`);
  }
  const byKind = {};
  for (const o of health.observances) byKind[o.dateRule.kind] = (byKind[o.dateRule.kind] ?? 0) + 1;
  assert.equal(byKind.FIXED_DATE, 35);
  assert.equal(byKind.FIXED_RANGE, 14);
  assert.equal(byKind.MONTH, 5);
  assert.equal(byKind.VARIABLE_ANNUAL_DATE, 3);
});

test('7. all 57 are Kaduse-owned only -- none exist in the global all-project registry (observances.json)', () => {
  const globalMapping = loadJson('channels/kaduse-medikal/content/observances.json');
  const globalIds = new Set(globalMapping.mappings.map((m) => m.observanceId));
  for (const o of health.observances) {
    assert.ok(!globalIds.has(o.id), `${o.id} leaked into the global all-project mapping`);
  }
  // The two files must not overlap in ID namespace at all (tr-* vs kaduse-*).
  const healthIds = new Set(health.observances.map((o) => o.id));
  for (const gid of globalIds) assert.ok(!healthIds.has(gid));
});

test('8. profession days/weeks carry the Special Day / Profession Recognition routing hint', () => {
  const hint = health.routingSemantics.HEALTHCARE_PROFESSION_DAY_OR_WEEK;
  assert.equal(hint.preferredArchetypeHint, 'special-day');
  assert.equal(hint.preferredSubtypeHint, 'PROFESSION_RECOGNITION');
  const professionObservances = health.observances.filter((o) => o.class === 'HEALTHCARE_PROFESSION_DAY' || o.class === 'HEALTHCARE_PROFESSION_WEEK');
  assert.equal(professionObservances.length, 7);
});

test('9. awareness dates are NOT forced into Special Day -- candidate hints include an alternative', () => {
  const hint = health.routingSemantics.HEALTH_AWARENESS_DAY_OR_WEEK_OR_MONTH;
  assert.ok(Array.isArray(hint.candidateArchetypeHints));
  assert.ok(hint.candidateArchetypeHints.includes('special-day'));
  assert.ok(hint.candidateArchetypeHints.includes('clinical-education'));
  assert.ok(hint.candidateArchetypeHints.length >= 2, 'must not be a single forced archetype');
});

test('neither routing-hint archetype is a registered post archetype yet', () => {
  const postArchetypes = loadJson('channels/kaduse-medikal/content/post-archetypes.json');
  const registeredIds = postArchetypes.archetypes.map((a) => a.id);
  assert.ok(!registeredIds.includes('special-day'));
  assert.ok(!registeredIds.includes('clinical-education'));
});

test('10/11/12. commercialContentAllowed, productPlacementAllowed, ctaAllowed default false for all 57', () => {
  for (const o of health.observances) {
    assert.equal(o.commercialContentAllowed, false, `${o.id} allows commercial content`);
    assert.equal(o.productPlacementAllowed, false, `${o.id} allows product placement`);
    assert.equal(o.ctaAllowed, false, `${o.id} allows CTA`);
  }
  assert.equal(health.commercialSafetyDefault.commercialContentAllowed, false);
  assert.equal(health.commercialSafetyDefault.productPlacementAllowed, false);
  assert.equal(health.commercialSafetyDefault.ctaAllowed, false);
});

test('future subtle brand presence is a documented consideration only, never an authorization, and only on profession entries', () => {
  const flagged = health.observances.filter((o) => o.futureSubtleBrandPresenceConsideration === true);
  assert.equal(flagged.length, 7);
  for (const o of flagged) {
    assert.ok(o.class === 'HEALTHCARE_PROFESSION_DAY' || o.class === 'HEALTHCARE_PROFESSION_WEEK');
    assert.equal(o.ctaAllowed, false, `${o.id} must still have ctaAllowed=false despite future brand-presence note`);
  }
});

test('the ambiguous palliative-care observance is explicitly marked pending, not guessed', () => {
  const o = health.observances.find((x) => x.id === 'kaduse-world-hospice-palliative-care-day');
  assert.ok(o);
  assert.equal(o.classResolutionStatus, 'PENDING_OFFICIAL_FORM_CONFIRMATION');
  assert.ok(o.classResolutionNote.length > 10);
});

test('no No-News-coupling: this file has no source/feed/URL/transport fields', () => {
  const serialized = JSON.stringify(health);
  for (const term of ['"sourceId"', '"targetId"', '"transportStatus"', '"officialUrl"', '"feedUrl"']) {
    assert.ok(!serialized.includes(term), `found forbidden News-shaped field ${term}`);
  }
});

test('no scheduler/cron/mail fields exist in this file', () => {
  const serialized = JSON.stringify(health).toLowerCase();
  for (const term of ['cron', 'smtp', 'recipient', 'sendgrid', 'mailgun', 'unsubscribe']) {
    assert.ok(!serialized.includes(term), `found forbidden scheduler/mail term "${term}"`);
  }
});
