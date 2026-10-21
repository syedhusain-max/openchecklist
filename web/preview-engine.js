// Renders a checklist's live preview inside a shadow root, scaled to a real device width,
// and highlights the element(s) annotated with data-check="<itemId>".
import { PREVIEW_CSS } from './preview-styles.js';
import { PREVIEWS } from './previews.js';

export const DEVICES = { desktop: 1200, tablet: 768, mobile: 390 };
const isMobileChecklist = (id) => id.startsWith('mobile/');

export function hasPreview(id) { return Boolean(PREVIEWS[id]); }

export function mountPreview(host, checklist, opts = {}) {
  const { interactive = true, onBadge } = opts;
  let theme = opts.theme || 'light';
  let device = isMobileChecklist(checklist.id) ? 'mobile' : opts.device || 'desktop';
  const root = host.shadowRoot || host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${PREVIEW_CSS}</style>
    <div class="oc-viewport" part="viewport"><div class="oc-scaler"><div class="oc-frame pv${isMobileChecklist(checklist.id) ? ' phone' : ''}" data-theme="${theme}" ${interactive ? '' : 'inert'}>
      ${PREVIEWS[checklist.id] || '<div class="pad muted">No preview yet — contribute one in web/previews.js.</div>'}
      <div class="oc-overlay" aria-hidden="true"></div>
    </div></div></div>`;
  const viewport = root.querySelector('.oc-viewport');
  const scaler = root.querySelector('.oc-scaler');
  const frame = root.querySelector('.oc-frame');
  const overlay = root.querySelector('.oc-overlay');
  let scale = 1;
  let current = null;
  let xrayOn = false;
  const opened = new Set();

  function layout() {
    const dw = DEVICES[device];
    const w = host.clientWidth || dw;
    scale = Math.min(1, w / dw);
    frame.style.width = `${dw}px`;
    frame.style.transform = `scale(${scale})`;
    frame.style.setProperty('--s', scale);
    scaler.style.width = `${dw * scale}px`;
    scaler.style.height = `${frame.offsetHeight * scale}px`;
    position();
  }

  const rel = (el) => {
    const f = frame.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: (r.left - f.left) / scale, y: (r.top - f.top) / scale, w: r.width / scale, h: r.height / scale };
  };

  function position() {
    overlay.querySelectorAll('[data-for]').forEach((n) => {
      const el = frame.querySelector(`[data-check~="${CSS.escape(n.dataset.for)}"]`);
      if (!el || !el.getClientRects().length) { n.hidden = true; return; }
      const p = rel(el);
      n.hidden = false;
      // Labels are counter-scaled, so their footprint in frame px is offsetWidth / scale; keep them inside the frame.
      const footprint = n.classList.contains('oc-label') ? n.offsetWidth / scale : 0;
      n.style.left = `${Math.max(Math.min(p.x, DEVICES[device] - footprint - 4), 0)}px`;
      n.style.top = `${Math.max(p.y - (n.classList.contains('oc-label') ? 6 : 0), 0)}px`;
    });
  }

  function openLayersFor(el) {
    let layer = el.closest('.pv-layer');
    while (layer) {
      if (!layer.classList.contains('open')) { layer.classList.add('open'); opened.add(layer); }
      layer = layer.parentElement?.closest('.pv-layer');
    }
  }
  function closeOpened() { opened.forEach((l) => l.classList.remove('open')); opened.clear(); }

  function highlight(itemId, label) {
    frame.querySelectorAll('.oc-hl').forEach((e) => e.classList.remove('oc-hl'));
    overlay.querySelectorAll('.oc-label').forEach((n) => n.remove());
    closeOpened();
    current = itemId;
    if (!itemId) { layout(); return 0; }
    const els = [...frame.querySelectorAll(`[data-check~="${CSS.escape(itemId)}"]`)];
    els.forEach((el) => { openLayersFor(el); el.classList.add('oc-hl'); });
    if (els[0] && label) {
      const tag = document.createElement('span');
      tag.className = 'oc-label'; tag.dataset.for = itemId; tag.textContent = label;
      overlay.appendChild(tag);
    }
    layout();
    if (els[0]) {
      const p = rel(els[0]);
      viewport.scrollTo({ top: Math.max(p.y * scale - viewport.clientHeight / 3, 0), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    return els.length;
  }

  function xray(on) {
    xrayOn = on;
    overlay.querySelectorAll('.oc-badge').forEach((n) => n.remove());
    if (on) checklist.items.forEach((it, i) => {
      if (!frame.querySelector(`[data-check~="${CSS.escape(it.id)}"]`)) return;
      const b = document.createElement('button');
      b.className = 'oc-badge'; b.dataset.for = it.id; b.textContent = i + 1;
      b.title = it.title; b.setAttribute('aria-label', `Item ${i + 1}: ${it.title}`);
      b.addEventListener('click', () => onBadge?.(it.id));
      overlay.appendChild(b);
    });
    frame.classList.toggle('oc-xray', on);
    position();
  }

  // Demo behaviours so components feel real. Links and forms never navigate.
  root.addEventListener('click', (e) => {
    if (!interactive) return;
    const t = e.target.closest('[data-demo], a, button, form');
    if (!t) return;
    if (t.matches('a, button[type=submit]')) e.preventDefault();
    const demo = t.dataset?.demo;
    if (!demo) return;
    e.preventDefault();
    if (demo === 'open') { root.getElementById(t.dataset.target)?.classList.add('open'); }
    else if (demo === 'close') { t.closest('.pv-layer')?.classList.remove('open'); }
    else if (demo === 'toast') {
      const w = root.getElementById(t.dataset.target || 'toast');
      w?.classList.add('open'); clearTimeout(w?._t); if (w) w._t = setTimeout(() => w.classList.remove('open'), 4000);
    } else if (demo === 'loading') {
      t.classList.add('is-loading'); t.setAttribute('aria-busy', 'true');
      setTimeout(() => { t.classList.remove('is-loading'); t.removeAttribute('aria-busy'); }, 1600);
    } else if (demo === 'reveal') {
      const input = t.parentElement.querySelector('input');
      input.type = input.type === 'password' ? 'text' : 'password';
      t.textContent = input.type === 'password' ? 'Show' : 'Hide';
    } else if (demo === 'tab') {
      t.parentElement.querySelectorAll('[data-demo=tab]').forEach((x) => x.setAttribute('aria-selected', String(x === t)));
    } else if (demo === 'period') {
      const r = t.closest('[data-period]');
      r.dataset.period = r.dataset.period === 'annual' ? 'monthly' : 'annual';
      t.setAttribute('aria-checked', String(r.dataset.period === 'annual'));
    } else if (demo === 'toggle') {
      t.setAttribute('aria-checked', String(t.getAttribute('aria-checked') !== 'true'));
    }
    requestAnimationFrame(layout);
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') root.querySelectorAll('.pv-layer.open').forEach((l) => l.classList.remove('open'));
  });

  const ro = new ResizeObserver(() => layout());
  ro.observe(host); ro.observe(frame);
  layout();

  return {
    highlight, xray,
    get current() { return current; },
    setTheme(t) { theme = t; frame.dataset.theme = t; },
    setDevice(d) { if (!isMobileChecklist(checklist.id)) { device = d; layout(); if (current) highlight(current, overlay.querySelector('.oc-label')?.textContent); if (xrayOn) xray(true); } },
    get device() { return device; },
    destroy() { ro.disconnect(); },
  };
}
