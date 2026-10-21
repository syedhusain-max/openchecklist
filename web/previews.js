// Live previews, one per checklist. Every item id must appear in a data-check attribute
// (space-separated for several) — `npm run validate` enforces full coverage.
const phone = (body, after = '') => `<div class="status"><span>9:41</span><span class="island"></span><span>􀙇 100%</span></div>
  <div class="screen-body">${body}</div>${after}<div class="home-ind"></div>`;
const ICON = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 1112 0v5l2 2H4z"/><path d="M10 21h4"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
};

export const PREVIEWS = {
  /* ---------------- WEBSITE ---------------- */
  'website/landing-page': `
  <nav class="pv-nav"><span class="logo">◆ Flowly</span><span class="links"><span>Product</span><span>Pricing</span><span>Customers</span></span><span class="grow"></span><a class="pv-btn sm primary" href="#" data-check="mobile-cta">Start free</a></nav>
  <section class="pad stack-lg" style="padding-top:56px">
    <div class="stack" data-check="value-prop" style="max-width:640px"><span class="pv-badge info">For freelancers & small studios</span><h1>Invoices that chase themselves.</h1><p class="muted" style="font-size:18px">Flowly sends polite reminders, takes card payments and reconciles your books — so you get paid 2× faster.</p></div>
    <div class="row"><a class="pv-btn primary lg" href="#" data-check="primary-cta">Start free trial</a><a class="pv-btn ghost lg" href="#">▶ Watch 2-min demo</a></div>
    <p class="fine" data-check="objections">✓ No card required &nbsp; ✓ Set up in 5 minutes &nbsp; ✓ Cancel anytime &nbsp; ✓ SOC 2 Type II</p>
    <div class="row muted small" data-check="social-proof"><b style="color:var(--text)">★★★★★ 4.9</b> from 1,200 reviews · Trusted by 4,200 studios — <b>NORTH</b> · <b>Kiln</b> · <b>orbit</b> · <b>Mesa</b></div>
    <div class="pv-card raised" data-check="product-visual" style="padding:12px"><div class="row" style="gap:6px;margin-bottom:10px"><span class="dot" style="background:#ff5f57"></span><span class="dot" style="background:#febc2e"></span><span class="dot" style="background:#28c840"></span></div>
      <div class="grid3"><div class="stack"><div class="line" style="width:60%"></div><div class="kpi"><div class="v">$48,210</div><span class="delta-up">▲ 18% paid this month</span></div></div><div class="bars" style="grid-column:span 2"><i style="height:30%"></i><i style="height:45%"></i><i style="height:38%"></i><i style="height:60%"></i><i style="height:72%"></i><i style="height:66%"></i><i style="height:90%"></i></div></div></div>
    <div class="grid2"><div class="spec" data-check="lcp"><b>Performance</b> · Hero screenshot is AVIF 1600×900 with <code>fetchpriority="high"</code> and explicit width/height. LCP 1.8s on Moto G4 / 4G.</div>
      <div class="spec" data-check="meta"><b>Share card</b><div class="row" style="margin-top:8px;align-items:stretch"><div class="img" style="width:120px;height:63px"></div><div><code>og:title</code> Flowly — invoices that chase themselves<br><code>og:image</code> 1200×630 · flowly.app</div></div></div></div>
  </section>`,

  'website/pricing': `
  <section class="pad stack-lg" data-period="monthly">
    <div class="stack center"><h2>Simple pricing that grows with you</h2>
      <div class="row" data-check="billing-toggle"><span class="small">Monthly</span><button class="pv-switch" role="switch" aria-checked="false" data-demo="period" aria-label="Annual billing"></button><span class="small">Annual <span class="pv-badge ok">Save 20%</span></span></div>
      <p class="fine" data-check="currency-tax">Prices in USD, excluding VAT/sales tax. Local currency shown at checkout.</p></div>
    <style>[data-period="monthly"] .a, [data-period="annual"] .m { display: none; }</style>
    <div class="grid3" style="align-items:stretch">
      <div class="pv-card stack" data-check="plan-names"><h3>Solo</h3><p class="fine">For freelancers sending a few invoices a month.</p><div><span class="kpi"><span class="v m">$12</span><span class="v a">$9.60</span></span> <span class="muted">/ month</span></div><p class="fine a">$115 billed yearly</p><a class="pv-btn block" href="#">Start Solo</a></div>
      <div class="pv-card accent stack" data-check="recommended"><div class="row between"><h3>Studio</h3><span class="pv-badge accent">Most popular</span></div><p class="fine">For small teams with shared clients.</p><div><span class="kpi"><span class="v m">$29</span><span class="v a">$23.20</span></span> <span class="muted">/ month</span></div><p class="fine a">$278 billed yearly</p><a class="pv-btn primary block" href="#">Start Studio</a></div>
      <div class="pv-card stack" data-check="enterprise"><h3>Agency</h3><p class="fine">50+ seats, SSO, custom contracts and invoicing.</p><div><span class="kpi"><span class="v" style="font-size:22px">Custom</span></span></div><a class="pv-btn block" href="#">Talk to sales</a></div>
    </div>
    <table class="pv-table" data-check="comparison"><thead><tr><th>Compare plans</th><th>Solo</th><th>Studio</th><th>Agency</th></tr></thead><tbody><tr><td>Clients</td><td>10</td><td>Unlimited</td><td>Unlimited</td></tr><tr><td>Automatic reminders</td><td>✓</td><td>✓</td><td>✓</td></tr><tr><td>Team seats</td><td>1</td><td>5</td><td>50+</td></tr><tr><td>SSO / SAML</td><td>—</td><td>—</td><td>✓</td></tr></tbody></table>
    <div data-check="faq"><details class="acc" open><summary>Can I change plans later?</summary><p>Yes — upgrades apply immediately and are prorated; downgrades apply at renewal.</p></details><details class="acc"><summary>Do you offer refunds?</summary><p>Full refund within 14 days, no questions asked.</p></details></div>
  </section>`,

  'website/blog-post': `
  <article class="pad" style="max-width:760px;margin:0 auto">
    <div class="stack"><span class="kicker">Guides</span><h1 data-check="headings" style="font-size:38px">How to get paid on time, every time</h1>
      <div class="row small muted" data-check="meta-info"><span class="pv-avatar">MJ</span><span><b style="color:var(--text)">Maya Jensen</b> · Updated 12 Oct 2026 · 7 min read</span></div></div>
    <div class="spec" data-check="toc" style="margin:20px 0"><b>On this page</b> — 1. Set terms upfront · 2. Automate reminders · 3. Make paying easy</div>
    <div class="stack" data-check="measure" style="max-width:66ch"><h2 style="font-size:22px">1. Set terms upfront</h2><p class="muted" style="font-size:17px;line-height:1.7">Late payments usually start before the invoice is sent. Agree on terms, deposit and late fees in the proposal so the invoice holds no surprises for your client.</p></div>
    <figure style="margin:20px 0" data-check="alt"><div class="img" style="height:170px"></div><figcaption class="fine" style="margin-top:6px"><code>alt="Invoice settings showing 14-day terms and a 2% late fee"</code></figcaption></figure>
    <div class="code-block" data-check="code"><button class="pv-btn sm" style="position:absolute;right:8px;top:8px">Copy</button><span class="c">// Send a reminder 3 days before due</span>
<span class="k">await</span> flowly.reminders.<span class="k">create</span>({ invoice, daysBefore: <span class="s">3</span> });</div>
    <div class="pv-card row between" data-check="next" style="margin-top:24px"><div><h3>Keep reading</h3><p class="fine">Writing payment terms clients actually read →</p></div><a class="pv-btn primary" href="#">Get the newsletter</a></div>
  </article>`,

  'website/contact': `
  <section class="pad grid2" style="gap:32px">
    <div class="stack"><h2>Talk to us</h2>
      <div class="stack" data-check="routes"><div class="pv-card row between"><div><h4>Sales</h4><p class="fine">Pricing, demos, procurement</p></div><span class="pv-btn sm">Book a call</span></div><div class="pv-card row between"><div><h4>Support</h4><p class="fine">Help with your account</p></div><span class="pv-btn sm">Open ticket</span></div><div class="pv-card row between"><div><h4>Press</h4><p class="fine">press@flowly.app</p></div></div></div>
      <div class="pv-banner info" data-check="self-serve">Looking for a quick answer? <a href="#"><b>Search the help center</b></a> or check <a href="#"><b>system status</b></a>.</div>
      <p class="small muted" data-check="alt-channels">Prefer email or phone? hello@flowly.app · +1 (415) 555-0144 · Live chat 9–6 CET</p></div>
    <form class="pv-card stack" data-check="short-form"><div class="field"><label>Name</label><input class="pv-input" value="Sam Rivera"></div><div class="field"><label>Work email</label><input class="pv-input" type="email" value="sam@studio.co"></div><div class="field"><label>How can we help?</label><textarea class="pv-input">We'd like a demo for a 12-person team.</textarea></div>
      <div class="spec" data-check="spam">Hidden honeypot field + rate limit — no CAPTCHA shown.</div>
      <button class="pv-btn primary" type="submit">Send message</button><p class="fine" data-check="response-time">⏱ We reply within 1 business day.</p></form>
  </section>`,

  'website/404': `
  <nav class="pv-nav" data-check="on-brand"><span class="logo">◆ Flowly</span><span class="links"><span>Product</span><span>Pricing</span><span>Blog</span></span></nav>
  <section class="pad stack center" style="padding:64px 28px">
    <span class="kicker">Error 404</span><h1 data-check="plain" style="font-size:40px">We can't find that page</h1><p class="muted">It may have moved, or the link might be mistyped.</p>
    <div class="row" data-check="search" style="width:420px;max-width:100%"><input class="pv-input grow" placeholder="Search Flowly…"><button class="pv-btn primary">Search</button></div>
    <div class="row" data-check="links"><a class="pv-btn" href="#">Home</a><a class="pv-btn" href="#">Pricing</a><a class="pv-btn" href="#">Help center</a><a class="pv-btn" href="#">Blog</a></div>
    <a class="small" href="#" data-check="report">Report a broken link</a>
    <div class="spec" data-check="status"><code>HTTP/2 404</code> · <code>&lt;meta name="robots" content="noindex"&gt;</code></div>
  </section>`,

  'website/faq': `
  <section class="pad stack-lg" style="max-width:820px;margin:0 auto">
    <div class="stack center"><h2>Frequently asked questions</h2><input class="pv-input" placeholder="Search questions…" data-check="search" style="max-width:420px"></div>
    <div class="pv-tabs" data-check="grouped"><button aria-selected="true" data-demo="tab">Billing</button><button data-demo="tab">Account</button><button data-demo="tab">Security</button></div>
    <div data-check="real-questions">
      <details class="acc" open id="refund"><summary data-check="accordion-a11y">Can I get a refund if I forget to cancel?</summary><p>Yes. Email us within 14 days of a renewal and we'll refund it in full. <a href="#refund" data-check="deep-links">🔗 Link to this answer</a></p></details>
      <details class="acc"><summary>Why was my card charged twice?</summary><p>Usually a pending authorization that drops off within 3 days.</p></details>
      <details class="acc"><summary>Can clients pay without an account?</summary><p>Yes, every invoice has a hosted payment page.</p></details></div>
    <div class="pv-card row between" data-check="escape"><span>Still stuck?</span><a class="pv-btn primary" href="#">Contact support</a></div>
  </section>`,

  'website/footer': `
  <div class="pad sunken" style="height:120px"><p class="muted center">…page content…</p></div>
  <footer class="pad stack-lg" style="border-top:1px solid var(--border)">
    <div class="grid4"><div class="stack" data-check="groups"><h4>Product</h4><span class="small muted">Features</span><span class="small muted">Pricing</span><span class="small muted">Integrations</span></div>
      <div class="stack"><h4>Company</h4><span class="small muted">About</span><span class="small muted">Careers</span><span class="small muted">Press</span></div>
      <div class="stack"><h4>Resources</h4><span class="small muted">Blog</span><span class="small muted">Help center</span><span class="small muted">Status</span></div>
      <div class="stack" data-check="newsletter"><h4>Get product updates</h4><div class="row"><input class="pv-input grow" placeholder="you@company.com"><button class="pv-btn primary">Subscribe</button></div></div></div>
    <div class="divider"></div>
    <div class="row between"><span class="small muted" data-check="contrast">© 2026 Flowly Inc. <span class="pv-badge">#5d5d6c on #fff · 6.4:1</span></span>
      <span class="row small" data-check="legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookie settings</a><a href="#">Imprint</a></span>
      <select class="pv-input select" style="width:150px" data-check="locale"><option>🌐 English (US)</option></select></div>
  </footer>`,

  /* ---------------- WEB APP ---------------- */
  'web-app/dashboard': `
  <div class="app-shell" style="--side:200px;min-height:640px">
    <aside class="pad-sm sunken stack" style="align-content:start"><b>◆ Flowly</b><span class="pv-badge accent" style="justify-self:start">Home</span><span class="small muted">Invoices</span><span class="small muted">Clients</span><span class="small muted">Reports</span></aside>
    <main class="pad stack-lg">
      <div data-check="orient"><h2>Good morning, Sam</h2><p class="muted">Since Friday: 4 invoices paid ($6,420) and 2 became overdue.</p></div>
      <div class="grid4" data-check="kpis">
        <div class="pv-card kpi"><span class="fine">Paid · last 30 days</span><div class="v">$48.2k</div><span class="delta-up">▲ 18% vs prev. 30d</span></div>
        <div class="pv-card kpi"><span class="fine">Outstanding</span><div class="v">$12.9k</div><span class="delta-down">▲ 6% vs prev. 30d</span></div>
        <div class="pv-card kpi"><span class="fine">Avg. days to pay</span><div class="v">9.4</div><span class="delta-up">▼ 2.1 days</span></div>
        <div class="pv-card kpi" data-check="loading"><span class="fine">Forecast</span><div class="skel" style="height:30px;margin:6px 0"></div><div class="skel" style="height:10px;width:60%"></div></div></div>
      <div class="grid2">
        <div class="pv-card stack" data-check="next-action"><div class="row between"><h3>Needs attention</h3><span class="pv-badge bad">2 overdue</span></div><div class="row between small"><span>INV-1042 · Kiln Studio · 12 days late</span><a class="pv-btn sm primary" href="#">Send reminder</a></div><div class="row between small"><span>INV-1039 · Mesa · 4 days late</span><a class="pv-btn sm" href="#">Send reminder</a></div></div>
        <div class="pv-card stack" data-check="charts-a11y"><div class="row between"><h3>Revenue</h3><a class="small" href="#">View as table</a></div><div class="bars" role="img" aria-label="Revenue rose from $31k in May to $48k in October"><i style="height:40%"></i><i style="height:52%"></i><i style="height:48%"></i><i style="height:63%"></i><i style="height:70%"></i><i style="height:88%"></i></div><p class="fine">Patterned bars = projected. Summary: up 55% since May.</p></div></div>
      <div class="grid2"><div class="pv-card stack" data-check="resume"><h3>Jump back in</h3><span class="small">📄 Draft — INV-1047 for orbit · edited 2h ago</span><span class="small">👤 Client — North Agency · viewed yesterday</span></div>
        <div class="pv-card stack sunken" data-check="empty"><span class="kicker">New account view</span><h4>Send your first invoice</h4><div class="progress"><i style="width:33%"></i></div><p class="fine">1 of 3 setup steps done · or explore with sample data</p></div></div>
    </main></div>`,

  'web-app/settings': `
  <div class="app-shell" style="--side:240px;min-height:620px">
    <aside class="pad-sm sunken stack" style="align-content:start" data-check="grouping"><input class="pv-input" placeholder="Search settings…" data-check="search"><span class="kicker">Personal</span><span class="small">Profile</span><span class="small">Notifications</span><span class="kicker">Workspace · affects 8 people</span><span class="pv-badge accent" style="justify-self:start">General</span><span class="small">Members</span><span class="small">Billing</span></aside>
    <main class="pad stack-lg" style="max-width:720px">
      <div class="pv-banner warn" data-check="unsaved"><b>You have unsaved changes.</b> <span class="grow"></span><span class="pv-btn sm">Discard</span></div>
      <div class="stack"><h2>Workspace</h2>
        <div class="field"><label>Workspace name</label><input class="pv-input" value="Rivera Studio"></div>
        <div class="row between pv-card" data-check="defaults"><div><h4>Late fees</h4><p class="fine">Adds 2% to invoices 7+ days overdue. Applies to all new invoices for every member.</p></div><button class="pv-switch" role="switch" aria-checked="true" data-demo="toggle" aria-label="Late fees"></button></div>
        <div class="row" data-check="save-model"><button class="pv-btn primary" data-demo="loading">Save changes</button><span class="fine">Changes apply after you save.</span></div></div>
      <div class="pv-card stack" data-check="danger" style="border-color:var(--bad)"><h3 style="color:var(--bad)">Danger zone</h3><div class="row between"><div><h4>Delete workspace</h4><p class="fine">Permanently removes all invoices and clients. Requires owner password.</p></div><button class="pv-btn danger-outline">Delete workspace…</button></div></div>
    </main></div>`,

  'web-app/data-table': `
  <section class="pad stack">
    <div class="row between"><div class="row" data-check="sort-filter"><span class="pv-badge info">Status: Overdue ✕</span><span class="pv-badge info">Client: Kiln ✕</span><span class="pv-btn sm">+ Filter</span><code class="fine">?status=overdue&client=kiln</code></div><span class="pv-btn sm">Export</span></div>
    <div class="pv-banner info" data-check="bulk"><b>2 selected</b><span class="grow"></span><span class="pv-btn sm">Send reminders</span><span class="pv-btn sm">Mark paid</span></div>
    <div style="max-height:250px;overflow:auto;border:1px solid var(--border);border-radius:12px" data-check="sticky">
    <table class="pv-table" data-check="semantics alignment"><caption class="pad-sm" style="padding-bottom:0">Invoices (48)</caption>
      <thead><tr><th scope="col">☐</th><th scope="col">Invoice</th><th scope="col">Client</th><th scope="col">Due ▾</th><th scope="col" class="num">Amount (USD)</th><th scope="col">Status</th></tr></thead>
      <tbody><tr class="sel"><td>☑</td><td>INV-1042</td><td>Kiln Studio</td><td>Oct 03</td><td class="num">4,800.00</td><td><span class="pv-badge bad">Overdue</span></td></tr>
      <tr class="sel"><td>☑</td><td>INV-1039</td><td>Kiln Studio</td><td>Oct 11</td><td class="num">920.50</td><td><span class="pv-badge bad">Overdue</span></td></tr>
      <tr><td>☐</td><td>INV-1031</td><td>Kiln Studio</td><td>Sep 28</td><td class="num">12,000.00</td><td><span class="pv-badge bad">Overdue</span></td></tr>
      <tr><td>☐</td><td>INV-1027</td><td>Kiln Studio</td><td>Sep 19</td><td class="num">310.00</td><td><span class="pv-badge bad">Overdue</span></td></tr></tbody></table></div>
    <div class="row between small muted" data-check="pagination"><span>Showing 1–4 of 48</span><span class="row"><select class="pv-input select" style="width:110px;min-height:32px"><option>25 / page</option></select><span class="pv-btn sm">‹</span><span class="pv-btn sm">›</span></span></div>
    <div class="grid2"><div class="pv-card stack center" data-check="empty-filter"><h4>No invoices match these filters</h4><p class="fine">Try removing “Client: Kiln”.</p><span class="pv-btn sm">Clear filters</span></div>
      <div class="spec" data-check="responsive"><b>Below 640px</b> rows collapse into cards (Invoice · Amount · Status); full table scrolls horizontally with an edge fade.</div></div>
  </section>`,

  'web-app/empty-state': `
  <section class="pad" style="min-height:520px;display:grid;grid-template-columns:minmax(0,1fr);place-items:center">
    <div class="stack center" style="max-width:460px">
      <div class="img" data-check="preview" style="width:260px;height:130px;display:grid;place-items:center"><div class="pv-card" style="width:200px;padding:10px"><div class="line" style="width:70%"></div><div class="line" style="width:40%;margin-top:6px"></div></div></div>
      <h2 data-check="why">No clients yet</h2>
      <p class="muted" data-check="tone">Clients you add here can be invoiced in two clicks. Let's add your first one — it takes about a minute.</p>
      <div class="row" data-check="action"><a class="pv-btn primary" href="#">+ Add client</a><a class="pv-btn" href="#">Import CSV</a></div>
      <a class="small" href="#" data-check="learn">▶ Watch: setting up clients (1:30)</a>
    </div></section>`,

  'web-app/onboarding': `
  <section class="pad" style="display:grid;grid-template-columns:minmax(0,1fr);place-items:center;min-height:560px;background:var(--sunken)">
    <div class="pv-card raised stack-lg" style="width:560px;max-width:100%">
      <div class="stack" data-check="progress"><div class="row between fine"><span>Step 2 of 3</span><span>About 1 minute left</span></div><div class="progress"><i style="width:66%"></i></div></div>
      <div class="stack" data-check="ask-less"><h2>What do you invoice for?</h2><p class="muted small">We'll set up your first invoice template.</p>
        <div class="grid2"><span class="pv-card pad-sm" style="border:2px solid var(--accent)">🎨 Design work</span><span class="pv-card pad-sm">💻 Development</span><span class="pv-card pad-sm">📸 Photography</span><span class="pv-card pad-sm">✍️ Consulting</span></div></div>
      <div class="pv-banner info" data-check="aha"><b>Next:</b> send a test invoice to yourself — that's when Flowly clicks.</div>
      <label class="pv-check" data-check="sample"><i class="on"></i>Fill my workspace with sample clients so I can explore</label>
      <div class="row between"><a class="pv-btn ghost" href="#" data-check="skip">Skip for now</a><span class="row"><span class="pv-btn">Back</span><span class="pv-btn primary">Continue</span></span></div>
      <p class="fine" data-check="invite">After your first invoice we'll suggest inviting teammates — not before.</p>
    </div></section>`,

  'web-app/notifications': `
  <section class="pad" style="display:grid;grid-template-columns:minmax(0,1fr);justify-items:end;min-height:540px;background:var(--sunken)">
    <div class="pv-card raised" style="width:420px;max-width:100%;padding:0">
      <div class="row between pad-sm" style="border-bottom:1px solid var(--border)"><h3>Notifications</h3><span class="row"><a class="small" href="#" data-check="read-state">Mark all as read</a><a class="pv-btn sm icon" href="#" data-check="prefs" aria-label="Notification settings">⚙</a></span></div>
      <div class="pad-sm row" style="align-items:flex-start;background:var(--accent-soft)" data-check="actionable"><span class="dot" style="margin-top:8px"></span><span class="pv-avatar">KS</span><div class="grow"><p class="small"><b>Kiln Studio</b> paid <b>INV-1042</b> · $4,800</p><p class="fine">2 min ago · <a href="#">View invoice</a></p></div></div>
      <div class="pad-sm row" style="align-items:flex-start;background:var(--accent-soft)" data-check="grouping"><span class="dot" style="margin-top:8px"></span><span class="pv-avatar">5</span><div class="grow"><p class="small"><b>5 comments</b> on Q4 retainer proposal</p><p class="fine">Maya, Leo and 3 others · 1h ago</p></div></div>
      <div class="pad-sm row" style="align-items:flex-start"><span class="pv-avatar">M</span><div class="grow"><p class="small muted">Mesa viewed INV-1039</p><p class="fine">Yesterday</p></div></div>
      <div class="pad-sm stack center sunken" data-check="empty"><span>🎉</span><p class="fine">You're all caught up on older notifications.</p></div>
      <div class="spec" style="margin:12px" data-check="live-region"><code>&lt;div role="status" aria-live="polite"&gt;</code> announces “New: Kiln Studio paid INV-1042”.</div>
    </div></section>`,

  'web-app/billing': `
  <section class="pad stack-lg" style="max-width:860px">
    <div class="pv-banner bad" data-check="failed"><b>Payment failed on Oct 18.</b> We'll retry on Oct 21 — your access continues until Oct 28. <span class="grow"></span><span class="pv-btn sm">Update card</span></div>
    <div class="grid2">
      <div class="pv-card stack" data-check="current"><span class="kicker">Current plan</span><div class="row between"><h2>Studio</h2><span class="pv-badge ok">Active</span></div><p class="small muted">$29 / month · renews Nov 1, 2026</p><div class="stack" style="gap:4px"><div class="row between fine"><span>Seats</span><span>4 of 5</span></div><div class="progress warn"><i style="width:80%"></i></div></div></div>
      <div class="pv-card stack" data-check="change-plan"><span class="kicker">Change plan</span><div class="row between"><span>Upgrade to Agency</span><b>+$61.40 today</b></div><p class="fine">Prorated for 18 remaining days, then $99/month.</p><span class="pv-btn primary">Review upgrade</span></div></div>
    <div class="pv-card row between" data-check="payment"><div class="row"><span class="pv-badge">VISA</span><span>•••• 4242 · expires 11/26</span><span class="pv-badge warn">Expires soon</span></div><span class="pv-btn sm">Update</span></div>
    <table class="pv-table" data-check="invoices"><thead><tr><th>Date</th><th>Description</th><th class="num">Amount</th><th></th></tr></thead><tbody><tr><td>Oct 1</td><td>Studio — monthly</td><td class="num">$29.00</td><td><a href="#">PDF</a></td></tr><tr><td>Sep 1</td><td>Studio — monthly</td><td class="num">$29.00</td><td><a href="#">PDF</a></td></tr></tbody></table>
    <p class="small muted">Billing details: Rivera Studio · VAT ID DE123456789 · <a href="#">Edit</a> &nbsp;·&nbsp; <a href="#" data-check="cancel" style="color:var(--bad)">Cancel subscription</a></p>
  </section>`,

  /* ---------------- MOBILE ---------------- */
  'mobile/login': phone(`
    <h2 style="margin-top:24px">Welcome back</h2>
    <button class="pv-btn block lg" data-check="social"> Continue with Apple</button><button class="pv-btn block lg">G&nbsp; Continue with Google</button>
    <div class="row fine"><div class="divider grow"></div>or<div class="divider grow"></div></div>
    <div class="field" data-check="autofill"><label>Email</label><input class="pv-input" type="email" autocomplete="username" value="sam@studio.co"><span class="fine">🔑 Autofill from Passwords</span></div>
    <div class="field error" data-check="errors"><label>Password</label><div class="input-wrap" data-check="show-password"><input class="pv-input" type="password" autocomplete="current-password" value="hunter22"><button class="pv-btn ghost sm" data-demo="reveal">Show</button></div><span class="err">Email or password is incorrect.</span></div>
    <a class="small" href="#" data-check="forgot">Forgot password?</a>
    <button class="pv-btn primary block lg">Log in</button>
    <div class="pv-card pad-sm row" data-check="biometric"><span style="font-size:22px">🙂</span><span class="small">Use Face ID next time</span><span class="grow"></span><button class="pv-switch" role="switch" aria-checked="true" data-demo="toggle" aria-label="Face ID"></button></div>
    <div class="kbd-sim" data-check="keyboard"><div class="row between fine"><span>email keyboard · return = “Next”</span><b style="color:var(--info)">Next</b></div><div class="keys"><span>q</span><span>w</span><span>e</span><span>r</span><span>t</span><span>y</span><span>u</span><span>i</span><span>o</span><span>p</span></div><div class="row fine" style="justify-content:center;gap:18px"><span>@</span><span>.com</span><span>.</span></div></div>`),

  'mobile/onboarding': phone(`
    <div class="row between" data-check="safe-area"><span class="fine">1 / 3</span><a class="pv-btn ghost sm" href="#" data-check="skip">Skip</a></div>
    <div class="img" style="height:220px;display:grid;place-items:center;font-size:64px" data-check="short">🌱</div>
    <h2 style="text-align:center">Build habits that stick</h2><p class="muted center small">Tiny daily check-ins, streaks and gentle nudges.</p>
    <div class="row" style="justify-content:center;gap:6px"><span class="dot"></span><span class="dot" style="background:var(--border)"></span><span class="dot" style="background:var(--border)"></span></div>
    <button class="pv-btn primary block lg" data-check="value-first">Try a 30-second check-in</button><p class="fine center">No account needed to start.</p>
    <div class="pv-card pad-sm stack" data-check="personalise"><span class="kicker">You picked</span><span class="small">🧘 Meditate · 💧 Drink water — your home screen starts with these.</span></div>
    <div class="pv-card pad-sm stack" data-check="permissions"><b class="small">Remind you at 8:00?</b><p class="fine">We'll ask iOS for notification permission only when you turn this on.</p><button class="pv-btn sm">Turn on reminders</button></div>`),

  'mobile/paywall': phone(`
    <div class="row between"><span></span><button class="x" data-check="close" aria-label="Close" style="width:44px;height:44px">✕</button></div>
    <h2 style="text-align:center">Habitly Plus</h2>
    <div class="stack small" data-check="benefits"><span>📈 See which habits actually stick</span><span>🔔 Smart reminders that adapt to you</span><span>☁️ Sync across all your devices</span></div>
    <div class="pv-card accent stack" data-check="price-clarity" style="padding:14px"><div class="row between"><b>Yearly</b><span class="pv-badge accent">Best value</span></div><div><b style="font-size:20px">$39.99 / year</b> <span class="fine">($3.33/mo)</span></div></div>
    <div class="pv-card stack" style="padding:14px"><div class="row between"><b>Monthly</b></div><div><b style="font-size:20px">$5.99 / month</b></div></div>
    <p class="fine center" data-check="trial">7-day free trial, then $39.99/year. We'll remind you 2 days before it ends. Cancel anytime in Settings.</p>
    <button class="pv-btn primary block lg">Start free trial</button>
    <div class="row fine" style="justify-content:center;gap:16px"><a href="#" data-check="restore">Restore purchases</a><span data-check="legal-links"><a href="#">Terms</a> · <a href="#">Privacy</a></span></div>`),

  'mobile/tab-bar': phone(`
    <h2>Today</h2><div class="pv-card stack" data-check="state"><span class="fine">Scroll position & stack are kept per tab; re-tapping “Home” scrolls to top.</span><div class="line"></div><div class="line" style="width:70%"></div><div class="line" style="width:85%"></div></div>
    <div class="pv-card"><div class="line"></div></div><div class="pv-card"><div class="line" style="width:60%"></div></div>`,
  `<nav class="tabbar" role="tablist" data-check="count labels">
      <button role="tab" aria-selected="true" data-demo="tab" data-check="active targets">${ICON.home}Home</button>
      <button role="tab" aria-selected="false" data-demo="tab">${ICON.search}Search</button>
      <button role="tab" aria-selected="false" data-demo="tab">${ICON.chart}Stats</button>
      <button role="tab" aria-selected="false" data-demo="tab" data-check="badges">${ICON.bell}<span class="count">2</span>Inbox</button>
      <button role="tab" aria-selected="false" data-demo="tab">${ICON.user}Profile</button></nav>`),

  'mobile/push-permission': phone(`
    <div class="pv-card stack center" data-check="timing" style="padding:16px"><span style="font-size:36px">🔥</span><b>3-day streak!</b><p class="fine">You just finished your third check-in.</p></div>
    <div class="pv-card raised stack" data-check="pre-prompt"><b>Keep your streak alive?</b>
      <div class="stack small" data-check="examples"><span>⏰ One reminder at 8:00 if you haven't checked in</span><span>🏆 Weekly summary on Sundays</span><span class="fine">Never more than 1 a day.</span></div>
      <div class="row"><button class="pv-btn primary grow">Turn on</button><button class="pv-btn grow">Not now</button></div></div>
    <div class="os-alert"><p><b>“Habitly” Would Like to Send You Notifications</b></p><div class="acts"><span>Don't Allow</span><span>Allow</span></div></div>
    <div class="pv-banner info small" data-check="denied">Reminders are off. You can enable them in <b>Settings › Notifications</b> anytime.</div>
    <div class="pv-card stack" data-check="control"><div class="row between small"><span>Daily reminder</span><button class="pv-switch" role="switch" aria-checked="true" data-demo="toggle" aria-label="Daily reminder"></button></div><div class="row between small"><span>Weekly summary</span><button class="pv-switch" role="switch" aria-checked="false" data-demo="toggle" aria-label="Weekly summary"></button></div></div>`),

  'mobile/search': phone(`
    <div class="row"><div class="input-wrap grow" data-check="clear"><input class="pv-input" value="medit" aria-label="Search"><button class="pv-btn ghost sm" aria-label="Clear">✕</button></div><a class="small" href="#">Cancel</a></div>
    <div class="stack" data-check="instant"><span class="kicker">Results</span><span class="small">🧘 <b>Medit</b>ation — 10 min</span><span class="small">🧘 Morning <b>medit</b>ation streak</span></div>
    <div class="pv-banner info small" data-check="typos">Showing results for <b>meditation</b>. Search instead for “medit”.</div>
    <div class="stack" data-check="recent"><span class="kicker">Recent</span><span class="small muted">🕑 water</span><span class="small muted">🕑 reading</span><span class="kicker">Popular</span><span class="small muted">🔥 sleep · stretch · journal</span></div>
    <div class="pv-card stack center" data-check="no-results"><b class="small">No habits match “xylo”</b><p class="fine">Try “mindfulness” or browse categories.</p><span class="pv-btn sm">Browse categories</span></div>
    <div class="spec" data-check="keyboard-dismiss"><code>keyboardDismissMode="on-drag"</code> — scrolling results hides the keyboard.</div>`),

  /* ---------------- DESIGN SYSTEM ---------------- */
  'design-system/button': `
  <section class="pad stack-lg">
    <div class="stack"><span class="kicker">Hierarchy</span><div class="row" data-check="hierarchy"><button class="pv-btn primary">Save changes</button><button class="pv-btn">Preview</button><button class="pv-btn ghost">Cancel</button><button class="pv-btn danger">Delete project</button></div></div>
    <div class="stack"><span class="kicker">States — primary</span><div class="row" data-check="states"><span class="stack center fine"><button class="pv-btn primary">Default</button>default</span><span class="stack center fine"><button class="pv-btn primary is-hover">Hover</button>hover</span><span class="stack center fine" data-check="focus"><button class="pv-btn primary is-focus">Focus</button>focus-visible</span><span class="stack center fine"><button class="pv-btn primary is-active">Active</button>active</span><span class="stack center fine"><button class="pv-btn primary" disabled>Disabled</button>disabled</span><span class="stack center fine" data-check="loading"><button class="pv-btn primary is-loading" style="width:132px">Save changes</button>loading</span></div></div>
    <div class="grid2">
      <div class="stack"><span class="kicker">Sizes & targets</span><div class="row" data-check="target"><button class="pv-btn sm">32px</button><button class="pv-btn">40px</button><button class="pv-btn lg">48px touch</button></div><p class="fine">Hit area never below 24×24; 44px on touch.</p></div>
      <div class="stack" data-check="labels"><span class="kicker">Labels</span><div class="row"><button class="pv-btn primary">Send invoice</button><button class="pv-btn icon" aria-label="Download PDF">⬇</button></div><p class="fine">Verb-first text · icon-only has <code>aria-label="Download PDF"</code></p></div></div>
    <div class="row"><button class="pv-btn primary" data-demo="loading">Click to see loading</button><span class="fine">width stays fixed, double-submit blocked</span></div>
    <div class="code-block" data-check="element"><span class="c">&lt;!-- action --&gt;</span>   &lt;<span class="k">button</span> type=<span class="s">"button"</span>&gt;Save&lt;/button&gt;
<span class="c">&lt;!-- navigation --&gt;</span> &lt;<span class="k">a</span> href=<span class="s">"/pricing"</span>&gt;See pricing&lt;/a&gt;</div>
  </section>`,

  'design-system/input-field': `
  <section class="pad grid2" style="gap:28px;align-items:start">
    <div class="stack-lg">
      <div class="field" data-check="label help"><label>Company email</label><input class="pv-input" placeholder="name@company.com"><span class="help">We'll send invoices from this address.</span></div>
      <div class="field error" data-check="error"><label>Card number</label><input class="pv-input" value="4242 4242 4242" aria-invalid="true" aria-describedby="e1"><span class="err" id="e1">Card number is too short — it needs 16 digits.</span></div>
      <div class="field" data-check="optional"><label>Phone <span class="opt">(optional)</span></label><input class="pv-input" type="tel"></div>
      <div class="field" data-check="counter"><label>Invoice note</label><textarea class="pv-input">Thanks for your business! Payment is due within 14 days of the invoice date. Late payments incur</textarea><span class="counter near">12 characters left</span></div>
    </div>
    <div class="stack" data-check="states"><span class="kicker">States</span>
      <div class="field"><span class="label fine">Default</span><input class="pv-input" placeholder="Placeholder"></div>
      <div class="field"><span class="label fine">Hover</span><input class="pv-input is-hover" value="Hover"></div>
      <div class="field"><span class="label fine">Focus</span><input class="pv-input is-focus" value="Focused"></div>
      <div class="field"><span class="label fine">Filled</span><input class="pv-input" value="Rivera Studio"></div>
      <div class="field"><span class="label fine">Disabled</span><input class="pv-input" disabled value="Locked by admin"></div>
      <div class="field"><span class="label fine">Read-only</span><input class="pv-input" readonly value="INV-1042"></div>
      <div class="code-block" data-check="types">&lt;input type=<span class="s">"email"</span> inputmode=<span class="s">"email"</span>
       autocomplete=<span class="s">"email"</span>&gt;</div></div>
  </section>`,

  'design-system/modal': `
  <section class="pad stack" style="min-height:560px;position:relative">
    <h3>Projects</h3><p class="muted small">Modal opens for a focused task — renaming a project.</p>
    <div class="row" data-check="justified"><button class="pv-btn primary" data-demo="open" data-target="m1">Rename project…</button><span class="fine">Opens a dialog</span></div>
    <div class="grid2"><div class="pv-card"><div class="line"></div><div class="line" style="width:60%;margin-top:8px"></div></div><div class="pv-card"><div class="line"></div></div></div>
    <div class="spec" data-check="mobile"><b>≤ 600px:</b> presented as a full-width bottom sheet with a drag handle.</div>
    <div class="pv-layer scrim" id="m1">
      <div class="pv-modal" role="dialog" aria-modal="true" aria-labelledby="mt" data-check="semantics focus-trap">
        <header><h3 id="mt">Rename project</h3><button class="x" data-demo="close" aria-label="Close" data-check="escape">✕</button></header>
        <div class="body stack" data-check="scroll"><div class="field"><label>Project name</label><input class="pv-input is-focus" value="Q4 retainer"></div><p class="fine">Focus moved here on open · Tab cycles inside · returns to “Rename project…” on close · Esc closes.</p><p class="fine">Long content scrolls in this body; header and actions stay put.</p></div>
        <footer><button class="pv-btn" data-demo="close">Cancel</button><button class="pv-btn primary" data-demo="close">Save</button></footer></div></div>
  </section>`,

  'design-system/toast': `
  <section class="pad stack" style="min-height:480px;position:relative">
    <div class="row"><button class="pv-btn primary" data-demo="toast" data-target="t1">Archive invoice</button><span class="fine">Shows a toast with undo</span></div>
    <div class="grid2" style="align-items:start">
      <div class="stack"><span class="kicker">Anatomy</span><div class="toast-wrap static" data-check="stack">
        <div class="pv-toast" data-check="short undo">✓ Invoice archived<span class="grow"></span><button class="pv-btn ghost sm">Undo</button></div>
        <div class="pv-toast">✓ Reminder sent to Kiln Studio</div></div>
        <p class="fine">Max 3 visible, bottom-right, never over the primary action.</p></div>
      <div class="stack"><div class="spec" data-check="timing"><b>Timing</b> · 6s minimum; paused while hovered or focused; toasts with actions stay until dismissed.</div>
        <div class="spec" data-check="announce"><code>role="status"</code> for success · <code>role="alert"</code> for errors.</div>
        <div class="pv-banner bad" data-check="not-errors"><b>Payment failed.</b> Card declined — <a href="#"><b>update card</b></a>. (Critical errors use a banner, not a toast.)</div></div></div>
    <div class="pv-layer toast-wrap" id="t1"><div class="pv-toast" role="status">✓ Invoice archived<span class="grow"></span><button class="pv-btn ghost sm" data-demo="close">Undo</button></div></div>
  </section>`,

  'design-system/tooltip': `
  <section class="pad stack-lg" style="padding-top:64px">
    <div class="row" style="gap:40px">
      <span class="tip-host" data-check="triggers dismiss"><button class="pv-btn icon" aria-describedby="tt1">⬇</button><span class="pv-tooltip show" role="tooltip" id="tt1">Download PDF · Esc to close</span></span>
      <span class="tip-host" data-check="supplementary"><span class="small">Late fee <a href="#">ⓘ</a></span><span class="pv-tooltip show">2% after 7 days — also explained in Settings</span></span>
      <span class="tip-host" data-check="position" style="margin-left:auto"><button class="pv-btn">Near edge</button><span class="pv-tooltip below show" style="left:auto;right:0;transform:none">Flipped below to stay in view</span></span></div>
    <div class="grid2" style="margin-top:24px"><div class="spec">Shown on <b>hover and keyboard focus</b>, stays while the pointer moves onto it (WCAG 1.4.13).</div>
      <div class="pv-card stack" data-check="touch"><span class="kicker">On touch</span><span class="small">Late fee</span><p class="fine" style="background:var(--sunken);padding:8px;border-radius:8px">2% after 7 days. (Tap ⓘ reveals inline text instead of a hover tooltip.)</p></div></div>
  </section>`,

  'design-system/color-system': `
  <section class="pad stack-lg">
    <div class="stack" data-check="scales"><span class="kicker">Indigo ramp</span><div class="ramp">${[97, 92, 84, 74, 62, 52, 42, 32, 22].map((l, i) => `<div class="swatch" style="background:hsl(244 75% ${l}%);color:${l > 55 ? '#15151c' : '#fff'}">${(i + 1) * 100}</div>`).join('')}</div></div>
    <div class="grid2">
      <div class="stack" data-check="semantic"><span class="kicker">Semantic tokens</span><div class="code-block">--color-surface      → neutral-0
--color-text-muted   → neutral-600
--color-action       → indigo-600
--color-danger       → red-600</div></div>
      <div class="stack" data-check="contrast"><span class="kicker">Checked pairs</span><div class="row small"><span class="pv-badge ok">Text on surface 15.8:1 ✓</span><span class="pv-badge ok">Muted on surface 6.4:1 ✓</span><span class="pv-badge bad">Indigo-300 on white 2.1:1 ✕</span></div></div></div>
    <div class="grid2">
      <div class="stack" data-check="status"><span class="kicker">Status = colour + icon + text</span><div class="pv-banner ok">✓ <b>Paid</b></div><div class="pv-banner warn">⚠ <b>Due soon</b></div><div class="pv-banner bad">✕ <b>Overdue</b></div></div>
      <div class="stack" data-check="dark"><span class="kicker">Dark theme (designed)</span><div class="pv-card" style="background:#191921;color:#f1f1f6;border-color:#30303d"><b>Surface #191921</b><p class="small" style="color:#a2a2b3">Lighter surfaces show elevation; accent desaturated to #8b84ff.</p></div></div></div>
    <div class="stack" data-check="data-viz"><span class="kicker">Categorical (colour-blind safe)</span><div class="row">${['#4269d0', '#efb118', '#ff725c', '#6cc5b0', '#3ca951', '#ff8ab7', '#a463f2'].map((c) => `<span class="swatch" style="background:${c};width:56px"></span>`).join('')}</div></div>
  </section>`,

  'design-system/typography': `
  <section class="pad grid2" style="gap:32px;align-items:start">
    <div class="stack" data-check="scale"><span class="kicker">Type scale</span>
      <div class="row between"><span style="font-size:44px;font-weight:800;line-height:1.1" data-check="line-height">Display</span><code class="fine">44 / 1.1</code></div>
      <div class="row between"><span style="font-size:30px;font-weight:700;line-height:1.2">Heading 1</span><code class="fine">30 / 1.2</code></div>
      <div class="row between"><span style="font-size:22px;font-weight:700">Heading 2</span><code class="fine">22 / 1.3</code></div>
      <div class="row between"><span style="font-size:18px;font-weight:600">Heading 3</span><code class="fine">18 / 1.4</code></div>
      <div class="row between" data-check="body"><span style="font-size:16px">Body — readable at 16px</span><code class="fine">16 / 1.5</code></div>
      <div class="row between"><span style="font-size:13px" class="muted">Caption</span><code class="fine">13 / 1.4</code></div></div>
    <div class="stack-lg">
      <div class="code-block" data-check="rem">--font-body: <span class="s">1rem</span>;    <span class="c">/* 16px, scales with user setting */</span>
--font-h1:   <span class="s">1.875rem</span>;</div>
      <div class="code-block" data-check="loading">@font-face { font-family: Inter;
  font-display: <span class="s">swap</span>; size-adjust: <span class="s">107%</span>;
  unicode-range: U+0000-00FF; }</div>
      <div class="pv-card" data-check="numerals"><span class="kicker">Tabular figures</span><table class="pv-table"><tr><td>Design</td><td class="num">1,120.00</td></tr><tr><td>Hosting</td><td class="num">  98.50</td></tr><tr><td><b>Total</b></td><td class="num"><b>1,218.50</b></td></tr></table></div></div>
  </section>`,

  'design-system/tokens': `
  <section class="pad stack-lg">
    <div class="grid3" data-check="tiers">
      <div class="pv-card stack"><span class="kicker">1 · Primitive</span><code class="small">indigo.600 = #4f46e5</code><code class="small">space.4 = 16px</code></div>
      <div class="pv-card stack"><span class="kicker">2 · Semantic</span><code class="small">color.action.bg → indigo.600</code><code class="small">space.inset.md → space.4</code></div>
      <div class="pv-card stack"><span class="kicker">3 · Component</span><code class="small">button.primary.bg → color.action.bg</code></div></div>
    <div class="spec" data-check="naming"><b>Grammar</b> · <code>{category}.{property}.{variant}.{state}</code> → <code>color.bg.danger.hover</code></div>
    <div class="grid2">
      <div class="stack" data-check="sync"><span class="kicker">One source → every platform</span><div class="row small"><span class="pv-badge info">tokens.json</span>→<span class="pv-badge">tokens.css</span><span class="pv-badge">Tokens.swift</span><span class="pv-badge">tokens.xml</span></div></div>
      <div class="stack" data-check="themes"><span class="kicker">Themes swap the semantic layer</span><div class="row"><span class="pv-btn primary">Light</span><span class="pv-btn primary" style="background:#8b84ff;color:#0c0c12">Dark</span><span class="pv-btn primary" style="background:#000;color:#fff;outline:2px solid #ff0">High contrast</span></div></div></div>
    <div class="grid2">
      <div class="stack" data-check="spacing"><span class="kicker">Spacing (4-based) & radius</span><div class="row" style="align-items:flex-end">${[4, 8, 12, 16, 24, 32, 48].map((s) => `<span class="stack center fine"><span style="width:${s}px;height:${s}px;background:var(--accent);border-radius:3px"></span>${s}</span>`).join('')}</div><div class="row">${[4, 8, 12, 999].map((r) => `<span style="width:40px;height:28px;border:2px solid var(--accent);border-radius:${r}px"></span>`).join('')}</div></div>
      <div class="code-block" data-check="motion">--motion-fast: <span class="s">120ms</span>; --ease-out: <span class="s">cubic-bezier(.2,.8,.2,1)</span>;
@media (prefers-reduced-motion: reduce) {
  :root { --motion-fast: <span class="s">0ms</span>; } }</div></div>
  </section>`,

  'design-system/accessibility': `
  <a href="#" class="pv-btn primary" style="position:absolute;left:12px;top:8px;z-index:2" data-check="skip">Skip to content</a>
  <nav class="pv-nav" style="padding-top:52px"><span class="logo">◆ Flowly</span><span class="links"><span>Invoices</span><span>Clients</span></span><span class="fine">&lt;header&gt; &lt;nav&gt;</span></nav>
  <main class="pad stack-lg">
    <div class="row" data-check="keyboard focus-order"><button class="pv-btn">① New invoice</button><button class="pv-btn is-focus">② Filter</button><button class="pv-btn">③ Export</button><span class="fine">Tab order follows reading order · no positive tabindex</span></div>
    <div class="row" data-check="names"><button class="pv-btn icon" aria-label="Delete invoice">🗑</button><code class="fine">aria-label="Delete invoice"</code><button class="pv-btn">Send invoice</button><code class="fine">name matches visible label</code></div>
    <div class="grid2"><div class="spec" data-check="reduced-motion"><b>prefers-reduced-motion</b> · page transitions and parallax turn off; spinners stay.</div>
      <div class="spec" data-check="reflow"><b>320px / 400% zoom</b> · sidebar collapses to a menu, tables become cards — no horizontal scrolling.</div></div>
    <div class="pv-card stack" data-check="testing"><span class="kicker">Release checks</span><div class="row small"><span class="pv-badge ok">axe: 0 violations</span><span class="pv-badge ok">Lighthouse a11y 100</span><span class="pv-badge ok">VoiceOver walkthrough ✓</span><span class="pv-badge ok">NVDA walkthrough ✓</span></div></div>
  </main>`,

  /* ---------------- FLOWS ---------------- */
  'flows/sign-up': `
  <div class="flow">
    <div class="screen"><span class="kicker">1 · Create account</span><h3>Start your free trial</h3>
      <div class="stack" data-check="sso"><span class="pv-btn block">G&nbsp; Sign up with Google</span><span class="pv-btn block"> Sign up with Apple</span></div>
      <div class="stack" data-check="fields"><div class="field"><label>Work email</label><input class="pv-input" value="sam@studio.co"></div>
      <div class="field" data-check="password-rules"><label>Password</label><input class="pv-input" type="password" value="flowly2026"><span class="fine" style="color:var(--ok)">✓ 8+ characters</span><span class="fine" style="color:var(--ok)">✓ Includes a number</span><span class="fine">○ Not a common password</span></div></div>
      <label class="pv-check small" data-check="consent"><i></i>Email me product tips (optional)</label><p class="fine">By signing up you agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
      <span class="pv-btn primary block">Create account</span><p class="fine" data-check="bot">Protected by rate limits + invisible bot check.</p></div>
    <div class="screen" data-check="existing"><span class="kicker">1b · Email already registered</span><div class="pv-banner info small">If an account exists for that email, we've sent a sign-in link. <a href="#"><b>Log in instead</b></a></div></div>
    <div class="screen" data-check="verify"><span class="kicker">2 · Inside the app</span><div class="pv-banner warn small">📧 Confirm your email to send invoices. <a href="#"><b>Resend</b></a></div><h3>Welcome, Sam!</h3><p class="small muted">You can explore and draft invoices while you verify.</p><div class="line"></div><div class="line" style="width:70%"></div></div>
  </div>`,

  'flows/reset-password': `
  <div class="flow">
    <div class="screen"><span class="kicker">1 · Request</span><h3>Reset your password</h3><div class="field"><label>Email</label><input class="pv-input" value="sam@studio.co"></div><span class="pv-btn primary block">Send reset link</span></div>
    <div class="screen"><span class="kicker">2 · Check email</span><div class="pv-banner info small" data-check="same-message">If an account exists for sam@studio.co, you'll get a link in a minute.</div>
      <span class="pv-btn block is-disabled" data-check="resend">Resend in 0:42</span><p class="fine">Not there? Check spam or promotions.</p>
      <div class="spec" data-check="expiry">Link valid <b>30 minutes</b>, single use.</div></div>
    <div class="screen" data-check="new-password"><span class="kicker">3 · New password</span><div class="field"><label>New password</label><div class="input-wrap"><input class="pv-input" type="password" value="new-strong-pass"><button class="pv-btn ghost sm" data-demo="reveal">Show</button></div><span class="fine" style="color:var(--ok)">✓ Strong</span></div>
      <label class="pv-check small" data-check="sessions"><i class="on"></i>Sign out of all other devices</label><span class="pv-btn primary block">Save and continue</span></div>
    <div class="screen"><span class="kicker">4 · Done</span><div class="pv-banner ok small" data-check="signed-in">✓ Password updated — you're signed in.</div>
      <div class="pv-card stack" data-check="notify"><span class="fine">📧 Email sent</span><b class="small">Your Flowly password was changed</b><p class="fine">Oct 21, 14:02 · Safari on macOS. <a href="#">This wasn't me</a></p></div></div>
  </div>`,

  'flows/checkout': `
  <div class="pad-sm row between" style="border-bottom:1px solid var(--border)"><b>Kiln Supply</b><div class="stepper" data-check="progress"><span class="done"><i>✓</i>Cart</span><hr><span class="now"><i>2</i>Details</span><hr><span><i>3</i>Pay</span></div></div>
  <div class="pad grid2 wide-first" style="gap:28px;align-items:start">
    <div class="stack-lg">
      <div class="pv-card row between" data-check="guest"><span class="small">Checking out as guest — create an account after your order (optional).</span><a class="small" href="#">Log in</a></div>
      <div class="stack" data-check="autofill"><span class="row"><span class="pv-btn primary grow" style="background:#000;color:#fff"> Pay</span><span class="pv-btn grow">G Pay</span></span>
        <div class="field"><label>Address</label><input class="pv-input" value="221 Mission St" autocomplete="shipping street-address"></div></div>
      <div class="field error" data-check="errors"><label>Card number</label><input class="pv-input" value="4000 0000 0000 0002"><span class="err">Your bank declined this card. Try another card or contact your bank.</span></div>
      <button class="pv-btn primary lg is-loading" data-check="double-submit" style="width:100%">Pay $142.00</button></div>
    <div class="pv-card stack" data-check="total"><h3>Order summary</h3><div class="row between small"><span>Stoneware mug ×2</span><span>$96.00</span></div><div class="row between small"><span>Shipping</span><span>$12.00</span></div><div class="row between small"><span>Tax</span><span>$34.00</span></div><div class="divider"></div><div class="row between"><b>Total</b><b>$142.00</b></div>
      <div class="stack fine" data-check="trust"><span>🔒 Secure payment via Stripe</span><span>↩︎ Free returns within 30 days</span><span>💬 help@kiln.co</span></div></div></div>
  <div class="pad" style="padding-top:0"><div class="pv-card row" data-check="confirm"><span style="font-size:28px">✅</span><div><b>Order #KS-20931 confirmed</b><p class="fine">Arrives Oct 24–26 · Confirmation sent to sam@studio.co · <a href="#">Track order</a></p></div></div></div>`,

  'flows/cancel-subscription': `
  <div class="flow">
    <div class="screen" data-check="findable"><span class="kicker">Settings › Billing</span><b>Studio · $29/month</b><span class="pv-btn block">Change plan</span><a class="small" href="#" style="color:var(--bad)">Cancel subscription</a></div>
    <div class="screen"><span class="kicker">1 · Before you go</span><div class="stack" data-check="alternatives"><span class="pv-card pad-sm small">⏸ Pause for up to 3 months</span><span class="pv-card pad-sm small">⬇ Switch to Solo — $12/mo</span></div>
      <div class="field" data-check="reason"><label>Why are you leaving? <span class="opt">(optional)</span></label><select class="pv-input select"><option>Too expensive</option></select></div><span class="pv-btn block">Continue to cancel</span></div>
    <div class="screen" data-check="consequences"><span class="kicker">2 · What happens</span><p class="small">Access continues until <b>Nov 1</b>. After that your account becomes read-only; data is kept for 90 days.</p><span class="pv-btn danger block">Cancel subscription</span><span class="pv-btn ghost block">Keep my plan</span></div>
    <div class="screen"><span class="kicker">3 · Confirmed</span><div class="pv-banner ok small" data-check="confirm">Cancelled. Ends Nov 1 — confirmation emailed.</div><span class="pv-btn primary block" data-check="reactivate">Reactivate</span></div>
  </div>`,

  'flows/delete-account': `
  <div class="flow">
    <div class="screen" data-check="self-serve"><span class="kicker">Settings › Account</span><b>Delete account</b><p class="fine">Available here — no support ticket needed.</p><span class="pv-btn danger-outline block">Delete account…</span></div>
    <div class="screen"><span class="kicker">1 · Before deleting</span><div class="pv-card pad-sm row between" data-check="export"><span class="small">Download all your data (ZIP)</span><span class="pv-btn sm">Export</span></div>
      <div class="stack small" data-check="impact"><b>This will:</b><span>• Cancel your Studio subscription</span><span>• Delete 148 invoices and 32 clients</span><span>• Transfer “Rivera Studio” ownership to Maya or delete it</span></div></div>
    <div class="screen" data-check="confirm"><span class="kicker">2 · Confirm</span><div class="field"><label>Type <code>DELETE</code> to confirm</label><input class="pv-input" value="DELETE"></div><div class="field"><label>Password</label><input class="pv-input" type="password" value="••••••••"></div><span class="pv-btn danger block">Permanently delete</span></div>
    <div class="screen"><span class="kicker">3 · Scheduled</span><div class="pv-banner warn small" data-check="grace">Deletion scheduled for <b>Nov 4</b>. Log in before then to restore.</div><div class="pv-card stack" data-check="receipt"><span class="fine">📧 Email sent</span><b class="small">We received your deletion request</b><p class="fine">Final deletion: Nov 4, 2026.</p></div></div>
  </div>`,

  'flows/form-submission': `
  <div class="flow">
    <form class="screen" data-check="single-column"><span class="kicker">1 · Filling in</span><h3>Request a quote</h3>
      <div class="field"><label>Full name</label><input class="pv-input" value="Sam Rivera"></div>
      <div class="field error" data-check="validation-timing"><label>Email</label><input class="pv-input" value="sam@studio"><span class="err">Add the domain, e.g. sam@studio.co</span><span class="fine">checked when you leave the field</span></div>
      <div class="field"><label>Budget</label><select class="pv-input select"><option>$5k–10k</option></select></div></form>
    <div class="screen"><span class="kicker">2 · Submit with errors</span><div class="pv-banner bad" data-check="error-summary" style="display:grid;gap:4px"><b>Fix 2 problems to continue</b><a href="#">• Email needs a domain</a><a href="#">• Choose a start date</a></div>
      <div class="field" data-check="preserve"><label>Full name</label><input class="pv-input" value="Sam Rivera"><span class="fine">your answers are kept</span></div></div>
    <div class="screen"><span class="kicker">3 · Sending</span><button class="pv-btn primary block is-loading" data-check="pending">Send request</button>
      <div class="pv-banner warn small" data-check="offline">Connection lost. <b>Nothing was lost</b> — <a href="#"><b>Retry</b></a></div></div>
    <div class="screen" data-check="success"><span class="kicker">4 · Sent</span><span style="font-size:32px">✅</span><h3>Request sent</h3><p class="small muted">We'll email a quote to sam@studio.co within 2 business days.</p></div>
  </div>`,

  'flows/file-upload': `
  <section class="pad grid2" style="gap:28px;align-items:start">
    <div class="stack">
      <div class="pv-card stack center" data-check="methods" style="border:2px dashed var(--border);padding:32px"><span style="font-size:32px">⬆</span><b>Drag files here, or <a href="#">browse</a></b><p class="fine">You can also paste images</p></div>
      <p class="fine" data-check="limits">JPG, PNG or PDF · up to 25 MB each · 10 files max</p>
      <div class="spec" data-check="privacy">📍 Location data is removed from photos before upload.</div></div>
    <div class="stack">
      <div class="pv-card row" data-check="progress preview"><div class="img" style="width:44px;height:44px"></div><div class="grow stack" style="gap:4px"><div class="row between small"><span>studio-shot.jpg</span><span class="fine">62% · 4.1 of 6.6 MB</span></div><div class="progress"><i style="width:62%"></i></div></div><button class="x" aria-label="Cancel upload">✕</button></div>
      <div class="pv-card row" data-check="resumable"><div class="img" style="width:44px;height:44px"></div><div class="grow stack" style="gap:4px"><div class="row between small"><span>brand-film.mp4</span><span class="fine">Paused — reconnecting…</span></div><div class="progress warn"><i style="width:38%"></i></div></div><span class="pv-btn sm">Resume</span></div>
      <div class="pv-card row" data-check="errors" style="border-color:var(--bad)"><span style="font-size:22px">⚠</span><div class="grow"><b class="small">invoice-scan.tiff</b><p class="fine" style="color:var(--bad)">TIFF isn't supported — convert to PDF or PNG.</p></div><span class="pv-btn sm">Replace</span></div>
      <div class="pv-card row"><span class="pv-badge ok">✓</span><span class="small grow">contract.pdf · 1.2 MB</span><button class="x" aria-label="Remove">✕</button></div></div>
  </section>`,
};
