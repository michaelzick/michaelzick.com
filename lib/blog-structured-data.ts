import type { BlogPost } from './blog';
import { getBlogPostWordCount, toAbsoluteUrl } from './blog';
import { siteConfig } from './site';
import { getOrganizationAddress, getSchemaLocale } from './site-structured-data';

type JsonLdNode = Record<string, unknown>;

export function getBlogPostStructuredData(post: BlogPost) {
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  const imageUrl = toAbsoluteUrl(post.imageUrl);
  const organizationAddress = getOrganizationAddress();
  const about = post.tags.map((tag) => ({ '@type': 'Thing', name: tag }));
  const wordCount = getBlogPostWordCount(post.body);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    alternativeHeadline: post.subtitle,
    description: post.excerpt,
    url: postUrl,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.businessName,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.personImage}`,
      },
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    ...(post.canonicalUrl ? { isBasedOn: post.canonicalUrl } : {}),
    inLanguage: getSchemaLocale(),
    keywords: post.tags.join(', '),
    articleSection: post.category,
    about,
    contentLocation: {
      '@type': 'Place',
      name: siteConfig.placename,
      address: organizationAddress,
    },
    ...(wordCount ? { wordCount } : {}),
  };
}

export function getBlogBreadcrumbStructuredData(post: BlogPost) {
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return {
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
}

export function getBlogIndexStructuredData(posts: BlogPost[]): JsonLdNode[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `Blog | ${siteConfig.shortName}`,
      description:
        'Insights, tools, and stories on Nice Guy recovery, approval addiction, and building secure attachment from coach Michael Zick.',
      url: `${siteConfig.url}/blog`,
      inLanguage: getSchemaLocale(),
      keywords: siteConfig.keywords.join(', '),
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
        articleSection: post.category,
        keywords: post.tags.join(', '),
        about: post.tags.map((tag) => ({ '@type': 'Thing', name: tag })),
        inLanguage: getSchemaLocale(),
        ...(post.canonicalUrl ? { isBasedOn: post.canonicalUrl } : {}),
        url: `${siteConfig.url}/blog/${post.slug}`,
        image: toAbsoluteUrl(post.imageUrl),
        datePublished: post.datePublished,
        dateModified: post.dateModified ?? post.datePublished,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.url}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  ];
}
