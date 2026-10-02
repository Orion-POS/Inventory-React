# Review of the current menu, validation and flows

This compares what the app does today with [BUSINESS_RULES.md](./BUSINESS_RULES.md), which is based
on how a cafe or restaurant in Indonesia really runs its stock, purchasing and cash. It says what is
wrong, why it matters, and what to do about it.

What was reviewed: the sidebar menu, every page under Setup, Stock Management, Transaction,
Suppliers and Assets, their forms and zod schemas, the sample data in `src/db.json` and
`src/__dummy__`, and the types in `src/types`. Everything in the app runs on sample data in the
browser; there is no backend yet. So some findings are about the prototype and some are about the
design that the Go API will inherit. Findings use an ID (`F-01`) and a priority:

- **P1** produces wrong stock, wrong money, or lets a user do something the business rules forbid.
- **P2** is misleading or confusing, and will cause mistakes in daily use.
- **P3** is polish.

## 1. Summary

The prototype has the right instinct on several points, but its **menu is organised around forms
instead of around the work**, and its **validation rules are copied between screens without being
adapted**. The most important gaps:

1. **There is no way to receive goods.** Stock can only go up through "Adjustment". A real cafe
   buys goods every day, with a price and often on credit. Without a goods receipt there is no
   cost, no supplier payable, and no purchase history (F-05).
2. **There is no "stock on hand" page.** The one number everybody wants is hidden (F-06).
3. **The Adjustment form cannot reduce stock, and cannot add more than what is on hand.** Its
   validation was copied from "Used Stock" (F-13).
4. **The opname difference has the wrong sign**, and opname is one item at a time, not a counting
   session (F-16, F-17).
5. **The Wasted Stock form is a copy of the UoM form.** It cannot record a quantity or a reason
   (F-18).
6. **Units of measure are defined per category, but packaging (sack, carton, bottle) is
   per item.** The sample data already shows the trouble (F-20, F-21).
7. **Item master data stores stock quantities** (`in_stock`, `actual_stock`), which contradicts the
   ledger decision in ADR 0006 (F-22).

None of these is hard to fix while the screens are still prototypes, and none is cheap to fix after
the Go API and its database are built around them. That is why it is worth settling them now.

## 2. What is already right

- **Separate concepts for usage, waste, adjustment and opname.** Many small systems blur them.
  Keeping them apart is what lets a cafe see its real waste rate.
- **Items can be marked as tracked or not** (`track_item`), which matches how kitchens work (ice
  and water are not counted).
- **A reference unit with a ratio** is the correct way to model unit conversion.
- **Multi-row entry with a review step before posting** suits a storekeeper entering a list.
- **Duplicate items in one document are prevented**, even if by name instead of id (F-12).
- **Search and filter on every list**, and filters that are built from the data.
- **Zod schemas with `refine`** are the right tool. They need correcting, not replacing.

## 3. Menu structure

### 3.1 Current menu

```
Summary                (empty page)
Stock Management
  Used Stock
  Adjustment
  Stock Opname
  Wasted Stock
Transaction            (list, "Add" form is a copy of the UoM form)
Suppliers              (placeholder text)
Assets                 (placeholder text)
Setup                  (tabs)
  Item Category
  UoM Category
  Item Libraries       (the item list)
  Transaction Type
(stock-recap route exists, but is not in the menu and is an empty page)
```

### 3.2 Findings

