# 0009. Stock quantities are scaled integers; unit ratios are integer fractions

Status: accepted

## Context

ADR 0006 says stock is an append-only ledger and that quantities which are not whole numbers are
"stored as scaled integers in the base unit, with UoM conversion applied at the edges". It does not
say what the scale is, how units convert, or how rounding works. Phase 3 needs those answers before
the first inventory table exists, because they cannot be changed once ledger rows are written.

The back office's Setup pages follow the Odoo model: a unit-of-measure category (weight, volume,
count) has one reference unit and other units that are bigger or smaller, each with a `ratio` and a
`rounding`, both floats (`ratio: 1000`, `rounding: 0.01`). Recipes deduct small amounts many times
a day (12.5 g of coffee per cup), purchases arrive in large units (a 25 kg sack), and an opname
compares a count against the sum of thousands of rows. With floats that sum drifts, and two
machines can disagree about a balance.

[BUSINESS_RULES.md](../BUSINESS_RULES.md) sets the rules this ADR implements: units in a UoM
category convert to its reference unit (BR-UOM-01, 02), packaging is defined per item (BR-UOM-04,
05), a quantity off the unit's step is rejected (BR-UOM-06), and a unit in use keeps its ratio
(BR-UOM-07). It changes one of them, BR-GEN-02, as explained below.

## Decision

### Quantities

- Every stored quantity is an **integer number of thousandths of the ingredient's base unit**
  (`quantity_scaled bigint`). With grams as the base unit, 12.5 g is `12500`; 1 is 0.001 g.
- An ingredient's **base unit is the reference unit of its UoM category**, so the precision is
  0.001 of that unit. Owners should make the smallest practical unit the reference (g, ml, pcs),
  not "ons" or "kg"; the back office says so when a category is created.
- Ledger rows, balances, recipe lines and counted quantities all use this one scale. Adding,
  subtracting and multiplying by a whole number (a recipe times the quantity sold) are exact, so a
  balance rebuilt from the ledger always equals the materialized balance to the last unit.
- The `bigint` range (about 9.2 × 10^15 base units at this scale) is far beyond any cafe. The API
  bounds every quantity to ±10^15 so it stays an exact JavaScript number.
- **This changes BR-GEN-02**, which stored whole base units (2.5 kg = 2500 g). Whole grams cannot
  hold a recipe that uses 12.5 g of coffee or 0.5 ml of syrup, and a recipe is multiplied by every
  cup sold, so the fraction cannot simply be rounded away. A unit's step (BR-UOM-06) still decides
  what a person may type; the extra three digits are room for recipes and conversions, not an
  invitation to enter milligrams.

### Units and ratios

- A unit belongs to exactly one category. Its size is a **positive integer fraction of the
  reference unit**: `ratio_num / ratio_den`, meaning one of this unit is `ratio_num / ratio_den`
  reference units. A kilogram in a gram category is `1000/1`, a 250 ml cup in a millilitre category
  is `250/1`, a US cup is `59147/250` (236.588 ml), a tenth of a gram would be `1/10`. The pair is
  stored reduced by its greatest common divisor, each part between 1 and 10^9.
- Exactly one unit per category is the reference, with `1/1`. "Bigger" and "smaller" are derived
  from the fraction for display; they are not stored, so they can never disagree with the ratio.
- The back office turns what the owner types ("236.588") into a fraction **from the text**, never
  through a float: `236588/1000`, reduced by the server.
- **Packaging is per item** (BR-UOM-04, 05): "Beras: 1 karung = 25 kg" is a unit that belongs to
  that item, in its base unit's category, with the same kind of fraction (`25000/1` g). It follows
  every rule here; only its owner differs.
- There is **no conversion between categories** (volume to weight needs a density the system does
  not know). An ingredient bought by the litre and used by the gram gets a packaging unit, such as
  "Minyak: 1 liter = 920 g", whose ratio the owner sets.
- `rounding` is the unit's **step** (BR-UOM-06), stored as thousandths of that unit
  (`rounding_scaled`: 0.01 → `10`, whole units → `1000`, at least `1`). An entered quantity that is
  not a multiple of its unit's step is **rejected** (`validation_failed`), never rounded.

### Conversion and rounding

- Entering a quantity in a unit: the client sends `{uom_id, quantity_scaled}` with
  `quantity_scaled` in thousandths **of that unit**. The server converts once, at the edge:
  `base = quantity_scaled × ratio_num / ratio_den`, computed exactly (in `math/big` or with
  overflow checks, not floats). The entry itself is never rounded (it is on its step or refused);
  only a ratio that does not divide evenly, such as a US cup, can leave a remainder below 0.001 of
  the base unit, which is rounded **half away from zero**. That is the only rounding of a stored
  quantity, at most 0.0005 of the base unit per entry.
- Documents (purchase lines, opname counts, waste and transfer lines) keep what was typed, the unit
  and the converted base quantity. The ledger keeps only the base quantity.
- **A unit in use keeps its ratio** (BR-UOM-07): once an item or a movement refers to it, its ratio
  cannot change. The owner adds a new unit and deactivates the old one, so a document always reads
  with the ratio it was entered with.
- Reading: the API returns base quantities (`quantity_scaled`) and the categories' ratios; the
  client converts for display (`quantity_scaled × ratio_den / ratio_num`) and rounds to the unit's
  `rounding`.
- One Go function does the conversion, with property tests (entry, conversion and display agree;
  conversions never overflow inside the bounds; a unit's own ratio round-trips exactly).

### Fixed once used

- An ingredient's base unit (BR-ITM-07), and a category's reference unit, cannot change once the
  ingredient has a ledger row or a recipe line: either would silently rescale every balance. A unit
  in use can be deactivated, never deleted, and keeps its ratio (above).

### Cost

- Money stays integer rupiah (ADR 0006). A price per thousandth of a gram is not a whole number,
  so a movement carries its **total cost in rupiah** (`cost_total bigint null`), not a unit cost.
  A unit cost is derived when it is displayed. The valuation method (average or last cost) is
  decided with the inventory reports, not here.

## Consequences

- Balances, rebuilds and opname differences are exact integer arithmetic, so the nightly check can
  demand equality instead of a tolerance.
- The precision limit is 0.001 of the reference unit. A category whose reference is "kg" can only
  record whole grams; this is why the reference should be the smallest unit.
- A ratio typed wrongly cannot be fixed in place once used; the fix is a new unit. The back office
  should show the conversion ("1 karung = 25 kg") before the owner saves.
- The API and the back office carry integers, not decimals. The back office needs one helper that
  turns typed text into thousandths and fractions, and one that formats them back.
- Ratios like a US cup are exact; a unit whose real size is irrational to the owner (a "scoop")
  is whatever fraction the owner types.
- The sample UoM data in the back office (`src/__dummy__/sampleUoMCategory.ts`) does not follow
  these rules (an "ons" reference with `kg = 1000` where 1 kg is 10 ons, and a litre in a weight
  category at the same ratio) and is replaced when the Setup pages move to the API.
