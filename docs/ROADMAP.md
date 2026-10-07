# Orion POS — Roadmap

Orion is a point-of-sale system for small and medium cafes and restaurants in Indonesia, in the
spirit of Moka POS. This repository is the **back-office web app** (inventory and setup today).
The cashier app and the backend live, or will live, elsewhere; see the architecture records in
[`docs/adr`](./adr).

Estimates are rough, in full-time weeks for one developer, and describe order and relative size
rather than promises. Expect real calendar time to be 1.5–2× longer, and longer still if the work
is part-time.

The rules the product must follow are in [BUSINESS_RULES.md](./BUSINESS_RULES.md). How the current
screens compare with them is in [FLOW_REVIEW.md](./FLOW_REVIEW.md). How screens should look and
behave is in [UIUX_GUIDES.md](./UIUX_GUIDES.md).

## Product surface

| Area | Scope |
|---|---|
| Cashier app (POS) | Offline-capable, touch-first checkout; shifts and cash drawer; split and merged bills; voids and refunds with permissions |
| Catalog | Items, variants, modifiers and add-ons, bundles, categories, per-outlet price and availability |
| Inventory | Ingredients, recipes, UoM conversion, purchasing, stock opname, waste, transfers |
| Payments | Cash, QRIS, e-wallets, split payment. Cards go through the merchant's own standalone EDC terminal and are recorded manually; no EDC integration |
| Hardware | ESC/POS receipt printer, cash drawer, barcode scanner (keyboard mode), kitchen printer |
| Restaurant flow | Tables and floor plan, open bills, kitchen tickets, then a kitchen display |
| Customers and promos | Loyalty, vouchers, rule-based promos |
| Back office | Multi-outlet, employees and roles, reports, tax and service charge |
| Account and billing | Self-serve signup, plans, 30-day trial, subscription billing ([ADR 0007](./adr/0007-free-early-access-then-subscription.md)) |
| Platform admin console | For the operator: tenant overview, billing-start schedule, module switches, subscription promo codes, audit log ([ADR 0008](./adr/0008-platform-admin-console.md)) |
| Later | Online ordering and delivery integrations, accounting export, QR self-order |

## Releases

| Release | When | Who |
|---|---|---|
| **Pilot** | End of Phase 1 | One design-partner cafe, running alongside its old system |
| **Free early access** | End of Phase 2 | Any cafe that signs up; free, clearly labelled as early access |
| **Paid launch** | End of Phase 5 | New sign-ups get a 30-day free trial, then a subscription. Early-access users are moved over with notice |

## Phases

### Phase 0: Foundation (3–4 weeks)

- [x] CI, a green build, current toolchain for this repo
- [ ] Go API skeleton, tenant and outlet schema ([ADR 0002](./adr/0002-go-modular-monolith.md))
- [ ] Plan and entitlement fields on the tenant from the first migration, with every tenant on the
      free early-access plan ([ADR 0007](./adr/0007-free-early-access-then-subscription.md))
- [ ] Auth: owner login by email, cashier PIN switching on a shared tablet, and device pairing
      ([ADR 0004](./adr/0004-offline-first-pos.md))
- [ ] OpenAPI pipeline generating the Go server stubs and the TypeScript client ([ADR 0003](./adr/0003-openapi-first.md))
- [ ] Retire `json-server` in favour of generated types and MSW mocks
- [ ] Hardware spike: receipt printing and cash drawer from the PWA ([ADR 0005](./adr/0005-pwa-hardware.md))
- [ ] Translation setup with `id-ID` as the default locale, in this app and in the cashier app
- [ ] Operator accounts with two-factor login, the entitlements and feature-flag table, and the
      audit log; managed by CLI or SQL for now ([ADR 0008](./adr/0008-platform-admin-console.md))
- [ ] Operations basics: automated PostgreSQL backups with a tested restore, error tracking, a
      repeatable deploy

Not code, but started now because of lead time:

- [ ] Recruit a design-partner cafe. A pay-first counter-service cafe fits Phase 1; a sit-down
      restaurant needs Phase 4.
- [ ] Apply to a payment gateway. Business verification takes weeks, and acting as a platform for
      other merchants probably needs a registered business entity.

**Done when** a paired tablet can log a cashier in by PIN and print a test receipt from data served
by the Go API.

### Phase 1: Pilot-ready counter cafe (10–14 weeks)

- Restructure into a monorepo for the back office, the POS and the admin console, with shared UI
  components and generated API types ([ADR 0008](./adr/0008-platform-admin-console.md))
- Catalog with variants and modifiers: API, and the management screens in this back-office app
- POS checkout with cash and manual QRIS (static QR; the cashier confirms the transfer)
- Tax, service charge and cash rounding, configured per outlet
- Manual discounts on a line or on the whole bill
- Printed receipts, using whatever the hardware spike proved
- Voids, with a permission check and a reason
- Shifts, cash drawer, and an end-of-shift and end-of-day report
- Offline outbox and sync ([ADR 0004](./adr/0004-offline-first-pos.md))

**Done when** the design-partner cafe trades for a full week, including time offline, alongside its
old system, and its end-of-day totals match.

### Phase 2: Early access (6–8 weeks)

