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
import { USECASE_PAGES, USECASES } from './pages/usecases.mjs';
import { journalIndex, journalPages, projectsIndex, projectPages } from './pages/editorial.mjs';
import { approach, partners, contact, privacy, notFound } from './pages/company.mjs';
import { JOURNAL } from './content/journal.mjs';
import { PROJECTS } from './content/projects.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [home, house, apartments, offices, heating, banya, territory, ...USECASE_PAGES, pricing, journalIndex, ...journalPages, projectsIndex, ...projectPages, approach, partners, contact, privacy];

// breadcrumb labels
const LABEL = { house: 'Загородный дом', apartments: 'Квартиры', offices: 'Офисы', heating: 'Отопление и климат', banya: 'Баня, сауна и спа', territory: 'Ворота, камеры, участок', pricing: 'Стоимость', journal: 'Журнал', projects: 'Проекты', approach: 'Как мы работаем', partners: 'Партнёрам', contact: 'Оставить заявку', privacy: 'Политика конфиденциальности' };
USECASES.forEach((u) => { LABEL[u.path] = u.crumb; });
const crumbsFor = (path) => {
  const parts = path.split('/');
  if (parts[0] === 'journal' && parts[1]) return [['Журнал', 'journal'], [JOURNAL.find((a) => a.slug === parts[1]).title, path]];
  if (parts[0] === 'projects' && parts[1]) return [['Проекты', 'projects'], [PROJECTS.find((a) => a.slug === parts[1]).title, path]];
  return [[LABEL[path] || path, path]];
};

for (const d of ['house', 'apartments', 'offices', 'heating', 'banya', 'territory', 'pricing', 'journal', 'projects', 'approach', 'partners', 'contact', 'privacy', ...USECASES.map((u) => u.path)]) {
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
const rendered = [];
for (const pg of pages) {
  const r = pg.render();
  rendered.push({ path: pg.path, title: r.title, description: r.description });
  write((pg.path ? pg.path + '/' : '') + 'index.html', layout({ path: pg.path, crumbs: pg.path ? crumbsFor(pg.path) : null, ...r })); n++;
}
write('404.html', layout({ path: '404', ...notFound.render(), bodyClass: '', noindex: true }));

// sitemap with priorities
const today = new Date().toISOString().slice(0, 10);
const prio = (p) => (!p ? '1.0' : ['house', 'apartments', 'heating', 'banya', 'territory', 'pricing', ...USECASES.map((u) => u.path)].includes(p) ? '0.9' : p.startsWith('journal/') || p.startsWith('projects/') ? '0.6' : p === 'privacy' ? '0.2' : '0.7');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((pg) => `  <url><loc>${SITE.domain}${url(pg.path)}</loc><lastmod>${today}</lastmod><priority>${prio(pg.path)}</priority></url>`).join('\n')}\n</urlset>\n`);

// robots: open for search and AI crawlers (GEO)
const ai = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'YandexAdditional', 'YandexGPT', 'GigaChat', 'Bytespider', 'CCBot', 'meta-externalagent', 'DuckAssistBot', 'MistralAI-User'];
write('robots.txt', [
  'User-agent: *', 'Allow: /', 'Disallow: /_source/', '',
  'User-agent: Yandex', 'Allow: /', 'Disallow: /_source/', 'Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid&etext&from', '',
  ...ai.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', 'Disallow: /_source/', '']),
  `Sitemap: ${SITE.domain}/sitemap.xml`, '',
].join('\n'));

// llms.txt: site card for AI assistants
const line = (p) => { const r = rendered.find((x) => x.path === p); return r ? `- [${r.title.split(' · ')[0]}](${SITE.domain}${url(p)}): ${r.description}` : ''; };
write('llms.txt', `# ${SITE.brand}: умный дом под ключ в России

> Инженерная компания: проектирование, монтаж и сервис умного дома для загородных домов, квартир и офисов. Специализация под российский климат: отопление по комнатам и удалённое управление котлом, тёплые полы, баня и сауна с прогревом к приезду, умные ворота и видеонаблюдение, обогрев кровли, водостоков и дорожек, защита от протечек и замерзания труб, резервное питание. ИИ-консьерж как надстройка.

Ключевые факты:
- Работаем по всей России, проект и смета после выезда инженера.
- Ориентиры бюджета (оборудование автоматики, монтаж и настройка, с НДС): квартира от 690 000 ₽, загородный дом с баней и участком от 1,84 млн ₽, резиденция от 4,7 млн ₽. Онлайн-калькулятор: ${SITE.domain}${url('pricing')}
- Локальная работа без интернета, ручное управление главнее автоматики, открытые протоколы (KNX, DALI, Modbus, OpenTherm).
- Заявка: ${SITE.domain}${url('contact')} (имя, телефон, ник в Telegram).

## Решения
${['house', 'apartments', 'offices'].map(line).join('\n')}

## Системы
${['heating', 'banya', 'territory', ...USECASES.map((u) => u.path)].map(line).join('\n')}

## Стоимость и подход
${['pricing', 'approach', 'projects', 'partners'].map(line).join('\n')}

## Журнал
${JOURNAL.map((a) => line('journal/' + a.slug)).join('\n')}
`);

// icons + manifest
write('site.webmanifest', JSON.stringify({ name: SITE.brand, short_name: SITE.brand, lang: 'ru', start_url: './', display: 'browser', background_color: '#0c1116', theme_color: '#0c1116', icons: [{ src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2));
write('assets/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#0c1116"/><circle cx="20" cy="20" r="14" fill="none" stroke="#cdb590" stroke-width="1.4"/><path d="M13 19.5 20 13.5l7 6" fill="none" stroke="#cdb590" stroke-width="1.4"/><path d="M14 24.5c2-1.7 4-1.7 6 0s4 1.7 6 0" fill="none" stroke="#f0b682" stroke-width="1.4"/></svg>`);
console.log(`Built ${n} pages + 404 into ${OUT}`);
