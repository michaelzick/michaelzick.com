'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '../../lib/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-lg bg-white shadow-md transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="aspect-[16/9] overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-5">
          {(post.category || post.tags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {post.category && (
                <span className="rounded-full border border-dark-blue/20 bg-dark-blue/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-default-grey">
                  {post.category}
                </span>
              )}
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-dark-blue/10 bg-dark-blue/5 px-2 py-0.5 text-xs text-default-grey"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h2 className="font-headline text-2xl font-semibold text-default-grey">
            {post.title}
          </h2>
          <p className="text-base text-default-grey/80">{post.subtitle}</p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-default-grey/70">
            <span>By {post.author}</span>
            {post.datePublished && (
              <span>
                {(() => {
                  const [year, month, day] = post.datePublished.split('-').map(Number);
                  return new Date(year, month - 1, day).toLocaleDateString('en-US');
                })()}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
