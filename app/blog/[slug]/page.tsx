import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import ScrollToTopButton from '../../../components/blog/ScrollToTopButton';
import BlogPostBreadcrumbs from '../../../components/blog/BlogPostBreadcrumbs';
import BlogPostHero from '../../../components/blog/BlogPostHero';
import SimilarPostsSection from '../../../components/blog/SimilarPostsSection';
import {
  getBlogBreadcrumbStructuredData,
  getBlogPostStructuredData,
} from '../../../lib/blog-structured-data';
import { getBlogPostBySlug, getBlogPosts, getSimilarBlogPosts, toAbsoluteUrl } from '../../../lib/blog';
import { siteConfig } from '../../../lib/site';

type BlogPostPageProps = {
  params: { slug: string; } | Promise<{ slug: string; }>;
};

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const post = getBlogPostBySlug(resolvedParams.slug);
  if (!post) {
    return {
      title: `Blog | ${siteConfig.shortName}`,
      robots: { index: false, follow: false },
    };
  }

  const canonical = post.canonicalUrl || `${siteConfig.url}/blog/${post.slug}`;
  const imageUrl = toAbsoluteUrl(post.imageUrl);

  return {
    title: `${post.title} | ${siteConfig.shortName}`,
    description: post.excerpt,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
      authors: [post.author],
      tags: post.tags,
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: siteConfig.description,
      images: [imageUrl],
    },
    keywords: Array.from(new Set([...siteConfig.keywords, ...post.tags])),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const post = getBlogPostBySlug(resolvedParams.slug);
  if (!post) notFound();

  const similarPosts = getSimilarBlogPosts(getBlogPosts(), post);
  const structuredData = [
    getBlogPostStructuredData(post),
    getBlogBreadcrumbStructuredData(post),
  ];

  return (
    <section className="bg-light-grey px-8 pb-16 pt-24 text-default-grey max-[1024px]:px-[35px] max-[929px]:px-[30px] min-[1440px]:px-[70px] md:pb-24 md:pt-28 lg:pt-36 xl:pt-40">
      <JsonLd data={structuredData} />
      <div className="mx-auto max-w-[1000px]">
        <BlogPostBreadcrumbs />
        <BlogPostHero post={post} />
        <div
          className="blog-content mt-10"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-dark-blue/10 bg-dark-blue/5 px-3 py-1 text-xs text-default-grey"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <SimilarPostsSection posts={similarPosts} />
      </div>
      <ScrollToTopButton targetId="blog-post-image" />
    </section>
  );
}
