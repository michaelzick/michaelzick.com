'use client';

interface BlogFiltersProps {
  filters: {
    categories: string[];
    tags: string[];
    authors: string[];
  };
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedAuthor: string;
  setSelectedAuthor: (author: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  isMobile?: boolean;
}

export default function BlogFilters({
  filters,
  selectedCategory,
  setSelectedCategory,
  selectedAuthor,
  setSelectedAuthor,
  selectedTags,
  toggleTag,
  clearFilters,
  isMobile = false,
}: BlogFiltersProps) {
  return (
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
            className={`rounded-full border px-3 py-1 text-sm transition ${selectedCategory === 'all'
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
              className={`rounded-full border px-3 py-1 text-sm transition ${selectedCategory === category
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
                className={`rounded-full border px-3 py-1 text-sm transition ${selectedTags.includes(tag)
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
            className={`rounded-full border px-3 py-1 text-sm transition ${selectedAuthor === 'all'
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
              className={`rounded-full border px-3 py-1 text-sm transition ${selectedAuthor === author
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
}
