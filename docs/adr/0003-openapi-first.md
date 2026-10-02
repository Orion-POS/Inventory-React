# 0003. API contract is OpenAPI-first

Status: accepted

## Context

The front end currently talks to a `json-server` mock (`src/db.json`). With one developer on both
sides, the main risk is the client and server quietly drifting apart.

## Decision

- The OpenAPI document is the source of truth for the HTTP API.
- The Go server stubs are generated from it (for example `oapi-codegen`), and the TypeScript client
  and types are generated from it (for example `openapi-typescript`).
- Until the Go API covers a screen, mock it with MSW using the same generated types. `json-server`
  is retired once the first real endpoints exist.

## Consequences

- A contract change shows up as a compile error on both sides.
- Generation must be part of CI so checked-in output cannot go stale.
- Slightly slower for the very first endpoint, faster from the second one on.
