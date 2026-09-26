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
// Local photos (real cases, news): pass a path under assets/, e.g. 'cases/dom-istra/01.webp'
export const isLocal = (key) => key.includes('/');
export const photo = (key, w = 1600, h) => {
  if (isLocal(key)) return '/assets/' + key;
  const id = PHOTOS[key];
  if (!id) throw new Error('Unknown photo ' + key);
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=72`;
};
export const img = (key, alt, { w = 1600, ratio, cls = '', eager = false, sizes = '100vw' } = {}) => {
  if (isLocal(key)) return `<img class="${cls}" src="${photo(key)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  const widths = [640, 1024, 1600, 2200].filter((x) => x <= Math.max(w, 640));
  const h = (x) => (ratio ? Math.round(x / ratio) : undefined);
  const srcset = widths.map((x) => `${photo(key, x, h(x))} ${x}w`).join(', ');
  const dims = ratio ? ` width="${w}" height="${h(w)}"` : '';
  return `<img class="${cls}" src="${photo(key, w, h(w))}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}"${dims} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
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
  { path: 'cases', label: 'Кейсы' },
  { path: 'news', label: 'Новости' },
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
  <section class="cta-band" id="lead">
    <div class="cta-band__media">${img(photoKey, '', { w: 2200 })}</div>
    <div class="cta-band__veil"></div>
    <div class="wrap cta-band__inner cta-band__inner--form">
      <div class="cta-band__copy">
        <h2 class="display-2">${title || 'Расскажите о своём доме.<br>Дальше мы возьмём всё на себя.'}</h2>
        <p class="lead">${lead || 'Оставьте имя и телефон. Инженер перезвонит, задаст несколько вопросов и назовёт ориентир бюджета. Удобнее переписка: укажите ник в Telegram.'}</p>
        <p class="cta-band__alt"><a class="link" href="${url('pricing')}">Или посчитайте бюджет сами в калькуляторе</a></p>
      </div>
      <div class="cta-band__form">${leadForm({ dark: true })}</div>
    </div>
  </section>`;

// ---------- lead form (name, phone, telegram) ----------
let FORM_N = 0;
export const leadForm = ({ partner = false, comment = false, dark = false } = {}) => {
  const n = ++FORM_N;
  const opts = ['Дизайнер интерьера', 'Архитектор', 'Строительная компания', 'Застройщик коттеджного посёлка', 'Установщик котлов, бань, ворот', 'Другое'];
  return `
  <form class="form lead-form ${dark ? 'lead-form--dark' : ''}" data-form novalidate>
    <div class="field"><label for="f${n}-name">Имя</label><input id="f${n}-name" name="name" autocomplete="name" required placeholder="Как к вам обращаться"></div>
    <div class="field"><label for="f${n}-phone">Телефон</label><input id="f${n}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+7 (___) ___-__-__" data-phone></div>
    <div class="field field--full"><label for="f${n}-tg">Ник в Telegram <small>необязательно, если удобнее переписка</small></label><input id="f${n}-tg" name="telegram" placeholder="@username" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></div>
    ${partner ? `<div class="field field--full"><label for="f${n}-role">Вы</label><select id="f${n}-role" name="role">${opts.map((o) => `<option>${o}</option>`).join('')}</select></div>` : ''}
    ${comment ? `<div class="field field--full"><label for="f${n}-msg">${partner ? 'О проекте или компании' : 'Что нужно сделать'} <small>необязательно</small></label><textarea id="f${n}-msg" name="message" placeholder="${partner ? 'Студия, город, ближайшие проекты' : 'Дом, квартира или офис, стадия, что хочется автоматизировать'}"></textarea></div>` : ''}
    <div class="hp" aria-hidden="true"><label for="f${n}-web">Сайт</label><input id="f${n}-web" name="website" tabindex="-1" autocomplete="off"></div>
    <label class="consent field--full"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных по <a href="${url('privacy')}" target="_blank">политике конфиденциальности</a></span></label>
    <div class="form__foot"><p>Перезвоним или напишем в течение рабочего дня.</p><button class="btn btn--primary" type="submit"><span>Отправить заявку</span>${icon('arrow')}</button></div>
    <p class="form__err" data-err hidden></p>
    <p class="form__ok" data-ok hidden>Спасибо, заявка у нас. Свяжемся с вами в течение рабочего дня.</p>
  </form>`;
};


// ---------- structured data ----------
const strip = (h = '') => String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
export const ORG_ID = () => SITE.domain + '/#org';
export const orgSchema = () => ({
  '@type': 'HomeAndConstructionBusiness', '@id': ORG_ID(), name: SITE.brand, url: SITE.domain + '/',
  logo: SITE.domain + '/assets/icon-512.png', image: photo('house-glass', 1200, 630),
  description: 'Проектирование, монтаж и сервис умного дома: отопление и котельная, тёплые полы, баня и сауна, ворота и видеонаблюдение, подогрев дорожек и водостоков, защита от протечек.',
  areaServed: { '@type': 'Country', name: 'Россия' }, priceRange: '₽₽₽', currenciesAccepted: 'RUB',
  ...(SITE.legalName ? { legalName: SITE.legalName } : {}),
  ...(SITE.phone ? { telephone: SITE.phone } : {}),
  ...(SITE.email ? { email: SITE.email } : {}),
  ...(SITE.sameAs && SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  knowsAbout: ['умный дом', 'KNX', 'автоматизация отопления', 'удалённое управление котлом', 'умная баня', 'умные ворота', 'видеонаблюдение', 'обогрев кровли и водостоков', 'защита от протечек'],
});
export const buildSchema = ({ path, title, description, body, jsonld, crumbs, service }) => {
  const url = SITE.domain + url_(path);
  const out = [];
  if (!path) out.push({ '@context': 'https://schema.org', '@graph': [orgSchema(), { '@type': 'WebSite', '@id': SITE.domain + '/#website', url: SITE.domain + '/', name: SITE.brand, inLanguage: 'ru', publisher: { '@id': ORG_ID() } }] });
  if (path && path !== '404') {
    const items = [{ name: 'Главная', url: SITE.domain + '/' }].concat((crumbs || [[strip(title).split(' · ')[0], path]]).map(([n, p]) => ({ name: n, url: SITE.domain + url_(p) })));
    out.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })) });
  }
  if (service) {
    out.push({ '@context': 'https://schema.org', '@type': 'Service', name: service.name, serviceType: service.type || service.name, description: service.description || description, url,
      provider: { '@type': 'HomeAndConstructionBusiness', '@id': ORG_ID(), name: SITE.brand, url: SITE.domain + '/' }, areaServed: { '@type': 'Country', name: 'Россия' },
      ...(service.min ? { offers: { '@type': 'Offer', priceCurrency: 'RUB', price: service.min, priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'RUB', minPrice: service.min, ...(service.max ? { maxPrice: service.max } : {}), valueAddedTaxIncluded: true }, url } } : {}) });
  }
  const qa = [...String(body).matchAll(/<details[^>]*><summary>([\s\S]*?)<\/summary><div class="faq__a">([\s\S]*?)<\/div><\/details>/g)];
  if (qa.length) out.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map((m) => ({ '@type': 'Question', name: strip(m[1]).replace(/^[«"]|[»"]$/g, ''), acceptedAnswer: { '@type': 'Answer', text: strip(m[2]) } })) });
  if (jsonld) out.push(jsonld);
  return out;
};
const url_ = (p) => url(p);
const metrikaTag = (id) => `<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${id}","ym");ym(${id},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});</script><noscript><div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute;left:-9999px;" alt=""></div></noscript>`;