| ID | Pri | Finding | Evidence | Why it matters |
|---|---|---|---|---|
| F-01 | P2 | **Summary** is empty, and `stock-recap` is reachable only by typing the URL | `SummaryPage.tsx`, `StockRecap.tsx`, `router.tsx:163` | The landing page should answer "what needs my attention today?" (low stock, payables due, waste, negative stock) |
| F-02 | P1 | **Item Libraries is hidden inside Setup.** The list of items is the most used screen in an inventory system, and a storekeeper adds new items weekly | `Setup/index.tsx`, `ItemLibraries.tsx` | Setup should hold rarely changed settings. Burying items there makes people avoid it and enter free text instead |
| F-03 | P2 | **"Stock Management" holds four peer pages with the same columns** (category, item, before, quantity, after, UoM, date) | `UsedStock.tsx`, `Adjustment.tsx`, `WastedStock.tsx` | They are all movements of one ledger. Four tables mean four places to look for "what happened to my sugar?" |
| F-04 | P2 | **"Transaction" mixes purchases and expenses.** Its rows have a supplier and a payment status (a purchase) but also types like "Pengeluaran Event" (an expense) | `sampleTransaction.ts`, `db.json` `transaction_types` | A purchase must change stock and create a payable. An expense does not. One list cannot do both |
| F-05 | P1 | **There is no goods receipt.** Stock goes up only through Adjustment | whole app | No cost per item, no average cost, no payable, no "price went up" warning. Business rules BR-PUR-01 to 10 have no screen |
| F-06 | P1 | **There is no stock-on-hand page.** The only place that shows a balance is a column in a movement table | whole app | The first question of every storekeeper and owner is "how much do I have?" |
| F-07 | P2 | **No payables screen.** A "Payment Status" column exists, but nothing shows what is owed, to whom, and when it is due | `Transaction.tsx` | Credit from suppliers is normal. Missing a due date costs money and damages the relationship |
| F-08 | P2 | **"Suppliers" and "Assets" are placeholders** but sit in the menu as if they work | `Suppliers.tsx`, `Assets.tsx` | A visible dead end for the user. Suppliers is needed before purchasing (BR-SUP) |
| F-09 | P3 | **Labels are inconsistent.** "Item Libraries" and "Item" are used for the same thing, "UoM" is jargon, and "Used Stock" is ambiguous (used by a sale, or used by a person?) | menu, tabs | Learnable, but a new employee should not need training for words |
| F-10 | P2 | **No reports menu, and no place for settings that grow** (outlets, staff and roles, waste reasons, tax) | menu | These are planned in the ROADMAP |

### 3.3 Recommended menu

Work first, configuration last, and only what exists is shown. Items marked with a phase are added
when that phase ships, not before.

```
Dashboard                        (was Summary)
INVENTORY
  Stock on hand                  NEW  quantity, average cost, value, low-stock badge
  Items                          MOVED from Setup > Item Libraries
  Movements                      MERGES Used Stock, Adjustment, Wasted Stock into one history
                                 with a "New" menu: Usage, Waste, Adjustment (Transfer later)
  Stock opname                   sessions, not single items
PURCHASING
  Goods receipts                 NEW  increases stock, creates a payable
  Suppliers
  Payables                       NEW  by due date
MONEY
  Expenses                       was Transaction, without purchases
  Assets                         later (Phase 5)
REPORTS                          later (stock, waste, COGS, payables)
SETTINGS                         was Setup
  Item categories
  Units of measure
  Expense types                  was Transaction Type
  Waste reasons                  later
  Outlets, Staff and roles       later
```

Reasoning:

- **Stock on hand** is the home of Inventory. Everything else is an action on it or a history of it.
- **Movements** is one table with a type filter. "Used", "Wasted" and "Adjustment" become types
  and quick actions. The three pages today share their columns, so little UI is lost, and a single
  history answers the question "what happened to this item?"
- **Opname stays separate** because it is a session with its own states (BR-OPN), not a movement
  form.
- **Purchasing is its own group** so the supplier journey is in one place: receive, owe, pay.
- **Expenses** keeps the "Transaction Type" idea but is no longer used for buying stock.
- The recipe screens (Phase 3) join Inventory as **Recipes**, after Items.

Navigation items in `src/config/navigation.ts` are data, so this is a small change once the pages
exist. Until then the existing four pages can stay under one "Stock" group and gain the rest later.

## 4. Terminology

| ID | Pri | Today | Problem | Recommendation |
|---|---|---|---|---|
| F-11 | P2 | **"In Stock" / "Initial Stock" / "Actual Stock" / "Current Stock"** on the same form (`UsedStockContent.tsx:175`) | "Actual stock" means the *counted* stock in an opname. Here it means the stock *after* the usage. Four names for two numbers | Use **Before**, **Quantity**, **After** on every movement form. Reserve "Counted" and "Expected" for opname |
| F-36 | P3 | "Stock Out" for the quantity used | Fine for a warehouse, odd for a kitchen. Also reused in the Adjustment message | "Quantity" |
| F-37 | P2 | "Occasion" for the waste reason | An occasion is an event. The reasons are expired, spoiled, spilled | "Reason" (BR-WST-01) |
| F-38 | P3 | "Transaction Type" holds values like "Belanja Hutang Bayar" and "Bahan Baku dan Pendukung" | One field mixes payment terms (credit, debt payment) with accounting class (ingredients). *The meaning of "Belanja Hutang Bayar" is assumed here and should be confirmed with the owner* | Separate the two: expense **group** and payment **status** (BR-EXP-02) |

