# 0007. Free early access first, then a subscription with a 30-day trial

Status: accepted

## Context

Orion will eventually be sold as a subscription with a 30-day free trial. The first public
release will be free. Adding plans and billing to a system that never expected them is expensive,
and taking away something people got for free is a trust problem if it is not announced from the
start.

Small Indonesian merchants often have no credit card, so card auto-debit cannot be the only way
to pay.

## Decision

- **From the first migration**, each tenant has a plan, a subscription status and the dates that
  go with them (trial end, paid-until). Every tenant starts on an `early_access` plan with all
  features enabled.
- Feature access and limits (outlets, devices, staff) are checked in **one place on the server**
  (an entitlements module), never scattered through handlers or the UI. The free release still
  goes through this check; it just always allows.
- The POS caches the tenant's entitlements with an expiry, so the check works offline.
- **No billing code until the paid launch** (Phase 5 in the roadmap).
- At paid launch:
  - New sign-ups get a 30-day trial with full features, and a reminder before it ends.
  - Billing goes through the payment gateway and accepts bank transfer, virtual account and QRIS
    invoices as well as cards.
  - Early-access tenants are moved over with advance notice and a founding-user price.
- When a tenant stops paying, they get a **grace period, then read-only access** to the back
  office. The POS never stops a cashier in the middle of a shift, and a tenant can always export
  their own data.
- The free release ships with terms of service and a privacy policy that call it free early
  access and say it will become paid, with notice.

## Consequences

- A few fields and one module exist before they are needed, which is cheap.
- Pricing (per outlet, per device or tiered) can be decided later without schema changes.
- The free tier has real hosting costs, so per-tenant limits exist from the free release.
- Once revenue starts, the business's own tax position (for example PPN on the subscription)
  needs an accountant's review.
