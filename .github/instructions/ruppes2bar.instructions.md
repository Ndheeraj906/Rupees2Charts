---
description: "Use when editing, extending, or generating code for the Ruppes2Bar project. Covers HTML/Bootstrap conventions, vanilla JS style, Chart.js patterns, and project-wide rules for currency formatting and month handling."
applyTo: "**/*.{html,js,css}"
---
# Ruppes2Bar — Project Coding Guidelines

## Project Overview
Ruppes2Bar is a browser-only (no build step, no framework) monthly income & expense tracker. It renders a Bootstrap 5 UI and a Chart.js bar chart. All logic lives in `script.js`; markup lives in `index.html`.

## Key Patterns and styles in this project follow specific patterns to maintain consistency, readability, and ease of maintenance. When
working on this codebase, please adhere to the following guidelines:
### UI Elements 
 All buttons must be in better advanced UI and Must be in relevent Colors and must be in good agline. 
---

## HTML / Bootstrap Rules

- Use **Bootstrap 5.3.3** CDN classes exclusively — do not write custom CSS for layout, spacing, or colour unless Bootstrap has no equivalent.
- Structure: dark navbar → `.container` → `.nav-tabs` → `.tab-content` → `.card`.
- Table pattern: `table table-hover table-bordered mb-0` inside a `div.table-responsive`.
- Input fields inside table cells must use `<input type="number" class="form-control" min="0" step="any">`.
- Element IDs for monthly inputs follow the pattern `income-{Month}` and `expense-{Month}` (three-letter month abbreviation, capitalised first letter, e.g. `income-Jan`).
- Totals footer row uses class `totals-row`; its cells use `id="total-income"` and `id="total-expenses"`.
- Never add inline `style` attributes except for canvas/chart dimensions.

---

## JavaScript Style

- **Vanilla JS only** — no jQuery, no framework, no build tools.
- Use `const` for variables that are never reassigned; `let` otherwise. Never use `var`.
- The canonical month list is the `MONTHS` constant: `['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']`. Do not hardcode month strings elsewhere.
- DOM reads for monthly values must use `MONTHS.map(...)` loops — never unroll month logic into 12 separate statements.
- Functions must be named in **camelCase** and be focused on a single concern (e.g. `getValues`, `updateTotals`, `updateChart`).
- Initialise the Chart.js instance inside `window.onload` and store it in the module-scoped `chart` variable.

---

## Currency Formatting

- The currency is **South African Rand**. Always prefix amounts with `R ` (capital R, one space).
- Display format: `'R ' + value.toFixed(2)` for totals, `'R ' + value.toLocaleString()` for axis tick labels.
- Input fields accept raw numbers; formatting is applied only on display/output.
- Never use a currency symbol other than `R`; do not use `ZAR` in UI-facing text.

---

## Chart.js Conventions

- Chart type: `bar` (grouped, not stacked unless explicitly requested).
- Dataset order: Income first, Expenses second.
- **Income colour**: `rgba(40, 167, 69, 0.75)` fill / `rgba(40, 167, 69, 1)` border (Bootstrap success green).
- **Expenses colour**: `rgba(220, 53, 69, 0.75)` fill / `rgba(220, 53, 69, 1)` border (Bootstrap danger red).
- Always set `beginAtZero: true` on the y-axis.
- Y-axis tick callback must format values as `'R ' + value.toLocaleString()`.
- Chart title: `'Monthly Income vs Expenses (R)'`.
- Legend position: `'top'`.
- Call `chart.update()` after mutating dataset arrays; do not recreate the chart instance on every update.

---

## File Structure

```
index.html      ← All markup and Bootstrap/Chart.js CDN links
script.js       ← All application logic
```

- Do not introduce additional JS files unless explicitly asked.
- Do not introduce a CSS file for rules that can be expressed with Bootstrap utilities.
- Chart.js and Bootstrap must be loaded from CDN; do not bundle them.
