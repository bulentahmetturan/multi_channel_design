import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pool = JSON.parse(readFileSync(new URL('./font-pool.json', import.meta.url), 'utf8'));
const kaduse = pool.channelCombinations['kaduse-medikal'];

test('Kaduse exposes only the two approved typography combinations', () => {
  assert.deepEqual(kaduse.combinations, [
    { id: 'kaduse-product-editorial', headline: 'EB Garamond', headlineEmphasis: 'EB Garamond Italic', body: 'Inter', status: 'READY_OPEN', description: 'Product-led editorial register.' },
    { id: 'kaduse-clinical-information', headline: 'EB Garamond', headlineEmphasis: 'EB Garamond Italic', body: 'IBM Plex Sans', status: 'READY_OPEN', description: 'Research and clinical-information register.' },
  ]);
  assert.equal(kaduse.rare, null);
  assert.deepEqual(kaduse.utilityMono.allowedRoles, ['eyebrow', 'footer', 'trackedClosingSignature']);
});

test('Kaduse removals are scoped and do not remove legitimate global availability', () => {
  assert.deepEqual(kaduse.kaduseScopedExclusions, ['Adelle', 'Libre Franklin', 'Source Sans 3', 'Stack Sans Notch']);
  assert.ok(pool.globalPool.headlineDisplay.families.includes('Source Sans 3'));
  assert.ok(pool.globalPool.headlineDisplay.families.includes('Libre Franklin'));
  assert.ok(pool.globalPool.rareOccasionalDisplay.families.includes('Stack Sans Notch'));
  assert.ok(pool.globalPool.licenseRequiredCreativePool.families.includes('Adelle'));
});

test('historical rejected direction remains unchanged as negative evidence', () => {
  const historic = JSON.parse(readFileSync(new URL('../../channels/kaduse-medikal/content/visual-directions/product-promotion-message-led-sparse-v1-direction-01.json', import.meta.url), 'utf8'));
  assert.equal(historic.typography.candidateFamily, 'Source Sans 3');
});
