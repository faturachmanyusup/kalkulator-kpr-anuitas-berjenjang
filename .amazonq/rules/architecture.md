# Architecture

## File Structure
```
src/
  calculator.ts         # Pure calculation logic, no React
  App.tsx               # Root component, owns all state
  components/
    ResultSection.tsx   # Renders summary cards + amortization table + export buttons
    SummaryCard.tsx     # Reusable summary stat card
  helpers/
    number.ts           # IDR(), PCT() formatters
    file.ts             # exportToXlsx(), exportToPdf()
```

## Data Flow
1. User inputs `principalRaw` (formatted string) and `tenors` (array of `TenorInput`) in `App.tsx`
2. On calculate: parse inputs → call `calculateKPR(principal, TenorRow[])` from `calculator.ts`
3. Result (`AmortizationRow[]`) stored in `App` state → passed to `ResultSection`
4. Export functions in `helpers/file.ts` receive `rows`, `principal`, `tenorYears` directly

## Conventions
- Business/calculation logic stays in `calculator.ts`, never inside components
- Formatting helpers stay in `helpers/number.ts`
- File export logic stays in `helpers/file.ts`
- New reusable UI primitives go in `components/`
- `App.tsx` is the only stateful component; child components are pure/presentational
