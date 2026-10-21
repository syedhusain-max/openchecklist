# OpenChecklist

Open-source design checklists for **websites, web apps, mobile, design-system components and flows** — for people in the browser and for AI agents over **MCP**.

Inspired by [checklist.design](https://www.checklist.design/). All checklist content in this repo is original and MIT-licensed.

## What's better

| | checklist.design | OpenChecklist |
|---|---|---|
| **Live preview of every checklist** — working example UI, each item pinned to its element, desktop/tablet/phone, light/dark | — | ✓ (229/229 items) |
| Item priority (must / should / nice) + filters | — | ✓ |
| WCAG 2.2 references linked per item | — | ✓ |
| "Not applicable" state + per-item notes | — | ✓ (N/A excluded from progress) |
| Projects combining many checklists, tracked separately | — | ✓ |
| Starter kits (Landing page, SaaS, Mobile MVP, Design system, E-commerce) | — | ✓ |
| Export Markdown / CSV / JSON, shareable state links | — | ✓ |
| "Copy AI review prompt" for any LLM | — | ✓ |
| MCP server (Claude, Cursor, Windsurf, VS Code…) | — | ✓ |
| Command palette (⌘K, `/`), keyboard checking (`j` `k` `x` `n`) | — | ✓ |
| Dark mode, 44px touch targets, real checkbox semantics | — | ✓ |
| Open data + schema + validator for contributions | — | ✓ |
| No backend: static site, works offline once loaded | — | ✓ |

## Quick start

```bash
npm start          # http://localhost:4321  (serves web/, syncs data)
npm test           # validates data + runs MCP server tests
```

The web app is plain HTML/CSS/JS in [`web/`](web/) — no build step. Deploy `web/` to GitHub Pages, Netlify or any static host (run `npm run sync` first so `web/checklists.json` is current).

## MCP server

```bash
cd mcp && npm install
```

**Claude Code**

```bash
claude mcp add openchecklist -- node /absolute/path/to/openchecklist/mcp/index.js
```

**Claude Desktop / Cursor / Windsurf / VS Code** — add to the client's MCP config:

```json
{
  "mcpServers": {
    "openchecklist": { "command": "node", "args": ["/absolute/path/to/openchecklist/mcp/index.js"] }
  }
}
```

| Tool | Purpose |
|---|---|
| `list_checklists` | List checklists, optionally by category |
| `search_checklists` | Search titles, items, tags, WCAG criteria |
| `get_checklist` | One checklist as Markdown or JSON, filtered by minimum priority |
| `list_kits` | Starter kits |
| `build_project_checklist` | Plain-English brief → merged project checklist (accessibility always included) |
| `review_design` | Structured PASS/FAIL/N/A rubric for reviewing a screen |
| `generate_design_brief` | Acceptance criteria for building one page/component/flow |

Also: resources at `checklist://{category}/{slug}` and prompts `design-review`, `build-with-checklist`.
Set `OPENCHECKLIST_DATA=/path/to/checklists.json` to point the server at your own fork's data.

## Repo layout

```
data/checklists.json   single source of truth (categories, checklists, kits)
data/schema.json       JSON Schema for editors
scripts/validate.mjs   data validator (npm run validate)
scripts/serve.mjs      local static server
web/                   the site (index.html, styles.css, app.js)
web/previews.js        live preview template per checklist (data-check anchors)
web/preview-engine.js  shadow-DOM renderer: device scaling, highlights, X-ray
web/preview-styles.js  the preview design system
mcp/                   MCP server (index.js, lib.js, tests)
```

## Live previews

Every checklist renders a working example UI built from a small preview design system. Each element that satisfies an item carries `data-check="<item-id>"`. Hovering an item, pressing **p**, or clicking **👁 Preview** highlights that element. **Show all checks** numbers every anchored element, and **Expand** opens a full-screen inspector. Mobile checklists render in a phone frame. Everything else can switch between desktop (1200px), tablet (768px) and phone (390px) widths, which the preview CSS responds to through container queries. `npm run validate` fails if any item lacks an anchor.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding a checklist is one JSON object and a pull request.

## License

MIT
