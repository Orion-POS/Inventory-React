# 0006. Money is integer rupiah; stock is an append-only ledger

Status: accepted

## Context

Rupiah has no minor unit in everyday use, and tax, service charge and rounding must be exact.
Inventory that is stored as an editable count loses its history and cannot be audited.

## Decision

- Store and compute all money as **integer rupiah**. Never use floating point for money.
- Tax rates, service charge and cash rounding are **per-outlet configuration**.
- Stock quantities are not stored as editable numbers. The source of truth is an **append-only
  stock ledger** (receive, sale consumption, waste, opname adjustment, transfer). The current
  stock level is derived from it, with a materialized balance for speed.
- Quantities that are not whole numbers (for example grams of an ingredient) are stored as scaled
  integers in the base unit, with UoM conversion applied at the edges.

## Consequences

- Every stock change has a reason and a timestamp, which makes opname and waste reports honest.
- Corrections add ledger rows instead of editing them.
- Balances need a rebuild job to repair them if a bug corrupts one.
