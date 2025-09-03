# BadBudget Design Specifications

Specifications for screens, interactions, states, and data visualizations in BadBudget. These align with the Design System.

## Global
- App width: max 1200px; horizontal padding 16/24/32px by breakpoint
- Dark mode: `dark` class toggles theme; stored in local storage
- Loading: centered spinner with status text
- Errors: inline near component; critical errors as dismissible alert
- Success toasts: concise confirmation for saved actions

## Information Architecture
- Authentication: Login, Sign Up
- Onboarding (3 steps): Income & Goals → Fixed Expenses → Review & Confirm
- Authenticated: Dashboard (Overview, Expenses, Benchmarks), Configuration, Profile/Sign Out

## Authentication
### Login
- Fields: Email, Password
- Actions: Sign In (primary), Create Account (secondary)
- Validation: email format, min 8 char password
- Error copy: “Email or password is incorrect.”

### Sign Up
- Fields: Name, Email, Password
- Actions: Create Account (primary), Back to Login (secondary)
- Password: min 8 chars, show/hide toggle

## Onboarding
### Step 1: Income & Investment Goals
- Inputs
  - Monthly Income (currency)
  - Investment Goal Range (min/max currency)
- Constraints
  - 0 ≤ min ≤ max ≤ income
  - Persist to temp state as user types

### Step 2: Fixed Expenses
- Table-style list with add/edit rows
- Each expense: Name, Amount, Type (living expense/liability), Subcategory
- Inline validations and totals preview

### Step 3: Review & Confirm
- Summary card: Income, Totals by category, Goal range
- Primary action: “Finish Setup” saves and initializes budget

## Dashboard
### Header Summary
- KPIs: Income, Fixed, Variable Allocated, Investment Allocated
- Each KPI has label, value, delta vs last month (if available)

### Allocation Visualization
- Donut chart: variable vs investment
- Tooltip: exact values; legend with colors and percentages
- Accessible description for screen readers

### Monthly Spending
- Bar chart: daily or category breakdown
- Filters: month selector (current and previous 12 months)

### Benchmarks
- Recommended: Living ≤ 70%, Liabilities ≤ 20%, Investments ≥ 10%
- Visual: progress bars with thresholds and semantic colors
- Copy:
  - Good: “On track”
  - Warning: “Close to limit”
  - Alert: “Over recommended”

### Recent Activity / Quick Add
- Quick add expense form with: date, subcategory, amount
- Prefill today’s date, focus amount field on open

## Configuration
- Sections: Profile, Budget Settings, Categories
- Budget Settings
  - Income
  - Investment goal min/max
  - Fixed expenses list with CRUD
- Categories
  - Manage living-expense subcategories

## Interaction Details
- Focus management: move focus to first invalid field on submit error
- Keyboard: Esc to close modals, Enter to submit primary actions
- Hover vs active: maintain contrast in both themes
- Loading states: disable controls, show spinner in buttons if long-running
- Save behaviors: optimistic UI with rollback if save fails

## Copy and Microtext
- Buttons: concise verbs (“Save”, “Add expense”)
- Empty states: friendly, action-oriented (“No expenses yet. Add your first expense.”)
- Errors: explain how to resolve (“Enter an amount greater than 0.”)

## Data Visualization Specs
- Donut chart colors: variable = primary-500, investment = accent-500
- Bar chart: categories alternate primary-400/primary-600
- Axis labels: 12–14px, accessible color contrast
- Tooltips: formatted currency, percentage

## Accessibility Specs
- All interactive elements reachable via keyboard (Tab/Shift+Tab)
- `aria-live=polite` for async save confirmations
- Chart regions labeled with `role="img"` and `aria-label`
- Inputs have associated labels and `aria-describedby` for help/error text

## Performance & Responsiveness
- Mobile first layouts; charts stack vertically on small screens
- Avoid layout shifts by reserving component heights
- Debounce expensive operations (search, filtering) at 250ms

## Error States
- Network error fetching user data: show inline card with retry
- Supabase save failure: keep local save; toast: “Saved locally, will retry syncing.”

## Security & Privacy
- Do not expose sensitive data in logs
- Respect local-only mode when unauthenticated

## Testable Acceptance Criteria (selected)
- User can complete onboarding with validation and land on Dashboard
- Screen reader announces focus and context on step changes
- Benchmarks display correct statuses given provided inputs
- Charts render with accessible labels and contrast in both themes

