import { readFileSync } from 'node:fs';
import { SITE } from './config.mjs';

// ---------- helpers ----------
export const url = (path = '') => {
  const p = path.replace(/^\/+|\/+$/g, '');
  return p ? `/${p}/` : '/';
};
export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- photos (Unsplash licence, hotlinked via their CDN) ----------
const PHOTOS = Object.fromEntries(
  readFileSync(new URL('./photos.txt', import.meta.url), 'utf8')
    .trim().split('\n').map((l) => l.split('|'))
);
export const photo = (key, w = 1600, h) => {
  const id = PHOTOS[key];
  if (!id) throw new Error('Unknown photo ' + key);
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=72`;
};
export const img = (key, alt, { w = 1600, ratio, cls = '', eager = false, sizes = '100vw' } = {}) => {
  const widths = [640, 1024, 1600, 2200].filter((x) => x <= Math.max(w, 640));
  const h = (x) => (ratio ? Math.round(x / ratio) : undefined);
  const srcset = widths.map((x) => `${photo(key, x, h(x))} ${x}w`).join(', ');
  return `<img class="${cls}" src="${photo(key, w, h(w))}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
};

// ---------- navigation ----------
export const NAV = [
  { key: 'solutions', label: 'Решения', children: [
    { path: 'house', label: 'Загородный дом', d: 'Отопление, баня, ворота, участок' },
    { path: 'apartments', label: 'Квартиры', d: 'Тёплый пол, свет, шторы, протечки' },
    { path: 'offices', label: 'Офисы', d: 'Переговорные, доступ, климат, счета' },
  ] },
  { key: 'systems', label: 'Системы', children: [
    { path: 'heating', label: 'Отопление и климат', d: 'Котёл, тёплые полы, вентиляция' },
    { path: 'banya', label: 'Баня, сауна и спа', d: 'Прогрев к приезду, купель, джакузи' },
    { path: 'territory', label: 'Ворота, камеры, участок', d: 'Доступ, видео, подогрев дорожек' },
    { path: 'approach', label: 'Как мы работаем', d: 'От обследования до сервиса' },
  ] },
  { path: 'projects', label: 'Проекты' },
  { path: 'journal', label: 'Журнал' },
  { path: 'pricing', label: 'Стоимость' },
];

// ---------- contacts ----------
export const tgLink = () => (SITE.telegram ? `https://t.me/${SITE.telegram.replace(/^@/, '')}` : '');

const ICONS = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  tg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.4 4.2 2.9 11.3c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.5-1.4ZM8.9 13.9l9-5.7c.4-.3.8-.1.5.2l-7.7 7-.3 3.2-1.5-4.7Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18M3 16h18" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>',
};
export const icon = (k) => ICONS[k];

// logo: a roof over a warm wave, inside a circle
export const LOGO = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M11 19.5 20 12l9 7.5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M13 25c2.3-2 4.7-2 7 0s4.7 2 7 0" fill="none" stroke="currentColor" stroke-width="1"/></svg>';

// ---------- building blocks ----------
export const btn = (href, label, variant = 'primary', extra = '') =>
  `<a class="btn btn--${variant}" href="${href}" ${extra}><span>${label}</span>${icon('arrow')}</a>`;

export const eyebrow = (t) => `<p class="eyebrow">${t}</p>`;

export const sectionHead = ({ kicker, title, lead, align = 'left' }) => `
  <header class="shead shead--${align}">
    ${kicker ? eyebrow(kicker) : ''}
    <h2 class="display-2">${title}</h2>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </header>`;

export const hero = ({ photoKey, alt, kicker, title, lead, ctas = '', panel = '', size = 'tall', crumb }) => `
  <section class="hero hero--${size}">
    <div class="hero__media">${img(photoKey, alt, { w: 2200, eager: true })}</div>
    <div class="hero__veil"></div>
    <div class="wrap hero__inner">
      <div class="hero__copy">
        ${crumb ? `<nav class="crumb" aria-label="Навигация"><a href="${url()}">Главная</a><span>/</span>${crumb}</nav>` : ''}
        ${kicker ? eyebrow(kicker) : ''}
        <h1 class="display-1">${title}</h1>
        ${lead ? `<p class="hero__lead">${lead}</p>` : ''}
        ${ctas ? `<div class="hero__ctas">${ctas}</div>` : ''}
      </div>
      ${panel}
    </div>
  </section>`;

