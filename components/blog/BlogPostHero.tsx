import Image from 'next/image';
import type { BlogPost } from '../../lib/blog';
import { formatPostDate } from '../../lib/blog';
import TrackedLink from '../TrackedLink';

type BlogPostHeroProps = {
  post: BlogPost;
};

export default function BlogPostHero({ post }: BlogPostHeroProps) {
  return (
    <>
      {post.canonicalUrl && post.canonicalSource && (
        <p className="mt-4 text-sm text-default-grey/70">
          Originally published on{' '}
          <TrackedLink
            href={post.canonicalUrl}
            target="_blank"
            className="font-semibold text-dark-blue underline decoration-dark-blue/60 decoration-2 underline-offset-4 transition hover:text-dark-blue/80"
            location="blog-post"
            section="canonical"
            label={post.canonicalSource}
          >
            {post.canonicalSource}
          </TrackedLink>
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
          {post.datePublished && <span>{formatPostDate(post.datePublished)}</span>}
          {post.category && (
            <span className="rounded-full border border-dark-blue/20 bg-dark-blue/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-default-grey">
              {post.category}
            </span>
          )}
        </div>
      </div>
      <div id="blog-post-image" className="mt-8 overflow-hidden rounded-lg shadow-md">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          priority={true}
        />
      </div>
    </>
  );
}
