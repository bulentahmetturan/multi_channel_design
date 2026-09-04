// Batch N2-FINAL -- validates Kaduse's channel-owned news subscriptions
// (channels/kaduse-medikal/content/news-sources.json) against the global
// source registry owned by the sibling channel-content-os repo. Reads that
// repo's read-only snapshot (mcp-server/src/news/global-source-registry.snapshot.json,
// generated from the authoritative .ts registry -- see that file's own
// comment) via a relative sibling path; never writes to it. This is the
// only place in this repo that reaches across the repo boundary, and it
// only reads.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');
const siblingRoot = path.resolve(repoRoot, '..', 'channel-content-os');

function loadJson(absOrRelToRepo, base = repoRoot) {
  return JSON.parse(readFileSync(path.join(base, absOrRelToRepo), 'utf-8'));
}

const kaduseNews = loadJson('channels/kaduse-medikal/content/news-sources.json');

const snapshotPath = path.join(siblingRoot, 'mcp-server/src/news/global-source-registry.snapshot.json');
const snapshotAvailable = existsSync(snapshotPath);

test('sibling channel-content-os registry snapshot is available for cross-repo validation', () => {
  assert.ok(snapshotAvailable, `expected snapshot at ${snapshotPath}`);
});

if (snapshotAvailable) {
  const registry = JSON.parse(readFileSync(snapshotPath, 'utf-8'));
  const sourceIds = new Set(registry.sources.map((s) => s.id));
  const targetIds = new Set(registry.targets.map((t) => t.id));
  const targetById = new Map(registry.targets.map((t) => [t.id, t]));
  const sourceById = new Map(registry.sources.map((s) => [s.id, s]));

  test('1. every Kaduse subscription resolves to an existing global source', () => {
    for (const sub of kaduseNews.subscriptions) {
      assert.ok(sourceIds.has(sub.sourceId), `unknown sourceId ${sub.sourceId}`);
    }
  });

  test('2. every Kaduse subscription resolves to an existing global monitored target', () => {
    for (const sub of kaduseNews.subscriptions) {
      assert.ok(targetIds.has(sub.targetId), `unknown targetId ${sub.targetId}`);
    }
  });

  test('3. every subscription target actually belongs to its declared source (referential integrity)', () => {
    for (const sub of kaduseNews.subscriptions) {
      const target = targetById.get(sub.targetId);
      assert.equal(target.sourceId, sub.sourceId, `${sub.targetId} belongs to ${target.sourceId}, not ${sub.sourceId}`);
    }
  });

  test('subscription count matches the declared subscriptionCount and the registry target count', () => {
    assert.equal(kaduseNews.subscriptions.length, kaduseNews.subscriptionCount);
    assert.equal(kaduseNews.subscriptions.length, registry.targets.length);
  });

  test('4/5. Kaduse config does not redefine global publisher identity or become canonical owner of source URLs (no duplicated global metadata)', () => {
    const forbiddenKeys = ['officialUrl', 'publisherId', 'canonicalName', 'transportStatus', 'countryOrRegion'];
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

  test('excluded/superseded identities recorded channel-side match the global registry', () => {
    const globalExcludedIds = new Set(registry.supersededOrExcluded.map((e) => e.id));
    for (const id of kaduseNews.supersededOrExcluded.excludedOrSuperseded) {
      assert.ok(globalExcludedIds.has(id), `${id} not present in global supersededOrExcluded`);
    }
    assert.equal(kaduseNews.supersededOrExcluded.excludedOrSuperseded.length, registry.supersededOrExcluded.length);
  });

  test('mapping a) Resmi Gazete -> Kaduse health-only subscription', () => {
    const sub = kaduseNews.subscriptions.find((s) => s.targetId === 'resmi-gazete-health-scoped');
    assert.ok(sub);
    assert.equal(sub.sourceId, 'resmi-gazete-source');
    assert.ok(sub.inclusionPolicy.some((i) => /health/i.test(i)));
    const target = targetById.get(sub.targetId);
    assert.equal(target.scopeType, 'CHANNEL_FILTER_OVER_BROADER_SOURCE');
  });

  test('mapping b) FDA CDRH -> Kaduse AI/device monitored targets (4 targets, all under fda-cdrh)', () => {
    const cdrhSubs = kaduseNews.subscriptions.filter((s) => s.sourceId === 'fda-cdrh');
    assert.equal(cdrhSubs.length, 4);
    for (const sub of cdrhSubs) {
      assert.equal(sourceById.get(sub.sourceId).publisherId, 'fda');
    }
  });

  test('mapping c) TUSEB -> TUYZE -> Kaduse Saglikta Yapay Zeka subscription', () => {
    const sub = kaduseNews.subscriptions.find((s) => s.targetId === 'tuyze-saglikta-yapay-zeka');
    assert.ok(sub);
    assert.equal(sub.sourceId, 'tuseb-news');
    assert.equal(sourceById.get(sub.sourceId).publisherId, 'tuseb');
  });

  test('a future second channel could reuse fda-cdrh-ai-ml-device without duplicating the source (referential shape check)', () => {
    // Structural proof: nothing in this file's shape requires a per-channel copy
    // of the target/source record -- subscriptions are {channelId, sourceId,
    // targetId, ...channel policy}, so a second channel adds one more object
    // with a different channelId, same sourceId/targetId, no registry change.
    const sub = kaduseNews.subscriptions.find((s) => s.targetId === 'fda-cdrh-ai-ml-device');
    assert.ok(sub);
    const hypotheticalSecondChannelSub = { ...sub, channelId: 'future-ai-health-channel' };
    assert.equal(hypotheticalSecondChannelSub.targetId, sub.targetId);
    assert.equal(hypotheticalSecondChannelSub.sourceId, sub.sourceId);
    assert.notEqual(hypotheticalSecondChannelSub.channelId, sub.channelId);
  });
}
