'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '../../lib/blog';

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

  const renderFilters = (isMobile = false) => (
    <div className={`space-y-6 ${isMobile ? 'mt-4' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-default-grey/70">
          Filters
        </p>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-semibold text-dark-blue/80 transition hover:text-dark-blue"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-default-grey">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              selectedCategory === 'all'
                ? 'border-dark-blue bg-dark-blue text-white'
                : 'border-dark-blue/20 bg-white text-default-grey hover:border-dark-blue/40'
            }`}
          >
            All
          </button>
          {filters.categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                selectedCategory === category
                  ? 'border-dark-blue bg-dark-blue text-white'
                  : 'border-dark-blue/20 bg-white text-default-grey hover:border-dark-blue/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-default-grey">Tags</p>
        <div className="flex flex-wrap gap-2">
          {filters.tags.length === 0 ? (
            <span className="text-sm text-default-grey/70">
              No tags yet.
            </span>
          ) : (
            filters.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  selectedTags.includes(tag)
                    ? 'border-dark-blue bg-dark-blue text-white'
                    : 'border-dark-blue/20 bg-white text-default-grey hover:border-dark-blue/40'
                }`}
              >
                {tag}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-default-grey">Author</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedAuthor('all')}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              selectedAuthor === 'all'
                ? 'border-dark-blue bg-dark-blue text-white'
                : 'border-dark-blue/20 bg-white text-default-grey hover:border-dark-blue/40'
            }`}
          >
            All
          </button>
          {filters.authors.map((author) => (
            <button
              key={author}
              type="button"
              onClick={() => setSelectedAuthor(author)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                selectedAuthor === author
                  ? 'border-dark-blue bg-dark-blue text-white'
                  : 'border-dark-blue/20 bg-white text-default-grey hover:border-dark-blue/40'
              }`}
            >
              {author}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-[rgb(var(--light-grey))] px-6 py-16 text-default-grey md:px-8 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl">
            Blog
          </h1>
          <p className="mt-3 text-xl text-default-grey/80">
            Perspectives, tools, and stories for reality alignment, relationships, and growth.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-lg bg-white p-5 shadow-md ring-1 ring-black/5">
              {hasFilters ? renderFilters() : <p className="text-sm text-default-grey/70">Add blog posts to enable filters.</p>}
            </div>
          </aside>

          <div>
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                className="flex items-center justify-between rounded-lg border border-dark-blue/20 bg-white px-4 py-3 text-left text-base font-semibold text-default-grey shadow-sm"
              >
                Filters
                <span className="text-sm text-default-grey/60">
                  {mobileFiltersOpen ? 'Hide' : 'Show'}
                </span>
              </button>
              {mobileFiltersOpen && (
                <div className="mt-4 rounded-lg bg-white p-5 shadow-md ring-1 ring-black/5">
                  {hasFilters ? renderFilters(true) : <p className="text-sm text-default-grey/70">Add blog posts to enable filters.</p>}
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
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <article className="overflow-hidden rounded-lg bg-white shadow-md transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="space-y-3 p-5">
                        {post.category && (
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-default-grey/70">
                            {post.category}
                          </p>
                        )}
                        <h2 className="font-headline text-2xl font-semibold text-default-grey">
                          {post.title}
                        </h2>
                        <p className="text-base text-default-grey/80">{post.subtitle}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-default-grey/70">
                          <span>By {post.author}</span>
                          {post.datePublished && <span>{new Date(post.datePublished).toLocaleDateString('en-US')}</span>}
                        </div>
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-dark-blue/10 bg-dark-blue/5 px-2 py-0.5 text-xs text-default-grey"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
