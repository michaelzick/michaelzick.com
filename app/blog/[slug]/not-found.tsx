'use client';

import { useEffect } from 'react';
import { trackEvent } from '../../../lib/analytics';

export default function BlogPostNotFound() {
  useEffect(() => {
    trackEvent('blog_post_not_found', {
      page_path: window.location.pathname,
    });
  }, []);

  return (
    <section className="page-top-offset bg-light-grey px-6 pb-16 text-default-grey md:px-8 md:pb-20">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="font-headline text-3xl font-semibold">Post not found</h1>
        <p className="mt-4 text-default-grey/75">
          The article you requested does not exist or is no longer available.
        </p>
      </div>
    </section>
  );
}
