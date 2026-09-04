// Batch O1 -- validates Kaduse's channel-owned observance applicability map
// (channels/kaduse-medikal/content/observances.json) using ONLY data local
// to this repo. Follows the exact lesson from Batch N2-FINAL-R1: a channel
// repo's normal test suite must never depend on another repo existing
// beside it. The genuine cross-repo referential check (does every
// observanceId actually resolve against the global registry?) lives in
// channel-content-os's mcp-server/src/observance/kaduse-observance-contract.test.ts,
// which skips gracefully when this repo isn't present.
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

const observances = loadJson('channels/kaduse-medikal/content/observances.json');
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validActions = new Set(['CREATE_POST', 'CONSIDER', 'IGNORE']);
const validSubtypes = new Set(['NATIONAL_CELEBRATION', 'RELIGIOUS_CELEBRATION', 'NATIONAL_COMMEMORATION', 'MEMORIAL']);

test('observances.json is well-formed with exactly 9 mappings', () => {
  assert.equal(observances.mappings.length, 9);
  assert.equal(observances.mappingCount, observances.mappings.length);
});

test('every mapping has a syntactically valid observanceId and belongs to kaduse-medikal', () => {
  for (const m of observances.mappings) {
    assert.match(m.observanceId, idPattern, `malformed observanceId ${m.observanceId}`);
    assert.equal(m.channelId, 'kaduse-medikal');
  }
});

test('observanceId values are unique -- no duplicate mappings', () => {
  const ids = observances.mappings.map((m) => m.observanceId);
  assert.equal(new Set(ids).size, ids.length);
});

test('every mapping uses a valid defaultAction and channelSubtype', () => {
  for (const m of observances.mappings) {
    assert.ok(validActions.has(m.defaultAction), `${m.observanceId} has invalid defaultAction ${m.defaultAction}`);
    assert.ok(validSubtypes.has(m.channelSubtype), `${m.observanceId} has invalid channelSubtype ${m.channelSubtype}`);
  }
});

test('no mapping duplicates global observance metadata (canonical name, date rule, class, provenance, lead days)', () => {
  const forbiddenKeys = ['canonicalName', 'dateRule', 'observanceClass', 'provenance', 'defaultLeadDays', 'triggerType', 'countryOrRegion'];
  for (const m of observances.mappings) {
    for (const key of forbiddenKeys) {
      assert.ok(!(key in m), `mapping for ${m.observanceId} duplicates global field "${key}"`);
    }
  }
});

test('commercialContentAllowed, productPlacementAllowed, and ctaAllowed are false for all 9 mappings', () => {
  for (const m of observances.mappings) {
    assert.equal(m.commercialContentAllowed, false, `${m.observanceId} allows commercial content`);
    assert.equal(m.productPlacementAllowed, false, `${m.observanceId} allows product placement`);
    assert.equal(m.ctaAllowed, false, `${m.observanceId} allows CTA`);
  }
});

test('no healthcare-specific observance is present yet', () => {
  const haystack = JSON.stringify(observances).toLowerCase();
  for (const term of ['health', 'medical', 'sağlık', 'tıbbi', 'hemşire', 'doktor']) {
    assert.ok(!haystack.includes(term), `found forbidden healthcare-specific term "${term}"`);
  }
});

test('Special Day archetype relationship is recorded as intended-future only, not a registered archetype', () => {
  assert.equal(observances.intendedFuturePostArchetypeId, 'special-day');
  const postArchetypes = loadJson('channels/kaduse-medikal/content/post-archetypes.json');
  const registeredIds = postArchetypes.archetypes.map((a) => a.id);
  assert.ok(!registeredIds.includes('special-day'), 'special-day must not be registered yet');
});

test('exact first-pass semantics: 30 Agustos and 29 Ekim are CREATE_POST, 23 Nisan and 19 Mayis are CONSIDER', () => {
  const byId = Object.fromEntries(observances.mappings.map((m) => [m.observanceId, m]));
  assert.equal(byId['tr-national-sovereignty-childrens-day'].defaultAction, 'CONSIDER');
  assert.equal(byId['tr-ataturk-commemoration-youth-sports-day'].defaultAction, 'CONSIDER');
  assert.equal(byId['tr-victory-day'].defaultAction, 'CREATE_POST');
  assert.equal(byId['tr-republic-day'].defaultAction, 'CREATE_POST');
  assert.equal(byId['tr-ramadan-feast'].defaultAction, 'CREATE_POST');
  assert.equal(byId['tr-sacrifice-feast'].defaultAction, 'CREATE_POST');
  assert.equal(byId['tr-martyrs-day-canakkale-naval-victory'].defaultAction, 'CREATE_POST');
  assert.equal(byId['tr-ataturk-memorial-day'].defaultAction, 'CREATE_POST');
  assert.equal(byId['tr-democracy-national-unity-day'].defaultAction, 'CONSIDER');
});
