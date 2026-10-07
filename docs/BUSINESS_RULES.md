# Business rules

The rules Orion follows for a cafe or restaurant in Indonesia: master data, purchasing, stock,
costing, expenses, selling, roles and reporting. Developers use it to implement and test. The
owner uses it to check that the product does what a real kitchen does.

How to use it:

- Every rule has an ID (`BR-STK-04`). Cite the ID in code comments, tests, tickets and pull
  requests, so a rule can be traced and changed in one place.
- **Phase** says when the rule is first needed, using the phases in [ROADMAP.md](./ROADMAP.md).
- A rule written as "must" is enforced by the **server**. The front end repeats it only to give
  quick feedback; it is never the only check.
- Numbers marked *default* are suggested starting values. Each business can change them in
  settings.
- Where a rule depends on tax or accounting law, it is marked **confirm**. Check it with an
  accountant before relying on it.

This document was written from industry practice and from reading the current code. It has not yet
been checked against a real cafe. Phase 0 includes recruiting a design-partner cafe; its first job
is to correct this document. How today's screens compare with these rules is in
[FLOW_REVIEW.md](./FLOW_REVIEW.md).

Related decisions: [ADR 0006](./adr/0006-integer-money-and-stock-ledger.md) (integer money and the
stock ledger), [ADR 0004](./adr/0004-offline-first-pos.md) (offline POS),
[ADR 0007](./adr/0007-free-early-access-then-subscription.md) (plans and billing).

## 1. Terms

| Term | Meaning |
|---|---|
| Tenant | A business that uses Orion. It can have several outlets |
| Outlet | One physical place that sells and stores stock |
| Bahan baku | Raw ingredient, such as rice, coffee beans, milk, chicken |
| Bahan penolong / pendukung | Supporting material that goes into the product but is not the main ingredient, such as cooking oil, sugar sachets, cups, straws |
| Setengah jadi | Prepared item made in the kitchen from other items, such as syrup, sauce, cold brew base, dough |
| Barang jadi | Finished goods bought ready to sell, such as bottled drinks or packaged snacks |
| Perlengkapan | Supplies that are used up but not sold, such as tissue, cleaning products, stationery (ATK) |
| Aset | Equipment kept for years, such as a grinder, fridge or tablet |
| UoM | Unit of measure. Base unit: the smallest unit an item is counted in, such as gram, millilitre, piece |
| Belanja pasar | Daily cash shopping at a market, usually with a handwritten note instead of an invoice |
| Nota / faktur | Receipt or invoice from a supplier |
| Tempo / jatuh tempo | Payment terms and due date for a purchase on credit (for example 7, 14 or 30 days) |
| Hutang | Money owed to a supplier |
| Stock opname | A physical count of stock, compared with what the system says |
| Susut | Stock lost to waste, spoilage, spillage or theft (shrinkage) |
| Retur | A return, to a supplier or by a customer |
| COGS / HPP | Cost of goods sold: the cost of what was sold or used |
| PBJT | Regional tax on food and drink service (replaced PB1; see ROADMAP) |
| Service charge | A percentage added to the bill for staff, shown as its own line |
| Pembulatan | Cash rounding on the final bill |

## 2. General rules

| ID | Rule | Phase |
|---|---|---|
| BR-GEN-01 | Money is an integer number of rupiah everywhere, in storage, calculation and API. Never a float. Display as `Rp 15.000` (a space after `Rp`, a dot between thousands, no period after `Rp`, no decimals) | 0 |
| BR-GEN-02 | Quantities are stored as integers in **thousandths of the item's base unit** ([ADR 0009](./adr/0009-scaled-integer-quantities-and-uom-ratios.md)), so a recipe can use 12.5 g. A 2.5 kg bag of flour is 2500 g, stored as 2,500,000. The unit's step (BR-UOM-06) decides how many decimals the user may enter and see | 3 |
| BR-GEN-03 | Every record belongs to a tenant, and stock records also to an outlet. A user never sees another tenant's data | 0 |
| BR-GEN-04 | Every record has a UUIDv7 id. People see a human number (`GR-JKT1-000123`, `OPN-JKT1-000007`) that is unique per outlet and never reused, even after a cancel or reversal. Gaps are allowed | 3 |
| BR-GEN-05 | Posted records (a stock movement, a receipt, a payment) are never edited or deleted. A mistake is fixed with a **reversal** that points to the original, has a reason, and is posted by someone with permission | 3 |
| BR-GEN-06 | Master data (items, suppliers, categories, units) is **archived**, not deleted, once anything refers to it. An archived record disappears from pickers and stays in history and reports | 3 |
| BR-GEN-07 | Every create, change, approval and reversal records who, when, and from which device. Changes to a posted document's status keep the old and new values | 3 |
| BR-GEN-08 | Timestamps are stored in UTC with the outlet's timezone (WIB, WITA or WIT) known. Reports use the outlet's local time | 1 |
| BR-GEN-09 | The **business day** starts at an hour set per outlet (*default* 00:00). A late-night venue that closes at 02:00 can set 04:00, so those sales belong to the day the shift started | 1 |
| BR-GEN-10 | Names are compared case-insensitively with spaces trimmed. `Beras`, `beras ` and `BERAS` are the same name | 3 |
| BR-GEN-11 | The interface is Indonesian by default and English is available. Stored values such as reasons and statuses are codes, translated when shown, so changing the language never changes data | 0 |

