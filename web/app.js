// OpenChecklist — zero-dependency SPA. Data: checklists.json. State: localStorage.
import { mountPreview } from './preview-engine.js';
const STORE_KEY = 'openchecklist:v1';
const PRIORITY_LABEL = { must: 'Must', should: 'Should', nice: 'Nice' };
const WCAG_URL = (sc) => `https://www.w3.org/WAI/WCAG22/Understanding/?sc=${encodeURIComponent(sc)}`;

const app = document.getElementById('app');
let DATA;
const byId = new Map();
const state = loadState();

// ---------- state ----------
function freshState() { return { theme: null, scratch: { progress: {}, notes: {} }, projects: {} }; }
function loadState() {
  try { return { ...freshState(), ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') }; }
  catch { return freshState(); }
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {} }
const ctxFor = (pid) => (pid ? state.projects[pid] : state.scratch);

function itemState(ctx, cid, iid) { return ctx.progress[cid]?.[iid] || 'todo'; }
function setItemState(ctx, cid, iid, value) {
  ctx.progress[cid] ??= {};
  if (value === 'todo') delete ctx.progress[cid][iid]; else ctx.progress[cid][iid] = value;
  save();
}
function stats(ctx, checklists) {
  let total = 0, done = 0, na = 0, mustOpen = 0;
  for (const c of checklists) for (const it of c.items) {
    total++;
    const s = itemState(ctx, c.id, it.id);
    if (s === 'done') done++; else if (s === 'na') na++; else if (it.priority === 'must') mustOpen++;
  }
  const denom = total - na;
  return { total, done, na, mustOpen, applicable: denom, pct: denom ? done / denom : 0 };
}

// ---------- helpers ----------
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const catName = (id) => DATA.categories.find((c) => c.id === id)?.name ?? id;
const uid = () => Math.random().toString(36).slice(2, 9);

function ring(pct, key, lg = false) {
  const p = Math.round(pct * 100);
  return `<div class="ring${lg ? ' lg' : ''}" data-ring="${esc(key)}" style="--p:${pct}" data-complete="${p === 100}" role="img" aria-label="${p}% complete">
    <svg viewBox="0 0 36 36" aria-hidden="true"><circle class="track" cx="18" cy="18" r="15.9155"/><circle class="bar" cx="18" cy="18" r="15.9155" pathLength="100"/></svg><span>${p}%</span></div>`;
}
function updateRing(el, pct) {
  const p = Math.round(pct * 100);
  el.style.setProperty('--p', pct);
  el.dataset.complete = String(p === 100);
  el.setAttribute('aria-label', `${p}% complete`);
  el.querySelector('span').textContent = `${p}%`;
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function confetti(fromEl) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = fromEl.getBoundingClientRect();
  const colors = ['#5b4bff', '#d9ff5b', '#1f9d55', '#ff6b9a', '#ffb547'];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.style.left = `${r.left + r.width / 2}px`; s.style.top = `${r.top + r.height / 2}px`;
    s.style.background = colors[i % colors.length];
    s.style.setProperty('--dx', `${(Math.random() - 0.5) * 320}px`);
    s.style.setProperty('--dy', `${(Math.random() - 0.8) * 260}px`);
    s.style.setProperty('--r', `${Math.random() * 720}deg`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copy(text, msg = 'Copied to clipboard') {
  try { await navigator.clipboard.writeText(text); toast(msg); }
  catch { toast('Copy failed — your browser blocked clipboard access'); }
}
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'checklist';

// ---------- exports ----------
const mark = { done: '[x]', na: '[~]', todo: '[ ]' };
function toMarkdown(title, ctx, lists) {
  const s = stats(ctx, lists);
  let md = `# ${title}\n\nProgress: ${s.done}/${s.applicable} applicable items (${Math.round(s.pct * 100)}%), ${s.na} not applicable, ${s.mustOpen} must-haves open.\n\nLegend: [x] done · [ ] open · [~] not applicable\n`;
  for (const c of lists) {
    md += `\n## ${c.title} (${catName(c.category)})\n\n${c.description}\n\n`;
    for (const it of c.items) {
      const st = itemState(ctx, c.id, it.id);
      md += `- ${mark[st]} **${it.title}** _(${it.priority}${it.wcag ? `, WCAG ${it.wcag}` : ''})_ — ${it.description}\n`;
      const note = ctx.notes[`${c.id}::${it.id}`];
      if (note) md += `  - Note: ${note.replace(/\n/g, ' ')}\n`;
    }
  }
  return md;
}
function toCSV(ctx, lists) {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [['checklist', 'category', 'item', 'priority', 'tags', 'wcag', 'status', 'note', 'description']];
  for (const c of lists) for (const it of c.items) {
    rows.push([c.title, catName(c.category), it.title, it.priority, (it.tags || []).join(' '), it.wcag, itemState(ctx, c.id, it.id), ctx.notes[`${c.id}::${it.id}`], it.description]);
  }
  return rows.map((r) => r.map(q).join(',')).join('\n');
}
function toJSON(title, ctx, lists) {
  return JSON.stringify({
    title, exportedAt: new Date().toISOString(), summary: stats(ctx, lists),
    checklists: lists.map((c) => ({ id: c.id, title: c.title, items: c.items.map((it) => ({ ...it, status: itemState(ctx, c.id, it.id), note: ctx.notes[`${c.id}::${it.id}`] || undefined })) })),
  }, null, 2);
}
function toAIPrompt(title, lists) {
  let p = `You are a senior product designer and accessibility reviewer. Review the design I provide (screenshots, Figma frames, a URL or code) against the checklist below.\n\nFor every item answer with: PASS, FAIL or N/A, one sentence of evidence that points at a specific element, and for FAIL a concrete fix. Review "must" items first. Finish with the three highest-impact fixes.\n\nChecklist: ${title}\n`;
  for (const c of lists) {
    p += `\n### ${c.title} (${catName(c.category)})\n`;
    for (const it of c.items) p += `- [${it.priority}] ${it.title}: ${it.description}${it.wcag ? ` (WCAG ${it.wcag})` : ''}\n`;
  }
  return p;
}
function shareLink(title, lists, ctx) {
  const ids = new Set(lists.map((c) => c.id));
  const progress = Object.fromEntries(Object.entries(ctx.progress).filter(([k]) => ids.has(k)));
  const notes = Object.fromEntries(Object.entries(ctx.notes).filter(([k]) => ids.has(k.split('::')[0])));
  const json = JSON.stringify({ name: title, checklists: [...ids], progress, notes });
  const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${location.origin}${location.pathname}#/import/${b64}`;
}

// ---------- views ----------
function checklistCard(c, ctx = state.scratch) {
  const s = stats(ctx, [c]);
  const must = c.items.filter((i) => i.priority === 'must').length;
  return `<a class="card" href="#/c/${c.id}">
    <div class="card-top"><span class="emoji" aria-hidden="true">${c.icon}</span>${ring(s.pct, c.id)}</div>
    <h3>${esc(c.title)}</h3><p>${esc(c.description)}</p>
    <div class="meta"><span>${catName(c.category)}</span><span>·</span><span>${c.items.length} items</span><span>·</span><span>${must} must</span></div>
  </a>`;
}
function kitCard(k) {
  const lists = k.checklists.map((id) => byId.get(id)).filter(Boolean);
  const n = lists.reduce((a, c) => a + c.items.length, 0);
  return `<a class="card kit-card" href="#/kit/${k.id}">
    <div class="card-top"><span class="emoji" aria-hidden="true">${k.icon}</span></div>
    <h3>${esc(k.title)}</h3><p>${esc(k.description)}</p>
    <div class="meta"><span>${lists.length} checklists</span><span>·</span><span>${n} items</span></div></a>`;
}

function viewHome() {
  const words = 'Ship every detail, not just the happy path.'.split(' ');
  const total = DATA.checklists.reduce((a, c) => a + c.items.length, 0);
  const featured = ['web-app/dashboard', 'flows/checkout', 'design-system/button', 'mobile/paywall', 'website/landing-page', 'design-system/accessibility', 'flows/sign-up', 'web-app/data-table'].map((id) => byId.get(id));
  return `
  <section class="hero"><div class="wrap">
    <span class="eyebrow"><b>●</b> Open source · Works with Claude, Cursor & any MCP client</span>
    <h1 class="reveal" aria-label="${esc(words.join(' '))}">${words.map((w, i) => `<span class="w${/detail/.test(w) ? ' hl' : ''}" style="--i:${i}" aria-hidden="true">${esc(w)}</span>`).join(' ')}</h1>
    <p class="hero-sub">Design checklists for websites, web apps, mobile, components and flows — with priorities, WCAG references, projects you can track, exports for your team, and an MCP server so your AI tools design with the same standards.</p>
    <div class="hero-cta">
      <a class="btn primary" href="#/kits">Start from a kit</a>
      <button class="btn" data-action="palette">Search ${DATA.checklists.length} checklists</button>
      <a class="btn" href="#/previews">👁 Live previews</a>
      <a class="btn ghost" href="#/mcp">Use with AI →</a>
    </div>
    <div class="hero-stats">
      <div><strong data-count="${DATA.checklists.length}">${DATA.checklists.length}</strong>checklists</div>
      <div><strong data-count="${total}">${total}</strong>checks</div>
      <div><strong data-count="${DATA.kits.length}">${DATA.kits.length}</strong>starter kits</div>
      <div><strong>7</strong>MCP tools</div>
    </div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="section-head"><div><h2>Starter kits</h2><p>Pre-bundled checklists for what you're actually building. Turn one into a tracked project in a click.</p></div><a class="btn sm" href="#/kits">All kits</a></div>
    <div class="grid">${DATA.kits.map(kitCard).join('')}</div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="section-head"><div><h2>Popular checklists</h2><p>Every item has a priority, so you know what blocks launch and what can wait.</p></div><a class="btn sm" href="#/browse">Browse all</a></div>
    <div class="grid">${featured.map((c) => checklistCard(c)).join('')}</div>
  </div></section>

  ${DATA.categories.map((cat) => `
  <section class="section"><div class="wrap">
    <div class="section-head"><div><h2>${esc(cat.name)}</h2><p>${esc(cat.description)}</p></div><a class="btn sm" href="#/browse/${cat.id}">View all</a></div>
    <div class="chips">${DATA.checklists.filter((c) => c.category === cat.id).map((c) => `<a class="chip" href="#/c/${c.id}"><span aria-hidden="true">${c.icon}</span>${esc(c.title)}</a>`).join('')}</div>
  </div></section>`).join('')}

  <section class="section"><div class="wrap split">
    <div class="prose"><h2>Bring the checklists into your AI tools</h2>
      <p>The OpenChecklist MCP server lets Claude, Cursor, Windsurf, VS Code and any MCP client search checklists, assemble a project checklist from a plain-English brief, and review a screen against it.</p>
      <p style="margin-top:16px"><a class="btn primary" href="#/mcp">Set up MCP</a></p></div>
    <pre class="code">You: Build a pricing page for my SaaS.
AI → <b>build_project_checklist</b>("SaaS pricing page")
AI → <b>get_checklist</b>("website/pricing")
AI: Done. Plans named by audience ✓
    Annual total shown ✓  Tax stated ✓
    Billing FAQ ✓  (7/7 must + should)</pre>
  </div></section>`;
}

function viewBrowse(category) {
  const lists = DATA.checklists.filter((c) => !category || c.category === category);
  return `<div class="wrap">
    <div class="page-head"><h1 style="font-size:clamp(34px,5vw,52px)">Browse checklists</h1><p class="lead">${lists.length} checklists${category ? ` in ${esc(catName(category))}` : ''}. Press <kbd>/</kbd> to search.</p>
      <nav class="chips" aria-label="Categories"><a class="chip" href="#/browse" ${!category ? 'aria-current="page"' : ''}>All</a>${DATA.categories.map((c) => `<a class="chip" href="#/browse/${c.id}" ${category === c.id ? 'aria-current="page"' : ''}>${esc(c.name)}</a>`).join('')}</nav></div>
    <div class="grid">${lists.map((c) => checklistCard(c)).join('')}</div></div>`;
}

function itemHTML(c, it, ctx) {
  const st = itemState(ctx, c.id, it.id);
  const key = `${c.id}::${it.id}`;
  const note = ctx.notes[key] || '';
  const hid = `h-${c.id.replace('/', '-')}-${it.id}`;
  return `<li class="item" id="item-${c.id.replace('/', '-')}-${it.id}" data-cid="${c.id}" data-iid="${it.id}" data-state="${st}" data-priority="${it.priority}">
    <button class="check" role="checkbox" aria-checked="${st === 'done' ? 'true' : st === 'na' ? 'mixed' : 'false'}" aria-labelledby="${hid}" data-action="toggle">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>
    <div class="item-body">
      <div class="item-head"><h3 id="${hid}">${esc(it.title)}</h3>
        <span class="badge ${it.priority}">${PRIORITY_LABEL[it.priority]}</span>
        ${(it.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
        ${it.wcag ? `<a class="wcag" href="${WCAG_URL(it.wcag)}" target="_blank" rel="noopener">WCAG ${esc(it.wcag)}</a>` : ''}</div>
      <p>${esc(it.description)}</p>
      ${it.tip ? `<p class="tip">💡 ${esc(it.tip)}</p>` : ''}
      <div class="item-actions">
        <button class="link-btn" data-action="na" aria-pressed="${st === 'na'}">Not applicable</button>
        <button class="link-btn" data-action="note" aria-expanded="${!!note}">${note ? 'Edit note' : 'Add note'}</button>
        <button class="link-btn pv-link" data-action="preview" aria-pressed="false">👁 Preview</button>
        <button class="link-btn" data-action="link">Copy link</button>
      </div>
      <textarea class="note" data-note="${key}" placeholder="Notes, evidence, ticket links…" aria-label="Note for ${esc(it.title)}" ${note ? '' : 'hidden'}>${esc(note)}</textarea>
    </div></li>`;
}

function toolbar(scopeKey, title) {
  return `<div class="toolbar" data-scope="${esc(scopeKey)}">
    <div data-ring-slot></div>
    <div class="count" data-count-slot></div>
    <div class="filters" role="group" aria-label="Filter by priority">
      ${['all', 'must', 'should', 'nice'].map((f) => `<button class="chip" data-action="filter" data-filter="${f}" aria-pressed="${f === 'all'}">${f === 'all' ? 'All' : PRIORITY_LABEL[f]}</button>`).join('')}
      <button class="chip" data-action="hide-done" aria-pressed="false">Hide completed</button>
    </div>
    <div class="spacer"></div>
    <div class="actions">
      <button class="btn sm" data-action="export-md">Markdown</button>
      <button class="btn sm" data-action="export-csv">CSV</button>
      <button class="btn sm" data-action="export-json">JSON</button>
      <button class="btn sm" data-action="ai-prompt" title="Copy a review prompt for ChatGPT, Claude or Gemini">Copy AI prompt</button>
      <button class="btn sm" data-action="share">Share</button>
      <button class="btn sm danger" data-action="reset">Reset</button>
    </div></div>`;
}

function viewChecklist(id, focusItem) {
  const c = byId.get(id);
  if (!c) return viewNotFound();
  const ctx = state.scratch;
  const related = DATA.kits.filter((k) => k.checklists.includes(id));
  current = { title: `${c.title} ${catName(c.category)} checklist`, lists: [c], ctx, focusItem };
  return `<div class="wrap wide">
    <div class="page-head">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/browse">Browse</a><span>/</span><a href="#/browse/${c.category}">${esc(catName(c.category))}</a></nav>
      <div class="page-title"><span class="emoji" aria-hidden="true">${c.icon}</span><h1>${esc(c.title)} <small>${esc(catName(c.category))}</small></h1></div>
      <p class="lead">${esc(c.description)}</p>
    </div>
    <div class="cl-layout">
      <div class="cl-main">
        ${toolbar(c.id)}
        <ol class="items" data-filter="all">${c.items.map((it) => itemHTML(c, it, ctx)).join('')}</ol>
        <p class="muted" style="font-size:14px">Keyboard: <kbd>j</kbd>/<kbd>k</kbd> move · <kbd>x</kbd> check · <kbd>n</kbd> not applicable · <kbd>p</kbd> preview · <kbd>/</kbd> search</p>
      </div>
      <aside class="cl-preview">${previewPanel(c)}</aside>
    </div>
    ${related.length ? `<section class="section"><div class="section-head"><h2>Part of these kits</h2></div><div class="grid">${related.map(kitCard).join('')}</div></section>` : ''}
  </div>`;
}

function viewKits() {
  return `<div class="wrap"><div class="page-head"><h1 style="font-size:clamp(34px,5vw,52px)">Starter kits</h1><p class="lead">Curated bundles for common builds. Open a kit to preview it, then turn it into a project you can track and share.</p></div>
    <div class="grid">${DATA.kits.map(kitCard).join('')}</div></div>`;
}
function viewKit(id) {
  const k = DATA.kits.find((x) => x.id === id);
  if (!k) return viewNotFound();
  const lists = k.checklists.map((x) => byId.get(x)).filter(Boolean);
  current = { title: k.title, lists, ctx: state.scratch };
  return `<div class="wrap">
    <div class="page-head"><nav class="crumbs"><a href="#/kits">Kits</a></nav>
      <div class="page-title"><span class="emoji" aria-hidden="true">${k.icon}</span><h1>${esc(k.title)}</h1></div>
      <p class="lead">${esc(k.description)}</p>
      <div class="hero-cta" style="margin-top:8px"><button class="btn primary" data-action="new-project" data-kit="${k.id}">Create project from this kit</button><button class="btn" data-action="ai-prompt">Copy AI prompt</button><button class="btn" data-action="export-md">Download Markdown</button></div>
    </div>
    <div class="grid">${lists.map((c) => checklistCard(c)).join('')}</div></div>`;
}

function viewProjects() {
  const projects = Object.entries(state.projects).sort((a, b) => b[1].created - a[1].created);
  return `<div class="wrap"><div class="page-head"><h1 style="font-size:clamp(34px,5vw,52px)">Projects</h1>
    <p class="lead">Combine checklists for one product, track progress separately from other projects, and export or share the result. Saved in this browser.</p>
    <div><button class="btn primary" data-action="new-project">New project</button></div></div>
    ${projects.length ? `<div class="grid">${projects.map(([pid, p]) => {
      const lists = p.checklists.map((x) => byId.get(x)).filter(Boolean); const s = stats(p, lists);
      return `<a class="card" href="#/p/${pid}"><div class="card-top"><span class="emoji" aria-hidden="true">📁</span>${ring(s.pct, pid)}</div><h3>${esc(p.name)}</h3>
        <p>${lists.length} checklists · ${s.done}/${s.applicable} done${s.mustOpen ? ` · <b style="color:var(--must)">${s.mustOpen} must-haves open</b>` : ''}</p></a>`;
    }).join('')}</div>` : `<div class="empty"><span style="font-size:40px" aria-hidden="true">🗂️</span><h2>No projects yet</h2><p class="muted">Start from a kit or pick checklists by hand.</p><div class="hero-cta" style="margin:0"><a class="btn primary" href="#/kits">Browse kits</a><button class="btn" data-action="new-project">Pick checklists</button></div></div>`}
  </div>`;
}
function viewProject(pid) {
  const p = state.projects[pid];
  if (!p) return viewNotFound();
  const lists = p.checklists.map((x) => byId.get(x)).filter(Boolean);
  current = { title: p.name, lists, ctx: p, pid };
  return `<div class="wrap">
    <div class="page-head"><nav class="crumbs"><a href="#/projects">Projects</a></nav>
      <div class="page-title"><h1>${esc(p.name)}</h1></div>
      <p class="lead">${lists.length} checklists · created ${new Date(p.created).toLocaleDateString()}</p>
      <div><button class="btn sm danger" data-action="delete-project">Delete project</button></div></div>
    ${toolbar('project')}
    ${lists.map((c) => `<section class="project-section" id="sec-${c.id.replace('/', '-')}"><header><span style="font-size:26px" aria-hidden="true">${c.icon}</span><h2><a href="#/c/${c.id}">${esc(c.title)}</a> <small class="muted" style="font-size:16px">${esc(catName(c.category))}</small></h2><div style="margin-left:auto;display:flex;gap:10px;align-items:center"><button class="btn sm" data-action="pv-open" data-cid="${c.id}">👁 Preview</button>${ring(stats(p, [c]).pct, c.id)}</div></header>
      <ol class="items" data-filter="all">${c.items.map((it) => itemHTML(c, it, p)).join('')}</ol></section>`).join('')}
  </div>`;
}

function viewImport(b64) {
  let data;
  try {
    data = JSON.parse(decodeURIComponent(escape(atob(b64.replace(/-/g, '+').replace(/_/g, '/')))));
    if (!Array.isArray(data.checklists)) throw new Error('bad');
  } catch { return `<div class="wrap"><div class="page-head"><h1>Invalid share link</h1><p class="lead">This link is broken or incomplete.</p></div></div>`; }
  pendingImport = data;
  const lists = data.checklists.map((x) => byId.get(x)).filter(Boolean);
  return `<div class="wrap"><div class="page-head"><h1>Import “${esc(data.name)}”</h1>
    <p class="lead">Someone shared a checklist project with ${lists.length} checklists: ${lists.map((c) => esc(c.title)).join(', ')}. Importing saves a copy in this browser.</p>
    <div class="hero-cta"><button class="btn primary" data-action="confirm-import">Import as project</button><a class="btn" href="#/">Cancel</a></div></div></div>`;
}

// ---------- previews ----------
const previewCtl = new Map(); // checklist id -> controller for inline panels on the current page
let thumbObserver = null;
const appTheme = () => document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const deviceChips = (c, scope) => (c.category === 'mobile' ? '<span class="chip static">📱 iPhone frame</span>'
  : ['desktop', 'tablet', 'mobile'].map((d) => `<button class="chip" data-action="pv-device" data-device="${d}" data-scope="${scope}" aria-pressed="${d === 'desktop'}">${{ desktop: '🖥 Desktop', tablet: 'Tablet', mobile: 'Mobile' }[d]}</button>`).join(''));

function previewPanel(c) {
  return `<section class="preview-panel" aria-label="Live preview of ${esc(c.title)}">
    <div class="pp-bar">
      <div><b>Live preview</b><p class="muted pp-hint">Hover an item or press <kbd>p</kbd> to see it in the UI.</p></div>
      <div class="pp-controls">${deviceChips(c, c.id)}
        <button class="chip" data-action="pv-theme" data-scope="${c.id}" aria-pressed="${appTheme() === 'dark'}">🌙 Dark</button>
        <button class="chip" data-action="pv-xray" data-scope="${c.id}" aria-pressed="false">Show all ${c.items.length} checks</button>
        <button class="chip" data-action="pv-open" data-cid="${c.id}" aria-label="Open preview full screen">⤢ Expand</button></div>
    </div>
    <div class="pp-host" data-preview="${c.id}"></div>
  </section>`;
}

function mountPagePreviews() {
  previewCtl.forEach((ctl) => ctl.destroy());
  previewCtl.clear();
  thumbObserver?.disconnect();
  app.querySelectorAll('[data-preview]').forEach((host) => {
    const c = byId.get(host.dataset.preview);
    previewCtl.set(c.id, mountPreview(host, c, { theme: appTheme(), onBadge: (iid) => focusItem(c.id, iid) }));
  });
  const thumbs = app.querySelectorAll('[data-preview-thumb]');
  if (!thumbs.length) return;
  thumbObserver = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    thumbObserver.unobserve(e.target);
    mountPreview(e.target, byId.get(e.target.dataset.previewThumb), { theme: appTheme(), interactive: false });
  }), { rootMargin: '200px' });
  thumbs.forEach((t) => thumbObserver.observe(t));
}

function focusItem(cid, iid) {
  const li = app.querySelector(`.item[data-cid="${CSS.escape(cid)}"][data-iid="${CSS.escape(iid)}"]`);
  if (!li) return;
  li.scrollIntoView({ block: 'center', behavior: 'smooth' });
  li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash');
  li.querySelector('.check').focus({ preventScroll: true });
  previewItem(li, false);
}

let previewing = null;
function previewItem(li, revealPanel = true) {
  const { cid, iid } = li.dataset;
  const it = byId.get(cid).items.find((x) => x.id === iid);
  const ctl = previewCtl.get(cid);
  if (!ctl) { openPreviewDialog(cid, iid); return; }
  if (previewing !== li) {
    app.querySelectorAll('.item.previewing').forEach((x) => { x.classList.remove('previewing'); x.querySelector('.pv-link')?.setAttribute('aria-pressed', 'false'); });
    li.classList.add('previewing'); li.querySelector('.pv-link')?.setAttribute('aria-pressed', 'true');
    previewing = li;
    ctl.highlight(iid, it.title);
  }
  // On narrow layouts the panel sits above the list; bring it into view on explicit requests.
  if (revealPanel && matchMedia('(max-width: 1099px)').matches) app.querySelector('.cl-preview')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

let dialogCtl = null;
function openPreviewDialog(cid, iid) {
  const c = byId.get(cid);
  const dlg = document.getElementById('preview-dialog');
  dlg.querySelector('h2').textContent = `${c.title} — live preview`;
  dlg.querySelector('.pd-controls').innerHTML = `${deviceChips(c, 'dialog')}<button class="chip" data-action="pv-theme" data-scope="dialog" aria-pressed="${appTheme() === 'dark'}">🌙 Dark</button><button class="chip" data-action="pv-xray" data-scope="dialog" aria-pressed="false">Show all checks</button>`;
  const host = dlg.querySelector('.pd-host');
  dlg.querySelector('.pd-items').innerHTML = c.items.map((it, i) => `<button class="pd-item" data-iid="${it.id}" aria-pressed="${it.id === iid}"><span>${i + 1}</span>${esc(it.title)}<span class="badge ${it.priority}">${PRIORITY_LABEL[it.priority]}</span></button>`).join('');
  dlg.showModal();
  dialogCtl?.destroy();
  dialogCtl = mountPreview(host, c, { theme: appTheme(), onBadge: (id) => selectDialogItem(id) });
  dialogCtl.checklist = c;
  if (iid) requestAnimationFrame(() => selectDialogItem(iid));
}
function selectDialogItem(iid) {
  const dlg = document.getElementById('preview-dialog');
  dlg.querySelectorAll('.pd-item').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.iid === iid)));
  dlg.querySelector(`.pd-item[data-iid="${CSS.escape(iid)}"]`)?.scrollIntoView({ block: 'nearest' });
  dialogCtl.highlight(iid, dialogCtl.checklist.items.find((x) => x.id === iid).title);
}
function controllersFor(scope) { return scope === 'dialog' ? [dialogCtl].filter(Boolean) : [previewCtl.get(scope)].filter(Boolean); }
function handlePreviewControl(btn) {
  const { action, scope } = btn.dataset;
  if (action === 'pv-open') { openPreviewDialog(btn.dataset.cid, previewCtl.get(btn.dataset.cid)?.current); return true; }
  if (action === 'pv-device') {
    btn.parentElement.querySelectorAll('[data-action=pv-device]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    controllersFor(scope).forEach((c) => c.setDevice(btn.dataset.device)); return true;
  }
  if (action === 'pv-theme') {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    controllersFor(scope).forEach((c) => c.setTheme(on ? 'dark' : 'light')); return true;
  }
  if (action === 'pv-xray') {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    controllersFor(scope).forEach((c) => c.xray(on)); return true;
  }
  return false;
}

function viewPreviews(category) {
  const lists = DATA.checklists.filter((c) => !category || c.category === category);
  return `<div class="wrap wide">
    <div class="page-head"><h1 style="font-size:clamp(34px,5vw,52px)">Live previews</h1>
      <p class="lead">Every checklist ships with a working example UI — ${DATA.checklists.reduce((a, c) => a + c.items.length, 0)} checks, each pinned to the element that satisfies it. Open one to explore it at desktop, tablet or phone size, in light or dark.</p>
      <nav class="chips" aria-label="Categories"><a class="chip" href="#/previews" ${!category ? 'aria-current="page"' : ''}>All</a>${DATA.categories.map((c) => `<a class="chip" href="#/previews/${c.id}" ${category === c.id ? 'aria-current="page"' : ''}>${esc(c.name)}</a>`).join('')}</nav></div>
    <div class="thumb-grid">${lists.map((c) => `<a class="card thumb-card" href="#/c/${c.id}">
      <div class="thumb" data-preview-thumb="${c.id}" aria-hidden="true"></div>
      <div class="card-top"><h3><span aria-hidden="true">${c.icon}</span> ${esc(c.title)}</h3><span class="tag">${esc(catName(c.category))}</span></div>
      <p>${c.items.length} checks previewed</p></a>`).join('')}</div></div>`;
}

function viewMCP() {
  const tools = [
    ['list_checklists', 'List checklists, optionally by category.'],
    ['search_checklists', 'Full-text search across checklists and items.'],
    ['get_checklist', 'Fetch one checklist as JSON or Markdown, filtered by priority.'],
    ['list_kits', 'List starter kits (landing page, SaaS, mobile MVP…).'],
    ['build_project_checklist', 'Turn a plain-English brief into a merged project checklist.'],
    ['review_design', 'Get a structured review rubric for a screen against chosen checklists.'],
    ['generate_design_brief', 'Produce acceptance criteria to build a page, app, component or flow.'],
  ];
  const desktop = `{
  "mcpServers": {
    "openchecklist": {
      "command": "node",
      "args": ["/absolute/path/to/openchecklist/mcp/index.js"]
    }
  }
}`;
  return `<div class="wrap">
    <div class="page-head"><h1 style="font-size:clamp(34px,5vw,52px)">MCP server</h1>
      <p class="lead">Give any AI assistant the same design standards your team uses. The server runs locally over stdio, reads the same <code>checklists.json</code> as this site, and needs no API keys.</p></div>
    <div class="split">
      <div class="prose">
        <h2>1 · Install</h2>
        <pre class="code"><button class="copy" data-action="copy-code">Copy</button>git clone &lt;your-fork-url&gt; openchecklist
cd openchecklist/mcp && npm install</pre>
        <h2>2 · Claude Code</h2>
        <pre class="code"><button class="copy" data-action="copy-code">Copy</button>claude mcp add openchecklist -- node /absolute/path/to/openchecklist/mcp/index.js</pre>
        <h2>3 · Claude Desktop, Cursor, Windsurf, VS Code</h2>
        <p>Add this to the client's MCP config (<code>claude_desktop_config.json</code>, <code>.cursor/mcp.json</code>, etc.):</p>
        <pre class="code"><button class="copy" data-action="copy-code">Copy</button>${esc(desktop)}</pre>
      </div>
      <div class="prose">
        <h2>Tools</h2>
        <div class="tools">${tools.map(([n, d]) => `<div class="card"><code>${n}</code><p>${d}</p></div>`).join('')}</div>
        <h2>Also exposed</h2>
        <ul><li><b>Resources</b> — every checklist at <code>checklist://{category}/{slug}</code></li>
          <li><b>Prompts</b> — <code>design-review</code> and <code>build-with-checklist</code></li></ul>
        <h2>Try asking</h2>
        <ul><li>“Build me a SaaS settings page and check it against OpenChecklist.”</li>
          <li>“Review this screenshot of our checkout with the must-have checks.”</li>
          <li>“Which accessibility checks apply to a modal?”</li></ul>
      </div>
    </div></div>`;
}
function viewNotFound() {
  return `<div class="wrap"><div class="empty" style="margin-top:48px"><span style="font-size:40px" aria-hidden="true">🧭</span><h1>Page not found</h1><p class="muted">That checklist or page doesn't exist.</p><div class="hero-cta" style="margin:0"><a class="btn primary" href="#/">Home</a><button class="btn" data-action="palette">Search</button></div></div></div>`;
}

// ---------- router ----------
let current = null;
let pendingImport = null;
function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  current = null;
  let html; let title = 'OpenChecklist — design checklists for people and AI';
  const [head, ...rest] = parts;
  if (!head) html = viewHome();
  else if (head === 'browse') html = viewBrowse(rest[0]);
  else if (head === 'c') { html = viewChecklist(`${rest[0]}/${rest[1]}`, rest[2]); const c = byId.get(`${rest[0]}/${rest[1]}`); if (c) title = `${c.title} ${catName(c.category)} checklist — OpenChecklist`; }
  else if (head === 'kits') html = viewKits();
  else if (head === 'kit') html = viewKit(rest[0]);
  else if (head === 'projects') html = viewProjects();
  else if (head === 'p') html = viewProject(rest[0]);
  else if (head === 'import') html = viewImport(rest.join('/'));
  else if (head === 'mcp') html = viewMCP();
  else if (head === 'previews') html = viewPreviews(rest[0]);
  else html = viewNotFound();
  document.title = title;
  app.innerHTML = html;
  document.querySelectorAll('.nav a, .mobile-nav a').forEach((a) => {
    const target = a.getAttribute('href').replace(/^#\/?/, '');
    const on = target ? head === target || (target === 'projects' && head === 'p') || (target === 'kits' && head === 'kit') : !head;
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  refreshProgress();
  previewing = null;
  mountPagePreviews();
  if (current?.focusItem) {
    const el = app.querySelector(`.item[data-iid="${CSS.escape(current.focusItem)}"]`);
    if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); el.querySelector('.check').focus({ preventScroll: true }); requestAnimationFrame(() => previewItem(el, false)); }
  } else window.scrollTo(0, 0);
}

function refreshProgress() {
  if (!current) return;
  const { ctx, lists } = current;
  const s = stats(ctx, lists);
  const ringSlot = app.querySelector('[data-ring-slot]');
  if (ringSlot) {
    const existing = ringSlot.querySelector('.ring');
    if (existing) updateRing(existing, s.pct); else ringSlot.innerHTML = ring(s.pct, 'total', true);
  }
  const count = app.querySelector('[data-count-slot]');
  if (count) count.innerHTML = `${s.done} of ${s.applicable}<small>${s.na ? `${s.na} not applicable · ` : ''}${s.mustOpen ? `${s.mustOpen} must-have${s.mustOpen === 1 ? '' : 's'} open` : 'All must-haves done ✓'}</small>`;
  for (const c of lists) {
    const el = app.querySelector(`.project-section .ring[data-ring="${CSS.escape(c.id)}"]`);
    if (el) updateRing(el, stats(ctx, [c]).pct);
  }
  return s;
}

// ---------- interactions ----------
function setItem(li, value) {
  const { ctx } = current;
  const before = stats(ctx, current.lists).pct;
  setItemState(ctx, li.dataset.cid, li.dataset.iid, value);
  li.dataset.state = value;
  li.querySelector('.check').setAttribute('aria-checked', value === 'done' ? 'true' : value === 'na' ? 'mixed' : 'false');
  li.querySelector('[data-action="na"]').setAttribute('aria-pressed', String(value === 'na'));
  const s = refreshProgress();
  if (before < 1 && s.pct === 1 && s.applicable > 0) { confetti(app.querySelector('[data-ring-slot]') || li); toast('Everything checked — ship it! 🎉'); }
}

function exportCurrent(kind) {
  if (!current) return;
  const { title, ctx, lists } = current;
  const base = slugify(title);
  if (kind === 'md') download(`${base}.md`, toMarkdown(title, ctx, lists), 'text/markdown');
  if (kind === 'csv') download(`${base}.csv`, toCSV(ctx, lists), 'text/csv');
  if (kind === 'json') download(`${base}.json`, toJSON(title, ctx, lists), 'application/json');
}

function openProjectDialog(kitId) {
  const dlg = document.getElementById('project-dialog');
  const form = document.getElementById('project-form');
  const kitSel = form.elements.kit;
  kitSel.innerHTML = `<option value="">— None, I'll pick —</option>${DATA.kits.map((k) => `<option value="${k.id}">${esc(k.title)}</option>`).join('')}`;
  document.getElementById('pick-list').innerHTML = DATA.categories.map((cat) => `<h4>${esc(cat.name)}</h4>${DATA.checklists.filter((c) => c.category === cat.id).map((c) => `<label><input type="checkbox" name="cl" value="${c.id}" />${c.icon} ${esc(c.title)}</label>`).join('')}`).join('');
  const applyKit = () => {
    const k = DATA.kits.find((x) => x.id === kitSel.value);
    form.querySelectorAll('input[name=cl]').forEach((cb) => { cb.checked = !!k && k.checklists.includes(cb.value); });
    if (k && !form.elements.name.value) form.elements.name.value = k.title;
  };
  kitSel.onchange = applyKit;
  form.reset();
  kitSel.value = kitId || '';
  applyKit();
  dlg.showModal();
  dlg.onclose = () => {
    if (dlg.returnValue !== 'create') return;
    const ids = [...form.querySelectorAll('input[name=cl]:checked')].map((x) => x.value);
    if (!ids.length) { toast('Pick at least one checklist'); return; }
    const pid = uid();
    state.projects[pid] = { name: form.elements.name.value.trim() || 'Untitled project', checklists: ids, progress: {}, notes: {}, created: Date.now() };
    save();
    location.hash = `#/p/${pid}`;
  };
}

app.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const a = btn.dataset.action;
  const li = btn.closest('.item');
  if (a === 'toggle') setItem(li, li.dataset.state === 'done' ? 'todo' : 'done');
  else if (a === 'na') setItem(li, li.dataset.state === 'na' ? 'todo' : 'na');
  else if (a === 'note') { const ta = li.querySelector('.note'); ta.hidden = !ta.hidden; btn.setAttribute('aria-expanded', String(!ta.hidden)); if (!ta.hidden) ta.focus(); }
  else if (a === 'link') { copy(`${location.origin}${location.pathname}#/c/${li.dataset.cid}/${li.dataset.iid}`, 'Link to item copied'); }
  else if (a === 'filter') {
    btn.parentElement.querySelectorAll('[data-action=filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    app.querySelectorAll('.items').forEach((l) => { l.dataset.filter = btn.dataset.filter; });
  } else if (a === 'hide-done') {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    app.querySelectorAll('.items').forEach((l) => { l.dataset.hideDone = String(on); });
  } else if (a === 'export-md') exportCurrent('md');
  else if (a === 'export-csv') exportCurrent('csv');
  else if (a === 'export-json') exportCurrent('json');
  else if (a === 'ai-prompt') copy(toAIPrompt(current.title, current.lists), 'AI review prompt copied — paste it with your screenshot');
  else if (a === 'share') copy(shareLink(current.title, current.lists, current.ctx), 'Share link copied');
  else if (a === 'reset') {
    if (!confirm('Reset progress and notes for this view?')) return;
    for (const c of current.lists) { delete current.ctx.progress[c.id]; for (const k of Object.keys(current.ctx.notes)) if (k.startsWith(`${c.id}::`)) delete current.ctx.notes[k]; }
    save(); route();
  } else if (a === 'new-project') openProjectDialog(btn.dataset.kit);
  else if (a === 'delete-project') {
    if (!confirm(`Delete “${state.projects[current.pid].name}”? This can't be undone.`)) return;
    delete state.projects[current.pid]; save(); location.hash = '#/projects';
  } else if (a === 'confirm-import' && pendingImport) {
    const pid = uid();
    state.projects[pid] = { name: pendingImport.name || 'Imported project', checklists: pendingImport.checklists.filter((x) => byId.has(x)), progress: pendingImport.progress || {}, notes: pendingImport.notes || {}, created: Date.now() };
    save(); pendingImport = null; location.hash = `#/p/${pid}`;
  } else if (a === 'copy-code') copy(btn.parentElement.textContent.replace(/^Copy/, '').trim());
  else if (a === 'palette') openPalette();
  else if (a === 'preview') previewItem(li);
  else handlePreviewControl(btn);
});
// Hovering or focusing an item previews it (pointer devices only, so touch scrolling doesn't jump the panel).
app.addEventListener('pointerover', (e) => {
  if (e.pointerType !== 'mouse') return;
  const li = e.target.closest('.item');
  if (li && previewCtl.has(li.dataset.cid)) previewItem(li, false);
});
app.addEventListener('focusin', (e) => {
  const li = e.target.closest('.item');
  if (li && previewCtl.has(li.dataset.cid)) previewItem(li, false);
});
const previewDialog = document.getElementById('preview-dialog');
previewDialog.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (e.target === previewDialog || btn?.dataset.action === 'pd-close') { previewDialog.close(); return; }
  if (btn?.classList.contains('pd-item')) selectDialogItem(btn.dataset.iid);
  else if (btn?.dataset.action) handlePreviewControl(btn);
});
previewDialog.addEventListener('close', () => { dialogCtl?.destroy(); dialogCtl = null; });
document.querySelector('.topbar').addEventListener('click', (e) => {
  const a = e.target.closest('[data-action]')?.dataset.action;
  if (a === 'palette') openPalette();
  if (a === 'theme') {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    state.theme = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = state.theme; save();
  }
});
app.addEventListener('input', (e) => {
  const ta = e.target.closest('.note');
  if (!ta || !current) return;
  const v = ta.value;
  if (v.trim()) current.ctx.notes[ta.dataset.note] = v; else delete current.ctx.notes[ta.dataset.note];
  clearTimeout(ta._t); ta._t = setTimeout(save, 300);
});

