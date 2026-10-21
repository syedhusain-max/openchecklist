// A small fictional design system ("Flowly") used by every preview. Scoped to the preview shadow root.
export const PREVIEW_CSS = /* css */ `
:host { display: block; }
* { box-sizing: border-box; }
.oc-viewport { overflow: var(--oc-overflow, auto); max-height: var(--oc-max-h, 560px); border-radius: 14px; background: var(--oc-stage, #e9e6dc); padding: 0; }
.oc-scaler { position: relative; margin: 0 auto; }
.oc-frame { position: absolute; top: 0; left: 0; transform-origin: 0 0; container-type: inline-size; }
.oc-frame[inert] { pointer-events: none; }
.oc-overlay { position: absolute; inset: 0; pointer-events: none; }

.pv { --bg: #ffffff; --surface: #ffffff; --sunken: #f4f4f7; --text: #15151c; --muted: #5d5d6c; --border: #e3e3ea;
  --accent: #4f46e5; --accent-ink: #fff; --accent-soft: #eef0ff; --ok: #12805c; --ok-soft: #e3f6ee; --warn: #9a5b00; --warn-soft: #fff4dc;
  --bad: #c62a4a; --bad-soft: #fde8ec; --info: #1f6fb5; --info-soft: #e5f1fc; --radius: 10px; --focus: #4f46e5;
  font: 15px/1.5 Inter, system-ui, sans-serif; color: var(--text); background: var(--bg); min-height: 100px; }
.pv[data-theme="dark"] { --bg: #101016; --surface: #191921; --sunken: #22222c; --text: #f1f1f6; --muted: #a2a2b3; --border: #30303d;
  --accent: #8b84ff; --accent-ink: #0c0c12; --accent-soft: #24234a; --ok: #43d39b; --ok-soft: #12302a; --warn: #ffbf5a; --warn-soft: #33270f;
  --bad: #ff7390; --bad-soft: #3a1720; --info: #6db5ff; --info-soft: #132a40; --focus: #8b84ff; }
.pv h1, .pv h2, .pv h3, .pv h4, .pv p { margin: 0; }
.pv h1 { font-size: 44px; line-height: 1.1; letter-spacing: -0.02em; }
.pv h2 { font-size: 26px; line-height: 1.2; }
.pv h3 { font-size: 18px; }
.pv h4 { font-size: 15px; }
.pv a { color: var(--accent); }
.pv code, .pv pre { font: 12.5px/1.5 "JetBrains Mono", ui-monospace, monospace; }
.pad { padding: 28px; } .pad-sm { padding: 16px; }
.row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.between { justify-content: space-between; }
.stack { display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr); } .stack-lg { display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr); }
.grid2 { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid3 { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid4 { display: grid; gap: 16px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.center { text-align: center; justify-items: center; }
.muted { color: var(--muted); } .fine { font-size: 12.5px; color: var(--muted); } .small { font-size: 13.5px; }
.grow { flex: 1; } .w-full { width: 100%; }
.sunken { background: var(--sunken); }
.divider { height: 1px; background: var(--border); margin: 8px 0; }

/* Nav */
.pv-nav { display: flex; align-items: center; gap: 24px; padding: 16px 28px; border-bottom: 1px solid var(--border); }
.pv-nav .logo { font-weight: 800; font-size: 18px; }
.pv-nav .links { display: flex; gap: 20px; color: var(--muted); font-size: 14px; }

/* Buttons */
.pv-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; padding: 0 16px; border-radius: var(--radius);
  border: 1px solid var(--border); background: var(--surface); color: var(--text); font: 600 14px/1 Inter, system-ui, sans-serif; text-decoration: none; cursor: pointer; position: relative; transition: background .15s, transform .1s; white-space: nowrap; }
.pv-btn:hover, .pv-btn.is-hover { background: var(--sunken); }
.pv-btn:active, .pv-btn.is-active { transform: scale(.97); }
.pv-btn:focus-visible, .pv-btn.is-focus { outline: 3px solid var(--focus); outline-offset: 2px; }
.pv-btn.primary { background: var(--accent); color: var(--accent-ink); border-color: transparent; }
.pv-btn.primary:hover, .pv-btn.primary.is-hover { filter: brightness(1.08); }
.pv-btn.ghost { background: transparent; border-color: transparent; color: var(--accent); }
.pv-btn.danger { background: var(--bad); color: #fff; border-color: transparent; }
.pv-btn.danger-outline { color: var(--bad); border-color: var(--bad); background: transparent; }
.pv-btn.sm { min-height: 32px; padding: 0 12px; font-size: 13px; }
.pv-btn.lg { min-height: 48px; padding: 0 22px; font-size: 16px; }
.pv-btn.block { width: 100%; }
.pv-btn[disabled], .pv-btn.is-disabled { opacity: .45; cursor: not-allowed; }
.pv-btn.icon { width: 40px; padding: 0; }
.pv-btn.is-loading { color: transparent !important; pointer-events: none; }
.pv-btn.is-loading::after { content: ""; position: absolute; width: 16px; height: 16px; border-radius: 50%; border: 2px solid currentColor; border-color: var(--accent-ink) var(--accent-ink) transparent transparent; animation: spin .7s linear infinite; }
.pv-btn:not(.primary).is-loading::after { border-color: var(--text) var(--text) transparent transparent; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Forms */
.field { display: grid; gap: 6px; }
.field > label, .field .label { font-weight: 600; font-size: 13.5px; }
.field .opt { font-weight: 400; color: var(--muted); }
.pv-input { min-height: 42px; width: 100%; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); padding: 0 12px; font: 15px Inter, system-ui, sans-serif; }
.pv-input:hover, .pv-input.is-hover { border-color: color-mix(in srgb, var(--text) 35%, var(--border)); }
.pv-input:focus, .pv-input.is-focus { outline: 3px solid color-mix(in srgb, var(--focus) 35%, transparent); border-color: var(--focus); }
.pv-input[disabled] { background: var(--sunken); color: var(--muted); }
.pv-input[readonly] { background: var(--sunken); }
textarea.pv-input { min-height: 84px; padding: 10px 12px; resize: none; }
.field .help { font-size: 12.5px; color: var(--muted); }
.field.error .pv-input { border-color: var(--bad); }
.field .err { font-size: 12.5px; color: var(--bad); display: flex; gap: 6px; align-items: center; }
.field .err::before { content: "!"; display: inline-grid; place-items: center; width: 15px; height: 15px; border-radius: 50%; background: var(--bad); color: #fff; font-size: 10px; font-weight: 800; }
.input-wrap { position: relative; }
.input-wrap .pv-btn { position: absolute; right: 4px; top: 4px; min-height: 34px; }
.counter { font-size: 12px; color: var(--muted); text-align: right; }
.counter.near { color: var(--warn); font-weight: 600; }
.pv-check { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; }
.pv-check i { flex: none; width: 18px; height: 18px; border: 2px solid var(--border); border-radius: 5px; margin-top: 2px; }
.pv-check i.on { background: var(--accent); border-color: var(--accent); }
.pv-switch { width: 40px; height: 24px; border-radius: 999px; background: var(--border); position: relative; border: 0; cursor: pointer; flex: none; }
.pv-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .2s; box-shadow: 0 1px 2px rgb(0 0 0 / 25%); }
.pv-switch[aria-checked="true"] { background: var(--accent); }
.pv-switch[aria-checked="true"]::after { transform: translateX(16px); }
.select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%); background-position: calc(100% - 18px) 50%, calc(100% - 13px) 50%; background-size: 5px 5px; background-repeat: no-repeat; }

/* Surfaces */
.pv-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
.pv-card.flat { box-shadow: none; }
.pv-card.raised { box-shadow: 0 1px 2px rgb(0 0 0 / 6%), 0 12px 28px -14px rgb(0 0 0 / 25%); }
.pv-card.accent { border: 2px solid var(--accent); position: relative; }
.pv-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--sunken); color: var(--muted); }
.pv-badge.ok { background: var(--ok-soft); color: var(--ok); } .pv-badge.warn { background: var(--warn-soft); color: var(--warn); }
.pv-badge.bad { background: var(--bad-soft); color: var(--bad); } .pv-badge.info { background: var(--info-soft); color: var(--info); }
.pv-badge.accent { background: var(--accent); color: var(--accent-ink); }
.pv-banner { display: flex; gap: 12px; align-items: center; padding: 12px 16px; border-radius: var(--radius); font-size: 14px; }
.pv-banner.warn { background: var(--warn-soft); color: var(--warn); } .pv-banner.bad { background: var(--bad-soft); color: var(--bad); }
.pv-banner.info { background: var(--info-soft); color: var(--info); } .pv-banner.ok { background: var(--ok-soft); color: var(--ok); }
.pv-banner b { color: inherit; }
.pv-avatar { width: 32px; height: 32px; border-radius: 50%; display: inline-grid; place-items: center; font-weight: 700; font-size: 13px; background: var(--accent-soft); color: var(--accent); flex: none; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex: none; }
.spec { border: 1.5px dashed color-mix(in srgb, var(--muted) 55%, transparent); border-radius: 10px; padding: 10px 12px; background: var(--sunken); font-size: 12.5px; color: var(--muted); }
.spec code { color: var(--text); }
.spec b { color: var(--text); font-weight: 600; }
.kicker { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.img { background: linear-gradient(135deg, var(--accent-soft), color-mix(in srgb, var(--accent) 25%, var(--sunken))); border-radius: 12px; }
.line { height: 9px; border-radius: 5px; background: var(--border); }
.skel { background: linear-gradient(90deg, var(--sunken) 25%, var(--border) 50%, var(--sunken) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
@keyframes shimmer { to { background-position: -200% 0; } }

/* Table */
.pv-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.pv-table caption { text-align: left; font-weight: 700; padding-bottom: 10px; }
.pv-table th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); padding: 10px 12px; border-bottom: 1px solid var(--border); background: var(--sunken); position: sticky; top: 0; }
.pv-table td { padding: 11px 12px; border-bottom: 1px solid var(--border); }
.pv-table .num { text-align: right; font-variant-numeric: tabular-nums; }
.pv-table tr.sel td { background: var(--accent-soft); }

/* Tabs, stepper, progress */
.pv-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); }
.pv-tabs button { background: none; border: 0; padding: 10px 14px; font: 600 14px Inter, sans-serif; color: var(--muted); border-bottom: 2px solid transparent; cursor: pointer; }
.pv-tabs button[aria-selected="true"] { color: var(--text); border-color: var(--accent); }
.stepper { display: flex; gap: 8px; align-items: center; font-size: 13px; color: var(--muted); }
.stepper span { display: flex; gap: 6px; align-items: center; }
.stepper i { width: 22px; height: 22px; border-radius: 50%; display: inline-grid; place-items: center; font-style: normal; font-size: 12px; font-weight: 700; background: var(--sunken); }
.stepper .done i { background: var(--ok); color: #fff; } .stepper .now { color: var(--text); font-weight: 600; } .stepper .now i { background: var(--accent); color: var(--accent-ink); }
.stepper hr { flex: 1; border: 0; height: 2px; background: var(--border); min-width: 16px; }
.progress { height: 8px; border-radius: 999px; background: var(--sunken); overflow: hidden; }
.progress > i { display: block; height: 100%; background: var(--accent); border-radius: 999px; }
.progress.warn > i { background: var(--warn); }

/* Charts */
.bars { display: flex; align-items: flex-end; gap: 6px; height: 90px; }
.bars i { flex: 1; background: var(--accent); border-radius: 4px 4px 0 0; opacity: .85; }
.bars i:nth-child(even) { background: repeating-linear-gradient(45deg, var(--accent), var(--accent) 3px, color-mix(in srgb, var(--accent) 60%, var(--bg)) 3px, color-mix(in srgb, var(--accent) 60%, var(--bg)) 6px); }
.kpi .v { font-size: 28px; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.delta-up { color: var(--ok); font-size: 13px; font-weight: 600; } .delta-down { color: var(--bad); font-size: 13px; font-weight: 600; }

/* Layers: modal, toast, tooltip */
.pv-layer { display: none; }
.pv-layer.open { display: grid; }
.scrim { position: absolute; inset: 0; background: rgb(10 10 20 / 45%); place-items: center; z-index: 5; padding: 24px; }
.pv-modal { width: min(460px, 100%); background: var(--surface); border-radius: 16px; box-shadow: 0 30px 70px -20px rgb(0 0 0 / 50%); display: grid; max-height: 420px; }
.pv-modal > header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid var(--border); }
.pv-modal > .body { padding: 18px 20px; overflow: auto; }
.pv-modal > footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--border); }
.x { width: 32px; height: 32px; border-radius: 8px; border: 0; background: var(--sunken); color: var(--text); cursor: pointer; font-size: 16px; }
.sheet { position: absolute; inset: auto 0 0 0; background: var(--surface); border-radius: 20px 20px 0 0; padding: 12px 20px 24px; box-shadow: 0 -20px 50px -20px rgb(0 0 0 / 40%); z-index: 6; }
.sheet::before { content: ""; display: block; width: 40px; height: 5px; border-radius: 3px; background: var(--border); margin: 0 auto 14px; }
.toast-wrap { position: absolute; right: 20px; bottom: 20px; gap: 8px; z-index: 7; width: 340px; }
.toast-wrap.static { position: static; display: grid; width: auto; }
.pv-toast { display: flex; gap: 12px; align-items: center; padding: 12px 14px; border-radius: 12px; background: var(--text); color: var(--bg); font-size: 14px; box-shadow: 0 14px 30px -12px rgb(0 0 0 / 45%); animation: toast-in .3s cubic-bezier(.2,.8,.2,1); }
.pv-toast .pv-btn.ghost { color: color-mix(in srgb, var(--accent) 50%, var(--bg)); min-height: 28px; padding: 0 8px; }
.pv-toast .bar { position: absolute; }
@keyframes toast-in { from { opacity: 0; transform: translateY(10px); } }
.tip-host { position: relative; display: inline-flex; }
.pv-tooltip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: var(--text); color: var(--bg); font-size: 12.5px; padding: 6px 10px; border-radius: 8px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .15s; }
.pv-tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px; border: 5px solid transparent; border-top-color: var(--text); }
.pv-tooltip.below { bottom: auto; top: calc(100% + 8px); }
.pv-tooltip.below::after { top: auto; bottom: 100%; border-top-color: transparent; border-bottom-color: var(--text); }
.tip-host:hover .pv-tooltip, .tip-host:focus-within .pv-tooltip, .pv-tooltip.show { opacity: 1; pointer-events: auto; }
details.acc { border-bottom: 1px solid var(--border); }
details.acc summary { padding: 14px 0; font-weight: 600; cursor: pointer; list-style: none; display: flex; justify-content: space-between; }
details.acc summary::after { content: "+"; color: var(--muted); font-size: 18px; }
details.acc[open] summary::after { content: "–"; }
details.acc p { padding-bottom: 14px; color: var(--muted); font-size: 14px; }

/* Flows: screens side by side */
.flow { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 18px; padding: 24px; background: var(--sunken); }
.screen { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px; display: grid; gap: 12px; align-content: start; position: relative; }
.screen > .kicker:first-child { margin-bottom: 2px; }

/* Phone frame for mobile checklists */
.phone { border-radius: 44px; border: 10px solid #1b1b22; overflow: hidden; }
.phone .status { display: flex; justify-content: space-between; align-items: center; padding: 12px 22px 6px; font-size: 13px; font-weight: 600; }
.phone .island { width: 110px; height: 30px; border-radius: 20px; background: #000; }
.phone .home-ind { width: 130px; height: 5px; border-radius: 3px; background: var(--text); opacity: .8; margin: 10px auto 8px; }
.phone .screen-body { padding: 8px 20px 16px; display: grid; gap: 14px; position: relative; min-height: 600px; align-content: start; }
.tabbar { display: flex; justify-content: space-around; border-top: 1px solid var(--border); padding: 6px 4px 0; }
.tabbar button { background: none; border: 0; display: grid; justify-items: center; gap: 2px; min-width: 64px; min-height: 48px; font: 500 11px Inter, sans-serif; color: var(--muted); position: relative; cursor: pointer; }
.tabbar button svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; }
.tabbar button[aria-selected="true"] { color: var(--accent); font-weight: 700; }
.tabbar button[aria-selected="true"] svg { fill: var(--accent-soft); }
.tabbar .count { position: absolute; top: 2px; right: 14px; min-width: 16px; height: 16px; border-radius: 8px; background: var(--bad); color: #fff; font-size: 10px; display: grid; place-items: center; padding: 0 4px; }
.kbd-sim { background: var(--sunken); border-radius: 12px; padding: 8px; display: grid; gap: 6px; font-size: 13px; }
.kbd-sim .keys { display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; }
.kbd-sim .keys span { background: var(--surface); border-radius: 5px; text-align: center; padding: 6px 0; font-size: 12px; box-shadow: 0 1px 0 var(--border); }
.os-alert { background: color-mix(in srgb, var(--surface) 92%, var(--sunken)); border-radius: 16px; text-align: center; overflow: hidden; box-shadow: 0 20px 40px -10px rgb(0 0 0 / 40%); }
.os-alert p { padding: 14px 16px 12px; font-size: 13.5px; }
.os-alert .acts { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--border); }
.os-alert .acts span { padding: 11px; color: var(--info); font-weight: 600; font-size: 14px; }
.os-alert .acts span + span { border-left: 1px solid var(--border); }
.swatch { height: 44px; border-radius: 8px; display: flex; align-items: flex-end; padding: 4px 6px; font-size: 10.5px; font-weight: 600; }
.ramp { display: grid; grid-template-columns: repeat(9, 1fr); gap: 4px; }
.code-block { background: #15141b; color: #e8e6f2; border-radius: 10px; padding: 12px 14px; font: 12.5px/1.6 "JetBrains Mono", monospace; overflow-x: auto; white-space: pre; position: relative; }
.code-block .k { color: #c4a7ff; } .code-block .s { color: #b5e48c; } .code-block .c { color: #7d7a8c; }

/* App shell + responsive behaviour (container = the simulated device width) */
.app-shell { display: grid; grid-template-columns: var(--side, 220px) minmax(0, 1fr); }
.grid2.wide-first { grid-template-columns: 1.3fr 1fr; }
.pv * { min-width: 0; overflow-wrap: anywhere; }
@container (max-width: 900px) {
  .grid4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .flow { grid-auto-flow: row; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .app-shell { grid-template-columns: minmax(0, 1fr); }
  .app-shell > aside { display: flex; flex-wrap: wrap; align-items: center; }
}
@container (max-width: 600px) {
  .grid2, .grid3, .grid4, .grid2.wide-first, .flow { grid-template-columns: minmax(0, 1fr); }
  .pad { padding: 18px; }
  .pv h1 { font-size: 32px; } .pv h2 { font-size: 22px; }
  .pv-nav { padding: 12px 16px; gap: 12px; } .pv-nav .links { display: none; }
  .pv-btn { white-space: normal; text-align: center; line-height: 1.2; }
  .pv-table { font-size: 13px; } .pv-table th, .pv-table td { padding: 8px 6px; }
  .toast-wrap { left: 12px; right: 12px; width: auto; }
  .ramp { grid-template-columns: repeat(5, 1fr); }
}

/* Annotation overlay */
.oc-hl { outline: 3px solid #ff2d7a !important; outline-offset: 4px; border-radius: 8px; animation: oc-pulse 1.4s ease-out 2; position: relative; z-index: 4; }
@keyframes oc-pulse { 0% { box-shadow: 0 0 0 0 rgb(255 45 122 / 55%); } 100% { box-shadow: 0 0 0 18px rgb(255 45 122 / 0%); } }
.oc-label { position: absolute; transform: translateY(-100%) scale(calc(1 / var(--s, 1))); transform-origin: 0 100%; background: #ff2d7a; color: #fff; font: 600 12px/1.2 Inter, system-ui, sans-serif; padding: 5px 9px; border-radius: 6px 6px 6px 0; white-space: nowrap; z-index: 9; max-width: 420px; overflow: hidden; text-overflow: ellipsis; }
.oc-badge { position: absolute; pointer-events: auto; transform: translate(-40%, -40%) scale(calc(1 / var(--s, 1))); width: 24px; height: 24px; border-radius: 50%; border: 2px solid #fff; background: #ff2d7a; color: #fff; font: 700 12px Inter, sans-serif; cursor: pointer; z-index: 9; box-shadow: 0 2px 6px rgb(0 0 0 / 30%); }
.oc-xray [data-check] { outline: 1.5px dashed rgb(255 45 122 / 60%); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;