## 3. Master data

### 3.1 Items

An item is anything the business buys, stores, prepares or uses. Menu items that customers order
belong to the catalog (ROADMAP Phase 1) and are separate from these.

| ID | Rule | Phase |
|---|---|---|
| BR-ITM-01 | An item has a **type**: `ingredient`, `supporting` (bahan penolong), `prepared` (setengah jadi), `finished` (barang jadi) or `supply` (perlengkapan). Equipment is an **asset** (section 9), not an item | 3 |
| BR-ITM-02 | Required: name (unique per tenant, 2 to 100 characters), type, category and **base unit**. Optional: SKU, barcode, notes, storage place, photo | 3 |
| BR-ITM-03 | An item is either **stock-tracked** or not. Cheap things that are never counted (ice, tap water, a pinch of salt) can be untracked: they can be bought and used in recipes, but they have no balance, no opname and no low-stock alert | 3 |
| BR-ITM-04 | A tracked item can have a **minimum stock** (reorder level), in base units. Below it, the item shows in a "needs restocking" list. Zero or empty means no alert | 3 |
| BR-ITM-05 | A perishable item can have a **shelf life** in days. A receipt can then record an expiry date, and an "expiring soon" list uses it. Expiry is a date on the receipt line, not full batch tracking, until a business needs more | 3 |
| BR-ITM-06 | Stock on hand and cost are **never edited on the item**. They come from the stock ledger (BR-STK-01). The only way to start with stock is an opening-balance movement with a date and a reason | 3 |
| BR-ITM-07 | The base unit cannot be changed once the item has any movement. Changing it would change the meaning of every old quantity | 3 |
| BR-ITM-08 | An item with stock on hand cannot be archived. Move or write off the stock first | 3 |
| BR-ITM-09 | An item belongs to one category. Its category gives a default expense type for purchases (BR-EXP-02); a purchase line can override it | 3 |

### 3.2 Units of measure

Weight, volume and count do not convert into each other (kilograms never become litres without an
item-specific density), and packaging like "sack", "carton" or "bottle" means a different amount for
each item. So units come in two layers.

| ID | Rule | Phase |
|---|---|---|
| BR-UOM-01 | A **UoM category** is a physical dimension: weight, volume or count. Units inside one category convert by a fixed ratio to the category's **reference unit** (gram, millilitre, piece) | 3 |
| BR-UOM-02 | Each UoM category has exactly one reference unit with ratio 1, and every other unit has a ratio above 0. Unit names are unique within the category, and symbols (`kg`, `g`, `L`, `ml`) are unique too | 3 |
| BR-UOM-03 | Standard units are provided for the three dimensions: `g`, `kg`, `ml`, `L`, `pcs`, `lusin` (12), `kodi` (20). The owner can add more. Standard units cannot be deleted | 3 |
| BR-UOM-04 | **Packaging is defined per item**, not per category. Example: "Beras: 1 karung = 25 kg", "Gula: 1 karung = 50 kg", "Telur: 1 tray = 30 pcs", "Sirup: 1 botol = 750 ml". A purchase is entered in the packaging, and the system stores base units | 3 |
| BR-UOM-05 | An item has one **base unit**, optionally one **purchase packaging** per supplier-pack size, and one **recipe unit** (usually the base unit, or a convenient one like `g` for coffee). All must be in the same UoM category as the base unit | 3 |
| BR-UOM-06 | **Rounding** decides the smallest step a person may enter for a unit, such as 0.01 for kg, 1 for g and ml, 1 for pcs. A quantity that is not a multiple of the step is rejected, never silently rounded | 3 |
| BR-UOM-07 | A unit that is used by any item or movement cannot be deleted or have its ratio changed. Add a new unit instead and archive the old one | 3 |

### 3.3 Item categories

| ID | Rule | Phase |
|---|---|---|
| BR-CAT-01 | A category groups items for reports and counts, for example *Kopi*, *Susu & dairy*, *Sayur*, *Daging*, *Bumbu kering*, *Kemasan*, *ATK*. Names are unique per tenant | 3 |
| BR-CAT-02 | A category can have a **default expense type**. It pre-fills the expense type on purchases. It is a default only, never a hard link | 3 |
| BR-CAT-03 | A category with items cannot be deleted. It can be archived, or its items moved first | 3 |
| BR-CAT-04 | Categories are one level. Add sub-categories only if a pilot cafe needs them | 3 |

