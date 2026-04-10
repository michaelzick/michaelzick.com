import rawPosts from '../content/blog/posts.json';
import { siteConfig } from './site';

export type RawBlogPost = {
  title: string;
  subtitle: string;
  author: string;
  excerpt?: string;
  canonicalUrl?: string;
  canonicalSource?: string;
  imageUrl: string;
  body: string;
  category?: string;
  tags?: string[];
  datePublished?: string;
  dateModified?: string;
  slug?: string;
};

export type BlogPost = Omit<RawBlogPost, 'slug' | 'tags'> & {
  slug: string;
  tags: string[];
};

export type BlogFilters = {
  categories: string[];
  tags: string[];
  authors: string[];
};

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['"’“”‘]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toAbsoluteUrl(url: string) {
  if (url.startsWith('http')) return url;
  return `${siteConfig.url}${url}`;
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function formatPostDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US');
}

export function getBlogPostWordCount(body: string) {
  const plainText = stripHtml(body);
  return plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
}

function buildExcerpt(post: RawBlogPost) {
  if (post.excerpt && post.excerpt.trim()) return post.excerpt.trim();
  const plainText = stripHtml(post.body || '');
  if (!plainText) return '';
  return plainText.length <= 160 ? plainText : `${plainText.slice(0, 157)}...`;
}

let cachedPosts: BlogPost[] | null = null;

export function getBlogPosts(): BlogPost[] {
  if (cachedPosts) return cachedPosts;

  const seen = new Map<string, number>();
  const posts = (rawPosts as RawBlogPost[]).map((post) => {
    const baseSlug = post.slug ? slugify(post.slug) : slugify(post.title);
    const slugCount = seen.get(baseSlug) || 0;
    const slug = slugCount ? `${baseSlug}-${slugCount + 1}` : baseSlug;
    seen.set(baseSlug, slugCount + 1);

    return {
      ...post,
      slug,
      tags: post.tags ?? [],
      excerpt: buildExcerpt(post),
    };
  });

  posts.sort((a, b) => {
    if (a.datePublished && b.datePublished) {
      return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime();
    }
    return 0;
  });

  cachedPosts = posts;
  return posts;
}

export function getBlogPostBySlug(slug: string) {
  const normalized = slugify(decodeURIComponent(slug));
  return getBlogPosts().find((post) => post.slug === normalized);
}

export function getBlogFilters(posts: BlogPost[]): BlogFilters {
  const categories = new Set<string>();
  const tags = new Set<string>();
  const authors = new Set<string>();

  posts.forEach((post) => {
    if (post.category) categories.add(post.category);
    post.tags.forEach((tag) => tags.add(tag));
    if (post.author) authors.add(post.author);
  });

  return {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
    authors: Array.from(authors).sort(),
  };
}

export function getSimilarBlogPosts(posts: BlogPost[], currentPost: BlogPost, limit = 3) {
  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .filter((post) => post.tags.some((tag) => currentPost.tags.includes(tag)))
    .slice(0, limit);
}
