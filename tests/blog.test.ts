import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPostDate,
  getBlogFilters,
  getBlogPostBySlug,
  getSimilarBlogPosts,
  stripHtml,
  type BlogPost,
} from '../lib/blog';

test('stripHtml removes markup and normalizes whitespace', () => {
  assert.equal(stripHtml('<p>Hello <strong>world</strong></p><p>Again</p>'), 'Hello world Again');
});

test('formatPostDate renders a stable US locale date', () => {
  assert.equal(formatPostDate('2026-01-10'), '1/10/2026');
});

test('getBlogPostBySlug normalizes encoded slugs', () => {
  const post = getBlogPostBySlug('if-it%E2%80%99s-not-a-hell-yes-is-it-a-no');
  assert.ok(post);
  assert.equal(post?.author, 'Michael Zick');
});

test('getBlogFilters and getSimilarBlogPosts derive stable blog navigation data', () => {
  const posts: BlogPost[] = [
    {
      title: 'One',
      subtitle: 'One subtitle',
      author: 'Michael',
      imageUrl: '/img/one.webp',
      body: '<p>One</p>',
      slug: 'one',
      tags: ['Attachment', 'Anxiety'],
      category: 'Article',
      excerpt: 'One excerpt',
    },
    {
      title: 'Two',
      subtitle: 'Two subtitle',
      author: 'Michael',
      imageUrl: '/img/two.webp',
      body: '<p>Two</p>',
      slug: 'two',
      tags: ['Anxiety'],
      category: 'Video',
      excerpt: 'Two excerpt',
    },
    {
      title: 'Three',
      subtitle: 'Three subtitle',
      author: 'Guest',
      imageUrl: '/img/three.webp',
      body: '<p>Three</p>',
      slug: 'three',
      tags: ['Boundaries'],
      category: 'Article',
      excerpt: 'Three excerpt',
    },
  ];

  const filters = getBlogFilters(posts);
  assert.deepEqual(filters, {
    authors: ['Guest', 'Michael'],
    categories: ['Article', 'Video'],
    tags: ['Anxiety', 'Attachment', 'Boundaries'],
  });

  assert.deepEqual(
    getSimilarBlogPosts(posts, posts[0]).map((post) => post.slug),
    ['two'],
  );
});
