const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
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

const routes = getRoutes(APP_DIR).sort();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map((route) => `  <url><loc>${BASE_URL}${route}</loc></url>`)
    .join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
console.log('sitemap.xml generated');
