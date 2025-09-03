# BadBudget Design System

This design system defines the visual language, components, and interaction patterns for BadBudget. It aligns with the current React + TypeScript + Tailwind CSS stack and supports dark mode.

## Principles
- Clarity over cleverness
- Reduce cognitive load
- Consistent and predictable interactions
- Accessible by default (WCAG 2.1 AA)
- Mobile-first, responsive at all breakpoints

## Design Tokens

### Color Palette
- Primary (brand): `primary-50…900` from Tailwind theme
- Accent (positive): `accent-50…900` from Tailwind theme
- Neutral: Tailwind gray scale for surfaces and text
- Semantic:
  - Success: `accent-600`
  - Warning: `#F59E0B` (amber-500)
  - Error: `#EF4444` (red-500)
  - Info: `primary-500`

Light mode surfaces
- Background: `#FFFFFF`
- Surface: `#FFFFFF`
- Border: `#E5E7EB` (gray-200)
- Text primary: `#111827` (gray-900)
- Text secondary: `#6B7280` (gray-500)

Dark mode surfaces
- Background: `#0F172A`–`#111827`
- Surface: `#1F2937` (gray-800)
- Border: `#374151` (gray-700)
- Text primary: `#F9FAFB` (gray-50)
- Text secondary: `#D1D5DB` (gray-300)

### Typography
- Font family: `Inter, system-ui, sans-serif`
- Sizes (rem): 3.0, 2.25, 1.5, 1.25, 1.125, 1.0, 0.875
- Weights: 700 (bold), 600 (semibold), 500 (medium), 400 (regular)
- Line height: 1.25–1.6 depending on size

### Spacing
- Scale: 4px base unit (Tailwind spacing scale)
- Container gutters: 16px mobile, 24px tablet, 32px desktop

### Radii and Elevation
- Radius: 8px default, 12px for cards, 9999px for pills
- Shadows: subtle shadow for default, medium on hover (Tailwind shadow-sm/md)

### Motion
- Durations: 150–300ms
- Easing: `ease-out` for enter, `ease-in` for exit
- Keyframes: `fade-in`, `slide-up`, `scale-in` (as defined in Tailwind config)

## Grid and Layout
- Breakpoints: Tailwind defaults (sm, md, lg, xl, 2xl)
- Max content width: 1200px for wide screens
- Page structure: header (nav), main content with sections, footer (optional)
- Card grid: responsive 1 → 2 → 3 columns across breakpoints

## Components

### Buttons
Variants
- Primary: solid brand `btn-primary`
- Secondary: neutral outline `btn-secondary`
- Tertiary: text button (link style)

States
- Default, hover, focus-visible, active, disabled, loading

Accessibility
- Minimum target size 44×44px
- Visible focus ring `focus:ring-primary-500`
- Use `aria-busy=true` for loading state

### Inputs
- Text, number, select, date
- Base class: `.input-field`
- States: default, hover, focus, invalid, disabled
- Labels always visible; placeholders are not labels
- Help text and error text below field (12–14px)

Validation
- Error border: red-500, message red-600
- Success border: accent-500 when confirmed

### Cards
- Base classes: `.card` + `.card-hover`
- Structure: header (title, actions), body (content), footer (secondary actions)

### Navigation
- Top bar with app name and actions (Sign In/Out, Theme toggle)
- Current page has clear state; avoid ambiguous hover-only cues

### Charts
- Use Recharts with accessible labels and legends
- Provide textual summaries for screen readers
- Colors: primary/accent for positive, amber/red for warnings/overages

### Alerts
- Info: primary-50/500
- Success: accent-50/600
- Warning: amber-50/500
- Error: red-50/600

### Empty States
- Brief explanation, friendly illustration/icon, and a primary call-to-action

## Patterns

### Onboarding
- 3 steps: Income & Goals → Fixed Expenses → Review
- Progress indicator and ability to go back
- Save state between steps

### Dashboard
- Hero summary: Income, Fixed, Variable, Investment with trend indicators
- Visualizations: pie/donut for allocation, bars for monthly spend
- Benchmarks with color-coded statuses

### Forms
- Group related fields with section headers
- Use input masks for currency and percentages
- Keyboard-friendly tab order; Enter to submit

## Accessibility Guidelines
- Color contrast ≥ 4.5:1 for text, 3:1 for large text and UI icons
- Focus visible at all times; never removed
- Provide ARIA labels for icons-only buttons
- Support prefers-reduced-motion
- Ensure charts have accessible fallback text

## Content Style
- Tone: supportive, confident, and concise
- Use sentence case for headings and buttons
- Avoid financial jargon; explain where necessary

## Theming and Dark Mode
- Dark mode toggled with `dark` class on `html` or `body`
- Persist user preference in storage
- Test color tokens in both themes; avoid pure blacks/whites

## Implementation Notes
- Use utility classes defined in `src/index.css` for buttons, inputs, and cards
- Extend Tailwind tokens via `tailwind.config.js` only; avoid ad-hoc hex values
- Prefer component composition over one-off styles

