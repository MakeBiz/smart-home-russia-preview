import { url, img, btn, esc, sectionHead, ctaBand, eyebrow, photo } from '../lib.mjs';
import { JOURNAL } from '../content/journal.mjs';
import { journalCard, journalCards, fmtDate } from './shared.mjs';
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
    return { title: `Журнал об умном доме: отопление, баня, участок · ${SITE.brand}`, description: 'Статьи об умном доме в российском климате: котёл и отопление, баня и сауна, подогрев дорожек и водостоков, ворота и камеры, тёплые полы в квартире.', body, bodyClass: 'page-plain', ogPhoto: first.photo };
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
    const jsonld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, datePublished: a.date, dateModified: a.updated || a.date, inLanguage: 'ru', image: photo(a.photo, 1200, 630), articleSection: a.cat, mainEntityOfPage: SITE.domain + url('journal/' + a.slug), author: { '@type': 'Organization', name: SITE.brand, url: SITE.domain + '/' }, publisher: { '@type': 'Organization', name: SITE.brand, logo: { '@type': 'ImageObject', url: SITE.domain + '/assets/icon-512.png' } } };
    return { title: a.title.length > 55 ? a.title : `${a.title} · ${SITE.brand}`, description: a.excerpt, body, bodyClass: 'page-plain', ogPhoto: a.photo, jsonld };
  },
}));

