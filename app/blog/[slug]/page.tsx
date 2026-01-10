import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '../../../lib/blog';
import { siteConfig } from '../../../lib/site';

type BlogPostPageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

function toAbsoluteUrl(url: string) {
  if (url.startsWith('http')) return url;
  return `${siteConfig.url}${url}`;
}

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

  const canonical = post.canonicalUrl ?? `/blog/${post.slug}`;
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
      url: post.canonicalUrl ?? `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    keywords: post.tags,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const post = getBlogPostBySlug(resolvedParams.slug);
  if (!post) notFound();

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  const imageUrl = toAbsoluteUrl(post.imageUrl);

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.businessName,
      url: siteConfig.url,
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    mainEntityOfPage: postUrl,
    isBasedOn: post.canonicalUrl,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteConfig.url}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <section className="bg-[rgb(var(--light-grey))] px-6 pb-16 pt-24 text-default-grey md:px-8 md:pb-24 md:pt-28 lg:pt-36 xl:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPostingJsonLd, breadcrumbJsonLd]),
        }}
      />
      <div className="mx-auto max-w-[1000px]">
        <nav className="text-sm text-default-grey/70">
          <Link href="/" className="hover:text-default-grey">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-default-grey">
            Blog
          </Link>
        </nav>
        {post.canonicalUrl && post.canonicalSource && (
          <p className="mt-4 text-sm text-default-grey/70">
            Originally published on{' '}
            <a
              href={post.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-dark-blue underline decoration-dark-blue/60 decoration-2 underline-offset-4 transition hover:text-dark-blue/80"
            >
              {post.canonicalSource}
            </a>
            .
          </p>
        )}
        <div className="mt-6 space-y-4">
          <h1 className="font-headline text-4xl font-semibold leading-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="text-xl text-default-grey/80">{post.subtitle}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-default-grey/70">
            <span>By {post.author}</span>
            {post.datePublished && (
              <span>
                {new Date(post.datePublished).toLocaleDateString('en-US')}
              </span>
            )}
            {post.category && (
              <span className="rounded-full border border-dark-blue/10 bg-dark-blue/5 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                {post.category}
              </span>
            )}
          </div>
        </div>
        <div className="mt-8 overflow-hidden rounded-lg shadow-md">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
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
      </div>
    </section>
  );
}
