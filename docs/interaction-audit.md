# Interaction audit — 2026-10-21

Method: Saffer's microinteraction framework (trigger, rules, feedback, loops), Cooper's excise and flow principles, and the peak-end rule.

| # | Interaction | Problem | Principle | Change |
|---|---|---|---|---|
| 1 | Reset progress, Delete project | Blocking `confirm()` before acting | Undo beats "Are you sure?" | Act immediately; toast with **Undo** (7s, paused while hovered) |
| 2 | New project dialog | Dialog closed, *then* errored if no checklist was picked, so the form was lost | Prevent errors (poka-yoke) | Create stays disabled until ≥1 checklist; label shows the count |
| 3 | Item notes | Silent autosave | Modeless feedback | "Saved ✓" status (polite live region) |
| 4 | Priority / hide-completed filters | Could leave an empty box | Avoid blank slates | Empty state with a one-click way back |
| 5 | Checking an item with "Hide completed" on | Item vanished before the tick was visible | Feedback before state change | Item stays 700ms, then fades out |
| 6 | Hover-to-preview | Preview flickered as the pointer crossed items | Hover intent | 140ms dwell before previewing |
| 7 | Reaching 100% | Confetti, then a dead end | Peak-end rule | Completion card: Export report, Copy share link, Next checklist (kit order) |

## Item state model

```
[todo] --check--> [done] --uncheck--> [todo]
[todo] --N/A----> [na]   --N/A------> [todo]
[done] --N/A----> [na]   (N/A items leave the progress denominator)
any    --reset--> [todo] --undo-----> previous state
```
