# Baseline audit — checklist.design (2026-10-21)

Scope: public site https://www.checklist.design/ (home + `/web-app/dashboard`), observed in the in-app browser and from the shipped bundle. Decision status for every finding: **observed**. Nothing here is an approved standard.

## Stack (reverse-engineered)
| Finding | Evidence |
|---|---|
| React SPA built with Vite, Tailwind v4, Supabase backend | `home.html` loads `/assets/index-CsBnuv4f.js`, `react-vendor-*.js`, `supabase-*.js`; CSS uses `--tw-*` vars |
| Routes `/`, `/browse`, `/:category`, `/:category/:slug`, `/plugin`, `/skill`, `/about`, `/privacy`, `/terms`, `/admin/*` | `path:"…"` literals in `index.js` |
| Supabase project `qbvdnsyfihtqsnbioyoa.supabase.co`, tables `categories`, `checklists` | `extract_endpoints.py` on bundle |
| Progress stored only in `localStorage` (`cd-detail-v3-<category>-<slug>`) | `Object.keys(localStorage)` on detail page |
| Data model: category → checklist (icon, title, description) → item (title, description, optional tip) | detail page DOM/screenshot |
| 129 checklists across Mobile, Web app, Website, Design system, Flows | home page "Browse all 129 checklists" |

## Findings
| ID | Category | Finding | Evidence | Impact |
|---|---|---|---|---|
| A-01 | a11y | Item checkboxes are `<button>` 20×20px with no visible checkbox role in markup sample | `size-[20px]` button outerHTML | Below 24px target (WCAG 2.5.8) |
| A-02 | a11y | Only 2 headings on a detail page; items are not headings/list items | `h1,h2,h3` count = 2 | Hard to skim with a screen reader |
| A-03 | theming | No dark theme even when OS prefers dark | `prefers-color-scheme: dark` true, body bg `rgb(244,243,238)` | Eye strain, inconsistent with OS |
| A-04 | perf | Content is fully client-rendered; detail page shows skeleton until data loads | screenshot after 3s on direct load showed only skeleton | Slow/blank first paint, weak SEO |
| P-01 | product | One checklist at a time; no way to combine checklists for a whole project | UI walkthrough | Users rebuild the same set per project |
| P-02 | product | No priority/severity, tags, or standards references on items | detail page | Can't triage "must ship" vs "nice" |
| P-03 | product | Binary done/not-done; no "not applicable" or notes | detail page | Progress lies when an item doesn't apply |
| P-04 | product | No export (Markdown/CSV/JSON) or shareable state | UI walkthrough | Can't hand results to a team or ticket |
| P-05 | openness | Content is closed (Supabase), no public schema or contribution path | bundle + site | No community growth, no offline use |
| P-06 | AI | AI features are Figma-plugin only; no MCP / open API | `/plugin`, `/skill` routes | Agents can't query checklists directly |
