#!/usr/bin/env node
// OpenChecklist MCP server (stdio). Exposes the checklist library as tools, resources and prompts.
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createLibrary, PRIORITIES } from './lib.js';

const lib = createLibrary();
const { data, byId } = lib;
const categoryIds = data.categories.map((c) => c.id);

const text = (t) => ({ content: [{ type: 'text', text: t }] });
const json = (v) => text(JSON.stringify(v, null, 2));
const notFound = (id) => ({ isError: true, ...text(`Unknown checklist "${id}". Call list_checklists or search_checklists to find valid ids (format: category/slug).`) });

const server = new McpServer({ name: 'openchecklist', version: '1.0.0' });

server.registerTool('list_checklists', {
  title: 'List checklists',
  description: `List design checklists. Categories: ${categoryIds.join(', ')}. Returns id, title, item counts.`,
  inputSchema: { category: z.enum(categoryIds).optional().describe('Only this category') },
  annotations: { readOnlyHint: true },
}, async ({ category }) => json({ categories: data.categories.map(({ id, name }) => ({ id, name })), checklists: lib.list(category) }));

server.registerTool('search_checklists', {
  title: 'Search checklists',
  description: 'Full-text search across checklist titles, item titles, descriptions, tags and WCAG criteria (e.g. "modal focus", "wcag 2.5.8", "pricing tax").',
  inputSchema: { query: z.string().min(1), limit: z.number().int().min(1).max(50).default(10) },
  annotations: { readOnlyHint: true },
}, async ({ query, limit }) => json(lib.search(query, limit)));

server.registerTool('get_checklist', {
  title: 'Get checklist',
  description: 'Get one checklist with every item (title, description, priority, tags, WCAG reference, tip).',
  inputSchema: {
    id: z.string().describe('Checklist id, e.g. "web-app/dashboard"'),
    format: z.enum(['markdown', 'json']).default('markdown'),
    min_priority: z.enum(PRIORITIES).default('nice').describe('"must" returns only launch blockers; "should" returns must+should'),
  },
  annotations: { readOnlyHint: true },
}, async ({ id, format, min_priority }) => {
  const c = byId.get(id);
  if (!c) return notFound(id);
  if (format === 'json') return json({ ...c, items: lib.filterItems(c, min_priority) });
  return text(lib.toMarkdown([c], { title: `${c.title} checklist`, minPriority: min_priority }));
});

server.registerTool('list_kits', {
  title: 'List starter kits',
  description: 'Starter kits bundle checklists for a common build (landing page, SaaS web app, mobile MVP, design system, e-commerce).',
  inputSchema: {},
  annotations: { readOnlyHint: true },
}, async () => json(data.kits));

server.registerTool('build_project_checklist', {
  title: 'Build project checklist',
  description: 'Turn a plain-English brief ("SaaS dashboard with billing and team invites", "iOS habit tracker with paywall") into one merged checklist to follow while designing or coding. Call this before building a website, web app, mobile screen, component or flow.',
  inputSchema: {
    brief: z.string().min(3).describe('What is being built'),
    kit: z.string().optional().describe('Optional kit id to include in full'),
    include: z.array(z.string()).optional().describe('Extra checklist ids to include'),
    min_priority: z.enum(PRIORITIES).default('should'),
    max_checklists: z.number().int().min(1).max(30).default(10),
  },
  annotations: { readOnlyHint: true },
}, async ({ brief, kit, include = [], min_priority, max_checklists }) => {
  const kitIds = kit ? data.kits.find((k) => k.id === kit)?.checklists ?? [] : [];
  const lists = lib.buildProject(brief, { include: [...include, ...kitIds], max: max_checklists });
  const header = `Selected ${lists.length} checklists for: "${brief}"\nIds: ${lists.map((c) => c.id).join(', ')}\n\nUse every **must** item as acceptance criteria. Report which items you satisfied when you finish.\n\n`;
  return text(header + lib.toMarkdown(lists, { title: 'Project checklist', minPriority: min_priority, withTips: false }));
});

