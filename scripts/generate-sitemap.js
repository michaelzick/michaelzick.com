const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BLOG_POSTS_PATH = path.join(__dirname, '..', 'content', 'blog', 'posts.json');
const BASE_URL = process.env.SITE_URL || 'https://michaelzick.com';

function getRoutes(dir, route = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];
  for (const entry of entries) {
    if (entry.isFile() && entry.name === 'page.tsx') {
      routes.push(route || '/');
    } else if (entry.isDirectory()) {
      routes = routes.concat(
        getRoutes(path.join(dir, entry.name), `${route}/${entry.name}`)
      );
    }
  }
  return routes;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getBlogRoutes() {
  if (!fs.existsSync(BLOG_POSTS_PATH)) return [];
  const raw = fs.readFileSync(BLOG_POSTS_PATH, 'utf8');
  const posts = JSON.parse(raw);
  const seen = new Map();

  return posts
    .map((post) => {
      const base = post.slug ? slugify(post.slug) : slugify(post.title || '');
      if (!base) return null;
      const count = seen.get(base) || 0;
      const slug = count ? `${base}-${count + 1}` : base;
      seen.set(base, count + 1);
      return `/blog/${slug}`;
    })
    .filter(Boolean);
}

const routes = Array.from(new Set([...getRoutes(APP_DIR), ...getBlogRoutes()])).sort();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map((route) => `  <url><loc>${BASE_URL}${route}</loc></url>`)
    .join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
console.log('sitemap.xml generated');
