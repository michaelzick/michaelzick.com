import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('generated sitemap includes Nice Guy University landing page', () => {
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');

  assert.match(
    sitemap,
    /https:\/\/www\.michaelzick\.com\/nice-guy-university/,
  );
});

test('generated sitemap includes the legal pages', () => {
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');

  assert.match(sitemap, /https:\/\/www\.michaelzick\.com\/privacy-policy/);
  assert.match(sitemap, /https:\/\/www\.michaelzick\.com\/terms-of-service/);
});