// Glass "home status" panel used across heroes
export const statusPanel = (rows, title = 'Состояние дома · онлайн') => `
  <aside class="status" aria-label="${esc(title)}">
    <div class="status__top"><span class="dot"></span>${title}</div>
    <ul>
      ${rows.map((r) => `<li><span class="status__label">${r.label}</span><span class="status__val" ${r.attr || ''}>${r.value}</span>${r.note ? `<span class="status__note">${r.note}</span>` : ''}</li>`).join('')}
    </ul>
  </aside>`;

export const features = (items, cols = 3) => `
  <div class="feat feat--${cols}">
    ${items.map((f) => `<article class="feat__item">${f.k ? `<p class="feat__k">${f.k}</p>` : ''}<h3>${f.t}</h3><p>${f.d}</p></article>`).join('')}
  </div>`;

export const split = ({ photoKey, alt, kicker, title, body, reverse = false, list, cta, tone = '' }) => `
  <section class="split ${reverse ? 'split--rev' : ''} ${tone}">
    <div class="split__media">${img(photoKey, alt, { w: 1400, ratio: 4 / 5, sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
    <div class="split__copy">
      ${kicker ? eyebrow(kicker) : ''}
      <h2 class="display-2">${title}</h2>
      ${body}
      ${list ? `<ul class="ticks">${list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
      ${cta || ''}
    </div>
  </section>`;

export const faq = (items) => `
  <div class="faq">
    ${items.map((q, i) => `<details ${i === 0 ? 'open' : ''}><summary>${q.q}</summary><div class="faq__a">${q.a}</div></details>`).join('')}
  </div>`;

export const ctaBand = ({ title, lead, photoKey = 'house-snow-night' } = {}) => `
  <section class="cta-band">
    <div class="cta-band__media">${img(photoKey, '', { w: 2200 })}</div>
    <div class="cta-band__veil"></div>
    <div class="wrap cta-band__inner">
      <h2 class="display-2">${title || 'Расскажите о своём доме.<br>Дальше мы возьмём всё на себя.'}</h2>
      <p class="lead">${lead || 'Звонок на 20 минут, затем выезд инженера на объект. Вы получаете понятный состав работ, ориентир бюджета и план, который встраивается в график стройки или ремонта.'}</p>
      <div class="hero__ctas">
        ${btn(url('contact'), 'Записаться на консультацию', 'primary')}
        ${btn(url('pricing'), 'Рассчитать мой дом', 'ghost')}
      </div>
    </div>
  </section>`;

// ---------- page layout ----------
export const layout = ({ path, title, description, body, ogPhoto = 'hero-house-night', bodyClass = '', jsonld }) => {
  const canonical = SITE.domain + url(path);
  const navHtml = NAV.map((n) => {
    if (n.children) {
      return `<li class="nav__group"><button class="nav__btn" type="button" aria-expanded="false">${n.label}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor"/></svg></button>
        <div class="nav__drop"><ul>${n.children.map((c) => `<li><a href="${url(c.path)}" ${c.path === path ? 'aria-current="page"' : ''}><strong>${c.label}</strong><span>${c.d}</span></a></li>`).join('')}</ul></div></li>`;
    }
    const cur = path === n.path || path.startsWith(n.path + '/');
    return `<li><a class="nav__link" href="${url(n.path)}" ${cur ? 'aria-current="page"' : ''}>${n.label}</a></li>`;
  }).join('');

  const tg = tgLink();
  const footerCols = [
    { h: 'Решения', links: [['house', 'Умный загородный дом'], ['apartments', 'Умная квартира'], ['offices', 'Умный офис']] },
    { h: 'Системы', links: [['heating', 'Отопление и климат'], ['banya', 'Баня, сауна и спа'], ['territory', 'Ворота, камеры, участок'], ['approach', 'Как мы работаем']] },
    { h: 'Компания', links: [['projects', 'Проекты'], ['journal', 'Журнал'], ['partners', 'Дизайнерам и строителям'], ['pricing', 'Стоимость'], ['contact', 'Контакты']] },
  ];

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${photo(ogPhoto, 1200, 630)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="ru_RU">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0C1116">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="preload" href="/assets/fonts/prata-cyrillic-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/manrope-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${BUILD_ID}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body class="${bodyClass}" data-lang="ru">
<a class="skip" href="#main">К содержимому</a>
<header class="site-head" data-head>
  <div class="wrap site-head__row">
    <a class="logo" href="${url()}" aria-label="${SITE.brand}">
      <span class="logo__mark" aria-hidden="true">${LOGO}</span>
      <span class="logo__word">${SITE.brand}</span>
    </a>
    <nav class="nav" aria-label="Основное меню"><ul>${navHtml}</ul></nav>
    <div class="site-head__tools">
      <a class="btn btn--small" href="${url('contact')}"><span>Консультация</span></a>
      <button class="burger" type="button" aria-label="Открыть меню" aria-expanded="false" data-burger>${icon('menu')}</button>
    </div>
  </div>
</header>
<div class="mnav" data-mnav hidden>
  <div class="mnav__top wrap"><span class="logo__word">${SITE.brand}</span><button class="burger" type="button" aria-label="Закрыть меню" data-burger-close>${icon('close')}</button></div>
  <nav class="wrap mnav__list">
    ${NAV.flatMap((n) => (n.children ? n.children : [n])).map((c) => `<a href="${url(c.path)}">${c.label}</a>`).join('')}
    <a href="${url('partners')}">Дизайнерам и строителям</a>
    <a href="${url('contact')}">Контакты</a>
  </nav>
  <div class="wrap mnav__cta">${btn(url('contact'), 'Записаться на консультацию')}${btn(url('pricing'), 'Рассчитать мой дом', 'ghost')}</div>
</div>
<main id="main">
${body}
</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="site-foot__top">
      <div class="site-foot__brand">
        <a class="logo" href="${url()}"><span class="logo__mark" aria-hidden="true">${LOGO}</span><span class="logo__word">${SITE.brand}</span></a>
        <p class="site-foot__claim">Инженерия умного дома для загородных домов, квартир и офисов. Проект, монтаж и сервис под российский климат.</p>
        <div class="site-foot__contacts">
          ${SITE.phone ? `<a href="tel:${SITE.phone.replace(/[\s()-]/g, '')}">${SITE.phone}</a>` : ''}
          ${SITE.email ? `<a href="mailto:${SITE.email}">${SITE.email}</a>` : ''}
          ${tg ? `<a href="${tg}" target="_blank" rel="noopener">Telegram</a>` : ''}
          <span>${SITE.address}</span>
        </div>
      </div>
      ${footerCols.map((c) => `<div class="site-foot__col"><p class="eyebrow">${c.h}</p><ul>${c.links.map(([p, l]) => `<li><a href="${url(p)}">${l}</a></li>`).join('')}</ul></div>`).join('')}
    </div>
    <div class="site-foot__bottom">
      <span>© ${new Date().getFullYear()} ${SITE.brand}</span>
      <span>Цены на сайте ориентировочные, в рублях, с учётом НДС. Не является публичной офертой.</span>
      <span>Фотографии: Unsplash</span>
    </div>
  </div>
</footer>
${tg ? `<a class="wa-float" href="${tg}" target="_blank" rel="noopener" aria-label="Telegram">${icon('tg')}</a>` : ''}
<script>window.SITE=${JSON.stringify({ telegram: SITE.telegram, email: SITE.email, formEndpoint: SITE.formEndpoint })};</script>
<script src="/assets/site.js?v=${BUILD_ID}" defer></script>
</body>
</html>`;
};

export const BUILD_ID = Date.now().toString(36);
