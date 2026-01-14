import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ScrollToTopButton from '../../../components/blog/ScrollToTopButton';
import { getBlogPostBySlug, getBlogPosts } from '../../../lib/blog';
import { siteConfig } from '../../../lib/site';

type BlogPostPageProps = {
  params: { slug: string; } | Promise<{ slug: string; }>;
};

function toAbsoluteUrl(url: string) {
  if (url.startsWith('http')) return url;
  return `${siteConfig.url}${url}`;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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
      description: post.excerpt,
      images: [imageUrl],
    },
    keywords: Array.from(new Set([...siteConfig.keywords, ...post.tags])),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const post = getBlogPostBySlug(resolvedParams.slug);
  if (!post) notFound();

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  const imageUrl = toAbsoluteUrl(post.imageUrl);
  const [countryCode, regionCode] = siteConfig.region.split('-');
  const contentLocation = {
    '@type': 'Place',
    name: siteConfig.placename,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.placename,
      ...(regionCode ? { addressRegion: regionCode } : {}),
      ...(countryCode ? { addressCountry: countryCode } : {}),
    },
  };
  const about = post.tags.map((tag) => ({ '@type': 'Thing', name: tag }));
  const wordCount = post.body ? stripHtml(post.body).split(/\s+/).filter(Boolean).length : undefined;

  const isBasedOn = post.canonicalUrl?.startsWith(siteConfig.url) ? post.canonicalUrl : undefined;
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    alternativeHeadline: post.subtitle,
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
    ...(post.canonicalUrl ? { isBasedOn: post.canonicalUrl } : {}),
    inLanguage: siteConfig.locale,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    about,
    contentLocation,
    ...(wordCount ? { wordCount } : {}),
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
    <section className="bg-[rgb(var(--light-grey))] px-8 pb-16 pt-24 text-default-grey max-[1024px]:px-[35px] max-[929px]:px-[30px] min-[1440px]:px-[70px] md:pb-24 md:pt-28 lg:pt-36 xl:pt-40">
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
              <span className="rounded-full border border-dark-blue/20 bg-dark-blue/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-default-grey">
                {post.category}
              </span>
            )}
          </div>
        </div>
        <div id="blog-post-image" className="mt-8 overflow-hidden rounded-lg shadow-md">
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

        {/* Similar Posts Section */}
        <div className="mt-20 border-t border-dark-blue/10 pt-16">
          {(() => {
            const allPosts = getBlogPosts();
            const similarPosts = allPosts
              .filter((p) => p.slug !== post.slug) // Exclude current post
              .filter((p) => p.tags.some((tag) => post.tags.includes(tag))) // At least one tag in common
              .slice(0, 3); // Show up to 3 similar posts

            if (similarPosts.length > 0) {
              return (
                <div className="space-y-10">
                  <h2 className="font-headline text-3xl font-semibold text-dark-blue">
                    Similar Posts
                  </h2>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {similarPosts.map((similar) => (
                      <Link
                        key={similar.slug}
                        href={`/blog/${similar.slug}`}
                        className="group flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img
                            src={similar.imageUrl}
                            alt={similar.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-headline text-xl font-bold leading-tight text-dark-blue">
                            {similar.title}
                          </h3>
                          <p className="line-clamp-2 text-sm text-default-grey/70">
                            {similar.subtitle}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-12 flex justify-start">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 text-dark-blue font-bold transition-colors group"
                    >
                      View All Posts
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <p className="text-lg text-default-grey/60 italic">
                  No similar posts found, but there's plenty more to explore.
                </p>
                <Link
                  href="/blog"
                  className="btn !px-10 !py-4 text-lg inline-flex items-center gap-2"
                >
                  ← Back To Blog
                </Link>
              </div>
            );
          })()}
        </div>
      </div>
      <ScrollToTopButton targetId="blog-post-image" />
    </section>
  );
}
