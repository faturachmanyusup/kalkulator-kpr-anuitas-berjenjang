# Code Style

## TypeScript
- Strict mode enabled — no implicit `any`, no non-null assertion unless necessary
- Prefer `interface` for object shapes, `type` for unions/aliases
- Use `crypto.randomUUID()` for generating unique IDs
- Use `useId()` for HTML label/input associations

## React
- Functional components only
- Wrap stable callbacks with `useCallback`
- Keep state minimal — derive values from state instead of duplicating (e.g. `principal` derived from `principalRaw`)
- No default export for components except `App.tsx`

## Formatting & Naming
- `Raw` suffix for unformatted string inputs (e.g. `principalRaw`, `rateRaw`)
- Currency values use `Math.ceil()` for rounding, never `Math.round()`
- Use `IDR()` from `helpers/number.ts` for all currency display
- Use `PCT()` from `helpers/number.ts` for all percentage display

## Tailwind
- Dark theme base: `slate-900 / slate-800 / slate-700`
- Accent colors: `blue-500/600` (primary), `emerald` (XLSX), `red` (PDF), `amber` (interest), `blue-400` (principal)
- Rounded: `rounded-xl` for inputs, `rounded-2xl` for cards, `rounded-lg` for small elements
- Always include `transition` on interactive elements
- Focus rings: `focus:ring-2 focus:ring-blue-500`

## General
- Minimal inline comments — write self-documenting code
- No unused imports or variables