// ---------- command palette ----------
const palette = document.getElementById('palette');
const pq = document.getElementById('palette-q');
const pres = document.getElementById('palette-results');
let index = [];
let sel = 0;
function buildIndex() {
  index = [
    ...DATA.checklists.map((c) => ({ kind: 'Checklist', icon: c.icon, title: c.title, sub: catName(c.category), href: `#/c/${c.id}`, text: `${c.title} ${c.description} ${catName(c.category)}`.toLowerCase() })),
    ...DATA.kits.map((k) => ({ kind: 'Kit', icon: k.icon, title: k.title, sub: k.description, href: `#/kit/${k.id}`, text: `${k.title} ${k.description} kit`.toLowerCase() })),
    ...DATA.checklists.flatMap((c) => c.items.map((it) => ({ kind: 'Item', icon: '·', title: it.title, sub: `${c.title} · ${catName(c.category)}`, href: `#/c/${c.id}/${it.id}`, text: `${it.title} ${it.description} ${(it.tags || []).join(' ')} ${it.wcag ? `wcag ${it.wcag}` : ''}`.toLowerCase() }))),
  ];
}
function searchIndex(q) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return index.filter((r) => r.kind !== 'Item').slice(0, 12);
  return index
    .map((r) => ({ r, score: terms.every((t) => r.text.includes(t)) ? terms.reduce((a, t) => a + (r.title.toLowerCase().includes(t) ? 3 : 1), 0) + (r.kind === 'Checklist' ? 2 : r.kind === 'Kit' ? 1 : 0) : 0 }))
    .filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 30).map((x) => x.r);
}
function renderPalette() {
  const results = searchIndex(pq.value);
  sel = Math.min(sel, Math.max(results.length - 1, 0));
  pres.innerHTML = results.length ? results.map((r, i) => `<li role="option" aria-selected="${i === sel}"><a href="${r.href}"><span aria-hidden="true">${r.icon}</span><span><span class="r-title">${esc(r.title)}</span><br><span class="r-sub">${esc(r.sub)}</span></span><span class="r-kind">${r.kind}</span></a></li>`).join('')
    : `<li style="padding:16px;color:var(--text-muted)">No matches. Try “modal”, “wcag 2.5.8” or “pricing”.</li>`;
}
function openPalette() { pq.value = ''; sel = 0; renderPalette(); palette.showModal(); pq.focus(); }
pq.addEventListener('input', () => { sel = 0; renderPalette(); });
pq.addEventListener('keydown', (e) => {
  const n = pres.querySelectorAll('[role=option]').length;
  if (e.key === 'ArrowDown') { sel = (sel + 1) % n; renderPalette(); e.preventDefault(); }
  if (e.key === 'ArrowUp') { sel = (sel - 1 + n) % n; renderPalette(); e.preventDefault(); }
  if (e.key === 'Enter') { const a = pres.querySelector('[aria-selected=true] a'); if (a) { location.hash = a.getAttribute('href'); palette.close(); } }
});
pres.addEventListener('click', (e) => { if (e.target.closest('a')) palette.close(); });
palette.addEventListener('click', (e) => { if (e.target === palette) palette.close(); });

