(() => {
  'use strict';

  // ---- Unit definitions (all in square metres) ----
  const ACRE = 4046.8564224;           // international acre
  const BIGHA = ACRE / 5;              // 809.371 m² = 8,712 ft²
  const KANAL_66 = ACRE / 8;           // 505.857 m² = 5,445 ft² (66-inch karam)
  const KARAM_FACTOR = { '66': 1, '57.5': (57.5 / 66) ** 2 }; // 57.5-inch karam ≈ 0.759×

  let karam = '66';
  const kanal = () => KANAL_66 * KARAM_FACTOR[karam];

  const UNITS = [
    { id: 'biswansi', name: 'Biswansi', group: 'a', icon: 'leaf',     m2: () => BIGHA / 400 },
    { id: 'biswa',    name: 'Biswa',    group: 'a', icon: 'layers',   m2: () => BIGHA / 20 },
    { id: 'bigha',    name: 'Bigha',    group: 'a', icon: 'mountain', m2: () => BIGHA },
    { id: 'sarsahi',  name: 'Sarsahi',  group: 'b', icon: 'home',     m2: () => kanal() / 180 },
    { id: 'marla',    name: 'Marla',    group: 'b', icon: 'grid',     m2: () => kanal() / 20 },
    { id: 'kanal',    name: 'Kanal',    group: 'b', icon: 'building', m2: () => kanal() },
    { id: 'sqm',      name: 'Sq metre', abbr: 'm²',   group: 'm', icon: 'dashsq',  m2: () => 1 },
    { id: 'sqft',     name: 'Sq foot',  abbr: 'ft²',  group: 'm', icon: 'square',  m2: () => 0.09290304 },
    { id: 'sqyd',     name: 'Sq yard',  abbr: 'yd²',  group: 'm', icon: 'square',  m2: () => 0.83612736 },
    { id: 'acre',     name: 'Acre',     abbr: 'acre', group: 'm', icon: 'leaf',    m2: () => ACRE },
    { id: 'are',      name: 'Are',      abbr: 'are',  group: 'm', icon: 'grid4',   m2: () => 100 },
    { id: 'hectare',  name: 'Hectare',  abbr: 'ha',   group: 'm', icon: 'sprout',  m2: () => 10000 },
  ];
  const byId = Object.fromEntries(UNITS.map(u => [u.id, u]));
  const GROUPS = { a: 'Bigha system', b: 'Kanal system', m: 'Metric & Imperial' };
  // "Swap units" jumps to the matching unit of the other system.
  const SWAP = { bigha: 'kanal', biswa: 'marla', biswansi: 'sarsahi', sqm: 'sqft', acre: 'hectare', sqyd: 'are' };
  for (const [k, v] of Object.entries(SWAP)) SWAP[v] = k;

  // ---- Icons (24×24, stroke = currentColor) ----
  const P = {
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.830-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
    swap: '<path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="currentColor" fill-opacity=".18"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z" fill="currentColor" fill-opacity=".18"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>',
    mountain: '<path d="M2 20 9.5 7l4.2 7 2.3-3.5L22 20Z" fill="currentColor" stroke="none"/>',
    home: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" fill="currentColor" stroke="none"/>',
    grid: '<rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" stroke="none"/><rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" stroke="none"/><rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" stroke="none"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" stroke="none"/>',
    building: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-5h6v5"/><path d="M9 10h.01M15 10h.01M12 10h.01"/>',
    dashsq: '<rect x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="3.2 3"/>',
    square: '<rect x="4" y="4" width="16" height="16" rx="2"/>',
    grid4: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    sprout: '<path d="M12 21v-7"/><path d="M12 14c0-4.5 3-7.5 8-7.5 0 4.5-3 7.5-8 7.5Z" fill="currentColor"/><path d="M12 14c0-4.5-3-7.5-8-7.5 0 4.5 3 7.5 8 7.5Z" fill="currentColor"/><path d="M12 10c0-3 1-5 0-7-1 2 0 4 0 7Z" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19"/><path d="M12 2.5a14.5 14.5 0 0 1 0 19 14.5 14.5 0 0 1 0-19Z"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r="2.6" fill="#4f9440" stroke="none"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
  };
  const svg = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;
  const LANDSCAPE = '<svg viewBox="0 0 46 46" aria-hidden="true"><defs><linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe8c8"/><stop offset="1" stop-color="#e9f8ec"/></linearGradient></defs><circle cx="23" cy="23" r="23" fill="url(#lsky)"/><path d="M0 28 L12 17 L20 24 L29 14 L46 27 V46 H0Z" fill="#3e8a3f"/><path d="M0 33 Q14 25 26 31 T46 30 V46 H0Z" fill="#7cc04c"/><path d="M0 40 Q16 33 30 38 T46 37" fill="none" stroke="#e9f6c9" stroke-width="2.2"/><path d="M6 46 Q18 38 34 46" fill="none" stroke="#e9f6c9" stroke-width="2"/></svg>';
  document.querySelectorAll('[data-icon]').forEach(el => { el.insertAdjacentHTML('afterbegin', svg(el.dataset.icon)); });

  // ---- Formatting ----
  const fmt = (n) => {
    if (!isFinite(n)) return '—';
    if (n === 0) return '0';
    const a = Math.abs(n);
    if (a < 0.0001) return n.toPrecision(4);
    const maxFrac = a >= 10000 ? 2 : a >= 100 ? 3 : a >= 1 ? 4 : 6;
    return n.toLocaleString('en-IN', { maximumFractionDigits: maxFrac });
  };
  const trim = (n, d = 2) => {
    const s = n.toFixed(d).replace(/\.?0+$/, '');
    return s === '-0' ? '0' : s;
  };
  const round6 = (n) => Number(n.toPrecision(10)).toString();

  // Break an area into a positional big–mid–small reading.
  const compound = (m2, bigM2, midPerBig, smallPerMid) => {
    let smalls = m2 / (bigM2 / (midPerBig * smallPerMid));
    smalls = Math.round(smalls * 1e6) / 1e6; // absorb float noise
    const perBig = midPerBig * smallPerMid;
    const big = Math.floor(smalls / perBig);
    smalls -= big * perBig;
    const mid = Math.floor(smalls / smallPerMid + 1e-9);
    smalls -= mid * smallPerMid;
    return [big, mid, Math.max(0, smalls)];
  };

  // ---- Rendering ----
  // Shrink long numbers so they stay on one line inside narrow tiles.
  const fit = (v) => v.length > 7 ? ' class="xlong"' : v.length > 6 ? ' class="long"' : '';
  const fitR = (digits) => digits.length > 6 ? ' class="long"' : '';
  let lastM2 = 0;
  const tile = (u, m2, fromId) => {
    const v = fmt(m2 / u.m2());
    const isMetric = u.group === 'm';
    return `<button class="tile ${isMetric ? 'm' : u.group}${u.id === fromId ? ' is-from' : ''}" data-copy="${v} ${u.name.toLowerCase()}">
      <span class="ico ${isMetric ? 'm-' + u.id : 'ico-' + u.group}">${svg(u.icon)}</span>
      <span class="t-txt">${isMetric ? `<small>${u.name}</small><b${fit(v)}>${v}</b><em>${u.abbr}</em>` : `<b${fit(v)}>${v}</b><small>${u.name}</small>`}</span>
    </button>`;
  };

  const resultsHtml = (m2, fromId) => {
    lastM2 = m2;
    const [bg, bw, bs] = compound(m2, BIGHA, 20, 20);
    const [kn, mr, sr] = compound(m2, kanal(), 20, 9);
    const local = UNITS.filter(u => u.group !== 'm').map(u => tile(u, m2, fromId)).join('');
    const metric = UNITS.filter(u => u.group === 'm').map(u => tile(u, m2, fromId)).join('');
    return `
      <div class="scenic"><div class="wrap readings">
        <div class="reading a" data-copy="${bg}-${bw}-${trim(bs)} bigha-biswa-biswansi">
          <span class="r-ico">${LANDSCAPE}</span>
          <span class="r-txt"><small>Bigha–Biswa–Biswansi</small><b${fitR(`${bg}${bw}${trim(bs)}`)}>${bg.toLocaleString('en-IN')} - ${bw} - ${trim(bs)}</b></span>
        </div>
        <div class="reading b" data-copy="${kn}-${mr}-${trim(sr)} kanal-marla-sarsahi">
          <span class="r-ico">${svg('home')}</span>
          <span class="r-txt"><small>Kanal–Marla–Sarsahi${karam === '57.5' ? ' (57.5″)' : ''}</small><b${fitR(`${kn}${mr}${trim(sr)}`)}>${kn.toLocaleString('en-IN')} - ${mr} - ${trim(sr)}</b></span>
        </div>
      </div></div>
      <div class="wrap stack overlap">
        <div class="card tiles">${local}</div>
        <div class="card">
          <div class="card-head">
            <span class="ico ico-globe">${svg('globe')}</span>
            <h2>${GROUPS.m}</h2>
            <button class="copy-all" data-copyall>${svg('clipboard')}Copy all</button>
          </div>
          <div class="tiles mtiles">${metric}</div>
        </div>
      </div>`;
  };

  // ---- Elements ----
  const $ = (id) => document.getElementById(id);
  const amount = $('amount'), fromUnit = $('fromUnit'), results = $('results');
  const r1 = $('r1'), r2 = $('r2'), r3 = $('r3');
  const rFormula = $('rFormula'), rResults = $('rResults');

  fromUnit.innerHTML = Object.keys(GROUPS).map(g =>
    `<optgroup label="${GROUPS[g]}">` +
    UNITS.filter(u => u.group === g).map(u => `<option value="${u.id}">${u.name}</option>`).join('') +
    `</optgroup>`).join('');

  // ---- State persistence (best effort) ----
  const store = {
    get() { try { return JSON.parse(localStorage.getItem('hpland') || '{}'); } catch { return {}; } },
    set(v) { try { localStorage.setItem('hpland', JSON.stringify(v)); } catch { /* ignore */ } },
    clear() { try { localStorage.removeItem('hpland'); } catch { /* ignore */ } },
  };
  let rSys = 'A';
  let tab = 'convert';
  const saved = store.get();
  if (saved.amount != null) amount.value = saved.amount;
  fromUnit.value = saved.from && byId[saved.from] ? saved.from : 'bigha';
  if (saved.karam && KARAM_FACTOR[saved.karam]) karam = saved.karam;
  if (saved.rSys) rSys = saved.rSys;
  if (Array.isArray(saved.r)) [r1.value, r2.value, r3.value] = saved.r;

  const persist = () => store.set({
    amount: amount.value, from: fromUnit.value, karam, rSys, r: [r1.value, r2.value, r3.value],
  });

  // ---- Convert tab ----
  const renderConvert = () => {
    const v = parseFloat(amount.value);
    results.innerHTML = resultsHtml((isFinite(v) ? v : 0) * byId[fromUnit.value].m2(), fromUnit.value);
  };

  // ---- Rakba tab ----
  const RSYS = {
    A: { labels: ['Bigha', 'Biswa', 'Biswansi'], unit: 'bigha', per: [20, 20],
         total: (a, b, c) => a + b / 20 + c / 400, expr: (a, b, c) => `${a} + ${b}/20 + ${c}/400` },
    B: { labels: ['Kanal', 'Marla', 'Sarsahi'], unit: 'kanal', per: [20, 9],
         total: (a, b, c) => a + b / 20 + c / 180, expr: (a, b, c) => `${a} + ${b}/20 + ${c}/180` },
    H: { labels: ['Hectare', 'Are', 'Centiare'], unit: 'hectare', per: [100, 100],
         total: (a, b, c) => a + b / 100 + c / 10000, expr: (a, b, c) => `${a} + ${b}/100 + ${c}/10000` },
  };
  const num = (el) => { const x = parseFloat(el.value); return isFinite(x) ? x : 0; };
  const rakbaM2 = () => RSYS[rSys].total(num(r1), num(r2), num(r3)) * byId[RSYS[rSys].unit].m2();

  const renderRakba = () => {
    const s = RSYS[rSys];
    document.querySelectorAll('[data-sys]').forEach(b => b.classList.toggle('active', b.dataset.sys === rSys));
    $('trio').className = `trio sys-${rSys}`;
    [$('r1l').textContent, $('r2l').textContent, $('r3l').textContent] = s.labels;
    const [a, b, c] = [num(r1), num(r2), num(r3)];
    const m2 = rakbaM2();
    rFormula.textContent = `${s.expr(a, b, c)} = ${fmt(s.total(a, b, c))} ${s.unit} = ${fmt(m2)} m²`;
    rResults.innerHTML = resultsHtml(m2, s.unit);
  };

  const renderKaram = () => {
    document.querySelectorAll('[data-karam]').forEach(b => {
      const on = b.dataset.karam === karam;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', on);
    });
    document.querySelectorAll('.karamName').forEach(el => { el.textContent = karam === '66' ? 'standard' : 'old Punjab'; });
    if (karam === '57.5') document.querySelector('[data-note]').hidden = false;
  };

  const renderAll = () => { renderKaram(); renderConvert(); renderRakba(); persist(); };

  // ---- Swap units ----
  const swap = () => {
    if (tab === 'rakba') {
      const m2 = rakbaM2();
      rSys = rSys === 'A' ? 'B' : 'A';
      const unitM2 = byId[RSYS[rSys].unit].m2();
      const [x, y, z] = compound(m2, unitM2, ...RSYS[rSys].per);
      [r1.value, r2.value, r3.value] = [x, y, trim(z)];
      renderRakba(); persist();
      showToast(`Now in ${RSYS[rSys].labels.join('–')}`);
      return;
    }
    const from = byId[fromUnit.value], to = byId[SWAP[from.id]];
    const v = parseFloat(amount.value);
    amount.value = isFinite(v) ? round6(v * from.m2() / to.m2()) : '';
    fromUnit.value = to.id;
    renderConvert(); persist();
    showToast(`${from.name} → ${to.name}`);
  };

  // ---- Events ----
  amount.addEventListener('input', () => { renderConvert(); persist(); });
  fromUnit.addEventListener('change', () => { renderConvert(); persist(); });
  [r1, r2, r3].forEach(el => el.addEventListener('input', () => { renderRakba(); persist(); }));
  [amount, r1, r2, r3].forEach(el => el.addEventListener('focus', () => el.select()));
  $('swapBtn').addEventListener('click', swap);
  $('swapCta').addEventListener('click', swap);

  document.querySelectorAll('[data-karam]').forEach(b =>
    b.addEventListener('click', () => { karam = b.dataset.karam; renderAll(); }));
  document.querySelectorAll('[data-sys]').forEach(b =>
    b.addEventListener('click', () => { rSys = b.dataset.sys; renderRakba(); persist(); }));
  document.querySelector('[data-info]').addEventListener('click', () => {
    const n = document.querySelector('[data-note]'); n.hidden = !n.hidden;
  });

  const setTab = (name) => {
    tab = name;
    document.querySelectorAll('.tab').forEach(x => {
      const on = x.dataset.tab === name;
      x.classList.toggle('active', on);
      x.setAttribute('aria-selected', on);
      $('tab-' + x.dataset.tab).hidden = !on;
    });
    $('bottomBar').hidden = name === 'ref';
    document.body.style.paddingBottom = name === 'ref' ? '24px' : '';
  };
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));
  $('bannerBtn').addEventListener('click', () => { setTab('ref'); scrollTo({ top: 0, behavior: 'smooth' }); });

  // Copy: tap a tile or reading, or "Copy all"
  const toast = $('toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  };
  const copy = async (text, label) => {
    try { await navigator.clipboard.writeText(text); showToast(`Copied ${label}`); }
    catch { showToast(label); }
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-copyall]')) {
      const lines = UNITS.map(u => `${u.name}: ${fmt(lastM2 / u.m2())}`);
      copy(lines.join('\n'), 'all values');
      return;
    }
    const c = e.target.closest('.tile, .reading');
    if (c) copy(c.dataset.copy, c.dataset.copy);
  });

  // ---- Settings ----
  const dlg = $('settings');
  $('settingsBtn').addEventListener('click', () => dlg.showModal());
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
  $('resetBtn').addEventListener('click', () => { store.clear(); location.reload(); });

  // ---- PWA: install prompt + service worker ----
  let deferredPrompt;
  const installBtn = $('installBtn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
  window.addEventListener('appinstalled', () => { installBtn.hidden = true; });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  renderAll();
})();
