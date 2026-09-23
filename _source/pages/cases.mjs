import { url, img, btn, esc, sectionHead, ctaBand, eyebrow, photo } from '../lib.mjs';
import { REAL_CASES, CASE_TYPES } from '../content/cases.mjs';
import { PROJECTS } from '../content/projects.mjs';
import { SITE } from '../config.mjs';
import { fmtDate } from './shared.mjs';

const CONCEPT_TYPE = { 'Загородный дом': 'house', 'Квартира': 'apartment', 'Офис': 'office' };
const SYS = {
  heating: 'Отопление и климат', 'kotel-udalenno': 'Удалённое управление котлом', 'teplyj-pol': 'Умный тёплый пол', banya: 'Баня, сауна и спа',
  'umnye-vorota': 'Умные ворота', videonablyudenie: 'Видеонаблюдение', 'obogrev-krovli': 'Обогрев кровли и дорожек', 'zashchita-ot-protechek': 'Защита от протечек',
  territory: 'Ворота, камеры, участок', house: 'Загородный дом', apartments: 'Квартира', offices: 'Офис',
};

export const CASES = [
  ...REAL_CASES.map((c) => ({ ...c, concept: false })),
  ...PROJECTS.map((p) => ({ ...p, type: CONCEPT_TYPE[p.type] || 'house', concept: true })),
];

export const caseCard = (c) => `
  <a class="card" href="${url('cases/' + c.slug)}" data-type="${c.type}">
    <div class="card__img">${img(c.photo, c.title, { w: 900, ratio: 4 / 3, sizes: '(min-width: 960px) 33vw, 100vw' })}</div>
    <p class="card__meta"><span>${CASE_TYPES[c.type] || ''}</span>${c.concept ? '<span>Концепт-проект</span>' : c.city ? `<span>${esc(c.city)}</span>` : ''}</p>
    <h3>${esc(c.title)}</h3>
    <p>${esc(c.excerpt)}</p>
  </a>`;

export const caseCards = (n = 3, skip) => `<div class="cards">${CASES.filter((c) => c.slug !== skip).slice(0, n).map(caseCard).join('')}</div>`;

const head = (crumbs, kicker, title, lead) => `
  <section class="article-head">
    <div class="wrap">
      <nav class="crumb" aria-label="Навигация"><a href="${url()}">Главная</a>${crumbs.map(([h, l]) => `<span>/</span>${h ? `<a href="${h}">${l}</a>` : `<span>${esc(l)}</span>`}`).join('')}</nav>
      ${kicker ? eyebrow(kicker) : ''}
      <h1 class="display-1">${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
    </div>
  </section>`;

export const casesIndex = {
  path: 'cases',
  render() {
    const real = CASES.filter((c) => !c.concept), concept = CASES.filter((c) => c.concept);
    const types = [...new Set(CASES.map((c) => c.type))];
    const filter = `<div class="chips chips--filter" data-filter role="group" aria-label="Тип объекта">
      <label class="chip"><input type="radio" name="case-type" value="all" checked><span>Все</span></label>
      ${types.map((t) => `<label class="chip"><input type="radio" name="case-type" value="${t}"><span>${CASE_TYPES[t]}</span></label>`).join('')}
    </div>`;
    const body = `
${head([[null, 'Кейсы']], 'Кейсы', 'Реальные объекты. <em>Задача, решение, результат.</em>', 'Загородные дома, квартиры и офисы, которые мы спроектировали, смонтировали и обслуживаем. У каждого объекта: что было, что сделали, сколько это заняло и что изменилось для владельцев.')}
<section class="section" style="padding-top:20px">
  <div class="wrap">
    ${filter}
    ${real.length ? `<div class="cards" data-filtered>${real.map(caseCard).join('')}</div>` : `
    <div class="empty-note">
      <p class="eyebrow">Скоро</p>
      <h2 class="display-2">Первые кейсы публикуем в ближайшие недели.</h2>
      <p>Согласовываем с владельцами, какие фото и детали можно показать. Пока посмотрите эталонные конфигурации ниже или посчитайте свой объект.</p>
      <div class="hero__ctas">${btn(url('pricing'), 'Рассчитать мой дом', 'primary')}${btn('#lead', 'Оставить заявку', 'ghost')}</div>
    </div>`}
  </div>
</section>
<section class="section tone-deep">
  <div class="wrap">
    ${sectionHead({ kicker: 'Эталонные конфигурации', title: 'Как мы собираем типовые объекты.', lead: 'Концепт-проекты: на них мы объясняем состав и бюджет. Фотографии иллюстративные.' })}
    <div class="cards" data-filtered>${concept.map(caseCard).join('')}</div>
  </div>
</section>
${ctaBand()}`;
    return {
      title: `Кейсы умного дома: загородные дома, квартиры, офисы · ${SITE.brand}`,
      description: 'Кейсы умного дома: реальные объекты с задачей, составом систем, сроками, бюджетом и результатом. Отопление, баня, ворота, видеонаблюдение, квартиры и офисы.',
      body, bodyClass: 'page-plain', ogPhoto: CASES[0].photo,
    };
  },
};