### 3.4 Suppliers

| ID | Rule | Phase |
|---|---|---|
| BR-SUP-01 | Required: name (unique per tenant). Useful: contact person, **WhatsApp number** (most ordering happens there), address, bank account, tax ID (NPWP) if they have one | 3 |
| BR-SUP-02 | A supplier has **payment terms**: cash on delivery, or credit with a number of days (7, 14, 30, or custom). The terms pre-fill the due date on a purchase | 3 |
| BR-SUP-03 | A supplier can be marked as a **market / ad-hoc** supplier ("Pasar", "Toko kelontong"). Purchases from it can be entered in one line per item without an invoice number | 3 |
| BR-SUP-04 | A supplier with open payables or a purchase in the last period cannot be deleted, only archived | 3 |
| BR-SUP-05 | A supplier can have a list of items it supplies, each with the pack size and the **last price paid**. The list helps ordering and flags price changes (BR-PUR-07). It never restricts what can be bought | 3 |

## 4. Purchasing and receiving

Most cafes do not issue purchase orders for everything. Dry goods and dairy come from regular
suppliers on credit. Vegetables, meat and ice come from the market, in cash, in the morning. Both
must work, and both must increase stock.

| ID | Rule | Phase |
|---|---|---|
| BR-PUR-01 | **Goods receipt** is the document that increases stock. It has a date, a supplier, an outlet, and lines. Each line has an item, a quantity in a unit of that item, a total price, and optionally an expiry date | 3 |
| BR-PUR-02 | Required on a line: an item, a quantity above 0 that respects the unit's rounding, and a **line total in whole rupiah** (zero allowed only for a marked free/bonus item). The unit price is derived: total divided by quantity | 3 |
| BR-PUR-03 | Prices are entered as a **total per line**, because that is what the nota says and it avoids rounding errors from per-unit prices such as Rp 0,6 per gram | 3 |
| BR-PUR-04 | A receipt records whether prices include tax. Input tax matters only to a business that is a VAT-registered company (PKP). **Confirm** with an accountant before building tax reclaim | 5 |
| BR-PUR-05 | A receipt has a **payment status**: paid now (with a method), on credit (with a due date), or part-paid. This creates a payable (section 5) when anything is unpaid | 3 |
| BR-PUR-06 | A receipt can have a **photo of the nota** attached. It is optional by default and can be made mandatory above an amount (*default* off) | 3 |
| BR-PUR-07 | When a line's unit price differs from the item's average cost by more than a set percentage (*default* 20%), the user sees a warning and can continue. The warning is logged | 3 |
| BR-PUR-08 | A receipt is a **draft** until posted. Posting adds a `purchase_receipt` movement per tracked line. A posted receipt is changed only by reversal (BR-GEN-05), and a reversal is refused if it would make an item's stock negative | 3 |
| BR-PUR-09 | **Partial delivery**: a receipt can cover only part of what was ordered. A later receipt covers the rest. There is no rule that one order equals one receipt | 3 |
| BR-PUR-10 | **Supplier return** (retur): a document that reduces stock and the payable (or creates a supplier credit if already paid). It needs the original receipt or a reason, and a manager's approval | 3 |
| BR-PUR-11 | Purchase **orders** are optional and come later. If used: draft, sent, partly received, received, cancelled. A receipt can be created from an order, but never requires one | 6 |
| BR-PUR-12 | **Market shopping advance**: an owner or manager can give a staff member cash for the day's market trip. After the trip the staff member enters the receipts and the system shows the difference to return (or claim). The advance is closed only when the difference is settled | 3 |

## 5. Payables (hutang)

| ID | Rule | Phase |
|---|---|---|
| BR-PAY-01 | A payable has: supplier, source receipt, total, **amount paid**, **outstanding**, due date and status. Outstanding is always total minus payments, never typed in | 3 |
| BR-PAY-02 | Status is derived: `unpaid` (nothing paid), `partial` (some paid, some outstanding), `paid` (outstanding is 0), `overdue` (outstanding above 0 and past the due date). Overdue is shown on top of unpaid or partial | 3 |
| BR-PAY-03 | A payment has a date, an amount, a method (cash from drawer, petty cash, bank transfer, QRIS, other) and an optional proof photo. The amount must be above 0 and not more than the outstanding. Overpayment is refused; a supplier credit is created explicitly instead | 3 |
| BR-PAY-04 | One payment can settle several receipts of the same supplier. The user chooses how it is split, or the oldest due first by default | 3 |
| BR-PAY-05 | Payments from the **cash drawer** reduce the shift's expected cash and appear in the end-of-shift report (BR-SHF-04) | 3 |
| BR-PAY-06 | A payment is reversed, not deleted. The payable goes back to its earlier status | 3 |
| BR-PAY-07 | The owner sees a **payables list by due date** and a summary of what is due this week. Reminders can come by notification | 3 |

