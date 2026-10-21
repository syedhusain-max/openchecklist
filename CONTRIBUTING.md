# Contributing

## Add or improve a checklist

1. Edit `data/checklists.json`. A checklist looks like:

   ```json
   {
     "id": "web-app/audit-log",
     "category": "web-app",
     "title": "Audit Log",
     "icon": "📜",
     "description": "One sentence on the job this screen does.",
     "items": [
       { "id": "filters", "title": "Filter by actor and date", "description": "What good looks like, in one or two sentences.", "priority": "must", "tags": ["ux"] }
     ]
   }
   ```

2. Rules (enforced by `npm run validate`):
   - `id` is `category/kebab-slug`; item ids are kebab-case and unique within the checklist.
   - `priority`: `must` (blocks launch), `should` (expected quality), `nice` (polish). At least one `must`.
   - `wcag` is optional, formatted like `2.5.8`, and only when the item maps to a real success criterion.
   - `tip` is optional — a practical aside, not a restatement.
3. Write it yourself. Don't paste content from other checklist sites or books.
4. Run `npm test`, then open a pull request.

## Code

- `web/` is dependency-free on purpose. Keep it that way unless there's a strong reason.
- MCP changes need a test in `mcp/test/`.