## 5. Validation

### 5.1 Findings

| ID | Pri | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| F-12 | P1 | **Duplicate items are detected by name, not by id**, and when a duplicate is picked the user sees nothing, only `console.error` | `UsedStockContent.tsx:52, 105`, `AdjustmentContent.tsx:52, 105` | Compare ids. Show a field error ("Barang ini sudah ada di baris 2"). |
| F-13 | P1 | **Adjustment cannot reduce stock, and cannot add above stock on hand.** It requires `adjustment_stock ≥ 1` and `adjustment_stock ≤ in_stock`. The type says it is "added or subtracted" | `AdjustmentContent.tsx:36–46`, `itemTypes.ts` | A **signed** quantity, not 0, with the result not below 0 (BR-ADJ-01, 02). A required reason and note |
| F-14 | P1 | **Quantities must be at least 1.** `z.number().min(1)` rejects 0.5 kg of butter or 250 g of coffee | `UsedStockContent.tsx:36`, `AdjustmentContent.tsx:36` | Above 0, in steps of the unit's rounding (BR-GEN-02, BR-UOM-06) |
| F-15 | P2 | **The error message says the opposite of the rule.** The rule is "used ≤ available". The message says "Used Stock must be greater than or equal to initial Stock". The Adjustment form shows "Stock Out must be at least 1" and "Used Stock must be…" | `UsedStockContent.tsx:45`, `AdjustmentContent.tsx:37, 45` | "Jumlah melebihi stok yang tersedia (stok: 12 kg)". Messages are written per form, with the field and the fix (section 14 of the rules) |
| F-16 | P1 | **Opname variance has the wrong sign.** `difference = inStock − actualStock`. With 10 kg expected and 8 kg counted it shows **+2**, which reads as a surplus, while 2 kg are missing | `StockOpnameContent.tsx:78–79` | **Variance = counted − expected** (BR-OPN-04). −2 means missing. Show the value in rupiah at average cost |
| F-17 | P1 | **Opname is one item per form and has no session.** There is no snapshot of expected stock, no blind count, no approval, no recount of large variances, and no reason for a variance | `StockOpnameContent.tsx` | Redesign as a session (BR-OPN-01 to 09). See flow 6.4 |
| F-18 | P1 | **The Wasted Stock form is the UoM form.** Its fields are Item name, Unit, Type, Ratio, Rounding, Active, Default. It cannot record a quantity, an item picked from the list, or a reason | `WastedStockContent.tsx:12–149` | Rebuild as an item picker with quantity and reason (BR-WST-01, 02), like Usage |
| F-19 | P2 | **The stock-opname schema says "Username must be at least 2 characters"** for the item name. Several fields have no rule at all (`actualStock` may be negative) | `StockOpnameContent.tsx:24` | Counted quantity 0 or more, with rounding (section 14 of the rules) |

### 5.2 Units of measure and item master data