## 6. Stock

### 6.1 The ledger

| ID | Rule | Phase |
|---|---|---|
| BR-STK-01 | Stock is an **append-only ledger** of movements per item and outlet (ADR 0006). The stock on hand is the sum of movements. Nothing edits a balance directly | 3 |
| BR-STK-02 | Movement types: `opening`, `purchase_receipt`, `supplier_return`, `sale_consumption`, `production_in`, `production_out`, `usage` (internal use), `waste`, `adjustment`, `opname_adjustment`, `transfer_out`, `transfer_in`, `reversal` | 3 |
| BR-STK-03 | Every movement has: item, outlet, quantity (signed, base units), type, **reason** (a code, plus an optional note), who, when, the source document, and the value in rupiah | 3 |
| BR-STK-04 | **Negative stock.** A sale (selling from a recipe) is never blocked by a low balance, because the shelf can be ahead of the system and a customer is waiting. The balance may go below 0 and shows in a "negative stock" list for a manager to resolve. All **manual** movements (usage, waste, transfer out, supplier return) are **refused** if they would take the balance below 0 | 3 |
| BR-STK-05 | A movement's **effective date** defaults to now. A user may back-date within the current open period (BR-STK-06) if their role allows. A future date is refused | 3 |
| BR-STK-06 | A period (a month) can be **closed** by the owner or manager after the month-end opname. A closed period accepts no new or reversed movements dated inside it. A correction is posted in the open period with a note | 3 |
| BR-STK-07 | **Concurrent use.** The server recalculates the balance when a movement is posted. The "stock before" shown on a form is a hint only and can be stale. If two people post against the same item, both succeed in order, and the later one is refused only under BR-STK-04 | 3 |
| BR-STK-08 | A balance can be **rebuilt** from the ledger. A mismatch between the stored balance and the rebuilt one is a bug and raises an alert | 3 |

### 6.2 Internal usage (pemakaian internal)

Selling a menu item deducts its ingredients automatically from the recipe (section 8). **Usage**
is the manual deduction for things that are not a sale.

| ID | Rule | Phase |
|---|---|---|
| BR-USE-01 | Reasons (codes): `staff_meal` (makan karyawan), `sampling` (tester, menu trial), `training`, `event_or_promo` (give-away, event), `kitchen_use` (items used without a recipe), `other` (note required) | 3 |
| BR-USE-02 | A usage document has one or more lines. Each has an item, a quantity above 0 with valid rounding, and the reason. The date is the effective date (BR-STK-05) | 3 |
| BR-USE-03 | The same item cannot appear twice in one document. Compare by **item id**, not by name | 3 |
| BR-USE-04 | The value of usage is the item's average cost at that time, so reports can show it as a cost | 3 |
| BR-USE-05 | Usage up to a limit (*default* Rp 100.000 per document) posts at once. Above it, the document waits for a manager's approval before it moves stock | 3 |

### 6.3 Waste (susut)

| ID | Rule | Phase |
|---|---|---|
| BR-WST-01 | Reasons (codes): `expired` (kadaluarsa), `spoiled` (rusak, basi), `spilled` (tumpah, pecah), `remake` (salah buat, order remade), `returned_by_customer`, `quality_reject`, `lost_unknown` (hilang, selisih tidak diketahui), `other` (note required). The list is fixed so reports can group by reason; a business can add reasons | 3 |
| BR-WST-02 | A waste line has an item, a quantity above 0 with valid rounding, a reason, and optionally a photo. It cannot take the balance below 0 (BR-STK-04) | 3 |
| BR-WST-03 | The value is the average cost at that time. The report shows waste by reason, item and value, and as a percentage of purchases | 3 |
| BR-WST-04 | Waste above the approval limit (*default* Rp 100.000 per document) needs approval from a manager, who is not the creator. `lost_unknown` always needs approval, whatever the amount | 3 |
| BR-WST-05 | Waste of a **menu item that was already made** (a finished drink thrown away) records the ingredients through its recipe, not the menu item. Without a recipe, record the ingredients by hand | 3 |
| BR-WST-06 | `staff_meal` is **usage**, not waste. Mixing them hides the real waste rate | 3 |

### 6.4 Adjustment

An adjustment corrects a count that is wrong **outside an opname**: a data entry mistake, a found
item, an opening balance. It is **signed**: it can add stock or remove it.

