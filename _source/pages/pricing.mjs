import { url, btn, hero, sectionHead, ctaBand, faq } from '../lib.mjs';

const chips = (name, opts, checked) => `<div class="chips">${opts.map(([v, l]) => `<label class="chip"><input type="radio" name="${name}" id="${name}-${v}" value="${v}" ${v === checked ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>`;
const range = (id, min, max, value, step = 1, plus = false) => `<div class="range"><input type="range" id="${id}" name="${id}" min="${min}" max="${max}" step="${step}" value="${value}" ${plus ? 'data-plus="1"' : ''}><output for="${id}">${value}</output></div>`;
const check = (id, label, small, on = false) => `<label class="check"><input type="checkbox" id="${id}" name="${id}" ${on ? 'checked' : ''}><span>${label}<small>${small}</small></span></label>`;

export default {
  path: 'pricing',
  render() {
    const q = (title, inner, hint = '', attr = '') => `<div class="q" ${attr}><div class="q__label"><h3>${title}</h3></div>${hint ? `<p class="q__hint">${hint}</p>` : ''}${inner}</div>`;
    const ready = [
      ['Квартира: повседневный комфорт', '3 комнаты, 4 шторы, радиаторы и тёплые полы в 3 зонах, защита от протечек', '0,69-1,36 млн ₽'],
      ['Квартира с ИИ-консьержем', '4 комнаты, 6 штор, 4 зоны отопления, протечки, умный замок', '1,28-2,54 млн ₽'],
      ['Таунхаус: семья и сауна', '5 комнат, 6 штор, 5 зон, сауна, ворота, 4 камеры', '1,3-2,64 млн ₽'],
      ['Загородный дом: баня и участок', '7 комнат, 8 штор, котельная и 7 зон, баня, ворота, 6 камер, подогрев дорожек, свет и полив, резервное питание', '1,84-3,81 млн ₽'],
      ['Дом с ИИ и спа-зоной', 'Тот же дом плюс купель и джакузи и ИИ-консьерж', '2,41-4,96 млн ₽'],
      ['Резиденция: индивидуальный уровень', '10 комнат, 14 штор, 10 зон, спа-комплекс, 12 камер, периметр, умный замок', '4,7-9,12 млн ₽'],
    ];
    const body = `
${hero({
  photoKey: 'panel-detail', alt: 'Деталь умной настенной панели', crumb: 'Стоимость', size: 'short',
  kicker: 'Стоимость и калькулятор',
  title: 'Сколько стоит мой дом? <em>Две минуты, чтобы узнать.</em>',
  lead: 'Несколько бытовых вопросов без технических терминов. Вы получаете честный диапазон на оборудование автоматизации, монтаж и настройку, в рублях с НДС.',
})}

<section class="section tone-light" id="calculator">
  <div class="wrap">
    <div data-calc>
      <div class="calc-bar" data-calcbar hidden><div><span class="calc-bar__k">Ваш ориентир бюджета</span><b data-out="bar"></b></div><button type="button" class="calc-bar__btn" data-calcbar-go>Подробнее</button></div>
      <div class="calc__tabs" role="tablist" data-tabs aria-label="Тип объекта">
        <button type="button" role="tab" id="tab-home" aria-controls="pane-home" aria-selected="true">Дом или квартира</button>
        <button type="button" role="tab" id="tab-office" aria-controls="pane-office" aria-selected="false" tabindex="-1">Офис</button>
      </div>

      <div class="calc" role="tabpanel" id="pane-home" aria-labelledby="tab-home">
        <form class="calc__form" onsubmit="return false">
          ${q('Какой у вас объект?', chips('type', [['apartment', 'Квартира'], ['townhouse', 'Таунхаус'], ['house', 'Загородный дом']], 'house'))}
          ${q('На какой стадии?', chips('stage', [['new', 'Строится'], ['renovation', 'Идёт ремонт'], ['ready', 'Готов, живём']], 'new'), 'Стадия меняет трудоёмкость монтажа, а не цену оборудования. На стройке всё проще: кабель закладываем до отделки.')}
          ${q('Сколько основных комнат сделать умными?', range('rooms', 1, 15, 7, 1, true), 'Спальни, гостиная, кухня-столовая, кабинет, детская. В каждой до трёх групп света, панель и датчик присутствия.')}
          ${q('Нужно управление отоплением?', `${chips('climate', [['all', 'Во всех комнатах'], ['some', 'В некоторых'], ['none', 'Нет'], ['unknown', 'Не знаю']], 'all')}<div data-zones hidden style="margin-top:18px"><p class="q__hint">Число независимых зон отопления</p>${range('zones', 1, 15, 3)}</div>`, 'Радиаторы, тёплые полы, конвекторы. Для дома сюда входит котельная и погодозависимое управление котлом.')}
          ${q('На скольких окнах нужны шторы на моторе?', `${range('shades', 0, 25, 8, 1, true)}<div style="margin-top:14px">${check('shades_unknown', 'Пока не знаю', 'Возьмём по одной на комнату')}</div>`, 'Стандартный прямой карниз до 4 м, один слой. Тюль и блэкаут считаются как два. Рольставни тоже сюда.')}
          ${q('Баня, сауна, спа?', chips('banya', [['none', 'Нет'], ['sauna', 'Баня или сауна'], ['spa', 'Баня + купель, джакузи или хаммам']], 'sauna'), 'Считаем автоматику: прогрев, свет, вентиляцию, защиту. Печь, чаши купели и джакузи считаются отдельно.', 'data-outdoor')}
          ${q('Сколько камер видеонаблюдения?', range('cams', 0, 16, 6, 1, true), 'Уличные камеры для мороза, регистратор с архивом, видео на телефоне и аналитика: человек, машина, движение ночью.')}
          ${q('Участок', `<div class="checks">
            ${check('gate', 'Ворота и калитка', 'С телефона и по номеру машины', true)}
            ${check('snow', 'Подогрев дорожек и водостоков', 'По датчикам осадков', true)}
            ${check('garden', 'Свет и полив участка', 'Фасад, дорожки, газон', true)}
          </div>`, 'Считаем подключение и управление. Сами ворота с приводом и греющий кабель считаются отдельно.', 'data-outdoor')}
          ${q('Какой уровень?', chips('tier', [['comfort', 'Комфорт'], ['ai', 'Комфорт + ИИ'], ['residence', 'Резиденция']], 'ai'), '«Комфорт» это полноценный умный дом. ИИ добавляет консьержа, планирование и отчёты. «Резиденция» добавляет архитектурные панели, премиальную механику и индивидуальный дизайн.')}
          ${q('Что-то ещё?', `<div class="checks">
            ${check('leak', 'Защита от протечек', 'Краны и датчики, контроль мороза в подвале', true)}
            ${check('power', 'Резервное питание', 'Автозапуск генератора, ИБП', true)}
            ${check('lock', 'Умный замок', 'Личные и гостевые коды')}
          </div>`)}
        </form>
        <aside class="result" id="calc-result" aria-live="polite">
          <p class="eyebrow">Ваш ориентир бюджета</p>
          <div class="result__sum" data-out="sum"></div>
          <div class="result__sub"><span data-out="sublabel"></span><b data-out="sub"></b></div>
          <ul class="result__list" data-out="list"></ul>
          <p class="result__warn" data-out="warn" hidden></p>
          <p class="result__note">Оборудование автоматизации, стандартный монтаж, интеграция и настройка. Не входят: котлы и радиаторы, банные печи, чаши купелей и джакузи, ворота с приводом, греющий кабель, светильники, ткань штор. Точная смета после обследования.</p>
          ${btn('#lead', 'Получить точную смету')}
        </aside>
      </div>

      <div class="calc" role="tabpanel" id="pane-office" aria-labelledby="tab-office" hidden data-office>
        <form class="calc__form" onsubmit="return false">
          ${q('Площадь офиса, м²', '<div class="range"><input type="range" id="o_area" name="o_area" min="100" max="3000" step="50" value="600"><output for="o_area">600</output></div>')}
          ${q('Что нужно?', chips('o_scope', [['optimise', 'Адресная оптимизация'], ['full', 'Полный умный офис']], 'optimise'), 'Оптимизация: календарь и занятость, климат переговорных, свет, раннее предупреждение о сбоях, сервис-деск. Полный: плюс доступ, гостевой Wi-Fi, аудиовидео и отчётность по всему офису.')}
        </form>
        <aside class="result" id="calc-result-office" aria-live="polite">
          <p class="eyebrow">Ваш ориентир бюджета</p>
          <div class="result__sum" data-out="o_sum"></div>
          <div class="result__sub"><span>Сервис и мониторинг</span><b data-out="o_sub"></b></div>
          <p class="result__warn" data-out="o_warn" hidden></p>
          <p class="result__note">Включает обследование инженерии. Оборудование СКУД, аудиовидео и изменения инженерии здания считаются отдельно.</p>
          ${btn('#lead', 'Заказать обследование офиса')}
        </aside>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ kicker: 'Готовые конфигурации', title: 'Типовые объекты, типовые бюджеты.', lead: 'Эталонные конфигурации, в рублях с НДС. Ваш дом будет отличаться, обследование покажет чем.' })}
    <div class="table-wrap">
      <table class="ptable ptable--price">
        <thead><tr><th>Конфигурация</th><th>Что входит</th><th>Бюджет</th></tr></thead>
        <tbody>${ready.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="num">${r[2]}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section tone-deep">
  <div class="wrap">
    ${sectionHead({ kicker: 'После сдачи', title: 'Сервисные планы.', lead: 'Физическое управление и локальные сцены продолжают работать, даже если вы откажетесь от подписки. Цены в месяц.' })}
    <div class="tiers">
      <article class="tier"><h3>Удалённая поддержка</h3><p class="tier__for">Для уровня «Комфорт». Удалённая помощь, обновления и изменения сцен.</p><p class="tier__price">3 000-8 000 ₽</p></article>
      <article class="tier tier--hl"><h3>ИИ-консьерж</h3><p class="tier__for">Для «Комфорт + ИИ». Мониторинг котла, электричества и камер, планирование, объяснения и еженедельный отчёт.</p><p class="tier__price">6 000-15 000 ₽</p></article>
      <article class="tier"><h3>Сервис резиденции</h3><p class="tier__for">Для резиденций. Расширенный мониторинг, приоритетный выезд и плановая подготовка дома к зиме.</p><p class="tier__price">12 000-30 000 ₽</p></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap two-col">
    ${sectionHead({ kicker: 'Вопросы', title: 'О деньгах.' })}
    ${faq([
      { q: 'Почему диапазон, а не точная цена?', a: '<p>Одна и та же комната может быть сделана на разном совместимом оборудовании и с разной трудоёмкостью. Диапазон честно это показывает. После обследования вы получаете построчную смету с фиксированной ценой.</p>' },
      { q: 'Может ли итог выйти за верхнюю границу?', a: '<p>Да, если обследование найдёт то, чего калькулятор знать не может: старый котёл без интерфейса, неподписанный коллектор тёплого пола, сложные карнизы, большой участок. Вы увидите это в смете до подписания, а не после.</p>' },
      { q: 'Как устроены платежи?', a: '<p>Поэтапно: обследование, аванс на проект и оборудование, затем этапы монтажа. Детали фиксируются в договоре, работаем с физическими и юридическими лицами.</p>' },
      { q: 'Можно ли сделать сначала часть, а остальное потом?', a: '<p>Да, и часто это разумно. Например, сначала отопление и протечки, через год баня и участок. Трассы кабеля и место в щите мы закладываем сразу, чтобы потом ничего не ломать.</p>' },
    ])}
  </div>
</section>

${ctaBand({ photoKey: 'fire-cup', title: 'Превратите диапазон в фиксированную цену.', lead: 'Закажите обследование. Инженер проверит котельную, щит, сеть и участок, а вы получите построчную смету со всеми исключениями письменно.' })}
`;
    return {
      title: 'Стоимость умного дома · Калькулятор в рублях · Smart Home',
      description: 'Рассчитайте стоимость умного дома: квартира от 690 000 ₽, загородный дом с баней и участком от 1,84 млн ₽, офис по площади. Ориентировочные диапазоны с НДС.',
      body, ogPhoto: 'panel-detail',
    };
  },
};
