## BadBudget Test Plan

This document defines the testing strategy for BadBudget, a React + TypeScript SPA with Tailwind, Recharts, localStorage persistence, and optional Supabase authentication/sync.

### Goals and Scope
- Ensure core flows work: authentication, onboarding, budget allocation, daily tracking, benchmarks, persistence, dark mode, responsiveness.
- Cover unit, component, integration, end-to-end, accessibility, performance, and visual regression.
- Validate both offline-only (localStorage) and authenticated (Supabase sync) modes.

### Test Strategy and Tooling
- Unit/Component: Jest, React Testing Library, jest-dom; user-event; msw for API mocking; jest-axe for a11y.
- Integration: RTL with msw, exercising `MainApp` with auth states and storage.
- End-to-End: Playwright (recommended) for full browser flows; axe-core integration for a11y; optional Percy for visual diffs.
- Visual Regression: Playwright screenshots or Percy.
- Performance: Lighthouse CI; Playwright traces; React Profiler where needed.
- Static checks: TypeScript, ESLint.

Suggested dev dependencies:

```bash
npm i -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jest-axe msw whatwg-fetch playwright @playwright/test axe-core
```

### Environments
- Local: CRA dev server; Supabase mocked by msw.
- Staging: Real Supabase project with test tables (`user_budgets`), seeded user; feature flags for network toggling.
- CI: Headless browsers for unit/integration; Playwright for E2E; Lighthouse CI optional.

### Test Data and Fixtures
Create `fixtures/` with representative `AppData` objects:
- Fresh user (no data).
- Onboarded user with fixed costs and goals.
- Historic spending across months.
- Edge cases: zero income, high liabilities, custom subcategories.

Minimal example:

```ts
const baseData: AppData = {
  user: { id: 'user_1', email: 'u@example.com', name: 'User', createdAt: '2024-01-01T00:00:00.000Z' },
  income: 5000,
  investmentGoals: { min: 300, max: 1000 },
  fixedCosts: [{ id: 'rent-1', name: 'Rent', amount: 1500, type: 'living-expense', classification: 'fixed', subCategory: 'Rent/Mortgage' }],
  currentBudget: { month: '2025-09', variableAllocated: 0, investmentAllocated: 0 },
  spendingHistory: [],
  customSubcategories: [],
  benchmarkPercentages: { livingExpenses: 70, liabilities: 20, investments: 10 }
};
```

### Coverage by Feature

#### Authentication (Supabase) — `utils/supabase.ts`, `Login`, `SignUp`, `MainApp`
- Sign up success and validation errors; duplicate email handling.
- Sign in success/failure; sign out resets to unauthenticated view.
- Auth state listener transitions (session expired -> unauthenticated).
- On login, loads Supabase `user_budgets` if present, otherwise onboarding.
- Remote failure falls back to localStorage without blocking UI.

#### Onboarding — `components/Onboarding.tsx`
- Step navigation, validation, and persistence when navigating back.
- Income numeric and positive; investment goals min ≤ max and ≥ 0.
- Fixed costs CRUD; type and classification validation; subcategory required.
- Completion persists to localStorage; if authenticated, also upserts to Supabase; remote errors do not lose local data.

#### Dashboard — `components/Dashboard.tsx`
- Displays totals (income, fixed, remaining).
- Allocation results keep investment within `[min, max]`.
- Edits to fixed costs/goals update allocations live.
- Benchmarks: living ≤70%, liabilities ≤20%, investments ≥10% with clear statuses.
- Charts render correctly; empty states handled gracefully.
- Reset clears localStorage and returns to onboarding; remote data unaffected unless explicitly confirmed by design.

#### Daily Expense Tracking
- Add/edit/delete daily expenses with required fields and positive amounts.
- Persist to `spendingHistory` for the current month; month rollover creates a new entry.
- Category totals and subcategory breakdown update correctly.

#### Local Storage — `utils/storage.ts`
- `getStoredData` returns `null` when missing; parses valid JSON; logs error on malformed without crashing.
- `saveData` writes full structure; `clearData` removes key.
- App prefers local data when unauthenticated or when remote unavailable.

#### Supabase Sync — `utils/supabase.ts`, `MainApp`
- `saveUserData` upserts with `user_id`, `budget_data`, `updated_at`.
- `getUserData` returns `budget_data` or `undefined` for missing; handles 404.
- Network errors are caught; UI remains responsive; local remains source of truth.
- When authenticated and remote has data, prefer remote; else fallback to local.

#### UI/UX and Accessibility
- Dark mode toggle saves preference if implemented; adequate contrast in both themes.
- Loading spinner shows while `isLoading`.
- Disable buttons during async to avoid duplicate submissions.
- Keyboard navigation, focus management, and visible focus outlines across flows.

#### Responsiveness
- Verify at 375, 768, 1024, 1440 px widths: no overflow, charts and cards adapt.

#### Error Handling
- Supabase errors surface as non-blocking messages with retry.
- Field-level and form-level errors for auth and onboarding.

#### Security/Privacy
- CRA env variables (`REACT_APP_*`) for Supabase config; no secrets in code.
- No PII in logs; localStorage key limited to `badBudgetData`.

### Non-Functional
- Accessibility: No critical axe violations on core screens; semantic landmarks; inputs have labels; chart alternatives have accessible names.
- Performance: Lighthouse budgets for FCP/TTI; dashboard remains responsive with larger datasets.
- Visual Regression: Protect layouts of `Dashboard`, `Onboarding`, `Login`, `SignUp` in light/dark at common widths.

### Test Suite Structure
- Unit/Component (`src/__tests__`):
  - `utils/storage.test.ts`
  - `utils/supabase.mock.test.ts`
  - `components/Login.test.tsx`
  - `components/SignUp.test.tsx`
  - `components/Onboarding.test.tsx`
  - `components/Dashboard.sections.test.tsx`
  - `MainApp.auth-and-fallback.test.tsx`
- E2E (`e2e/` with Playwright):
  - `auth.spec.ts`
  - `onboarding.spec.ts`
  - `dashboard.spec.ts`
  - `expenses.spec.ts`
  - `persistence.spec.ts`
  - `accessibility.spec.ts`
  - `responsive.spec.ts`

### Representative Scenarios
- Remote failure during app load -> local data shown without blocking.
- Investment allocation always within goals after edits.
- Liabilities >20% shows warning state.
- Adding past-month expenses updates trend chart.
- Reset clears local state; re-login with remote data restores remote.
- Dark mode persists across reloads and maintains contrast.

### Accessibility Checks
- Component-level: `jest-axe` in RTL tests.
- E2E: Playwright + `axe-core` to scan key routes in both themes.
- Validate keyboard-only flows and focus order.

### CI and Quality Gates
- Stages: Type check + lint -> Unit/Component -> Build -> E2E -> Lighthouse (optional).
- Gates: No failing tests; zero critical axe issues; no TS errors; performance budgets met.

### Execution
- Unit/Component: `npm test`
- Playwright init/run:

```bash
npx playwright install --with-deps
npx playwright test
```

Start server for E2E:

```bash
npm start
# In another terminal
npx playwright test
```

### Risks and Mitigations
- Supabase mocking: mock `utils/supabase.ts` for unit; msw/E2E for integration realism.
- Large `Dashboard.tsx`: split tests by section; prioritize high-value flows.
- Allocation logic intertwined with UI: assert UI outcomes and state, not internal algorithm steps.

