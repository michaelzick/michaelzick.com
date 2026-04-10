import TrackedLink from '../TrackedLink';

export default function BlogPostBreadcrumbs() {
  return (
    <nav className="text-sm text-default-grey/70">
      <TrackedLink
        href="/"
        className="hover:text-default-grey"
        location="blog-post"
        section="breadcrumb"
        label="Home"
      >
        Home
      </TrackedLink>
      <span className="mx-2">/</span>
      <TrackedLink
        href="/blog"
        className="hover:text-default-grey"
        location="blog-post"
        section="breadcrumb"
        label="Blog"
      >
        Blog
      </TrackedLink>
    </nav>
  );
}
