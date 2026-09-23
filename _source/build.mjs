// Build: node _source/build.mjs  → writes static HTML into the site root
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout, url } from './lib.mjs';
import { SITE } from './config.mjs';
import home from './pages/home.mjs';
import house from './pages/house.mjs';
import apartments from './pages/apartments.mjs';
import offices from './pages/offices.mjs';
import heating from './pages/heating.mjs';
import banya from './pages/banya.mjs';
import territory from './pages/territory.mjs';
import pricing from './pages/pricing.mjs';
import { journalIndex, journalPages, projectsIndex, projectPages } from './pages/editorial.mjs';
import { approach, partners, contact, notFound } from './pages/company.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [home, house, apartments, offices, heating, banya, territory, pricing, journalIndex, ...journalPages, projectsIndex, ...projectPages, approach, partners, contact];

for (const d of ['house', 'apartments', 'offices', 'heating', 'banya', 'territory', 'pricing', 'journal', 'projects', 'approach', 'partners', 'contact']) {
  const p = join(OUT, d); try { if (existsSync(p)) rmSync(p, { recursive: true, force: true }); } catch (e) { /* no delete rights: files are overwritten */ }
}

// root-relative links → relative, so the site works at a domain root and in a subfolder (GitHub Pages preview)
const relativize = (rel, html) => {
  const depth = rel.split('/').length - 1;
  const pre = depth ? '../'.repeat(depth) : './';
  return html.replace(/(href|src|action)="\/(?!\/)/g, `$1="${pre}`).replace(/(srcset|content)="\/(?!\/)/g, `$1="${pre}`);
};
const write = (rel, html) => { const f = join(OUT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, rel.endsWith('.html') ? relativize(rel, html) : html); };
let n = 0;
for (const pg of pages) {
  const r = pg.render();
  write((pg.path ? pg.path + '/' : '') + 'index.html', layout({ path: pg.path, ...r })); n++;
}
write('404.html', layout({ path: '', ...notFound.render(), bodyClass: '' }));

const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((pg) => `  <url><loc>${SITE.domain}${url(pg.path)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /_source/\nSitemap: ${SITE.domain}/sitemap.xml\n`);
write('assets/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#0c1116"/><circle cx="20" cy="20" r="14" fill="none" stroke="#cdb590" stroke-width="1.4"/><path d="M13 19.5 20 13.5l7 6" fill="none" stroke="#cdb590" stroke-width="1.4"/><path d="M14 24.5c2-1.7 4-1.7 6 0s4 1.7 6 0" fill="none" stroke="#f0b682" stroke-width="1.4"/></svg>`);
console.log(`Built ${n} pages + 404 into ${OUT}`);