| ID | Rule | Phase |
|---|---|---|
| BR-ADJ-01 | A line has an item, a **signed** quantity (positive adds, negative removes, never 0), a reason code and a required note. Reasons: `opening_balance`, `entry_mistake`, `found`, `damaged_in_storage`, `other` | 3 |
| BR-ADJ-02 | A negative adjustment cannot take the balance below 0. A positive adjustment has no upper limit, because it is how stock that was never entered comes in | 3 |
| BR-ADJ-03 | An adjustment needs a manager's approval when its value exceeds the limit (*default* Rp 100.000), or when it is a positive adjustment to an item that has purchases in the last 30 days (a possible duplicate of a receipt). **Confirm** with the pilot | 3 |
| BR-ADJ-04 | Adjustment is **not** a substitute for stock-in. Buying goes through a goods receipt, so it carries a price and a payable | 3 |

### 6.5 Stock opname

| ID | Rule | Phase |
|---|---|---|
| BR-OPN-01 | An opname is a **session** with a scope (the whole outlet, a category, or a storage place) and many items, not one item at a time. States: `counting` → `review` → `approved` (posted) or `cancelled` | 3 |
| BR-OPN-02 | When the session starts, the system **freezes the expected quantity** of each item in scope as a snapshot with the time. Movements after that time are kept and applied, so the variance compares against the snapshot plus later movements | 3 |
| BR-OPN-03 | **Blind count** is the default for staff: the counter does not see the expected quantity. Managers and owners can turn it off | 3 |
| BR-OPN-04 | **Variance = counted − expected.** Negative means missing stock (a loss), positive means surplus. The report shows the variance in base units, in packaging, and in **rupiah at average cost** | 3 |
| BR-OPN-05 | Counted quantity is zero or more, and respects the unit's rounding. An item that was **not counted** is not treated as 0; it stays out of the posting and is listed as "not counted" | 3 |
| BR-OPN-06 | Each variance with an absolute value above the tolerance (*default* 2% of expected, or Rp 20.000, whichever is higher) needs a **reason** (reuse BR-WST-01 and BR-ADJ-01 codes) and prompts a **recount** | 3 |
| BR-OPN-07 | The person who counted cannot approve the session. A manager or the owner approves. Small businesses with one person may switch this off, and the owner accepts it is a weaker control | 3 |
| BR-OPN-08 | Approving posts one `opname_adjustment` movement per counted item with a variance. A session with no variance posts nothing | 3 |
| BR-OPN-09 | An approved session is final. A mistake is fixed in a new session or a reversal by the owner | 3 |
| BR-OPN-10 | **Suggested frequency** (shown as a schedule, not enforced): daily for perishables and high-value items (meat, seafood, dairy, coffee beans), weekly for fast-moving dry goods, monthly for everything. The monthly full opname closes the period and gives the closing stock for COGS (BR-CST-05) | 3 |

### 6.6 Transfers

| ID | Rule | Phase |
|---|---|---|
| BR-TRF-01 | A transfer moves stock between two outlets, or between a central kitchen or warehouse and an outlet. It is two steps: `transfer_out` (sender, status **in transit**) and `transfer_in` (receiver, confirms what arrived) | 6 |
| BR-TRF-02 | The receiver can accept less than was sent. The difference is a loss in transit, approved by a manager, and stays visible | 6 |
| BR-TRF-03 | The transfer is valued at the sender's average cost. The receiver's cost is updated by it | 6 |

## 7. Costing

| ID | Rule | Phase |
|---|---|---|
| BR-CST-01 | The cost method is **weighted average**, per item and outlet. FIFO and batch costs are not offered until a business asks for them | 3 |
| BR-CST-02 | The system keeps, per item and outlet, **total quantity** (base units) and **total value** (whole rupiah). The average unit cost is value divided by quantity, so it is never stored rounded | 3 |
| BR-CST-03 | A **receipt** adds its quantity and its line total to the totals. A **consumption** (sale, usage, waste, opname loss) removes the quantity and a value of `round(quantity × value ÷ quantity on hand)`. A small rounding remainder stays in the balance and goes away as stock moves | 3 |
| BR-CST-04 | When stock is **negative**, consumption uses the last known average cost. The receipt that later brings the balance above 0 is not revalued back into earlier consumptions | 3 |
| BR-CST-05 | **COGS for a period** = opening stock value + purchases − closing stock value, where closing comes from the month-end opname. The ledger-based figure (sum of consumption values) is shown next to it, and the difference is the unexplained loss | 3 |
| BR-CST-06 | Reports show the **latest purchase price** next to the average, because owners think in "what I paid last time", and markets move prices daily | 3 |

## 8. Recipes and production