document.addEventListener('keydown', (e) => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); return; }
  if (typing || palette.open || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === '/') { e.preventDefault(); openPalette(); return; }
  const items = [...app.querySelectorAll('.item')].filter((x) => x.offsetParent);
  if (!items.length) return;
  const cur = document.activeElement?.closest('.item');
  let i = items.indexOf(cur);
  if (e.key === 'j' || e.key === 'k') {
    i = e.key === 'j' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0);
    items[i].querySelector('.check').focus(); items[i].scrollIntoView({ block: 'nearest' });
  } else if (cur && e.key === 'x') setItem(cur, cur.dataset.state === 'done' ? 'todo' : 'done');
  else if (cur && e.key === 'n') setItem(cur, cur.dataset.state === 'na' ? 'todo' : 'na');
  else if (cur && e.key === 'p') previewItem(cur);
});

// ---------- boot ----------
(async () => {
  try {
    DATA = await (await fetch('checklists.json')).json();
  } catch {
    app.innerHTML = `<div class="wrap"><div class="empty" style="margin-top:48px"><h1>Couldn't load checklists</h1><p class="muted">Serve this folder over HTTP (e.g. <code>npm start</code>) — browsers block fetch() from file://.</p></div></div>`;
    return;
  }
  DATA.checklists.forEach((c) => byId.set(c.id, c));
  buildIndex();
  window.addEventListener('hashchange', route);
  route();
})();
