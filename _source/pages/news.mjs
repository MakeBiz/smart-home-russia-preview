import { url, img, btn, esc, sectionHead, ctaBand, eyebrow, photo } from '../lib.mjs';
import { NEWS } from '../content/news.mjs';
import { SITE } from '../config.mjs';
import { fmtDate } from './shared.mjs';

export const newsCard = (a, lead = false) => `
  <a class="card ${lead ? 'card--lead' : ''}" href="${url('news/' + a.slug)}">
    <div class="card__img">${img(a.photo, a.title, { w: lead ? 1600 : 900, ratio: lead ? 16 / 9 : 4 / 3, sizes: lead ? '(min-width: 960px) 66vw, 100vw' : '(min-width: 960px) 33vw, 100vw' })}</div>
    <p class="card__meta"><span>${a.tag}</span><span><time datetime="${a.date}">${fmtDate(a.date)}</time></span></p>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.excerpt)}</p>
  </a>`;

export const newsCards = (n = 3, skip) => `<div class="cards">${NEWS.filter((a) => a.slug !== skip).slice(0, n).map((a) => newsCard(a)).join('')}</div>`;
export const hasNews = (skip) => NEWS.filter((a) => a.slug !== skip).length > 0;

const head = (crumbs, kicker, title, lead) => `
  <section class="article-head">
    <div class="wrap">
      <nav class="crumb" aria-label="Навигация"><a href="${url()}">Главная</a>${crumbs.map(([h, l]) => `<span>/</span>${h ? `<a href="${h}">${l}</a>` : `<span>${esc(l)}</span>`}`).join('')}</nav>
      ${kicker ? eyebrow(kicker) : ''}
      <h1 class="display-1">${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
    </div>
  </section>`;

export const newsIndex = {
  path: 'news',
  render() {
    const [first, ...rest] = NEWS;
    const body = `
${head([[null, 'Новости']], 'Новости', 'Новости компании <em>и рынка.</em>', 'Новые объекты, решения и изменения на рынке умного дома, отопления и безопасности, которые касаются владельцев домов и квартир в России.')}
<section class="section" style="padding-top:20px">
  <div class="wrap">
    <div class="cards">${first ? newsCard(first, true) : ''}${rest.map((a) => newsCard(a)).join('')}</div>
  </div>
</section>
${ctaBand()}`;
    return { title: `Новости умного дома · ${SITE.brand}`, description: 'Новости Smart Home: новые объекты и решения, изменения на рынке умного дома, отопления и безопасности частного дома в России.', body, bodyClass: 'page-plain', ogPhoto: first ? first.photo : 'house-glass' };
  },
};

export const newsPages = NEWS.map((a) => ({
  path: 'news/' + a.slug,
  render() {
    const body = `
${head([[url('news'), 'Новости'], [null, a.title]], `${a.tag} · ${fmtDate(a.date)}`, esc(a.title), esc(a.excerpt))}
<figure class="article-cover" style="margin:0">${img(a.photo, a.title, { w: 2200, eager: true })}</figure>
<article class="wrap"><div class="article-body">${a.body}
${a.source ? `<p class="note">Источник: <a href="${a.source.url}" target="_blank" rel="noopener nofollow">${esc(a.source.name)}</a></p>` : ''}
</div></article>
${hasNews(a.slug) ? `<section class="section tone-deep"><div class="wrap">${sectionHead({ kicker: 'Ещё новости', title: 'Что нового.' })}${newsCards(3, a.slug)}</div></section>` : ''}
${ctaBand()}`;
    const jsonld = { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: a.title, description: a.excerpt, datePublished: a.date, dateModified: a.updated || a.date, inLanguage: 'ru',
      image: a.photo.includes('/') ? SITE.domain + photo(a.photo) : photo(a.photo, 1200, 630), mainEntityOfPage: SITE.domain + url('news/' + a.slug),
      author: { '@type': 'Organization', name: SITE.brand, url: SITE.domain + '/' }, publisher: { '@type': 'Organization', name: SITE.brand, logo: { '@type': 'ImageObject', url: SITE.domain + '/assets/icon-512.png' } } };
    return { title: a.title.length > 55 ? a.title : `${a.title} · ${SITE.brand}`, description: a.excerpt, body, bodyClass: 'page-plain', ogPhoto: a.photo, jsonld };
  },
}));