| ID | Rule | Phase |
|---|---|---|
| BR-RCP-01 | A **recipe** belongs to a menu item (or a prepared item) and lists ingredient items with a quantity in the item's recipe unit for **one portion** or one **batch** | 3 |
| BR-RCP-02 | Recipe quantities respect the unit rounding. A recipe may use prepared items, up to 2 levels deep, with no loops | 3 |
| BR-RCP-03 | A recipe line can have a **yield or trim percentage** (peeled vegetables, whole chicken, fruit): the purchased quantity needed is `net quantity ÷ yield`. *Default* 100% | 3 |
| BR-RCP-04 | **Modifiers and variants** change the recipe: size changes quantities, "extra shot" adds an ingredient, "no sugar" removes one. A modifier is a recipe delta | 3 |
| BR-RCP-05 | Selling a menu item posts `sale_consumption` for each tracked ingredient of its recipe. A menu item with **no recipe** deducts nothing, and the menu list shows it as "no recipe" | 3 |
| BR-RCP-06 | A **void** or **refund** that returns the item to stock reverses the consumption. A refund of a made-and-thrown-away item does not (BR-WST-05) | 3 |
| BR-RCP-07 | **Production** of a prepared item (syrup, sauce, dough) is a document: it consumes ingredients and creates the prepared item in a stated **yield quantity**. The yield is entered by the person who made it, and the cost of the output is the cost of the inputs | 3 |
| BR-RCP-08 | A recipe change applies to **future sales only**. Past consumption is never recalculated | 3 |
| BR-RCP-09 | The recipe cost per portion and the margin against the selling price are shown, using the average cost. A margin below a threshold (*default* 30% food cost is the usual target ceiling) is highlighted | 3 |

## 9. Expenses and assets

| ID | Rule | Phase |
|---|---|---|
| BR-EXP-01 | An **expense** is money spent that is not stock: rent, electricity, salaries, repairs, delivery fees, event costs. It has a date, an amount, an **expense type**, a payee, a payment method, and an optional photo | 3 |
| BR-EXP-02 | An **expense type** has a name and a **group**: `cost_of_goods` (ingredients and supporting materials), `operating` (rent, utilities, salaries, supplies), `maintenance`, `marketing_event`, `capital` (equipment). The group is a classification only. It is **separate from the payment status**: "paid", "on credit" or "debt payment" is a field of the payment, not a type of expense | 3 |
| BR-EXP-03 | A purchase of stock (a goods receipt) counts as a `cost_of_goods` expense through its expense type. Do not enter the same money again as an expense | 3 |
| BR-EXP-04 | An expense paid from the **cash drawer or petty cash** reduces expected cash in the shift (BR-SHF-04) | 3 |
| BR-EXP-05 | Recurring expenses (rent, subscriptions) can be set to repeat monthly. They create a **draft** to confirm, never a posted expense by themselves | 6 |
| BR-AST-01 | An **asset** has a name, a purchase date, a cost, an outlet, a condition and an optional serial number. It is not stock-tracked and it has no recipe use | 5 |
| BR-AST-02 | A purchase above a value limit set by the business (*default* Rp 2.500.000) is suggested as an asset. **Confirm** the threshold and depreciation with an accountant | 5 |
| BR-AST-03 | An asset can be **retired** (sold, broken, lost) with a date and a reason. It is not deleted | 5 |

## 10. Selling

These rules are for the cashier app. They are here because stock, cost and reports depend on them.
The ROADMAP has the schedule, and [ADR 0004](./adr/0004-offline-first-pos.md) has the offline design.

### 10.1 Bill calculation