// ---------- page layout ----------
export const layout = ({ path, title, description, body, ogPhoto = 'hero-house-night', bodyClass = '', jsonld, crumbs, service, noindex = false }) => {
  const schema = buildSchema({ path, title, description, body, jsonld, crumbs, service });
  const robots = (noindex || !SITE.indexable) ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">';
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
    { h: 'Популярное', links: [['kotel-udalenno', 'Удалённое управление котлом'], ['teplyj-pol', 'Умный тёплый пол'], ['videonablyudenie', 'Видеонаблюдение для дома'], ['umnye-vorota', 'Умные ворота'], ['obogrev-krovli', 'Обогрев кровли и водостоков'], ['zashchita-ot-protechek', 'Защита от протечек']] },
    { h: 'Компания', links: [['cases', 'Кейсы'], ['news', 'Новости'], ['journal', 'Журнал'], ['partners', 'Дизайнерам и строителям'], ['pricing', 'Стоимость'], ['contact', 'Оставить заявку'], ['privacy', 'Политика конфиденциальности']] },
  ];

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${robots}
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${isLocal(ogPhoto) ? SITE.domain + photo(ogPhoto) : photo(ogPhoto, 1200, 630)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="${SITE.brand}">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0C1116">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/icon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${SITE.yandexVerification ? `<meta name="yandex-verification" content="${SITE.yandexVerification}">` : ''}
${SITE.googleVerification ? `<meta name="google-site-verification" content="${SITE.googleVerification}">` : ''}
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="preload" href="/assets/fonts/prata-cyrillic-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/manrope-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${BUILD_ID}">
${schema.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
${SITE.metrika ? metrikaTag(SITE.metrika) : ''}
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
    <a href="${url('contact')}">Оставить заявку</a>
  </nav>
  <div class="wrap mnav__cta">${btn(url('contact'), 'Оставить заявку')}${btn(url('pricing'), 'Рассчитать мой дом', 'ghost')}</div>
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
          <a href="${url('contact')}">Оставить заявку</a>
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
<a class="m-cta" href="#lead" data-mcta>Оставить заявку ${icon('arrow')}</a>
<script>window.SITE=${JSON.stringify({ formEndpoint: SITE.formEndpoint, contactUrl: url('contact'), metrika: SITE.metrika || 0 })};</script>
<script src="/assets/site.js?v=${BUILD_ID}" defer></script>
</body>
</html>`;
};

export const BUILD_ID = Date.now().toString(36);