server.registerTool('review_design', {
  title: 'Review design against checklists',
  description: 'Returns a structured review rubric for a screen, component or flow. Use it to audit a screenshot, URL, Figma frame or code you can see, then answer each item with PASS / FAIL / N/A, evidence and a fix.',
  inputSchema: {
    checklist_ids: z.array(z.string()).min(1).describe('Checklists to review against'),
    context: z.string().optional().describe('What is being reviewed (screen name, URL, file path)'),
    min_priority: z.enum(PRIORITIES).default('should'),
  },
  annotations: { readOnlyHint: true },
}, async ({ checklist_ids, context, min_priority }) => {
  const missing = checklist_ids.filter((id) => !byId.has(id));
  if (missing.length) return notFound(missing.join(', '));
  const lists = checklist_ids.map((id) => byId.get(id));
  const rubric = lists.flatMap((c) => lib.filterItems(c, min_priority).map((it) => ({ ref: `${c.id}#${it.id}`, check: it.title, criterion: it.description, priority: it.priority, wcag: it.wcag })));
  return json({
    reviewing: context ?? 'unspecified',
    instructions: 'For each rubric entry return {ref, verdict: PASS|FAIL|N/A, evidence, fix?}. Evidence must point to a specific element. Order FAILs by priority (must first) and end with the top 3 fixes.',
    rubric,
  });
});

server.registerTool('generate_design_brief', {
  title: 'Generate design brief',
  description: 'Generate acceptance criteria for building a specific page, component or flow, grouped by priority. Ideal right before writing UI code.',
  inputSchema: { id: z.string().describe('Checklist id to build from'), product: z.string().optional().describe('Product/context to tailor the brief to') },
  annotations: { readOnlyHint: true },
}, async ({ id, product }) => {
  const c = byId.get(id);
  if (!c) return notFound(id);
  let md = `# Build brief: ${c.title} (${lib.catName(c.category)})${product ? ` for ${product}` : ''}\n\nGoal: ${c.description}\n`;
  for (const p of PRIORITIES) {
    const items = c.items.filter((i) => i.priority === p);
    if (!items.length) continue;
    md += `\n## ${p === 'must' ? 'Must (acceptance criteria)' : p === 'should' ? 'Should (expected quality)' : 'Nice to have'}\n`;
    items.forEach((it) => { md += `- [ ] ${it.title}: ${it.description}${it.wcag ? ` — verify WCAG ${it.wcag}` : ''}\n`; });
  }
  md += `\n## States to design\nDefault, loading, empty, error, success, and small-screen (320–375px) layouts.\n`;
  return text(md);
});

// Resources: every checklist as markdown.
server.registerResource('checklist', new ResourceTemplate('checklist://{category}/{slug}', {
  list: async () => ({ resources: data.checklists.map((c) => ({ uri: `checklist://${c.id}`, name: `${c.title} (${lib.catName(c.category)})`, description: c.description, mimeType: 'text/markdown' })) }),
}), { title: 'Design checklist', description: 'A design checklist rendered as Markdown', mimeType: 'text/markdown' },
async (uri, { category, slug }) => {
  const c = byId.get(`${category}/${slug}`);
  if (!c) throw new Error(`Unknown checklist ${category}/${slug}`);
  return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: lib.toMarkdown([c], { title: c.title }) }] };
});

server.registerPrompt('design-review', {
  title: 'Design review',
  description: 'Review a design against an OpenChecklist checklist',
  argsSchema: { checklist_id: z.string(), what: z.string().optional() },
}, ({ checklist_id, what }) => {
  const c = byId.get(checklist_id);
  const body = c ? lib.toMarkdown([c], { title: c.title }) : `Checklist "${checklist_id}" not found — call search_checklists first.`;
  return { messages: [{ role: 'user', content: { type: 'text', text: `Review ${what ?? 'the design I share next'} against this checklist. For each item give PASS / FAIL / N/A with evidence and a concrete fix. Must items first, then the top 3 fixes.\n\n${body}` } }] };
});

server.registerPrompt('build-with-checklist', {
  title: 'Build with checklist',
  description: 'Build a website, app screen, component or flow that satisfies the relevant checklists',
  argsSchema: { brief: z.string() },
}, ({ brief }) => {
  const lists = lib.buildProject(brief, { max: 8 });
  return { messages: [{ role: 'user', content: { type: 'text', text: `Build: ${brief}\n\nTreat every "must" item below as an acceptance criterion and every "should" item as expected quality. When done, list each must item and how it was satisfied.\n\n${lib.toMarkdown(lists, { minPriority: 'should', withTips: false })}` } }] };
});

await server.connect(new StdioServerTransport());
