'use client';

import { useMemo, useState } from 'react';
import type { BlogPost } from '../../lib/blog';
import BlogFilters from './BlogFilters';
import BlogPostCard from './BlogPostCard';
import { FadeInSection } from '../FadeInSection';
import BookingCta from '../BookingCta';
import QuestionnaireCta from '../QuestionnaireCta';

type BlogIndexClientProps = {
  posts: BlogPost[];
  filters: {
    categories: string[];
    tags: string[];
    authors: string[];
  };
};

export default function BlogIndexClient({ posts, filters }: BlogIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const matchesAuthor =
        selectedAuthor === 'all' || post.author === selectedAuthor;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => post.tags.includes(tag));

      return matchesCategory && matchesAuthor && matchesTags;
    });
  }, [posts, selectedCategory, selectedAuthor, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedAuthor('all');
    setSelectedTags([]);
  };

  const hasFilters =
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.authors.length > 0;

  return (
    <section className="bg-light-grey px-6 pb-16 pt-24 text-default-grey md:px-8 md:pb-20 md:pt-28 lg:pt-36 xl:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <FadeInSection className="mb-10 text-center md:text-left" immediate>
          <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl">
            Field Notes on Approval, Attachment, and Reality
          </h1>
          <p className="mt-8 text-xl text-default-grey/80">
            Essays for men who are done outsourcing their worth to reactions, chemistry, and approval.
          </p>
        </FadeInSection>

        <FadeInSection className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 mt-10 rounded-lg bg-white p-5 shadow-md ring-1 ring-black/5">
              {hasFilters ? (
                <BlogFilters
                  filters={filters}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedAuthor={selectedAuthor}
                  setSelectedAuthor={setSelectedAuthor}
                  selectedTags={selectedTags}
                  toggleTag={toggleTag}
                  clearFilters={clearFilters}
                />
              ) : (
                <p className="text-sm text-default-grey/70">Add blog posts to enable filters.</p>
              )}
            </div>
          </aside>

          <div>
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                className="flex items-baseline justify-between rounded-lg border border-dark-blue/20 bg-white px-4 py-3 text-left text-base font-semibold text-default-grey shadow-sm"
              >
                Filters
                <span className="ml-2 text-sm leading-none text-default-grey/60">
                  {mobileFiltersOpen ? 'Hide' : 'Show'}
                </span>
              </button>
              {mobileFiltersOpen && (
                <div className="mt-4 rounded-lg bg-white p-5 shadow-md ring-1 ring-black/5">
                  {hasFilters ? (
                    <BlogFilters
                      filters={filters}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      selectedAuthor={selectedAuthor}
                      setSelectedAuthor={setSelectedAuthor}
                      selectedTags={selectedTags}
                      toggleTag={toggleTag}
                      clearFilters={clearFilters}
                      isMobile
                    />
                  ) : (
                    <p className="text-sm text-default-grey/70">Add blog posts to enable filters.</p>
                  )}
                </div>
              )}
            </div>

            {posts.length === 0 ? (
              <div className="mt-10 rounded-lg bg-white p-8 text-center shadow-md">
                <p className="text-lg font-semibold">No posts yet.</p>
                <p className="mt-2 text-default-grey/70">
                  Add entries to <span className="font-mono">content/blog/posts.json</span> to publish your first post.
                </p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="mt-10 rounded-lg bg-white p-8 text-center shadow-md">
                <p className="text-lg font-semibold">No posts match those filters.</p>
                <p className="mt-2 text-default-grey/70">Try clearing or adjusting your selections.</p>
              </div>
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </FadeInSection>

        <FadeInSection className="mt-16 border-t border-default-grey/20 pt-12 flex flex-col items-center gap-6 text-center md:flex-row md:justify-center">
          <p className="text-xl font-semibold text-default-grey md:w-auto w-full">
            Ready to stop studying the pattern and start changing it?
          </p>
          <BookingCta location="blog-index" />
          <QuestionnaireCta location="blog-index" className="btn-secondary cta-unified btn-secondary-dark" />
        </FadeInSection>
      </div>
    </section>
  );
}
