# 0008. A separate platform admin console for the operator

Status: accepted

## Context

As the operator of Orion, I need to run the service itself, separately from any cafe's settings:

- see which businesses have signed up and whether they are active;
- schedule when the subscription phase starts (ADR 0007);
- turn modules on or off for everyone or for one business;
- create promo codes for the subscription.

This console can reach every tenant's account, so it carries more risk than any other part of the
system. Tenant data also falls under UU PDP.

In this record, "tenant" means a business that uses Orion, and "operator" means me and anyone I
later give admin access.

## Decision

### Separation

- The console is a **separate front-end app** on its own subdomain (for example `admin.`), not a
  section of the tenant back office behind a role check. Tenants never download its code. It
  reuses the same UI components and generated API types.
- **Operator accounts are separate from tenant users.** They use their own token audience, and
  two-factor login is required.
- The Go service exposes the console's endpoints under `/admin` in a `platform` module. Tenant
  tokens are rejected there, and operator tokens are rejected on tenant endpoints.
- **Every operator action is written to an append-only audit log:** who did it, when, what it
  changed (before and after), and why. The console shows this log.
- **The console shows aggregates and account details, not the tenants' business data.** For
  example, it shows sales counts per day but not individual sales or the tenants' customers. If
  "view as tenant" is ever added for support, it is read-only, time-limited, and audited.

### Tenant overview

- A list of tenants showing owner contact, signup date, outlets, paired devices, plan,
  subscription status, last sync, and sales count per day.
- Platform metrics: signups over time, active tenants, and tenants that have stopped syncing.
- Actions: suspend or reinstate a tenant, revoke a device, extend a trial, change a plan, and send
  an announcement to the back office and the POS.

### Starting the subscription phase

- The start is a **scheduled date**, not a switch. There is one global "billing starts" date, and
  a tenant can have an override (for example, to keep a pilot cafe free for longer).
- The system **refuses a date closer than the promised notice period** (ADR 0007), and it sends
  the reminder emails and in-app notices on a schedule leading up to the date.
- On the date, a background job moves each early-access tenant to a trial or a paid plan,
  according to ADR 0007 and any promo code the tenant has redeemed.

### Module switches

There are two kinds of switch, and both are resolved by the single entitlements check from
ADR 0007:

- **Plan entitlements** are commercial: which modules and limits a plan includes.
- **Feature flags** are technical: kill switches and gradual rollouts, for example a new sync
  path enabled for a few tenants first.

The effective value is resolved in this order, and the most specific level wins:

1. global default
2. the tenant's plan
3. an override for that tenant

Rules:

- **Turning a module off hides it. It never deletes data.** Turning it back on restores
  everything.
- The POS applies changes at its next sync, using the cached entitlements from ADR 0007. A
  change never interrupts a cashier mid-shift.
- Flags are rows in PostgreSQL, edited from the console. No third-party flag service.
- Every flag has an owner and a note, and temporary flags are removed once a rollout is done.

### Promo codes

These are codes for the **Orion subscription**, offered by the operator to tenants. They are not
the vouchers that a cafe offers its own customers (the Phase 6 "Customers and promos" area). The
two use different tables and different names in code: `subscription_promo` here, `voucher` there.

- **Rewards:** an extended trial (for example 60 days), a percentage or fixed-rupiah discount for
  a number of billing periods, or a plan upgrade for a period.
- **Limits:** a validity window, a maximum number of redemptions, at most one redemption per
  tenant, and optionally the plans the code applies to.
- **Redemptions are recorded:** which tenant, when, and what was granted. The console shows usage
  per code.
- A code redeemed **during free early access is stored and applied when billing starts.** This is
  how founding-user offers work.
- Discounts are calculated by Orion's own billing code before an invoice is created, not by the
  payment gateway.
- **Generated codes are hard to guess:** random, case-insensitive, and without look-alike
  characters (`0/O`, `1/I/L`). Redemption attempts are rate-limited per account.

### Timing

| Roadmap phase | What exists |
|---|---|
| Phase 0 | Operator accounts with two-factor login, the entitlements table and resolution, and the audit log. No console screens; a small CLI or SQL is enough. |
| Phase 2 (free early access) | A minimal console: tenant list and metrics, suspend or reinstate, device revocation, module switches, announcements, and the audit log. |
| Phase 5 (paid launch) | Scheduling the billing start, promo codes, plan editing, and billing status per tenant. |

## Consequences

- The project has three front-end apps (the back office, the POS and the console) sharing UI
  components and generated API types. That makes a monorepo worthwhile, so the restructure
  happens at the start of Phase 1.
- One more app to deploy and secure, in return for a smaller attack surface in the tenant apps.
- Losing an operator account would be the most damaging single compromise in the system. Two-factor
  login, the audit log, and keeping the number of operator accounts minimal are not optional.
- Switches that take effect "at next sync" mean a POS that stays offline can run on old
  entitlements for a while. This is accepted.
