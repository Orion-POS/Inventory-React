# Orion Inventory (back office)

Back-office web app for **Orion POS**, a point-of-sale system for small and medium cafes and
restaurants in Indonesia. This repository currently covers inventory and setup: items, units of
measure, stock management, suppliers and transactions.

The product plan lives in [`docs/ROADMAP.md`](docs/ROADMAP.md) and the reasoning behind the main
technical choices in [`docs/adr`](docs/adr).

> **Status:** early stage. Most pages run on dummy data from `src/__dummy__` and a local
> `json-server` mock. The real API is being rewritten in Go; see the roadmap.

## Tech stack

- React 19, TypeScript, Vite
- Tailwind CSS 3 with shadcn/ui-style components on Radix UI
- Redux Toolkit and RTK Query
- react-hook-form and zod
- TanStack Table
- React Router 6

## Getting started

Requires Node 22 (see `.nvmrc`) and Yarn 1.

```bash
yarn install
cp .env.example .env.local   # then adjust VITE_BASE_URL_API if needed
yarn dev
```

To run the mock API for the Item Category page:

```bash
yarn json-server             # serves src/db.json on http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Type-check with `tsc`, then build for production |
| `yarn lint` | Run ESLint (errors fail, warnings are reported) |
| `yarn preview` | Serve the production build locally |
| `yarn json-server` | Run the mock API |

CI runs `yarn lint` and `yarn build` on every push and pull request.

## Project layout

```
src/
  app/          Redux store, RTK Query services and slices
  components/   forms, modals, navs, table, and ui (shadcn-style primitives)
  pages/        one folder per route: Summary, Setup, stock-management, ...
  providers/    modal and theme providers
  __dummy__/    sample data used until the real API exists
  types/        shared domain types
```

## Contributing

Branch names use `<type>/<alias>`, for example `feature/setup-page` or `fix/modal-footer`.
Commit messages follow `<type>(<scope>): <subject>` (scope optional), for example
`feat(form): combo-box`. Types are `feat`, `fix`, `docs`, `style`, `refactor`, `test` and `chore`.
