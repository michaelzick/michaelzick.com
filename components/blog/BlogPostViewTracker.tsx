'use client';

import { useEffect } from 'react';
import { trackEvent } from '../../lib/analytics';

type BlogPostViewTrackerProps = {
  slug: string;
  category: string;
};

export default function BlogPostViewTracker({ slug, category }: BlogPostViewTrackerProps) {
  useEffect(() => {
    trackEvent('blog_post_viewed', {
      post_slug: slug,
      post_category: category,
      page_path: window.location.pathname,
    });
  }, [slug, category]);

  return null;
}
