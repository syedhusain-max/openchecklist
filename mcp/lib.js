// Pure data helpers shared by the MCP server and its tests. No MCP imports here.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
// Bundled copy (for npm installs) first, then the repo's data folder.
const CANDIDATES = [process.env.OPENCHECKLIST_DATA, join(here, 'checklists.json'), join(here, '..', 'data', 'checklists.json')].filter(Boolean);

export function loadData() {
  for (const p of CANDIDATES) {
    try { return JSON.parse(readFileSync(p, 'utf8')); } catch {}
  }
  throw new Error(`checklists.json not found. Tried: ${CANDIDATES.join(', ')}`);
}

export const PRIORITIES = ['must', 'should', 'nice'];
const rank = { must: 0, should: 1, nice: 2 };

export function createLibrary(data = loadData()) {
  const byId = new Map(data.checklists.map((c) => [c.id, c]));
  const catName = (id) => data.categories.find((c) => c.id === id)?.name ?? id;

  const filterItems = (c, minPriority = 'nice') => c.items.filter((it) => rank[it.priority] <= rank[minPriority]);

  function summary(c) {
    return { id: c.id, title: c.title, category: c.category, description: c.description, items: c.items.length, must: c.items.filter((i) => i.priority === 'must').length };
  }

  function list(category) {
    return data.checklists.filter((c) => !category || c.category === category).map(summary);
  }

  function search(query, limit = 10) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = [];
    for (const c of data.checklists) {
      const cText = `${c.title} ${c.description} ${c.category} ${catName(c.category)}`.toLowerCase();
      const cScore = terms.reduce((a, t) => a + (c.title.toLowerCase().includes(t) ? 4 : cText.includes(t) ? 2 : 0), 0);
      if (cScore) hits.push({ type: 'checklist', score: cScore + 2, checklist: c.id, title: c.title });
      for (const it of c.items) {
        const iText = `${it.title} ${it.description} ${it.tip ?? ''} ${(it.tags || []).join(' ')} ${it.wcag ? `wcag ${it.wcag}` : ''}`.toLowerCase();
        if (!terms.every((t) => iText.includes(t) || cText.includes(t))) continue;
        const s = terms.reduce((a, t) => a + (it.title.toLowerCase().includes(t) ? 3 : iText.includes(t) ? 1 : 0), 0);
        if (s) hits.push({ type: 'item', score: s, checklist: c.id, item: it.id, title: it.title, priority: it.priority, description: it.description, wcag: it.wcag });
      }
    }
    return hits.sort((a, b) => b.score - a.score).slice(0, limit).map(({ score, ...h }) => h);
  }

  function toMarkdown(lists, { title, minPriority = 'nice', withTips = true } = {}) {
    let md = title ? `# ${title}\n\n` : '';
    md += 'Priority: **must** = blocks launch · **should** = expected quality · **nice** = polish\n';
    for (const c of lists) {
      md += `\n## ${c.title} — ${catName(c.category)} (\`${c.id}\`)\n\n${c.description}\n\n`;
      for (const it of filterItems(c, minPriority)) {
        md += `- [ ] **${it.title}** _(${it.priority}${it.wcag ? `, WCAG ${it.wcag}` : ''})_ — ${it.description}\n`;
        if (withTips && it.tip) md += `  - Tip: ${it.tip}\n`;
      }
    }
    return md;
  }

  // Keyword routing from a plain-English brief to checklists. Deterministic so agents get stable results.
  const SIGNALS = {
    'website/landing-page': ['landing', 'marketing', 'homepage', 'home page', 'hero', 'website', 'launch', 'startup'],
    'website/pricing': ['pricing', 'plans', 'price', 'saas', 'subscription'],
    'website/blog-post': ['blog', 'article', 'post', 'content', 'docs'],
    'website/contact': ['contact', 'lead', 'support form', 'agency', 'portfolio'],
    'website/404': ['404', 'not found', 'website', 'marketing'],
    'website/faq': ['faq', 'help', 'questions', 'pricing'],
    'website/footer': ['footer', 'website', 'marketing', 'landing'],
    'web-app/dashboard': ['dashboard', 'analytics', 'admin', 'saas', 'web app', 'crm', 'metrics'],
    'web-app/settings': ['settings', 'preferences', 'account', 'saas', 'web app', 'profile'],
    'web-app/data-table': ['table', 'list', 'admin', 'crm', 'records', 'data', 'inventory'],
    'web-app/empty-state': ['empty', 'first run', 'saas', 'web app', 'dashboard'],
    'web-app/onboarding': ['onboarding', 'activation', 'saas', 'web app', 'first run'],
    'web-app/notifications': ['notification', 'inbox', 'activity', 'alerts', 'collaboration'],
    'web-app/billing': ['billing', 'subscription', 'invoice', 'saas', 'payments', 'plans'],
    'mobile/login': ['login', 'sign in', 'mobile', 'ios', 'android', 'app'],
    'mobile/onboarding': ['mobile', 'ios', 'android', 'onboarding', 'app'],
    'mobile/paywall': ['paywall', 'in-app purchase', 'iap', 'subscription', 'premium'],
    'mobile/tab-bar': ['tab bar', 'navigation', 'mobile', 'ios', 'android'],
    'mobile/push-permission': ['push', 'notification', 'mobile', 'ios', 'android'],
    'mobile/search': ['search', 'find', 'discover', 'catalog'],
    'design-system/button': ['button', 'component', 'design system', 'ui kit', 'library'],
    'design-system/input-field': ['input', 'form', 'field', 'component', 'design system'],
    'design-system/modal': ['modal', 'dialog', 'popup', 'component', 'design system'],
    'design-system/toast': ['toast', 'snackbar', 'feedback', 'component', 'design system'],
    'design-system/tooltip': ['tooltip', 'popover', 'component', 'design system'],
    'design-system/color-system': ['color', 'palette', 'theme', 'dark mode', 'brand', 'design system'],
    'design-system/typography': ['typography', 'font', 'type scale', 'design system', 'brand'],
    'design-system/tokens': ['tokens', 'design system', 'theme', 'variables'],
    'design-system/accessibility': ['accessibility', 'a11y', 'wcag', 'accessible', 'screen reader', 'design system'],
    'flows/sign-up': ['sign up', 'signup', 'register', 'registration', 'account', 'saas', 'auth'],
    'flows/reset-password': ['password', 'reset', 'forgot', 'auth', 'login'],
    'flows/checkout': ['checkout', 'cart', 'ecommerce', 'e-commerce', 'shop', 'store', 'payment', 'order'],
    'flows/cancel-subscription': ['cancel', 'churn', 'subscription', 'saas'],
    'flows/delete-account': ['delete account', 'gdpr', 'privacy', 'account deletion', 'app store'],
    'flows/form-submission': ['form', 'submit', 'survey', 'application', 'contact'],
    'flows/file-upload': ['upload', 'file', 'media', 'image', 'attachment', 'photo'],
  };

  function buildProject(brief, { include = [], max = 12 } = {}) {
    const b = ` ${brief.toLowerCase()} `;
    const scored = Object.entries(SIGNALS)
      .map(([id, words]) => ({ id, score: words.reduce((a, w) => a + (b.includes(w) ? (w.includes(' ') ? 3 : 2) : 0), 0) }))
      .filter((x) => x.score > 0 && byId.has(x.id))
      .sort((a, b2) => b2.score - a.score);
    const kitMatches = data.kits.filter((k) => b.includes(k.id.replace('-', ' ')) || k.title.toLowerCase().split(' ').some((w) => w.length > 4 && b.includes(` ${w} `)));
    const A11Y = 'design-system/accessibility';
    const ids = [...new Set([...include, ...scored.map((x) => x.id), ...kitMatches.flatMap((k) => k.checklists)])].filter((id) => byId.has(id) && id !== A11Y);
    // Accessibility foundations always apply, so they keep a slot regardless of max.
    return [...ids.slice(0, Math.max(max - 1, 0)), A11Y].map((id) => byId.get(id));
  }

  return { data, byId, catName, list, search, summary, toMarkdown, buildProject, filterItems };
}
