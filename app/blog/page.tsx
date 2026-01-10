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
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: 'website',
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

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogTitle,
    description: blogDescription,
    url: `${siteConfig.url}/blog`,
    inLanguage: siteConfig.locale,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.businessName,
      url: siteConfig.url,
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      url: `${siteConfig.url}/blog/${post.slug}`,
      image: toAbsoluteUrl(post.imageUrl),
      datePublished: post.datePublished,
      dateModified: post.dateModified ?? post.datePublished,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogIndexClient posts={posts} filters={filters} />
    </>
  );
}
