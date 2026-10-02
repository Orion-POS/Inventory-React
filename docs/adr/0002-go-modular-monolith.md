# 0002. Backend is a Go modular monolith on PostgreSQL

Status: accepted

## Context

The backend is being rewritten in Go. One developer maintains everything. The system needs
multi-tenant and multi-outlet data, transactional correctness around sales and stock, and a simple
deployment.

## Decision

- One Go service deployed as a single binary, split internally into modules (catalog, sales,
  inventory, payments) with clear boundaries.
- PostgreSQL as the only datastore. Background work uses a Postgres-backed job queue (for example
  `river`) or a plain jobs table.
- Suggested libraries: `chi` or the standard router, `pgx` with `sqlc`, `goose` or `atlas` for
  migrations. These are defaults, not commitments.
- **Tenant and outlet ids are on every business table from the first migration.** Retrofitting
  multi-tenancy later is painful. The multi-outlet UI waits until Phase 5.
- Roles and permissions exist from the start.

## Consequences

- Operationally simple: one process, one database.
- Module boundaries must be enforced by convention and review, since the compiler will not.
- Splitting a module into its own service later stays possible but is not planned.
