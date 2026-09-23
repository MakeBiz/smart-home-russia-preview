import { url, img, btn, esc, sectionHead, ctaBand, eyebrow } from '../lib.mjs';
import { JOURNAL } from '../content/journal.mjs';
import { PROJECTS } from '../content/projects.mjs';
import { journalCard, journalCards, projectCards, projectCard, fmtDate } from './shared.mjs';
import { SITE } from '../config.mjs';

const plainHead = (crumbs, kicker, title, lead) => `
  <section class="article-head">
    <div class="wrap">
      <nav class="crumb" aria-label="Навигация"><a href="${url()}">Главная</a>${crumbs.map(([h, l]) => `<span>/</span>${h ? `<a href="${h}">${l}</a>` : `<span>${l}</span>`}`).join('')}</nav>
      ${kicker ? eyebrow(kicker) : ''}
      <h1 class="display-1">${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
    </div>
  </section>`;

export const journalIndex = {
  path: 'journal',
  render() {
    const [first, ...rest] = JOURNAL;
    const body = `
${plainHead([[null, 'Журнал']], 'Журнал', 'Новости, идеи и заметки с объектов.', 'Как умный дом на самом деле работает в российском климате: отопление, бани, участок, квартиры и детали, которые делают жизнь проще.')}
<section class="section" style="padding-top:20px">
  <div class="wrap">
    <div class="cards">${journalCard(first, true)}${rest.map((a) => journalCard(a)).join('')}</div>
  </div>
</section>
${ctaBand()}`;
    return { title: `Журнал · ${SITE.brand}`, description: 'Статьи об умном доме: отопление и котельная, баня и сауна, подогрев дорожек, ворота и камеры, квартиры.', body, bodyClass: 'page-plain', ogPhoto: first.photo };
  },
};

export const journalPages = JOURNAL.map((a) => ({
  path: 'journal/' + a.slug,
  render() {
    const body = `
${plainHead([[url('journal'), 'Журнал']], `${a.cat} · ${fmtDate(a.date)} · ${a.read} мин`, esc(a.title), esc(a.excerpt))}
<figure class="article-cover" style="margin:0">${img(a.photo, a.title, { w: 2200, eager: true })}</figure>
<article class="wrap"><div class="article-body">${a.body}</div></article>
<section class="section tone-deep">
  <div class="wrap">
    ${sectionHead({ kicker: 'Читать дальше', title: 'Ещё из журнала.' })}
    ${journalCards(3, a.slug)}
  </div>
</section>
${ctaBand()}`;
    const jsonld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, datePublished: a.date, inLanguage: 'ru', publisher: { '@type': 'Organization', name: SITE.brand } };
    return { title: `${a.title} · ${SITE.brand}`, description: a.excerpt, body, bodyClass: 'page-plain', ogPhoto: a.photo, jsonld };
  },
}));

export const projectsIndex = {
  path: 'projects',
  render() {
    const body = `
${plainHead([[null, 'Проекты']], 'Проекты', 'Дома, которые живут сами.', 'Эталонные конфигурации загородного дома, квартиры и офиса: что делает каждый объект и сколько это стоит. Завершённые проекты будут публиковаться здесь по мере сдачи.')}
<section class="section" style="padding-top:20px">
  <div class="wrap">${projectCards()}</div>
</section>
${ctaBand()}`;
    return { title: `Проекты · ${SITE.brand}`, description: 'Проекты умных загородных домов, квартир и офисов: состав, сценарии и бюджеты.', body, bodyClass: 'page-plain', ogPhoto: 'house-stars' };
  },
};

export const projectPages = PROJECTS.map((p) => ({
  path: 'projects/' + p.slug,
  render() {
    const body = `
${plainHead([[url('projects'), 'Проекты']], `${p.type}${p.concept ? ' · Концепт-проект' : ''}`, esc(p.title), esc(p.excerpt))}
<div class="wrap"><dl class="spec" style="margin:0 0 50px">${p.spec.map((s) => `<div><dt>${s[0]}</dt><dd>${s[1]}</dd></div>`).join('')}</dl></div>
<figure class="article-cover" style="margin:0">${img(p.photo, p.title, { w: 2200, eager: true })}</figure>
<article class="wrap"><div class="article-body">
${p.concept ? '<p class="note" style="margin-top:0;border:0;padding:0">Концепт-проект: эталонная конфигурация, на которой мы объясняем состав и бюджет. Фотографии иллюстративные.</p>' : ''}
${p.body}
<div class="hero__ctas">${btn('#lead', 'Обсудить похожий проект', 'primary')}${btn(url('pricing'), 'Рассчитать мой дом', 'ghost')}</div>
</div></article>
<div class="gallery">${p.gallery.map((g) => `<div class="gallery__img">${img(g, '', { w: 1000, ratio: 4 / 3, sizes: '33vw' })}</div>`).join('')}</div>
<section class="section tone-deep">
  <div class="wrap">
    ${sectionHead({ kicker: 'Другие проекты', title: 'Посмотрите другой тип пространства.' })}
    <div class="cards cards--2">${PROJECTS.filter((x) => x.slug !== p.slug).map((x) => projectCard(x)).join('')}</div>
  </div>
</section>
${ctaBand()}`;
    return { title: `${p.title} · ${SITE.brand}`, description: p.excerpt, body, bodyClass: 'page-plain', ogPhoto: p.photo };
  },
}));
