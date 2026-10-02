# 0004. The POS client is offline-first

Status: accepted

## Context

Cafes in Indonesia lose connectivity regularly, and a cashier must never be blocked from taking an
order. The first release is a PWA.

## Decision

- The cashier app writes to a local store (IndexedDB, for example via Dexie) and syncs through an
  **outbox**.
- Every sale, payment and shift event gets a **UUIDv7 id and an idempotency key** generated on the
  client. The server must accept the same event twice without effect.
- Sales and payments are **append-only and immutable.** A correction is a new void or refund
  record, never an edit.
- The catalog and prices are **pulled as versioned deltas** and are read-only on the POS.
- Stock is owned by the server (see ADR 0006). Offline sales may briefly drive stock negative.
- No CRDTs. The data is mostly append-only, so the conflicts they solve mostly do not arise.
- The app shell is cached by a service worker (`vite-plugin-pwa`, Workbox), and the app requests
  persistent storage so the browser does not evict local data.

## Consequences

- The sync protocol and its tests are the most important code in the system.
- Reports can lag the shop floor until a device syncs.
- Clock skew on devices must be tolerated: store the device time, but order by server receipt.
