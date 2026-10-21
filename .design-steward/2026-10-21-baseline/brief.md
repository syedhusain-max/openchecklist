# Brief — OpenChecklist

Proposed (not approved standards). Issue IDs reference `canon-report.md`.

## Goal
An open-source (MIT) design-checklist library that is better than checklist.design for actually building websites, web apps, mobile apps, components and flows — usable by people in the browser and by AI agents through MCP.

## Requested changes
| Issue | Change | Acceptance |
|---|---|---|
| A-01 | Real checkbox semantics, ≥24px hit area | Checkbox controls are `role="checkbox"` with `aria-checked`; hit area ≥ 24×24 |
| A-02 | Items rendered as an ordered list with headings | Each item title is an `h3` inside `li` |
| A-03 | Light + dark themes, honour OS, manual toggle | `prefers-color-scheme` respected; toggle persists |
| A-04 | No backend; content shipped as static JSON | Detail page renders without any network call besides `checklists.json` |
| P-01 | Projects + starter kits (Landing page, SaaS, Mobile MVP, Design system, E-commerce) | A user can create a project from a kit or hand-picked checklists and see aggregate progress |
| P-02 | Every item has priority (must/should/nice), tags, optional WCAG ref; filters | Filter "must only" hides the rest |
| P-03 | Three states: todo / done / N/A, plus per-item notes | N/A items excluded from progress denominator |
| P-04 | Export Markdown/CSV/JSON, "copy as AI review prompt", shareable link | Exports download; share link restores state |
| P-05 | Data in `data/checklists.json` with JSON Schema + CONTRIBUTING | `npm run validate` passes |
| P-06 | MCP server exposing list/search/get/kit/project/review tools, resources and prompts | MCP `tools/list` returns the tools over stdio |

## Unresolved
- Content is newly written, not copied — coverage is smaller than 129 at launch (P2, TODO: grow via contributions).
- Figma plugin parity is out of scope.
- Animated components from the AnimatedWebs library were unavailable (MCP not authorized); animations are hand-built.
