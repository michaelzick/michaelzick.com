import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const analyticsScriptsSource = readFileSync(
  path.join(process.cwd(), 'components', 'SiteAnalyticsScripts.tsx'),
  'utf8',
);

test('records all sessions with replay-backed heatmaps enabled', () => {
  assert.match(analyticsScriptsSource, /record_sessions_percent:\s*100/);
  assert.match(analyticsScriptsSource, /record_heatmap_data:\s*true/);
});

test('shows ordinary page text in session replay and heatmaps', () => {
  assert.match(analyticsScriptsSource, /record_mask_all_text:\s*false/);
});

test('keeps every form input masked without an unmask exception', () => {
  assert.match(analyticsScriptsSource, /record_mask_all_inputs:\s*true/);
  assert.doesNotMatch(analyticsScriptsSource, /record_unmask_input_selector/);
});