- Dynamic QRIS and e-wallets through the gateway, with webhook reconciliation
- Refunds
- Sales reports by day, item and payment method
- Self-serve signup and onboarding (create a business, an outlet, pair a device)
- Catalog import from CSV, so cafes can move from Moka or a spreadsheet
- Printed kitchen or bar tickets (cheap once receipt printing works)
- Terms of service and a privacy policy that say the service is free early access and will become
  paid, with notice
- Per-tenant limits (outlets, devices) to keep the free tier's hosting cost bounded
- Minimal admin console: tenant list and metrics, suspend or reinstate, device revocation, module
  switches, announcements, audit log ([ADR 0008](./adr/0008-platform-admin-console.md))

**Done when** a cafe that has never spoken to you can sign up, import its menu, and sell.

### Phase 3: Inventory (6–8 weeks)

- Stock ledger ([ADR 0006](./adr/0006-integer-money-and-stock-ledger.md))
- Items, units of measure and recipes; goods receipts, suppliers and payables; usage, waste and
  adjustment; stock opname as a counting session ([BUSINESS_RULES.md](./BUSINESS_RULES.md))
- Port the existing Setup and Stock Management pages in this repo onto the real API

**Done when** selling an item deducts its recipe's ingredients, and an opname reconciles the
difference.

### Phase 4: Restaurant flow (6–8 weeks)

- Tables and open bills, split and merged bills
- Kitchen tickets per station before a kitchen display screen

**Done when** a sit-down restaurant can run a full service on it.

### Phase 5: Paid launch (4–6 weeks)

- Subscription billing through the payment gateway ([ADR 0007](./adr/0007-free-early-access-then-subscription.md))
- 30-day free trial for new sign-ups, with reminders before it ends
- Admin console: schedule the billing start date (globally and per tenant), subscription promo
  codes, plan editing, billing status per tenant ([ADR 0008](./adr/0008-platform-admin-console.md))
- Move early-access tenants onto a paid plan with advance notice and a founding-user price
- Grace period and read-only mode for unpaid accounts; selling is never cut off mid-shift
- Data export for every tenant, paid or not

**Done when** a new cafe can sign up, trial, and pay without manual help.

### Phase 6: Growth (open-ended)

- Loyalty, vouchers and rule-based promos
- Multi-outlet UI (the schema supports it from Phase 0)
- Online-order integrations
- Accounting export

## Deliberate cuts

- Multi-outlet **schema** from day one, but no multi-outlet UI until Phase 6.
- Plan and entitlement **fields** from day one, but no billing until Phase 5.
- Recipes only after basic selling works.
- Printed kitchen tickets before a kitchen display.
- Cards are recorded, not integrated.
- Android tablets only for the first release; iPad is out of scope ([ADR 0005](./adr/0005-pwa-hardware.md)).

## Indonesia-specific requirements

- **Money** is integer rupiah. Cash rounding (pembulatan) is a per-outlet setting.
- **Tax and service charge are configurable per outlet**, including tax-inclusive or
  tax-exclusive pricing. Points to confirm with an accountant before hard-coding anything:
  - PB1 has been replaced by **PBJT** (Pajak Barang dan Jasa Tertentu) under UU HKPD
    (Law 1/2022). It is a regional tax; each local government sets the rate, up to 10%.
  - Food and drink served by a restaurant is understood to be a regional tax object and not
    subject to PPN. Other goods a cafe sells may differ.
  - Some local governments monitor PBJT through tapping boxes or online reporting, which could
    become an integration requirement in those cities.
- **Payments:** cash and manual QRIS first, then dynamic QRIS and e-wallets via a gateway (for
  example Xendit or Midtrans).
- **Subscription payments:** card ownership among small merchants is low, so billing must accept
  bank transfer, virtual account and QRIS, not only card auto-debit.
- **Language and time:** `id-ID` is the default locale with English available. Each outlet has its
  own timezone (WIB, WITA or WIT). The reporting day is cut at an hour set per outlet (midnight by
  default), so a venue that closes at 02:00 keeps one evening in one day.
- **Privacy:** tenant and customer data fall under UU PDP. Publish a privacy policy with the free
  release, and plan consent and deletion before building loyalty features.

## Risks

| Risk | Mitigation |
|---|---|
| Browser printing is unreliable | Spike in Phase 0; fallbacks in ADR 0005 |
| Offline sync bugs lose or duplicate sales | Idempotent server, immutable records, sync tests written first |
| Payment gateway onboarding is slow | Apply in Phase 0; manual QRIS does not depend on it |
| An operator account is compromised | Separate admin app and accounts, required two-factor login, audit log (ADR 0008) |
| Free users leave when billing starts | Say "free early access" from day one; notice period and founding-user price |
| One developer: illness, burnout, lost context | ADRs, CI, backups, keeping scope cuts |

## Open questions

- Which payment gateway to start with.
- Pricing: per outlet, per device, or tiered plans, and the price point against Moka and its
  competitors.
- What early-access users get at paid launch: notice period length and founding-user discount.
- Whether to wrap the PWA in a thin Android shell (TWA or Capacitor) if the hardware spike fails.
- Hosting and region for the Go API and PostgreSQL.
- Whether to register a business entity before the free release or before the paid launch.