export const casePages = CASES.map((c) => ({
  path: 'cases/' + c.slug,
  render() {
    const spec = c.concept ? c.spec : [['Город', c.city], ['Площадь', c.area], ['Срок', c.duration], ...(c.budget ? [['Бюджет', c.budget]] : [])].filter((x) => x[1]);
    const content = c.concept ? c.body : `
<h2>Задача</h2>${c.task}
<h2>Что сделали</h2>${c.solution}
<h2>Результат</h2>${c.result}
${c.quote ? `<blockquote>${esc(c.quote.text)}<footer>${esc(c.quote.author)}</footer></blockquote>` : ''}`;
    const sys = (c.systems || []).filter((s) => SYS[s]);
    const body = `
${head([[url('cases'), 'Кейсы'], [null, c.title]], `${CASE_TYPES[c.type] || ''}${c.concept ? ' · Концепт-проект' : c.year ? ' · ' + c.year : ''}`, esc(c.title), esc(c.excerpt))}
<div class="wrap"><dl class="spec" style="margin:0 0 50px">${spec.map((s) => `<div><dt>${s[0]}</dt><dd>${esc(s[1])}</dd></div>`).join('')}</dl></div>
<figure class="article-cover" style="margin:0">${img(c.photo, c.title, { w: 2200, eager: true })}</figure>
<article class="wrap"><div class="article-body">
${c.concept ? '<p class="note" style="margin-top:0;border:0;padding:0">Концепт-проект: эталонная конфигурация, на которой мы объясняем состав и бюджет. Фотографии иллюстративные.</p>' : ''}
${content}
${sys.length ? `<h2>Системы на объекте</h2><p class="chips-row">${sys.map((s) => `<a class="tag" href="${url(s)}">${SYS[s]}</a>`).join('')}</p>` : ''}
<div class="hero__ctas">${btn('#lead', 'Обсудить похожий проект', 'primary')}${btn(url('pricing'), 'Рассчитать мой дом', 'ghost')}</div>
</div></article>
${(c.gallery || []).length ? `<div class="gallery">${c.gallery.map((g, i) => `<div class="gallery__img">${img(g, `${c.title}: фото ${i + 1}`, { w: 1000, ratio: 4 / 3, sizes: '33vw' })}</div>`).join('')}</div>` : ''}
<section class="section tone-deep">
  <div class="wrap">
    ${sectionHead({ kicker: 'Другие кейсы', title: 'Посмотрите другие объекты.' })}
    ${caseCards(3, c.slug)}
  </div>
</section>
${ctaBand()}`;
    const jsonld = c.concept ? null : { '@context': 'https://schema.org', '@type': 'Article', articleSection: 'Кейсы', headline: c.title, description: c.excerpt, datePublished: c.date, inLanguage: 'ru',
      image: c.photo.includes('/') ? SITE.domain + photo(c.photo) : photo(c.photo, 1200, 630), mainEntityOfPage: SITE.domain + url('cases/' + c.slug),
      author: { '@type': 'Organization', name: SITE.brand }, publisher: { '@type': 'Organization', name: SITE.brand, logo: { '@type': 'ImageObject', url: SITE.domain + '/assets/icon-512.png' } },
      ...(c.city ? { contentLocation: { '@type': 'Place', name: c.city } } : {}) };
    return { title: `${c.title}${c.concept ? '' : ': кейс'} · ${SITE.brand}`, description: c.excerpt, body, bodyClass: 'page-plain', ogPhoto: c.photo, jsonld };
  },
}));
