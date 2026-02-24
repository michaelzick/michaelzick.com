import { MetadataRoute } from 'next';
import { siteConfig } from '../lib/site';
import { getBlogPosts } from '../lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getBlogPosts();

  const blogRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.dateModified ?? post.datePublished),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/testimonials',
    '/questionnaire',
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
