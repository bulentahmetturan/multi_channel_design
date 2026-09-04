// Batch N2-FINAL-R1 -- validates Kaduse's channel-owned news subscriptions
// (channels/kaduse-medikal/content/news-sources.json) using ONLY data local
// to this repo. This file must run correctly on any machine, with or
// without the sibling channel-content-os repo checked out -- a channel
// repo's normal test suite must never require another repo to exist beside
// it. The genuine cross-repo referential check (does every sourceId/targetId
// actually resolve against the global registry?) lives instead in
// channel-content-os's mcp-server/src/news/kaduse-subscription-contract.test.ts,
// which is the correct direction of dependency: that repo owns the global
// truth, so it validates a consumer's config against itself, and it skips
// (rather than fails) when this repo isn't present beside it.
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

const kaduseNews = loadJson('channels/kaduse-medikal/content/news-sources.json');
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

test('news-sources.json is well-formed and has exactly 59 subscriptions', () => {
  assert.equal(kaduseNews.status, 'ACTIVE_SUBSCRIPTIONS');
  assert.equal(kaduseNews.subscriptions.length, 59);
  assert.equal(kaduseNews.subscriptionCount, kaduseNews.subscriptions.length);
});

test('every subscription has syntactically valid sourceId/targetId and belongs to kaduse-medikal', () => {
  for (const sub of kaduseNews.subscriptions) {
    assert.match(sub.sourceId, idPattern, `malformed sourceId ${sub.sourceId}`);
    assert.match(sub.targetId, idPattern, `malformed targetId ${sub.targetId}`);
    assert.equal(sub.channelId, 'kaduse-medikal');
    assert.equal(typeof sub.enabled, 'boolean');
  }
});

test('subscription (sourceId, targetId) pairs are unique -- no duplicate subscriptions', () => {
  const seen = new Set();
  for (const sub of kaduseNews.subscriptions) {
    const key = `${sub.sourceId}::${sub.targetId}`;
    assert.ok(!seen.has(key), `duplicate subscription for ${key}`);
    seen.add(key);
  }
});

test('no subscription duplicates global metadata (publisher identity, URLs, transport status)', () => {
  const forbiddenKeys = ['officialUrl', 'publisherId', 'canonicalName', 'transportStatus', 'countryOrRegion', 'verificationStatus'];
  for (const sub of kaduseNews.subscriptions) {
    for (const key of forbiddenKeys) {
      assert.ok(!(key in sub), `subscription for ${sub.targetId} duplicates global field "${key}"`);
    }
  }
});

test('no source-priority/trust-tier ontology exists as a field on any subscription', () => {
  const forbiddenFieldNames = ['trustTier', 'priority', 'tier', 'rank', 'weight'];
  for (const sub of kaduseNews.subscriptions) {
    for (const key of Object.keys(sub)) {
      assert.ok(!forbiddenFieldNames.includes(key), `subscription for ${sub.targetId} has forbidden priority-ontology field "${key}"`);
    }
  }
});

test('the 5 excluded/superseded identities are self-consistently recorded (local check, no sibling needed)', () => {
  const expected = ['eunethta-21', 'lexxion-ehpl', 'topra-regulatory-rapporteur', 'meddeviceguide', 'mhra'].sort();
  const actual = [...kaduseNews.supersededOrExcluded.excludedOrSuperseded].sort();
  assert.deepEqual(actual, expected);
});

test('no active subscription references a source/target id matching an excluded identity', () => {
  const excludedIds = new Set(kaduseNews.supersededOrExcluded.excludedOrSuperseded);
  for (const sub of kaduseNews.subscriptions) {
    assert.ok(!excludedIds.has(sub.sourceId), `active subscription references excluded id ${sub.sourceId}`);
    assert.ok(!excludedIds.has(sub.targetId), `active subscription references excluded id ${sub.targetId}`);
  }
});

test('scoped subscriptions (those with inclusionPolicy/exclusionPolicy) carry non-empty policy arrays', () => {
  for (const sub of kaduseNews.subscriptions) {
    if ('inclusionPolicy' in sub) assert.ok(sub.inclusionPolicy.length > 0, `${sub.targetId} has empty inclusionPolicy`);
    if ('exclusionPolicy' in sub) assert.ok(sub.exclusionPolicy.length > 0, `${sub.targetId} has empty exclusionPolicy`);
  }
});

test('FDA CDRH subscriptions are internally consistent (4 subscriptions, same sourceId, distinct targetIds)', () => {
  const cdrhSubs = kaduseNews.subscriptions.filter((s) => s.sourceId === 'fda-cdrh');
  assert.equal(cdrhSubs.length, 4);
  const targetIds = new Set(cdrhSubs.map((s) => s.targetId));
  assert.equal(targetIds.size, 4);
});

test('TITCK and TUSEB each have exactly 2 subscriptions (child-target pattern), same sourceId', () => {
  for (const sourceId of ['titck-announcements', 'tuseb-news']) {
    const subs = kaduseNews.subscriptions.filter((s) => s.sourceId === sourceId);
    assert.equal(subs.length, 2, `${sourceId} should have exactly 2 subscriptions`);
  }
});