| ID | Pri | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| F-20 | P1 | **The UoM data is invalid.** Both "karung 10kg" and "karung 5kg" have the id `uom-11`, and two units in the same category are `default: true` | `db.json:68, 77, 74, 92` | Unique ids. Exactly one reference unit per category, with ratio 1 (BR-UOM-02) |
| F-21 | P1 | **Packaging is modelled inside a category.** "Karung 10kg" and "karung 5kg" are units of "Satuan beras". A sack of sugar or a carton of milk would need its own category, or a category per supplier pack size | `db.json` `uom_categories` | Categories are the three dimensions (weight, volume, count). Packaging is defined per item (BR-UOM-04, 05) |
| F-22 | P1 | **Items store stock.** The item record has `in_stock` and `actual_stock` | `db.json:32–33` | Remove both. Stock comes from the ledger (BR-ITM-06, ADR 0006). Add: type, base unit, packaging, minimum stock, shelf life, active |
| F-23 | P2 | **UoM form validation.** "Type" is free text (the data uses `bigger` and `reference`), ratio and rounding have no rules, the first field is labelled "Item name" for a category, and the "Cancel" button is `type="submit"` | `UoMCategory.tsx:152, 180–183, 261` | Type is derived (reference or not), not typed. Ratio above 0. The label is "Category name". Cancel is `type="button"` |
| F-24 | P3 | **The Save button reads "Save changesssssssssss"** | `UoMCategory.tsx:264` | "Save changes" |
| F-25 | P2 | **An item has one `uom_id` and one `item_cat_id`, and nothing else.** No type, no purchase packaging, no minimum stock | `db.json:30–40` | See BR-ITM-02 to 05 |
| F-26 | P2 | **Item categories are linked one-to-one to a transaction type** (`transaction_type_id`). The link is useful, but only as a default | `db.json:7` | A **default** expense type that the purchase can override (BR-CAT-02) |
| F-27 | P2 | **The category and item forms have no validation at all.** No required name, no unique check. The transaction type list is hard-coded ("Bahan Makanan", "Bahan Minuman") and does not come from the Transaction Type page | `ItemCategory.tsx:134–229`, `ItemLibraries.tsx` | Required unique name (BR-GEN-10). The list comes from the API |

### 5.3 Dates, money and numbers

| ID | Pri | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| F-28 | P2 | **Every row defaults to `date: new Date()` in the browser**, and the record then keeps a JavaScript `Date` (the Redux warnings) | form defaults | One effective date per document, defaulting to now, back-dating by permission (BR-STK-05). Send an ISO string, and let the server stamp the real time |
| F-29 | P2 | **`formatPrice` prints `Rp. 10.000`.** The usual form is `Rp 10.000`, with no period after Rp. It also breaks for decimals and negative numbers | `utils/formatPrice.ts` | `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`, and integer rupiah only (BR-GEN-01) |
| F-30 | P2 | **Transactions have no outstanding amount, no due date, no invoice number**, and a global id `T0001` | `transactionTypes.ts` | See BR-PAY-01, BR-GEN-04 |

## 6. Flows

### 6.1 Stock-in does not exist (F-05)

Today: Adjustment is the only way to add stock, and it caps the quantity (F-13).

Recommended **Goods receipt** flow (BR-PUR):

1. Choose the supplier (or "Pasar" for a market trip) and the date.
2. Add lines: pick an item, enter the quantity in a pack of that item (2 karung) or in the base
   unit, and the **line total** from the nota. The unit price is shown, not typed.
