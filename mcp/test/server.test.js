import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const serverPath = fileURLToPath(new URL('../index.js', import.meta.url));
let client;

before(async () => {
  client = new Client({ name: 'test', version: '0.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [serverPath] }));
});
after(async () => { await client.close(); });

test('lists all tools', async () => {
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), ['build_project_checklist', 'generate_design_brief', 'get_checklist', 'list_checklists', 'list_kits', 'review_design', 'search_checklists']);
});

test('get_checklist returns markdown filtered by priority', async () => {
  const r = await client.callTool({ name: 'get_checklist', arguments: { id: 'design-system/modal', min_priority: 'must' } });
  const t = r.content[0].text;
  assert.match(t, /Focus managed/);
  assert.doesNotMatch(t, /_\(should/);
});

test('unknown checklist is an error with guidance', async () => {
  const r = await client.callTool({ name: 'get_checklist', arguments: { id: 'nope/nope' } });
  assert.equal(r.isError, true);
  assert.match(r.content[0].text, /search_checklists/);
});

test('search finds items by WCAG criterion', async () => {
  const r = await client.callTool({ name: 'search_checklists', arguments: { query: 'wcag 2.5.8' } });
  const hits = JSON.parse(r.content[0].text);
  assert.ok(hits.some((h) => h.wcag === '2.5.8'));
});

test('build_project_checklist routes a SaaS brief', async () => {
  const r = await client.callTool({ name: 'build_project_checklist', arguments: { brief: 'SaaS dashboard with billing and a pricing page' } });
  const t = r.content[0].text;
  for (const id of ['web-app/dashboard', 'web-app/billing', 'website/pricing', 'design-system/accessibility']) assert.match(t, new RegExp(id));
});

test('review_design returns a rubric', async () => {
  const r = await client.callTool({ name: 'review_design', arguments: { checklist_ids: ['flows/checkout'], context: 'checkout.png' } });
  const body = JSON.parse(r.content[0].text);
  assert.ok(body.rubric.length >= 5);
  assert.ok(body.rubric.every((x) => x.ref.startsWith('flows/checkout#')));
});

test('resources and prompts are exposed', async () => {
  const { resources } = await client.listResources();
  assert.ok(resources.some((r) => r.uri === 'checklist://web-app/dashboard'));
  const res = await client.readResource({ uri: 'checklist://web-app/dashboard' });
  assert.match(res.contents[0].text, /Dashboard/);
  const { prompts } = await client.listPrompts();
  assert.deepEqual(prompts.map((p) => p.name).sort(), ['build-with-checklist', 'design-review']);
});