| ID | Rule | Phase |
|---|---|---|
| BR-SAL-01 | Order of calculation: **line subtotal → discounts → service charge → tax → cash rounding**. Service charge is calculated on the amount **after** discounts. Tax is calculated on the amount **after discounts plus service charge** (**confirm** the local rule and whether the outlet's tax is inclusive or exclusive) | 1 |
| BR-SAL-02 | Example, exclusive pricing: items Rp 100.000, discount Rp 0, service 5% = Rp 5.000, PBJT 10% × (100.000 + 5.000) = Rp 10.500, total Rp 115.500, rounded to the nearest Rp 100 = Rp 115.500. With a Rp 10.000 discount: base 90.000, service 4.500, tax 9.450, total 103.950, rounded to Rp 104.000, **rounding line +50** | 1 |
| BR-SAL-03 | **Inclusive pricing**: the shown price already contains service and tax. The bill shows the amounts as included, computed backwards and rounded in whole rupiah. The remainder from rounding goes to the tax line so the total matches | 1 |
| BR-SAL-04 | Each tax or charge is rounded to whole rupiah **at line level of the bill** (not per item), with the rounding method set per outlet. The rounding line is shown separately and only applies to **cash** payments (*default* nearest Rp 100; *options* 50, 500, 1.000, off) | 1 |
| BR-SAL-05 | Tax rate, service charge rate and rounding are **per outlet** settings. Changing them affects **new sales only**. A sale stores the rates it used | 1 |
| BR-SAL-06 | A discount is a percentage or a fixed amount, on a line or on the bill, and never takes a line or the bill below 0. A discount above a limit (*default* 20%) needs a manager's PIN | 1 |
| BR-SAL-07 | Payments can be split across methods. The sum of payments must equal the total, except cash, where the change is returned. Non-cash payments cannot exceed the amount due | 1 |
| BR-SAL-08 | A sale is **immutable** once paid. A mistake is a **void** (before the end of the shift, with a reason and a manager's PIN) or a **refund** (after, to a method, with a reason and a manager's approval). Both keep the original sale and its receipt number (ADR 0004) | 1 |

### 10.2 Shifts and cash

| ID | Rule | Phase |
|---|---|---|
| BR-SHF-01 | A cashier opens a **shift** on a device by counting and entering the **opening cash**. Sales cannot be taken without an open shift | 1 |
| BR-SHF-02 | **Cash in / cash out** during a shift needs a reason (change top-up, supplier payment, petty expense) and a note. A manager's PIN is needed above a limit | 1 |
| BR-SHF-03 | On closing, the cashier enters the **counted cash**. The system compares it with expected cash and records the **difference** | 1 |
| BR-SHF-04 | **Expected cash** = opening cash + cash sales − cash refunds + cash in − cash out − cash payments to suppliers and expenses paid from the drawer | 1 |
| BR-SHF-05 | The end-of-shift report shows sales by payment method, discounts, voids and refunds, tax and service charge, the cash difference, and the cashier. A difference above a limit (*default* Rp 10.000) is highlighted for the manager | 1 |
| BR-SHF-06 | A shift left open past the end of the business day is flagged to the manager. It is not closed automatically | 1 |

## 11. Roles and permissions

A role is a set of permissions. The owner can adjust them. A cashier works with a **PIN** on a shared
device (ADR 0004). An action that "needs approval" requires a different person with the permission,
who confirms with their PIN.

| Action | Owner | Manager | Supervisor | Storekeeper | Cashier | Accountant |
|---|---|---|---|---|---|---|
| View stock on hand and movements | ✓ | ✓ | ✓ | ✓ | – | ✓ |
| Create and edit items, units, categories | ✓ | ✓ | – | – | – | – |
| Post goods receipt | ✓ | ✓ | – | ✓ | – | – |
| Reverse a receipt or movement | ✓ | ✓ (approval above limit) | – | – | – | – |
| Post usage and waste | ✓ | ✓ | ✓ | ✓ | – | – |
| Approve usage, waste, adjustment above the limit | ✓ | ✓ | – | – | – | – |
| Count in an opname | ✓ | ✓ | ✓ | ✓ | – | – |
| Approve an opname | ✓ | ✓ | – | – | – | – |
| Close a period | ✓ | ✓ | – | – | – | – |
| Record supplier payments | ✓ | ✓ | – | – | – | ✓ |
| View costs, margins and payables | ✓ | ✓ | – | – | – | ✓ |
| Take sales, open and close own shift | ✓ | ✓ | ✓ | – | ✓ | – |
| Void or refund, give a large discount | ✓ | ✓ | ✓ (void only) | – | approval | – |
| Manage staff, roles, outlet settings, tax and service charge | ✓ | – | – | – | – | – |
| Export data | ✓ | ✓ | – | – | – | ✓ |

| ID | Rule | Phase |
|---|---|---|
| BR-ROL-01 | The permissions above are the defaults. Roles are sets of permission codes, so a new permission needs no new role | 3 |
| BR-ROL-02 | A user can have different roles at different outlets | 6 |
| BR-ROL-03 | A cashier picks their name and enters a PIN of 4 to 6 digits. The PIN is locked for 5 minutes after 5 wrong tries (*default*). The owner can reset a PIN | 0 |
| BR-ROL-04 | A user who is removed is **deactivated**, so their history keeps their name. Their devices and PIN stop working at once, or at the next sync for an offline device (ADR 0004) | 0 |
| BR-ROL-05 | Anyone approving a document that they created is refused, except an owner in a business with a single user (BR-OPN-07) | 3 |

## 12. Reports

| ID | Rule | Phase |
|---|---|---|
| BR-RPT-01 | Reports use the **business day** (BR-GEN-09) and the outlet's timezone, and show the period and the time of generation | 1 |
| BR-RPT-02 | Stock reports: **stock on hand** (quantity, average cost, value), **movements** by item and type, **low stock**, **negative stock**, **expiring soon**, **waste by reason**, **opname variance**, **usage by reason** | 3 |
| BR-RPT-03 | Money reports: **payables by due date**, **purchases by supplier and category**, **price history of an item**, **expenses by type**, **COGS and food cost %** | 3 |
| BR-RPT-04 | A report's totals equal the sum of its rows, and the stock value equals the sum of the ledger. Where a rounding difference exists, a "rounding" line shows it | 3 |
| BR-RPT-05 | Every list and report can be **exported to CSV** (UTF-8 with BOM so Excel shows Indonesian characters, `;` as the separator option, dates as `YYYY-MM-DD`, numbers without thousand separators) | 3 |

## 13. Data and privacy

| ID | Rule | Phase |
|---|---|---|
| BR-DAT-01 | Financial records are kept for a long period. Indonesian tax and company-records laws commonly require **10 years**. **Confirm** the exact period with an accountant. Because of this, deleting a tenant removes personal data (staff and customer details) and keeps anonymised financial records until the period ends | 5 |
| BR-DAT-02 | A tenant can **export all of its data** at any time, including when read-only or after cancelling (ADR 0007) | 5 |
| BR-DAT-03 | Personal data (staff, customers, supplier contacts) is collected only for a stated purpose and shown only to roles that need it, as the UU PDP requires | 2 |
| BR-DAT-04 | Photos (nota, waste) are stored per tenant and removed with the tenant. They are not public | 3 |

## 14. Validation reference

One place for the field rules. The server enforces all of them. The front end shows the same
message next to the field.

| Field | Rule | Message (Indonesian first) |
|---|---|---|
| Any name | Required, trimmed, 2 to 100 chars, unique per tenant case-insensitively | "Nama wajib diisi" / "Nama sudah dipakai" |
| Quantity (any movement) | Number above 0, multiple of the unit's rounding, at most 3 decimals in the shown unit | "Jumlah harus lebih dari 0" / "Jumlah tidak sesuai satuan terkecil (0,01 kg)" |
| Signed quantity (adjustment) | Not 0; the result cannot be below 0 | "Jumlah tidak boleh 0" / "Stok tidak mencukupi untuk pengurangan ini" |
| Usage / waste quantity | Not more than the balance at posting | "Jumlah melebihi stok yang tersedia (stok: 12 kg)" |
| Counted quantity (opname) | 0 or more, respects rounding | "Jumlah hitung tidak boleh negatif" |
| Price / amount | Whole rupiah, 0 or more (above 0 for payments and expenses), at most 12 digits | "Nominal harus bilangan bulat rupiah" |
| Payment | Above 0 and not above the outstanding | "Pembayaran melebihi sisa hutang (Rp 50.000)" |
| Date | Valid date, not in the future, not inside a closed period | "Tanggal tidak boleh di masa depan" / "Periode sudah ditutup" |
| Reason | Required from a fixed list; `other` needs a note of at least 5 chars | "Pilih alasan" / "Catatan wajib untuk alasan lainnya" |
| Duplicate item in one document | Compared by item id | "Barang ini sudah ada di baris 2" |
| UoM ratio | Above 0; the reference unit is exactly 1 | "Rasio harus lebih dari 0" |
| UoM category | Exactly one reference unit; unique names and symbols | "Harus ada tepat satu satuan acuan" |
| Phone (WhatsApp) | Indonesian numbers: starts with `08` or `+62`, 9 to 14 digits; store as `+62…` | "Nomor telepon tidak valid" |
| Email | Standard format, lower-cased | "Email tidak valid" |
| PIN | 4 to 6 digits | "PIN harus 4–6 angka" |
| File (photo) | JPEG, PNG or WebP, at most 5 MB, resized on upload | "Foto maksimal 5 MB" |

Validation messages name the field and say how to fix it. They are never copied between forms
without checking (a message that says "Username" on an opname form is a defect).

## 15. Open questions for the pilot cafe and an accountant

1. Which items do you **not** count at all (ice, water, salt)? Is "untracked" enough?
2. How do you buy today: market cash, credit suppliers, both? Is a handwritten nota the only proof?
3. Do you track expiry for dairy, meat, sauces? By batch or only by date?
4. How often do you count, who counts, and what variance do you accept?
5. What are the real waste reasons? Is the list in BR-WST-01 complete?
6. Are staff meals given, and are they costed?
7. What limits suit you for approval (Rp 100.000?), discounts (20%?), cash difference (Rp 10.000?)
8. Do you sell on credit or run a tab for regular customers?
9. Is the business a PKP (VAT-registered)? Is tax inclusive or exclusive in your prices? **Confirm**
   the order in BR-SAL-01 against the regional PBJT rule in your city.
10. What closes your business day, and does any outlet trade past midnight?
11. Do you have a central kitchen or one storage for several outlets?
12. How long must you keep records? **Confirm** BR-DAT-01 with an accountant.
