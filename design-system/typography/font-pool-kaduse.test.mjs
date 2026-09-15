import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pool = JSON.parse(readFileSync(new URL('./font-pool.json', import.meta.url), 'utf8'));
const kaduse = pool.channelCombinations['kaduse-medikal'];

// Visual system reset (2026-09-16): Kaduse's typography-pairing entry
// (combinations/utilityMono/kaduseScopedExclusions) was cleared -- that was
// aesthetic font-pairing policy (channel-content-os's typography/kaduse-
// typography-policy.ts, removed), not a font-availability fact. See
// channel-content-os/VISUAL_SYSTEM_RESET.md.
test('Kaduse typography entry is cleared pending the new FormatSpec, not silently repopulated', () => {
  assert.deepEqual(kaduse.combinations, []);
  assert.equal(kaduse.rare, null);
  assert.equal('utilityMono' in kaduse, false);
  assert.equal('kaduseScopedExclusions' in kaduse, false);
});

test('other channels\' typography entries are unaffected by Kaduse\'s reset', () => {
  assert.ok(pool.channelCombinations['tip-ogrencileri-platformu'].combinations.length > 0);
  assert.ok(pool.channelCombinations['futboscope'].combinations.length > 0);
  assert.ok(pool.channelCombinations['turkiye-scholarships'].combinations.length > 0);
});

test('the global pool itself is untouched by the Kaduse-scoped reset', () => {
  assert.ok(pool.globalPool.headlineDisplay.families.includes('Source Sans 3'));
  assert.ok(pool.globalPool.headlineDisplay.families.includes('Libre Franklin'));
  assert.ok(pool.globalPool.rareOccasionalDisplay.families.includes('Stack Sans Notch'));
  assert.ok(pool.globalPool.licenseRequiredCreativePool.families.includes('Adelle'));
});
