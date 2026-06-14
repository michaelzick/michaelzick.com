'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { BlogPost } from '../../lib/blog';
import { trackEvent } from '../../lib/analytics';
import BookingCta from '../BookingCta';
import QuestionnaireCta from '../QuestionnaireCta';
import TrackedLink from '../TrackedLink';

type SimilarPostsSectionProps = {
  posts: BlogPost[];
};

export default function SimilarPostsSection({ posts }: SimilarPostsSectionProps) {
  const hasTrackedEmptyState = useRef(false);

  useEffect(() => {
    if (posts.length > 0) {
      hasTrackedEmptyState.current = false;
      return;
    }

    if (hasTrackedEmptyState.current) return;
    hasTrackedEmptyState.current = true;
    trackEvent('blog_similar_posts_empty_state_viewed', {
      page_path: window.location.pathname,
    });
  }, [posts.length]);

  const trackRecirculationClick = (destination: string, postSlug?: string) => {
    trackEvent('blog_post_recirculation_clicked', {
      destination,
      ...(postSlug ? { post_slug: postSlug } : {}),
      page_path: window.location.pathname,
    });
  };

  return (
    <div className="mt-10 border-t border-dark-blue/10 pt-8">
      {posts.length > 0 ? (
        <div className="space-y-10">
          <h2 className="font-headline text-3xl font-semibold text-dark-blue">
            Similar Posts
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <TrackedLink
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-md"
                location="blog-post"
                section="similar-posts"
                label={post.title}
                onClick={() => trackRecirculationClick('similar_post', post.slug)}
              >
                <div className="aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline text-xl font-bold leading-tight text-dark-blue">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-default-grey/70">
                    {post.subtitle}
                  </p>
                </div>
              </TrackedLink>
            ))}
          </div>
          <div className="mt-12 flex justify-start">
            <TrackedLink
              href="/blog"
              className="group inline-flex items-center gap-2 font-bold text-dark-blue transition-colors"
              location="blog-post"
              section="similar-posts"
              label="View All Posts"
              onClick={() => trackRecirculationClick('blog_index')}
            >
              View All Posts
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </TrackedLink>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <p className="text-lg italic text-default-grey/60">
            No similar posts found, but there&apos;s plenty more to explore.
          </p>
          <TrackedLink
            href="/blog"
            className="group inline-flex items-center gap-2 font-bold text-dark-blue transition-colors"
            location="blog-post"
            section="similar-posts"
            label="View All Posts"
            onClick={() => trackRecirculationClick('blog_index')}
          >
            View All Posts
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </TrackedLink>
        </div>
      )}
      <div className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center">
        <BookingCta
          location="blog-post-bottom"
          onClick={() => trackRecirculationClick('booking_cta')}
        />
        <QuestionnaireCta
          location="blog-post-bottom"
          className="btn-secondary cta-unified btn-secondary-dark"
          onClick={() => trackRecirculationClick('questionnaire_cta')}
        />
      </div>
    </div>
  );
}
