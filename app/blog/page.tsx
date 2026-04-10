import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import BlogIndexClient from '../../components/blog/BlogIndexClient';
import { getBlogFilters, getBlogPosts } from '../../lib/blog';
import { getBlogIndexStructuredData } from '../../lib/blog-structured-data';
import { siteConfig } from '../../lib/site';

const blogTitle = `Blog | ${siteConfig.shortName}`;
const blogDescription =
  'Insights, tools, and stories on Nice Guy recovery, approval addiction, and building secure attachment from coach Michael Zick.';

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

export default function BlogPage() {
  const posts = getBlogPosts();
  const filters = getBlogFilters(posts);
  const structuredData = getBlogIndexStructuredData(posts);

  return (
    <>
      <JsonLd data={structuredData} />
      <BlogIndexClient posts={posts} filters={filters} />
    </>
  );
}
