import type { Metadata } from 'next';
import BlogIndexClient from '../../components/blog/BlogIndexClient';
import { getBlogFilters, getBlogPosts } from '../../lib/blog';
import { siteConfig } from '../../lib/site';

const blogTitle = `Blog | ${siteConfig.shortName}`;
const blogDescription =
  'Perspectives, tools, and stories for reality alignment, relationships, and personal growth.';

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,
  keywords: [...siteConfig.keywords, 'blog', 'articles', 'videos'],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: 'website',
    locale: siteConfig.locale,
    images: [
      {
        url: siteConfig.defaultImage,
        alt: 'Mountain landscape at sunset',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: blogTitle,
    description: blogDescription,
    images: [siteConfig.defaultImage],
  },
};

function toAbsoluteUrl(url: string) {
  if (url.startsWith('http')) return url;
  return `${siteConfig.url}${url}`;
}

export default function BlogPage() {
  const posts = getBlogPosts();
  const filters = getBlogFilters(posts);
  const schemaLocale = siteConfig.locale.replace('_', '-');

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogTitle,
    description: blogDescription,
    url: `${siteConfig.url}/blog`,
    inLanguage: schemaLocale,
    keywords: siteConfig.keywords.join(', '),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.businessName,
      url: siteConfig.url,
    },
    blogPost: posts.map((post) => {
      return {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        author: {
          '@type': 'Person',
          name: post.author,
        },
        articleSection: post.category,
        keywords: post.tags.join(', '),
        about: post.tags.map((tag) => ({ '@type': 'Thing', name: tag })),
        inLanguage: schemaLocale,
        ...(post.canonicalUrl ? { isBasedOn: post.canonicalUrl } : {}),
        url: `${siteConfig.url}/blog/${post.slug}`,
        image: toAbsoluteUrl(post.imageUrl),
        datePublished: post.datePublished,
        dateModified: post.dateModified ?? post.datePublished,
      };
    }),
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteConfig.url}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([blogJsonLd, itemListJsonLd]) }}
      />
      <BlogIndexClient posts={posts} filters={filters} />
    </>
  );
}
