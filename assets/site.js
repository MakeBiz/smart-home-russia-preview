(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const lang = d.body.dataset.lang || 'en';
  const T = (en, ru) => (lang === 'ru' ? ru : en);

  /* header */
  const head = d.querySelector('[data-head]');
  const onScroll = () => head && head.classList.toggle('is-solid', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* dropdowns on touch / click */
  d.querySelectorAll('.nav__btn').forEach((b) => b.addEventListener('click', () => {
    const g = b.parentElement, open = !g.classList.contains('is-open');
    d.querySelectorAll('.nav__group.is-open').forEach((x) => { x.classList.remove('is-open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
    g.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
  }));
  d.addEventListener('click', (e) => { if (!e.target.closest('.nav__group')) d.querySelectorAll('.nav__group.is-open').forEach((x) => x.classList.remove('is-open')); });

  /* mobile menu */
  const mnav = d.querySelector('[data-mnav]');
  d.querySelectorAll('[data-burger]').forEach((b) => b.addEventListener('click', () => { mnav.hidden = false; d.body.style.overflow = 'hidden'; }));
  d.querySelectorAll('[data-burger-close]').forEach((b) => b.addEventListener('click', () => { mnav.hidden = true; d.body.style.overflow = ''; }));

  /* reveal: in-view items show at once, the rest ease in; everything shows after 2.5s regardless */
  const rv = [...d.querySelectorAll('.rv')];
  if ('IntersectionObserver' in window && rv.length) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in'); else io.observe(el); });
    setTimeout(() => rv.forEach((el) => el.classList.add('in')), 2500);
  } else rv.forEach((el) => el.classList.add('in'));

  /* tabs (scenarios, calculator modes) */
  d.querySelectorAll('[data-tabs]').forEach((box) => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const select = (t) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = d.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => { const k = e.key; if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); const n = tabs[(i + (k === 'ArrowDown' || k === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); select(n); } });
    });
  });

  /* live status: gentle drift of values so the panel feels alive */
  d.querySelectorAll('[data-live]').forEach((el) => {
    const [from, to, dec] = el.dataset.live.split(',').map(Number);
    let v = from; const unit = el.dataset.unit || '';
    const fmt = (x) => x.toFixed(dec) + unit;
    el.textContent = fmt(v);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setInterval(() => {
      const step = (to - v) * 0.06 + (Math.random() - 0.5) * Math.pow(10, -dec);
      v = Math.abs(to - v) < Math.pow(10, -dec) ? to + (Math.random() - 0.5) * 2 * Math.pow(10, -dec) : v + step;
      el.textContent = fmt(v);
    }, 1800);
  });

  /* ---------- calculator ---------- */
  const calc = d.querySelector('[data-calc]');
  if (calc) {
    const nf = new Intl.NumberFormat('ru-RU');
    const rub = (n) => (n >= 1e6 ? (Math.round(n / 1e4) / 100).toLocaleString('ru-RU') + ' млн ₽' : nf.format(n) + ' ₽');
    const rubRange = (a, b) => (b >= 1e6 ? `${(Math.round(a / 1e4) / 100).toLocaleString('ru-RU')}-${(Math.round(b / 1e4) / 100).toLocaleString('ru-RU')} млн ₽` : `${nf.format(a)}-${nf.format(b)} ₽`);
    const R = {
      platform: { comfort: [180000, 320000], ai: [180000, 320000], residence: [450000, 850000] },
      common: { comfort: [80000, 160000], ai: [80000, 160000], residence: [200000, 380000] },
      room: { comfort: [45000, 85000], ai: [45000, 85000], residence: [110000, 190000] },
      boiler: { comfort: [90000, 190000], ai: [90000, 190000], residence: [160000, 320000] },
      aptHeat: { comfort: [40000, 90000], ai: [40000, 90000], residence: [80000, 160000] },
      zone: { comfort: [18000, 35000], ai: [18000, 35000], residence: [30000, 60000] },
      shade: { comfort: [35000, 70000], ai: [35000, 70000], residence: [70000, 130000] },
      aiBase: { comfort: [0, 0], ai: [350000, 700000], residence: [350000, 700000] },
      aiRoom: { comfort: [0, 0], ai: [15000, 30000], residence: [15000, 30000] },
      type: { apartment: [0, 0], townhouse: [60000, 140000], house: [120000, 280000] },
      stage: { new: [0, 0], renovation: [8000, 18000], ready: [15000, 35000] },
      banya: { none: [0, 0], sauna: [110000, 240000], spa: [220000, 480000] },
      gate: [70000, 160000], camBase: [45000, 95000], cam: [16000, 32000], snow: [80000, 190000], garden: [120000, 260000],
      leak: [45000, 95000], power: [90000, 220000], lock: [35000, 80000],
    };
    const SUB = { comfort: [3000, 8000], ai: [6000, 15000], residence: [12000, 30000] };
    const val = (name) => { const el = calc.querySelector(`[name="${name}"]:checked`) || calc.querySelector(`[name="${name}"]`); return el ? (el.type === 'checkbox' ? el.checked : el.value) : null; };
    const out = (id) => calc.querySelector(`[data-out="${id}"]`);
    const bar = calc.querySelector('[data-calcbar]');
    const barText = { home: '', office: '' };
    const activeMode = () => (d.getElementById('pane-office').hidden ? 'home' : 'office');
    const activeResult = () => d.getElementById(activeMode() === 'home' ? 'calc-result' : 'calc-result-office');
    const setBar = (txt, mode) => { barText[mode] = txt; if (mode === activeMode()) out('bar').textContent = txt; };
    const mq = matchMedia('(max-width: 960px)');
    const seen = new Map();
    const activePane = () => d.getElementById(activeMode() === 'home' ? 'pane-home' : 'pane-office');
    const updateBar = () => {
      out('bar').textContent = barText[activeMode()];
      const formOn = !!seen.get(activePane().querySelector('.calc__form'));
      const resOn = !!seen.get(activeResult());
      bar.hidden = !(mq.matches && formOn && !resOn);
    };
    if ('IntersectionObserver' in window) {
      const io2 = new IntersectionObserver((es) => { es.forEach((e) => seen.set(e.target, e.isIntersecting)); updateBar(); });
      calc.querySelectorAll('.calc__form, .result').forEach((el) => io2.observe(el));
      calc.querySelectorAll('[role="tab"]').forEach((tb) => tb.addEventListener('click', () => setTimeout(updateBar, 80)));
      mq.addEventListener ? mq.addEventListener('change', updateBar) : mq.addListener(updateBar);
    }
    calc.querySelector('[data-calcbar-go]').addEventListener('click', () => activeResult().scrollIntoView({ behavior: 'smooth', block: 'start' }));

    const sync = () => {
      calc.querySelectorAll('input[type="range"]').forEach((r) => { const o = calc.querySelector(`output[for="${r.id}"]`); if (o && r.id !== 'o_area') o.textContent = r.value + (r.max && +r.value >= +r.max && r.dataset.plus ? '+' : ''); });
      calc.querySelector('[data-zones]').hidden = val('climate') !== 'some';
      calc.querySelector('#shades').disabled = !!val('shades_unknown');
      const apt = val('type') === 'apartment';
      calc.querySelectorAll('[data-outdoor]').forEach((x) => (x.hidden = apt));
    };

    const compute = () => {
      sync();
      const tier = val('tier'), type = val('type'), stage = val('stage');
      const apt = type === 'apartment';
      const rooms = +val('rooms');
      const W = val('shades_unknown') ? rooms : +val('shades');
      const climate = val('climate');
      const Z = climate === 'all' || climate === 'unknown' ? rooms : climate === 'some' ? Math.min(+val('zones'), rooms) : 0;
      const banya = apt ? 'none' : val('banya');
      const cams = +val('cams');
      const lines = [];
      const add = (label, [lo, hi], k = 1) => { if (hi * k > 0) lines.push([label, lo * k, hi * k]); };
      add('Платформа и запуск', R.platform[tier]);
      add(apt ? 'Прихожая, коридор, общие зоны' : 'Общие зоны: вход, холл, лестница', R.common[tier]);
      add(`Свет и присутствие, комнат: ${rooms}`, R.room[tier], rooms);
      if (Z > 0) { add(apt ? 'Узел отопления квартиры' : 'Котельная и погодозависимое управление', apt ? R.aptHeat[tier] : R.boiler[tier]); add(`Зон отопления: ${Z}`, R.zone[tier], Z); }
      add(`Приводов штор: ${W}`, R.shade[tier], W);
      add('Настройка ИИ-консьержа', R.aiBase[tier]);
      add('ИИ-сценарии по комнатам', R.aiRoom[tier], rooms);
      add('Инфраструктура объекта', R.type[type]);
      add('Монтажный резерв по стадии', R.stage[stage], rooms);
      if (banya !== 'none') add(banya === 'spa' ? 'Баня и спа-зона' : 'Баня или сауна', R.banya[banya]);
      if (cams > 0) { add('Видеонаблюдение: регистратор и сеть', R.camBase); add(`Камер: ${cams}`, R.cam, cams); }
      if (!apt && val('gate')) add('Ворота и калитка', R.gate);
      if (!apt && val('snow')) add('Подогрев дорожек и водостоков', R.snow);
      if (!apt && val('garden')) add('Свет и полив участка', R.garden);
      if (val('leak')) add('Защита от протечек', R.leak);
      if (val('power')) add('Резервное питание', R.power);
      if (val('lock')) add('Умный замок', R.lock);
      const lo = lines.reduce((s, l) => s + l[1], 0), hi = lines.reduce((s, l) => s + l[2], 0);
      const loV = Math.floor(lo / 10000) * 10000, hiV = Math.ceil(hi / 10000) * 10000;
      out('sum').innerHTML = `${rub(loV)}<br>до ${rub(hiV)}<small>Ориентировочный бюджет с НДС</small>`;
      const sub = SUB[tier];
      out('sub').textContent = `${nf.format(sub[0])}-${nf.format(sub[1])} ₽ / мес.`;
      out('sublabel').textContent = tier === 'comfort' ? 'Удалённый сервис, по желанию' : 'ИИ-консьерж и мониторинг';
      out('list').innerHTML = lines.map((l) => `<li><span>${l[0]}</span><span>${nf.format(Math.round(l[1] / 1000) * 1000)}-${nf.format(Math.round(l[2] / 1000) * 1000)}</span></li>`).join('');
      const warn = [];
      if (rooms > 12 || W > 20 || cams > 12) warn.push('Больше 12 комнат, 20 штор или 12 камер: итоговую цену фиксируем после обследования.');
      if (climate === 'unknown') warn.push('Мы предположили одну зону отопления на комнату. Совместимость котла и коллектора проверим на объекте.');
      const w = out('warn'); w.hidden = !warn.length; w.textContent = warn.join(' ');
      const names = { apartment: 'квартира', townhouse: 'таунхаус', house: 'загородный дом' };
      const summary = `Расчёт: ${names[type]}, ${rooms} комн., ${W} штор, ${Z} зон отопления, баня: ${banya}, камер: ${cams}, уровень: ${tier} → ${rubRange(loV, hiV)}`;
      calc.dataset.summary = summary;
      setBar(rubRange(loV, hiV), 'home');
      try { sessionStorage.setItem('shr_estimate', summary); } catch (e) { /* storage unavailable */ }
    };

    const office = () => {
      const area = +val('o_area'); const scope = val('o_scope');
      const o = calc.querySelector('output[for="o_area"]'); if (o) o.textContent = nf.format(area) + (area >= 3000 ? '+' : '');
      const a = Math.max(area, 300);
      let lo, hi;
      if (scope === 'optimise') { lo = 420000 + (a - 300) * 350; hi = 850000 + (a - 300) * 700; }
      else { lo = 1400000 + (a - 300) * 1100; hi = 2800000 + (a - 300) * 2200; }
      const survey = [40000, 120000];
      const L = Math.floor((lo + survey[0]) / 10000) * 10000, H = Math.ceil((hi + survey[1]) / 10000) * 10000;
      out('o_sum').innerHTML = `${rub(L)}<br>до ${rub(H)}${area > 1500 ? '+' : ''}<small>Ориентир с обследованием и НДС</small>`;
      out('o_sub').textContent = '15 000-60 000 ₽ / мес.';
      const w = out('o_warn'); w.hidden = area <= 1500; w.textContent = 'Для площади больше 1 500 м² цену считаем после обследования инженерии здания.';
      setBar(rubRange(L, H), 'office');
      calc.dataset.summary = `Расчёт офиса: ${area} м², ${scope === 'full' ? 'полный умный офис' : 'адресная оптимизация'} → ${rubRange(L, H)}`;
      try { sessionStorage.setItem('shr_estimate', calc.dataset.summary); } catch (e) { /* storage unavailable */ }
    };

    calc.addEventListener('input', (e) => { if (e.target.closest('[data-office]')) office(); else compute(); });
    calc.addEventListener('change', (e) => { if (e.target.closest('[data-office]')) office(); else compute(); });
    const h = location.hash.replace('#', '');
    if (['apartment', 'townhouse', 'house'].includes(h)) {
      const r = calc.querySelector(`[name="type"][value="${h}"]`); if (r) r.checked = true;
      if (h === 'apartment') { calc.querySelector('#rooms').value = 3; calc.querySelector('#shades').value = 4; calc.querySelector('#cams').value = 0; const st = calc.querySelector('[name="stage"][value="renovation"]'); if (st) st.checked = true; const pw = calc.querySelector('#power'); if (pw) pw.checked = false; }
    }
    if (h === 'office') { const t = d.getElementById('tab-office'); if (t) t.click(); }
    compute(); office();
  }

  /* ---------- lead forms: name, phone, telegram → relay → Telegram + Bitrix24 ---------- */
  const S = window.SITE || {};
  // remember UTM and referrer of the first visit in this session
  try {
    const qs = new URLSearchParams(location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'gclid'].forEach((k) => { if (qs.get(k)) utm[k] = qs.get(k); });
    if (Object.keys(utm).length) sessionStorage.setItem('shr_utm', JSON.stringify(utm));
    if (!sessionStorage.getItem('shr_ref')) sessionStorage.setItem('shr_ref', document.referrer || '');
  } catch (e) { /* storage unavailable */ }

  const digits = (v) => (v || '').replace(/\D/g, '');
  const fmtPhone = (v) => {
    let d = digits(v);
    if (!d) return '';
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] === '9') d = '7' + d;
    if (d[0] !== '7') return '+' + d.slice(0, 15);
    d = d.slice(1, 11);
    let out = '+7';
    if (d.length) out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ')';
    if (d.length > 3) out += ' ' + d.slice(3, 6);
    if (d.length > 6) out += '-' + d.slice(6, 8);
    if (d.length > 8) out += '-' + d.slice(8, 10);
    return out;
  };
  const cleanTg = (v) => {
    let t = (v || '').trim().replace(/^https?:\/\/(www\.)?(t|telegram)\.me\//i, '').replace(/^@+/, '').replace(/[/?#].*$/, '');
    return t ? '@' + t : '';
  };

  d.querySelectorAll('[data-phone]').forEach((inp) => {
    inp.addEventListener('focus', () => { if (!inp.value) inp.value = '+7 ('; });
    inp.addEventListener('blur', () => { if (digits(inp.value).length <= 1) inp.value = ''; });
    inp.addEventListener('input', () => { const end = inp.selectionEnd === inp.value.length; inp.value = fmtPhone(inp.value); if (end) inp.setSelectionRange(inp.value.length, inp.value.length); });
  });

  d.querySelectorAll('[data-form]').forEach((f) => {
    const err = f.querySelector('[data-err]');
    const btnEl = f.querySelector('button[type="submit"]');
    const showErr = (msg) => { err.textContent = msg; err.hidden = !msg; };
    f.addEventListener('input', (e) => { e.target.classList && e.target.classList.remove('is-bad'); if (e.target.name === 'consent') e.target.closest('.consent').classList.remove('is-bad'); showErr(''); });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(f);
      const name = (fd.get('name') || '').trim();
      const phoneDigits = digits(fd.get('phone'));
      const tg = cleanTg(fd.get('telegram'));
      const bad = [];
      if (name.length < 2) bad.push(f.querySelector('[name="name"]'));
      if (phoneDigits.length < 11) bad.push(f.querySelector('[name="phone"]'));
      bad.forEach((x) => x.classList.add('is-bad'));
      if (bad.length) { showErr(bad.length === 2 ? 'Укажите имя и телефон.' : name.length < 2 ? 'Укажите, как к вам обращаться.' : 'Проверьте номер телефона: нужно 11 цифр.'); bad[0].focus(); return; }
      if (!fd.get('consent')) { f.querySelector('.consent').classList.add('is-bad'); showErr('Отметьте согласие на обработку данных.'); return; }
      if (fd.get('website')) { done(); return; } // bot
      let estimate = '', utm = {}, ref = '';
      try { estimate = sessionStorage.getItem('shr_estimate') || ''; utm = JSON.parse(sessionStorage.getItem('shr_utm') || '{}'); ref = sessionStorage.getItem('shr_ref') || ''; } catch (x) { /* ignore */ }
      const payload = {
        name, phone: '+' + (phoneDigits[0] === '8' ? '7' + phoneDigits.slice(1) : phoneDigits), telegram: tg,
        role: fd.get('role') || '', message: (fd.get('message') || '').trim(), estimate,
        page: location.href.split('#')[0], title: document.title, referrer: ref, utm,
      };
      function done() { f.querySelector('[data-ok]').hidden = false; f.querySelectorAll('.field, .form__foot, .consent').forEach((x) => (x.hidden = true)); showErr(''); try { if (window.ym && S.metrika) window.ym(S.metrika, 'reachGoal', 'lead'); } catch (x) { /* ignore */ } }
      if (!S.formEndpoint) { showErr('Форма ещё не подключена. Попробуйте позже.'); return; }
      btnEl.disabled = true; btnEl.querySelector('span').textContent = 'Отправляем…';
      try {
        const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), 15000);
        const r = await fetch(S.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(payload), signal: ctrl.signal });
        clearTimeout(tm);
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.ok) throw new Error(j.error || 'send');
        done();
      } catch (x) {
        showErr('Не получилось отправить заявку. Проверьте интернет и попробуйте ещё раз.');
      } finally { btnEl.disabled = false; btnEl.querySelector('span').textContent = 'Отправить заявку'; }
    });
  });

  /* mobile sticky CTA: to the form on this page, hidden while a form or the calculator bar is on screen */
  const mcta = d.querySelector('[data-mcta]');
  if (mcta) {
    const target = d.getElementById('lead');
    if (!target) mcta.href = S.contactUrl || '/contact/';
    const vis = new Map();
    const upd = () => { const calcBar = d.querySelector('[data-calcbar]'); const anyVis = [...vis.values()].some(Boolean); mcta.classList.toggle('is-hidden', anyVis || (calcBar && !calcBar.hidden) || scrollY < 200); };
    if ('IntersectionObserver' in window) {
      const io3 = new IntersectionObserver((es) => { es.forEach((e) => vis.set(e.target, e.isIntersecting)); upd(); });
      d.querySelectorAll('[data-form], .result, .hero').forEach((el) => io3.observe(el));
    }
    window.addEventListener('scroll', upd, { passive: true }); upd();
    const bar = d.querySelector('[data-calcbar]'); if (bar && 'MutationObserver' in window) new MutationObserver(upd).observe(bar, { attributes: true, attributeFilter: ['hidden'] });
  }
})();