3. A warning appears if a price differs a lot from the average (BR-PUR-07).
4. Choose payment: paid now (method), on credit (due date from the supplier's terms), or part.
5. Optionally attach a photo of the nota.
6. **Post.** Stock goes up, the average cost changes, and a payable is created for what is unpaid.

### 6.2 Edit buttons on immutable records (F-31, P1)

The confirm dialog says the operation "will change the current stock item and you will unable to
cancel or edit" (`UsedStockConfirm.tsx:107`). The tables next to it have **Edit** buttons on every
row, and the Used Stock table also has **Assign to Item**, which comes from the Item Category page
and means nothing on a movement (`UsedStock.tsx:206`).

Recommendation (BR-GEN-05): a posted movement has **no Edit**. It has **Reverse**, which asks for a
reason, posts the opposite movement and links the two. The row action menu shows "View" and
"Reverse". The warning text says "cannot be edited; it can be reversed".

### 6.3 Usage, waste and adjustment

One flow, three types, so the screens share a component:

1. Pick the type (usage, waste or adjustment) and the reason from the fixed list.
2. Add lines (item, quantity). The form shows **Before**, **Quantity**, **After**.
3. Under the approval limit, the document posts. Above it, it waits for a manager (BR-USE-05,
   BR-WST-04, BR-ADJ-03).
4. The history shows the document with its status: pending, posted, rejected, reversed.

The server decides whether the stock is enough. The "Before" figure on the form is a hint that can
be out of date (BR-STK-07). Today the browser computes the new balance, and two people on two
tablets would overwrite each other.

### 6.4 Opname as a session

1. A manager starts a session and chooses its scope (everything, a category, a storage place). The
   system **snapshots the expected quantities** (BR-OPN-02).
2. Staff count, **blind** by default. One list, one row per item, with the quantity in the
   packaging they see on the shelf, so "2 karung + 3 kg" is accepted.
3. Items with a variance above the tolerance ask for a **recount** and a **reason**.
4. The counter submits. A **different** person reviews: the variance in quantity and rupiah, the
   items not counted, and approves.
5. Approval posts the adjustments, one per item with a variance. The session becomes final.

This is the biggest redesign in this document, and the most valuable one. It is also what makes the
monthly COGS figure trustworthy (BR-CST-05).

### 6.5 Setup is a prerequisite, but it is not guided

A new user must create categories, units, expense types and items before anything works, with no
order shown. A first-run checklist ("1. Add units 2. Add categories 3. Add items 4. Enter opening
stock") removes the guesswork, and a starter set of units (BR-UOM-03) removes the first step.

## 7. Data and architecture

| ID | Pri | Finding | Recommendation |
|---|---|---|---|
| F-32 | P1 | **All stock changes happen in browser state** (`usedStock` slice, sample arrays). That is fine for a prototype, but every rule in BUSINESS_RULES is enforced by the server | Treat the front-end schemas as quick feedback. Write each rule once in the OpenAPI schema and the Go service (ADR 0003) |
| F-33 | P2 | **Three different sources of data.** Item category from a REST call, used stock from a Redux slice, the rest from sample files, and two RTK Query APIs (`api.ts` and `usedStockApi.ts`) | One API definition per resource, generated from the OpenAPI document |
| F-34 | P2 | **Lists are filtered in the browser** with `watch` and `setState`. This does not scale to thousands of movements | Server-side filter, sort and pagination. The list pages become thin |
| F-35 | P3 | **Setup tables show sample data from a "earnings" file** (`earningsData`) for categories, items and transaction types | Replace when the API exists. Meanwhile, hide the rows rather than show a person's name as an item stock |

## 8. Suggested order of work

**Now, in the prototype (small, no backend needed).** These correct wrong behaviour and cost about
two to three days:

1. Fix the messages and labels: F-11, F-15, F-19, F-23, F-24.
2. Allow decimal quantities and signed adjustments: F-13, F-14.
3. Correct the opname sign: F-16.
4. Remove "Edit" and "Assign to Item" from the movement tables: F-31.
5. Replace the Wasted Stock form with an item picker, a quantity and a reason: F-18.
6. Compare duplicates by id and show an error: F-12.
7. Fix the sample data: F-20. Remove `in_stock` and `actual_stock` from items: F-22.
8. Correct `formatPrice`: F-29.

**Phase 0 and 1.** Write the rules into the OpenAPI document and the Go service; decide the
document model below. No new inventory screens yet; the pilot is a counter cafe (ROADMAP).

**Phase 3 (Inventory).** Build the structure in section 3.3: Items out of Setup, Stock on hand,
Goods receipts, Suppliers and Payables, Movements, and opname sessions. Migrate the existing pages
onto it rather than polishing them first.

**Decisions to make before Phase 3** (candidates for an ADR on stock documents):

- Do usage, waste and adjustment share one document table with a type? (Recommended.)
- Approvals: one generic mechanism with a limit per document type? (Recommended.)
- Is a goods receipt required for stock-in, with no "quick add" bypass? (Recommended: required,
  but with a one-line "market shopping" mode for speed.)
- The default approval limits and variance tolerances: ask the pilot cafe (section 15 of the
  rules).

## 9. Effect on the ROADMAP

- **Phase 3** lists "stock ledger, ingredients and recipes, stock opname, waste, purchasing". It
  should also name **goods receipts, payables, and opname as a counting session**, which are the
  parts this review found missing or wrong.
- **Reporting day.** The ROADMAP says the reporting day is cut at the outlet's local midnight. A
  cafe that closes at 02:00 would split one evening into two days. BR-GEN-09 makes the cutoff a
  per-outlet setting.
- **The pilot's stock figures.** Stock falls when a drink is sold only once recipes exist
  (Phase 3). In the pilot (Phase 1) and early access (Phase 2) it falls only through manual usage
  and waste, so the pilot cafe should not rely on its stock balance yet.
