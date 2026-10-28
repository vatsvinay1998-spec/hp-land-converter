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
    { id: 'biswansi', name: 'Biswansi', hi: 'बिस्वांसी', group: 'a', m2: () => BIGHA / 400 },
    { id: 'biswa',    name: 'Biswa',    hi: 'बिस्वा',    group: 'a', m2: () => BIGHA / 20 },
    { id: 'bigha',    name: 'Bigha',    hi: 'बीघा',      group: 'a', m2: () => BIGHA },
    { id: 'sarsahi',  name: 'Sarsahi',  hi: 'सरसाही',    group: 'b', m2: () => kanal() / 180 },
    { id: 'marla',    name: 'Marla',    hi: 'मरला',      group: 'b', m2: () => kanal() / 20 },
    { id: 'kanal',    name: 'Kanal',    hi: 'कनाल',      group: 'b', m2: () => kanal() },
    { id: 'sqm',      name: 'Square metre', hi: 'm²',    group: 'm', m2: () => 1 },
    { id: 'sqft',     name: 'Square foot',  hi: 'ft²',   group: 'm', m2: () => 0.09290304 },
    { id: 'sqyd',     name: 'Square yard',  hi: 'yd²',   group: 'm', m2: () => 0.83612736 },
    { id: 'acre',     name: 'Acre',     hi: 'एकड़',      group: 'm', m2: () => ACRE },
    { id: 'hectare',  name: 'Hectare',  hi: 'हेक्टेयर',  group: 'm', m2: () => 10000 },
  ];
  const byId = Object.fromEntries(UNITS.map(u => [u.id, u]));
  const GROUPS = { a: 'System A · Bigha', b: 'System B · Kanal', m: 'Metric & Imperial' };

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

  const compoundHtml = (m2) => {
    const [bg, bw, bs] = compound(m2, BIGHA, 20, 20);
    const [kn, mr, sr] = compound(m2, kanal(), 20, 9);
    return `
      <div class="compound">
        <div class="compound-row a"><span class="k">Bigha – Biswa – Biswansi</span><span class="v">${bg.toLocaleString('en-IN')} – ${bw} – ${trim(bs)}</span></div>
        <div class="compound-row b"><span class="k">Kanal – Marla – Sarsahi${karam === '57.5' ? ' (57.5″)' : ''}</span><span class="v">${kn.toLocaleString('en-IN')} – ${mr} – ${trim(sr)}</span></div>
      </div>`;
  };

  const resultsHtml = (m2, fromId) => {
    let html = compoundHtml(m2);
    for (const g of Object.keys(GROUPS)) {
      html += `<div class="group-h ${g}">${GROUPS[g]}</div>`;
      for (const u of UNITS.filter(x => x.group === g)) {
        const v = m2 / u.m2();
        html += `<button class="res${u.id === fromId ? ' is-from' : ''}" data-copy="${fmt(v)} ${u.name.toLowerCase()}">
          <span class="res-name"><b>${u.name}</b><span>${u.hi}</span></span>
          <span class="res-val">${fmt(v)}</span>
        </button>`;
      }
    }
    return html;
  };

  // ---- Elements ----
  const $ = (id) => document.getElementById(id);
  const amount = $('amount'), fromUnit = $('fromUnit'), results = $('results');
  const karamWarn = $('karamWarn');
  const r1 = $('r1'), r2 = $('r2'), r3 = $('r3');
  const rFormula = $('rFormula'), rResults = $('rResults'), rKaramNote = $('rKaramNote');

  fromUnit.innerHTML = Object.keys(GROUPS).map(g =>
    `<optgroup label="${GROUPS[g]}">` +
    UNITS.filter(u => u.group === g).map(u => `<option value="${u.id}">${u.name}</option>`).join('') +
    `</optgroup>`).join('');

  // ---- State persistence (best effort) ----
  const store = {
    get() { try { return JSON.parse(localStorage.getItem('hpland') || '{}'); } catch { return {}; } },
    set(v) { try { localStorage.setItem('hpland', JSON.stringify(v)); } catch { /* ignore */ } },
  };
  let rSys = 'A';
  const saved = store.get();
  if (saved.amount != null) amount.value = saved.amount;
  if (saved.from && byId[saved.from]) fromUnit.value = saved.from; else fromUnit.value = 'bigha';
  if (saved.karam && KARAM_FACTOR[saved.karam]) karam = saved.karam;
  if (saved.rSys) rSys = saved.rSys;
  if (Array.isArray(saved.r)) [r1.value, r2.value, r3.value] = saved.r;

  const persist = () => store.set({
    amount: amount.value, from: fromUnit.value, karam, rSys, r: [r1.value, r2.value, r3.value],
  });

  // ---- Convert tab ----
  const renderConvert = () => {
    const v = parseFloat(amount.value);
    const m2 = (isFinite(v) ? v : 0) * byId[fromUnit.value].m2();
    results.innerHTML = resultsHtml(m2, fromUnit.value);
  };

  // ---- Rakba tab ----
  const RSYS = {
    A: { labels: ['Bigha', 'Biswa', 'Biswansi'], unit: 'bigha',
         total: (a, b, c) => a + b / 20 + c / 400, expr: (a, b, c) => `${a} + ${b}/20 + ${c}/400` },
    B: { labels: ['Kanal', 'Marla', 'Sarsahi'], unit: 'kanal',
         total: (a, b, c) => a + b / 20 + c / 180, expr: (a, b, c) => `${a} + ${b}/20 + ${c}/180` },
    H: { labels: ['Hectare', 'Are', 'Centiare (m²)'], unit: 'hectare',
         total: (a, b, c) => a + b / 100 + c / 10000, expr: (a, b, c) => `${a} + ${b}/100 + ${c}/10000` },
  };

  const renderRakba = () => {
    const s = RSYS[rSys];
    document.querySelectorAll('[data-sys]').forEach(b => b.classList.toggle('active', b.dataset.sys === rSys));
    $('trio').className = `trio sys-${rSys}`;
    $('r1l').textContent = s.labels[0];
    $('r2l').textContent = s.labels[1];
    $('r3l').textContent = s.labels[2];
    const n = (el) => { const x = parseFloat(el.value); return isFinite(x) ? x : 0; };
    const [a, b, c] = [n(r1), n(r2), n(r3)];
    const t = s.total(a, b, c);
    const m2 = t * byId[s.unit].m2();
    rFormula.textContent = `${s.expr(a, b, c)} = ${fmt(t)} ${s.unit} = ${fmt(m2)} m²`;
    rKaramNote.hidden = karam !== '57.5';
    rKaramNote.textContent = 'Using the 57.5-inch karam for kanal units (change it on the Convert tab).';
    rResults.innerHTML = resultsHtml(m2, s.unit);
  };

  const renderKaram = () => {
    document.querySelectorAll('[data-karam]').forEach(b => {
      const on = b.dataset.karam === karam;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', on);
    });
    karamWarn.hidden = karam !== '57.5';
  };

  const renderAll = () => { renderKaram(); renderConvert(); renderRakba(); persist(); };

  // ---- Events ----
  amount.addEventListener('input', () => { renderConvert(); persist(); });
  fromUnit.addEventListener('change', () => { renderConvert(); persist(); });
  [r1, r2, r3].forEach(el => el.addEventListener('input', () => { renderRakba(); persist(); }));
  [amount, r1, r2, r3].forEach(el => el.addEventListener('focus', () => el.select()));

  document.querySelectorAll('[data-karam]').forEach(b =>
    b.addEventListener('click', () => { karam = b.dataset.karam; renderAll(); }));

  document.querySelectorAll('[data-sys]').forEach(b =>
    b.addEventListener('click', () => { rSys = b.dataset.sys; renderRakba(); persist(); }));

  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => {
      const on = x === t;
      x.classList.toggle('active', on);
      x.setAttribute('aria-selected', on);
      $('tab-' + x.dataset.tab).hidden = !on;
    });
  }));

  // Tap a result to copy it
  const toast = $('toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  };
  document.addEventListener('click', async (e) => {
    const r = e.target.closest('.res');
    if (!r) return;
    try { await navigator.clipboard.writeText(r.dataset.copy); showToast(`Copied ${r.dataset.copy}`); }
    catch { showToast(r.dataset.copy); }
  });

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
