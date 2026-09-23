// Use-case pages built on real search demand (Wordstat, Russia). Content lives in content/usecases_*.mjs
import { url, btn, hero, statusPanel, sectionHead, features, split, ctaBand, faq } from '../lib.mjs';
import { UC_A } from '../content/usecases_a.mjs';
import { UC_B } from '../content/usecases_b.mjs';
import { UC_C } from '../content/usecases_c.mjs';

export const USECASES = [...UC_A, ...UC_B, ...UC_C];

const LINKS = {
  heating: ['Отопление и климат', 'Котёл, тёплые полы, радиаторы и вентиляция одной системой'],
  house: ['Умный загородный дом', 'Отопление, баня, ворота, участок и ИИ-консьерж'],
  apartments: ['Умная квартира', 'Тёплые полы, свет, шторы и протечки за несколько недель'],
  territory: ['Ворота, камеры, участок', 'Въезд, видео, подогрев дорожек и резервное питание'],
  banya: ['Баня, сауна и спа', 'Прогрев к приезду, купель и джакузи'],
  'journal/heated-paths': ['Как не платить за обогрев впустую', 'Статья о подогреве дорожек и водостоков'],
  'journal/boiler-winter': ['Котёл остановился в феврале', 'Разбор аварии по минутам'],
};
const TEASER = {
  'kotel-udalenno': 'Прогрев к приезду, погодозависимый режим и сигнал об аварии инженеру',
  'teplyj-pol': 'Водяной и электрический, по расписанию и своя температура в каждой зоне',
  videonablyudenie: 'Уличные камеры до −40°, аналитика и архив в доме',
  'umnye-vorota': 'Открытие по номеру машины, гостевые коды и видеодомофон',
  'obogrev-krovli': 'Кровля, водостоки и дорожки по датчикам осадков, без лишних счетов',
  'zashchita-ot-protechek': 'Краны с электроприводом, датчики и защита труб от мороза',
};
USECASES.forEach((u) => { LINKS[u.path] = [u.crumb, TEASER[u.path]]; });

export const relatedBlock = (paths, title = 'Смотрите также', kicker = 'Связанные решения') => `
<section class="section section--tight">
  <div class="wrap">
    ${sectionHead({ kicker, title })}
    <div class="feat feat--${paths.length % 3 === 0 ? 3 : 2} related">
      ${paths.map((p) => `<a class="feat__item related__item" href="${url(p)}"><h3>${LINKS[p][0]}</h3><p>${LINKS[p][1]}</p></a>`).join('')}
    </div>
  </div>
</section>`;

export const USECASE_PAGES = USECASES.map((u) => ({
  path: u.path,
  render() {
    const body = `
${hero({ photoKey: u.photo, alt: u.crumb, crumb: u.crumb, size: 'mid', kicker: u.kicker, title: u.h1, lead: u.lead,
  ctas: btn('#lead', 'Оставить заявку') + btn(url('pricing'), 'Рассчитать бюджет', 'ghost'),
  panel: statusPanel(u.panel, u.panelTitle) })}

<section class="section tone-light">
  <div class="wrap"><p class="thesis rv">${u.thesis}</p></div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: u.crumb, title: u.featHead })}
    ${features(u.feats)}
  </div>
</section>

${split({ photoKey: u.splitPhoto, alt: u.crumb, tone: 'tone-deep', kicker: u.crumb, title: u.split.title, body: u.split.body, list: u.split.list })}

<section class="section tone-light">
  <div class="wrap">
    ${sectionHead({ kicker: 'Стоимость', title: 'Сколько это стоит.', lead: 'Ориентиры на оборудование автоматики, монтаж и настройку, в рублях с НДС. Точная смета после выезда инженера.' })}
    <div class="table-wrap">
      <table class="ptable ptable--price">
        <thead><tr><th>Вариант</th><th>Что входит</th><th>Бюджет</th></tr></thead>
        <tbody>${u.prices.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="num">${r[2]}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap two-col">
    ${sectionHead({ kicker: 'Вопросы', title: 'Частые вопросы.' })}
    ${faq(u.faq)}
  </div>
</section>

${relatedBlock(u.related)}

${ctaBand({ photoKey: u.ctaPhoto })}
`;
    return { title: `${u.seoTitle} · Smart Home`, description: u.seoDesc, body, ogPhoto: u.photo, service: { ...u.service, description: u.seoDesc } };
  },
}));
