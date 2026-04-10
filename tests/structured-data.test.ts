import test from 'node:test';
import assert from 'node:assert/strict';
import { type BlogPost } from '../lib/blog';
import {
  getBlogBreadcrumbStructuredData,
  getBlogPostStructuredData,
} from '../lib/blog-structured-data';
import { getRegionParts, getSiteStructuredData } from '../lib/site-structured-data';

const samplePost: BlogPost = {
  title: 'Sample Post',
  subtitle: 'Subtitle',
  author: 'Michael Zick',
  excerpt: 'Sample excerpt',
  canonicalUrl: 'https://example.com/original',
  canonicalSource: 'Example',
  imageUrl: '/img/homepage_mountains.webp',
  body: '<p>Hello world from the sample post.</p>',
  category: 'Article',
  tags: ['Attachment', 'Recovery'],
  datePublished: '2026-01-10',
  dateModified: '2026-01-12',
  slug: 'sample-post',
};

test('getRegionParts splits country and region codes', () => {
  assert.deepEqual(getRegionParts('US-CA'), {
    countryCode: 'US',
    regionCode: 'CA',
  });
});

test('getSiteStructuredData includes organization and person nodes', () => {
  const data = getSiteStructuredData();
  assert.equal(Array.isArray(data['@graph']), true);
  assert.equal((data['@graph'] as unknown[]).length, 3);
});

test('blog structured data includes canonical source and computed word count', () => {
  const data = getBlogPostStructuredData(samplePost);
  assert.equal(data.isBasedOn, 'https://example.com/original');
  assert.equal(data.wordCount, 6);

  const breadcrumb = getBlogBreadcrumbStructuredData(samplePost);
  assert.equal(
    (breadcrumb.itemListElement as Array<{ position: number; }>).at(-1)?.position,
    3,
  );
});
