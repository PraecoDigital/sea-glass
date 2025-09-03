# BadBudget UI/UX Improvement Recommendations

These recommendations are tailored to the current codebase (React + Tailwind + Recharts + Supabase) and aim to improve usability, accessibility, and visual polish.

## Quick Wins
- Add global theme toggle placement in the header across `Login`, `SignUp`, and the app shell
- Increase button hit area to 44×44px and add `aria-busy` on async actions
- Add currency input masking (e.g., 1,234.56) and validation hints
- Persist dark mode preference to localStorage and respect system `prefers-color-scheme`

## Navigation & Structure
- Introduce a simple top navigation with app name, quick actions, profile menu
- Ensure consistent page titles and breadcrumbs (visually subtle) for orientation

## Onboarding Enhancements
- Add stepper with labeled steps and dynamic validation summaries
- Autosave per step; restore state after refresh
- Provide example values and helper text for income and goals

## Dashboard Enhancements
- KPI cards with small trend indicators (caret up/down) and semantic colors
- Benchmarks section: progress bars with thresholds and clear messages
- Charts: improve tooltip formatting to show currency and percentages; add accessible descriptions

## Forms & Inputs
- Standardize error presentation under fields with red-600 text and icon
- Add helper text under complex fields explaining impact (e.g., investment min/max)
- Use consistent spacing between fields (24px) and sections (32–40px)

## Accessibility
- Ensure focus visibility on all interactive elements (use Tailwind ring utilities)
- Provide ARIA labels for icon-only buttons (e.g., close, theme toggle)
- Add `aria-live` regions for save confirmations and error messages
- Verify color contrast in both themes (≥ 4.5:1 text; ≥ 3:1 UI components)

## Performance
- Code-split heavy pages (Dashboard) if needed and lazy-load charts
- Debounce expense inputs and filters by 250ms to avoid unnecessary renders
- Memoize chart data transforms

## Visual Polish
- Use consistent card padding (24px) and header/body/footer segmentation
- Adopt 8px radius everywhere; use `shadow-sm` default and `shadow-md` on hover
- Harmonize color usage: reserve `primary` for key actions, `accent` for success

## Documentation & Governance
- Keep `DesignSystem.md` and `DesignSpecifications.md` in `docs/` and update on changes
- Add Storybook (optional) for component snapshots and accessibility checks

## Implementation Suggestions
- Create shared components: `Button`, `Input`, `Card`, `KpiCard`, `ProgressBar`, `ChartWrapper`
- Extract tailwind class compositions into reusable component wrappers to reduce duplication
- Add unit tests for formatting utilities (currency, percentage)

