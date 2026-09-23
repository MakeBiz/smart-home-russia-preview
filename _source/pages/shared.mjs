import { url, img, esc } from '../lib.mjs';
import { JOURNAL } from '../content/journal.mjs';

export const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export const journalCard = (a, lead = false) => `
  <a class="card ${lead ? 'card--lead' : ''}" href="${url('journal/' + a.slug)}">
    <div class="card__img">${img(a.photo, a.title, { w: lead ? 1600 : 900, ratio: lead ? 16 / 9 : 4 / 3, sizes: lead ? '(min-width: 960px) 66vw, 100vw' : '(min-width: 960px) 33vw, 100vw' })}</div>
    <p class="card__meta"><span>${a.cat}</span><span>${fmtDate(a.date)}</span></p>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.excerpt)}</p>
  </a>`;

export const journalCards = (n = 3, skip) => `<div class="cards">${JOURNAL.filter((a) => a.slug !== skip).slice(0, n).map((a) => journalCard(a)).join('')}</div>`;

