# Orion POS — Roadmap

Orion is a point-of-sale system for small and medium cafes and restaurants in Indonesia, in the
spirit of Moka POS. This repository is the **back-office web app** (inventory and setup today).
The cashier app and the backend live, or will live, elsewhere; see the architecture records in
[`docs/adr`](./adr).

Estimates are rough, for one developer, and describe order and relative size rather than promises.

## Product surface

| Area | Scope |
|---|---|
| Cashier app (POS) | Offline-capable, touch-first checkout; shifts and cash drawer; split and merged bills; voids and refunds with permissions |
| Catalog | Items, variants, modifiers and add-ons, bundles, categories, per-outlet price and availability |
| Inventory | Ingredients, recipes, UoM conversion, purchasing, stock opname, waste, transfers |
| Payments | Cash, QRIS, e-wallets, cards, split payment |
| Hardware | ESC/POS receipt printer, cash drawer, barcode scanner, kitchen printer |
| Restaurant flow | Tables and floor plan, open bills, kitchen tickets, then a kitchen display |
| Customers and promos | Loyalty, vouchers, discounts |
| Back office | Multi-outlet, employees and roles, reports, tax and service charge |
| Later | Online ordering and delivery integrations, accounting export, QR self-order |

## Phases

### Phase 0: Foundation (2–3 weeks)

- Go API skeleton, auth and roles, tenant and outlet schema ([ADR 0002](./adr/0002-go-modular-monolith.md))
- OpenAPI pipeline generating the Go server stubs and the TypeScript client ([ADR 0003](./adr/0003-openapi-first.md))
- CI, a green build, current toolchain for this repo
- Retire `json-server` in favour of generated types and MSW mocks

### Phase 1: Sell something (6–8 weeks)

- Catalog with variants and modifiers
- POS checkout, cash only
- Shifts and cash drawer
- Receipts
- Offline outbox and sync ([ADR 0004](./adr/0004-offline-first-pos.md))
- **Find one real cafe as a pilot before this phase ends.**

### Phase 2: Get paid (4–6 weeks)

- Printer integration; do the hardware spike first ([ADR 0005](./adr/0005-pwa-hardware.md))
- Manual QRIS (cashier confirms the transfer), then dynamic QRIS and e-wallets through a gateway
- Daily sales report
- Voids and refunds

### Phase 3: Inventory (4–6 weeks)

- Stock ledger ([ADR 0006](./adr/0006-integer-money-and-stock-ledger.md))
- Ingredients and recipes, stock opname, waste, purchasing
- Port the existing Setup and Stock Management pages in this repo onto the real API

### Phase 4: Restaurant flow (4–6 weeks)

- Tables and open bills, split bills
- Kitchen tickets (printed) before a kitchen display screen

### Phase 5: Growth (open-ended)

- Loyalty and promos
- Multi-outlet UI (the schema supports it from Phase 0)
- Online-order integrations

## Deliberate cuts

- Multi-outlet **schema** from day one, but no multi-outlet UI until Phase 5.
- Recipes only after basic selling works.
- Printed kitchen tickets before a kitchen display.
- Android tablets only for the first release; iPad is out of scope ([ADR 0005](./adr/0005-pwa-hardware.md)).

## Indonesia-specific requirements

- **Money** is integer rupiah. Cash rounding (pembulatan) is a per-outlet setting.
- **Tax and service charge are configurable per outlet.** Restaurants typically deal with PB1
  (a regional tax set by each local government), PPN, and an optional service charge. Rates and
  tax-inclusive versus tax-exclusive pricing vary, so confirm current rules with an accountant
  before hard-coding anything.
- **Payments:** cash first, manual QRIS next, then dynamic QRIS and e-wallets via a gateway
  (for example Xendit or Midtrans) with webhook reconciliation.
- **Language and time:** `id-ID` is the default locale with English available. Each outlet has its
  own timezone (WIB, WITA or WIT) and the reporting day is cut at that outlet's local midnight.
- **Privacy:** customer data falls under UU PDP. Plan for consent and deletion before building
  loyalty features.

## Open questions

- Which payment gateway to start with.
- Whether to wrap the PWA in a thin Android shell (TWA or Capacitor) if the hardware spike fails.
- Hosting and region for the Go API and PostgreSQL.
