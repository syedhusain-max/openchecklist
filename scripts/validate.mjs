// Validates data/checklists.json. Zero dependencies so contributors can run it anywhere.
import { readFileSync } from 'node:fs';

const path = new URL('../data/checklists.json', import.meta.url);
const data = JSON.parse(readFileSync(path, 'utf8'));
const errors = [];
const PRIORITIES = new Set(['must', 'should', 'nice']);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const cats = new Set(data.categories.map((c) => c.id));
const ids = new Set();
for (const c of data.checklists) {
  const where = `checklist ${c.id}`;
  if (ids.has(c.id)) errors.push(`${where}: duplicate id`);
  ids.add(c.id);
  const [cat, slug] = c.id.split('/');
  if (cat !== c.category) errors.push(`${where}: id prefix must equal category "${c.category}"`);
  if (!cats.has(c.category)) errors.push(`${where}: unknown category`);
  if (!SLUG.test(slug ?? '')) errors.push(`${where}: slug must be kebab-case`);
  for (const k of ['title', 'description', 'icon']) if (!c[k]) errors.push(`${where}: missing ${k}`);
  if (!Array.isArray(c.items) || c.items.length < 3) errors.push(`${where}: needs at least 3 items`);
  const itemIds = new Set();
  for (const it of c.items ?? []) {
    const w = `${where} item ${it.id}`;
    if (!SLUG.test(it.id ?? '')) errors.push(`${w}: id must be kebab-case`);
    if (itemIds.has(it.id)) errors.push(`${w}: duplicate item id`);
    itemIds.add(it.id);
    if (!it.title || !it.description) errors.push(`${w}: title and description required`);
    if (!PRIORITIES.has(it.priority)) errors.push(`${w}: priority must be must|should|nice`);
    if (it.wcag && !/^\d\.\d+\.\d+$/.test(it.wcag)) errors.push(`${w}: wcag must look like 1.4.3`);
  }
  if (!c.items?.some((it) => it.priority === 'must')) errors.push(`${where}: needs at least one "must" item`);
}
for (const k of data.kits) for (const id of k.checklists) if (!ids.has(id)) errors.push(`kit ${k.id}: unknown checklist ${id}`);

// Every checklist needs a live preview, and every item must be annotated in it.
const { PREVIEWS } = await import('../web/previews.js');
let anchored = 0;
for (const c of data.checklists) {
  const html = PREVIEWS[c.id];
  if (!html) { errors.push(`checklist ${c.id}: no preview in web/previews.js`); continue; }
  const annotated = new Set([...html.matchAll(/data-check="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));
  for (const it of c.items) {
    if (annotated.has(it.id)) anchored++;
    else errors.push(`checklist ${c.id}: item "${it.id}" has no data-check anchor in its preview`);
  }
  for (const a of annotated) if (!c.items.some((it) => it.id === a)) errors.push(`checklist ${c.id}: preview anchor "${a}" matches no item`);
}
for (const id of Object.keys(PREVIEWS)) if (!ids.has(id)) errors.push(`preview ${id}: no matching checklist`);

const items = data.checklists.reduce((a, c) => a + c.items.length, 0);
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${data.checklists.length} checklists, ${items} items, ${data.kits.length} kits, ${anchored}/${items} items previewed — valid`);
