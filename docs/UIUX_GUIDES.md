# UI and UX guides

How Orion looks and behaves, so that a screen built next month feels like one built today. It
covers the foundations (colour, type, spacing), the two main surfaces (the **back office** and the
**cashier app**), and the patterns they share: data lists, forms, dialogs, feedback and
accessibility.

Read it with [BUSINESS_RULES.md](./BUSINESS_RULES.md), which decides what a screen must enforce, and
[FLOW_REVIEW.md](./FLOW_REVIEW.md), which lists today's gaps.

**Contents**

1. [Principles](#1-principles)
2. [Surfaces](#2-surfaces)
3. [Foundations](#3-foundations)
4. [Content and language](#4-content-and-language)
5. [Back office](#5-back-office)
6. [Data list view](#6-data-list-view)
7. [Form view](#7-form-view)
8. [Dialogs, drawers and confirmation](#8-dialogs-drawers-and-confirmation)
9. [Feedback and states](#9-feedback-and-states)
10. [Cashier app](#10-cashier-app)
11. [Operator console](#11-operator-console)
12. [Accessibility](#12-accessibility)
13. [Components](#13-components)
14. [Working rules](#14-working-rules)

**Status of this guide.** The foundations, the back-office shell, the sidebar, the header and the
route tabs already exist in the code. The data list, form, dialog and cashier patterns describe the
target; section 13 says which components exist and which are still to be built. Where today's code
disagrees with this guide, the guide wins for new work, and the old screen is fixed when it is next
touched.

## 1. Principles

1. **Built for a busy person.** A cashier serves a queue with wet hands. A storekeeper counts sacks
   with a tablet in one hand. Every screen should be usable at a glance, with the next step
   obvious, and nothing that needs reading twice.
2. **One main action per screen.** One gold button says what to do next. Everything else is
   quieter.
3. **Say it plainly, in Indonesian first.** Short words, real units, real amounts. `Rp 74.000`, not
   `74000`. "Stok tidak cukup", not "Validation failed".
4. **Forgive, but never hide.** Offer undo for small mistakes. Require a reason and a second person
   for large ones. Never let a stock or money record be silently edited (BR-GEN-05).
5. **Be honest about the network.** The cashier app works offline, and says so. It never shows a
   spinner where a sale could be recorded, and never claims something is saved when it is not.
6. **Accessible by default.** Contrast, focus, keyboard and touch size are part of "done", not extras.
7. **Consistent beats clever.** The same thing looks the same everywhere. A new pattern needs a
   reason, and an entry in this guide.

## 2. Surfaces

Orion has three apps with one set of tokens and components (see ADR 0008). They differ in who uses
them and on what.

| | Back office | Cashier app | Operator console |
|---|---|---|---|
| Who | Owner, manager, storekeeper, accountant | Cashier, supervisor | The operator (you) |
| Device | Laptop or desktop; phone for checking | Android tablet, 10 inch, landscape (ADR 0005) | Laptop |
| Input | Mouse and keyboard; touch on phone | **Touch only** | Mouse and keyboard |
| Session length | Minutes, in bursts | A whole shift, all day | Minutes |
| Priority | Accuracy, review, find things | **Speed, no mistakes, never blocked** | Care, auditability |
| Density | Compact, many rows | Spacious, large targets | Compact |
| Body text | 14 px | 16 px or larger | 14 px |
| Smallest target | 40 px high | **48 px**, primary actions 56 px | 40 px |
| Navigation | Sidebar, tabs, breadcrumbs | Few screens, a top bar, no sidebar | As the back office |
| Errors | Inline, can take time to read | Short, one line, one action | Inline with extra confirmation |
| Network | Online required | **Offline-first** (ADR 0004) | Online required |
| Language | Indonesian, English | Indonesian, English | English |
| Code (planned monorepo) | `apps/backoffice` | `apps/pos` | `apps/admin` |

Foundations (section 3) are shared. Sections 5 to 9 are the back office. Section 10 is the cashier
app and overrides the sizes and density above. Section 11 is the operator console.

## 3. Foundations

The single source of truth is `src/index.css` (colour variables) and `tailwind.config.js` (scales).
Never type a hex value in a component.

### 3.1 Colour

Colours are named for **what they do**, not what they look like. Use the token, not the hue.

| Token (Tailwind) | Use | Notes |
|---|---|---|
| `primary` (gold) | The main action button, a selected state, the active marker in the sidebar | A **fill** only. Gold on white is 1.95:1, so never use it for text or a thin icon on a light surface |
| `primary-foreground` (ink) | Text and icons on gold | 9.1:1 on gold. Never use white on gold |
| `foreground` | Body text and headings | 18:1 on white |
| `muted-foreground` | Secondary text, help text, table headers, placeholder text | 7.0:1 on white, 6.5:1 on the canvas |
| `canvas` | The page background behind cards | Warm grey |
| `card` / `background` | Cards, dialogs, inputs | White |
| `border` | Dividers and card edges | Decorative, so low contrast is fine |
| `input` | The border of a form field | Must reach 3:1 against its surround (see the note below) |
| `ring` (indigo) | The keyboard focus ring on light surfaces | 8.1:1. On the dark sidebar the ring is gold |
| `secondary` / `muted` / `accent` | Hover backgrounds, quiet buttons, selected rows | Warm light grey |
| `destructive` | A button that deletes or voids, and nothing else | White text on it is 5.6:1 |
| `success`, `warning`, `danger`, `info` | **Status text and icons**, always on the matching `-soft` background | 5.6:1 to 6.8:1 on their soft backgrounds |
| `sidebar-*` | The sidebar only | Light text 11.9:1, muted text 7.3:1 |
| `brand-900` (ink) | Text on the cream `brand-50` and `brand-100` fills (quiet buttons, selected chips) | 15:1 |

Rules:

- **One gold button per view.** If two things look equally important, one of them is not.
- **Colour never carries meaning alone.** A status has a word and usually an icon as well as a
  colour (people with colour-blindness, and a tablet in sunlight).
- **Semantic colours mean something.** Green is success, amber is "look at this", red is "wrong or
  dangerous", blue is "for your information". Do not use them as decoration.
- **Do not nest cards.** A card inside a card makes noise. Separate with a divider or a tinted
  background.
- **Dark mode** has tokens (the `.dark` block) but is not supported yet. Writing with tokens now means
  it can be turned on later. A dark cashier theme for dim cafes is the most likely first use.

> **Known gap.** The form field border (`--input`) is 1.67:1 on white, below the 3:1 that WCAG 2.2
> asks for the edge of a control. Change it to about `38 6% 52%` (3.6:1). The placeholder colour
> `gray-300` is 1.5:1; placeholders use `muted-foreground`.

### 3.2 Typography

Font: **Inter Variable**, self-hosted, with the system font as a fallback. Numbers use
`tabular-nums` wherever they are compared or added up, so digits line up.

| Role | Back office | Cashier |
|---|---|---|
| Page title | 18 px / semibold (`text-lg`) | 20 px / semibold |
| Section title | 16 px / semibold | 18 px / semibold |
| Body, table cells, inputs | 14 px (`text-sm`) | **16 px** (`text-base`) |
| Secondary, help text | 12 to 13 px (`text-xs`) in `muted-foreground` | 14 px (nothing smaller) |
| Table header | 12 px / semibold / `muted-foreground`, sentence case | n/a |
| Button label | 14 px / medium | 16 to 18 px / semibold |
| Totals and amounts due | 16 px / semibold | **28 to 32 px** / semibold |
| Keypad digits | n/a | 28 px / medium |

Line height: 1.4 to 1.5 for text, 1 for single-line big numbers. Do not use more than two weights on
a screen (regular, semibold). Do not use italics, and use all-caps only for the small section labels
in the sidebar.

### 3.3 Spacing and size

A **4 px grid**. Use Tailwind's scale (`1` = 4 px) and prefer these steps: 4, 8, 12, 16, 24, 32.

| Where | Value |
|---|---|
| Page gutter | 12 px on a phone, 20 px from `md` |
| Card padding | 16 px on a phone, 24 px from `md` |
| Gap between sections | 24 px |
| Gap between form fields | 16 px |
| Label to input | 6 px |
| Toolbar gaps | 12 px |
| Table cell | 12 px vertical, 16 px horizontal |
| Space between touch targets (cashier) | at least 8 px |

### 3.4 Shape and elevation

| Element | Radius |
|---|---|
| Inputs, buttons, menu items | 8 px (`rounded-md`) |
| Cards, dialogs | 12 px (`rounded-xl`) |
| Sidebar | right corners only, 24 px (`rounded-r-3xl`) |
| Status pills, avatars | full |
| Cashier tiles and keys | 16 px (`rounded-2xl`) |

Elevation is quiet: a card has `shadow-card` and a 1 px ring. Popovers and menus use `shadow-md`,
dialogs `shadow-lg`. Nothing else has a shadow.

### 3.5 Icons

- **`lucide-react` only.** The older `@carbon/icons-react` is being removed. Do not add new Carbon
  imports.
- Sizes: 16 px (`h-4 w-4`) beside text in a button or table, 20 px (`h-5 w-5`) in the sidebar and
  header, 24 px (`h-6 w-6`) in the cashier app.
- Decorative icons have `aria-hidden="true"`. An **icon-only button** has an `aria-label` and a
  tooltip. A destructive action is never icon-only.

### 3.6 Motion

| Use | Duration |
|---|---|
| Hover, focus, colour change | 150 ms |
| Expand and collapse, drawer, popover | 200 ms |
| Dialog | 200 ms |

Motion only explains a change (something opened, moved, appeared). It never decorates. Every
animation has a `motion-reduce:` variant that turns it off, and nothing animates in the cashier
app's payment path for longer than 150 ms.

### 3.7 Breakpoints

Tailwind's: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. The back office switches layout at `md` (sidebar
becomes a drawer, tables become card lists, forms stay one column). The cashier app switches at `lg`
(landscape split view becomes portrait with a bottom sheet).

## 4. Content and language

### 4.1 Writing

- **Indonesian first, English available.** Write every string as a translation key from the start
  (BR-GEN-11). Stored values such as statuses and reasons are codes, translated when shown.
- **Sentence case** for everything: "Tambah barang", not "Tambah Barang". Proper nouns excepted.
- **Buttons are verbs, with the noun when it is not obvious:** "Simpan", "Simpan penerimaan",
  "Bayar Rp 74.000", "Tutup shift". Not "OK", "Yes", "Submit" or "Proceed".
- **Errors say what is wrong and how to fix it.** "Jumlah melebihi stok (stok: 12 kg)". Not
  "Invalid input". Never blame the user. The full list is in BUSINESS_RULES, section 14.
- **No exclamation marks, no jokes, no jargon.** "UoM" is spelled "Satuan" in the interface.
- **Keep it short.** A cashier reads a few words. A manager can read a sentence.
- Success messages are quiet and past tense: "Penerimaan barang disimpan."

### 4.2 Formats

| Thing | Format | Example |
|---|---|---|
| Money | `Rp`, a space, dots between thousands, no decimals | `Rp 15.000`, a refund as `-Rp 15.000` |
| Quantity | Decimal comma, the unit after a space, trailing zeros trimmed | `2,5 kg`, `250 g`, `12 pcs` |
| Date | Day, short month, year | `07 Okt 2026` (in English: `07 Oct 2026`) |
| Time | 24 hour | `14:30` |
| Date and time | Date, comma, time | `07 Okt 2026, 14:30` |
| Recent time | Relative only inside the last 24 hours, with the exact time on hover or press | `5 menit lalu` |
| Percentage | A comma, no space | `5%`, `12,5%` |
| Phone | International format | `+62 812 3456 7890` |
| Receipt number | As issued (ADR 0004) | `JKT1-03-000482` |

Format with `Intl` and the `id-ID` locale, in one shared helper (`formatRupiah`, `formatQuantity`,
`formatDate`). Do not format numbers by hand. Table cells and CSV exports use the same data, but the
CSV uses plain numbers and ISO dates (BR-RPT-05).

### 4.3 Terms

One word per thing, in every screen, button and report.

| English | Indonesian | Notes |
|---|---|---|
| Items | Barang | Also "Bahan" for an ingredient in a recipe |
| Stock on hand | Stok | |
| Goods receipt | Penerimaan barang | Not "Barang masuk" |
| Supplier | Pemasok | |
| Payables | Hutang | |
| Usage | Pemakaian | Internal use, not a sale |
| Waste | Susut | |
| Adjustment | Penyesuaian | |
| Stock opname | Stock opname | Commonly used as is |
| Reverse | Koreksi | A posted record is reversed, not edited |
| Void | Batal | A sale, before the shift ends |
| Refund | Pengembalian dana | |
| Hold | Tahan | A bill set aside |
| Pay | Bayar | |
| Subtotal, Discount, Service, Tax, Rounding, Total | Subtotal, Diskon, Service, Pajak, Pembulatan, Total | The order of BR-SAL-01 |
| Shift | Shift | |
| Save, Cancel, Delete, Archive | Simpan, Batal, Hapus, Arsipkan | "Hapus" only where deletion is possible (BR-GEN-06) |

## 5. Back office

### 5.1 The page shell

The shell is `MainLayout`. Do not rebuild it in a page.

```
┌─────────────┬──────────────────────────────────────────────────────────┐
│ ◆ Orion   ⟪ │  Stock Management › Used Stock              (header)     │
│ BACK OFFICE │ ┌──────────────────────────────────────────────────────┐ │
│             │ │  Page content card                                   │ │
│ ▣ Summary   │ │                                                      │ │
│ INVENTORY   │ │                                                      │ │
│ ▾ Stock …   │ │                                                      │ │
│   Used      │ │                                                      │ │
│ …           │ └──────────────────────────────────────────────────────┘ │
└─────────────┴──────────────────────────────────────────────────────────┘
 dark sidebar,        canvas (warm grey) with one white card for the page
 flush left, rounded
 on the right
```

- **Sidebar** (`Sidebar.tsx`, items in `src/config/navigation.ts`): dark indigo, flush with the
  screen, rounded on the right. 240 px wide, or a 72 px icon rail. The collapse button is at the top
  right and the choice is remembered. Below `md` it is a drawer opened from the header.
  - Items are grouped under small labels (Inventory, Configuration). A group with children expands
    in place and opens by itself on the active route. On the icon rail a group shows its children in
    a flyout.
  - **Order the menu by the work, not by the data model**, with rarely used settings at the bottom
    (FLOW_REVIEW 3.3). At most about 7 top-level items and 2 levels. A third level is a sign that a
    page needs tabs instead.
  - Add a page by editing `navigation.ts`, not the component.
- **Header** (`AppHeader.tsx`): breadcrumb on the left, with the current page as the one `h1`. The
  right side is reserved for the outlet switcher and the user menu, which arrive with sign-in.
  Do not put page actions in it.
- **Content card:** the page lives in one white card that scrolls inside the shell. A page
  fills the card; it does not add its own outer border or background.
- **Skip link:** "Skip to content" is the first focusable element.

### 5.2 Page anatomy

Every page has the same bands, top to bottom. Leave a band out; do not reorder them.

```
┌──────────────────────────────────────────────────────────────────┐
│ [Tabs]  (only when the page has sibling views)                   │  1
│ ────────────────────────────────────────────────────────────────│
│ [Primary action]                          [Secondary actions ⋯]  │  2  actions
│ [Search……]  [Filter ▾] [Filter ▾] [Date ▾]            [Export]   │  3  toolbar
│ ▸ Filters applied: Kategori: Kopi ✕  Clear                       │  4  filter chips
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ table or content                                             │ │  5
│ └──────────────────────────────────────────────────────────────┘ │
│ Menampilkan 1–25 dari 312            ‹ 1 2 3 … 13 ›    25 ▾      │  6  pagination
└──────────────────────────────────────────────────────────────────┘
```

- **Tabs** (`RouteTabs`): for **sibling views of one subject** that are used regularly, such as the
  Setup sections. Each tab is a route. They are horizontal, scroll sideways on a phone, and the
  active tab has a gold underline plus a bolder label. Use tabs for at most about 6 views.
  Never nest tabs in tabs. Never use tabs for steps (use a stepper or a page).
- **Actions band:** the one primary action on the left ("Tambah barang"), secondary actions on the
  right in a menu. An action that applies to the data on screen (export) sits in the toolbar.
- Detail, form and dashboard pages use the same shell with their own bands (below).

### 5.3 Page types

| Type | When | Layout |
|---|---|---|
| **List** | Browse, search, act on many records | Section 6 |
| **Detail** | One record: its fields, history and actions | A header with the record name, a status pill and actions. Below: field groups in a card and tabs for related lists (history, lines). Read first, edit second |
| **Form page** | A document with lines, or more than 12 fields (goods receipt, opname) | Section 7. Full width, a sticky action bar |
| **Dashboard** | "What needs me today?" | A row of 3 to 4 stat cards, then lists of exceptions (low stock, payables due). Every number links to the list behind it. Charts only where they answer a question |
| **Settings** | Rarely changed configuration | A single column of grouped sections with their own Save button, or a list with a drawer to edit |

Dashboard stat card: a label (12 px, muted), a number (24 px, semibold, tabular), an optional
status pill or change indicator. No decoration, and no gauge where a number will do.

## 6. Data list view

Most of the back office is lists of records. They must look and behave the same.

### 6.1 Toolbar

- **Search** on the left, 256 px wide, with a search icon and the placeholder "Cari nama atau
  kode". It filters as you type after 300 ms and `/` focuses it. It searches name, code and the
  fields a person would use to find the record, not only one column.
- **Filters** next to it, as dropdowns or combobox pickers with the filter name as the label ("Kategori",
  "Status", "Tanggal"). At most 3 are visible; the rest go in a "Filter lainnya" popover.
- **Applied filters** show as chips under the toolbar, each with a remove button and one "Hapus
  semua". A person must always see why a list is short.
- **Export** (CSV) and other occasional actions go in an overflow menu on the right.
- Filter, sort and page are kept in the **URL query string**. The back button, a refresh and a
  copied link all return to the same view.

### 6.2 The table

| Rule | Detail |
|---|---|
| Row height | 48 px (comfortable, default). A 40 px compact option may be offered later |
| Header | Sticky, 12 px semibold muted text, a 1 px bottom border, a sort arrow that appears on hover and shows the active sort |
| Cell padding | `px-4 py-3` |
| Row hover | A light `muted` background |
| Zebra stripes | No |
| First column | The name or code that identifies the row. It is the link to the detail page |
| Text columns | Left-aligned, truncated with a tooltip, never wrapped past two lines |
| **Number and money columns** | **Right-aligned, `tabular-nums`**, the header right-aligned too |
| Units | In the header for a whole column of one unit (`Stok (kg)`), as a suffix in the cell when units differ (`2,5 kg`) |
| Date columns | `07 Okt 2026`, with the time in muted text when it matters |
| Status | A status pill (6.3), never a coloured word |
| Booleans | A check icon with a label for screen readers, or a pill, not "true" |
| Empty cell | An en dash `–` in muted text |
| Totals | A footer row for money and quantity lists, bold, labelled "Total" |
| Maximum columns | 8 on desktop. Hide the least important first as the width shrinks |
| Row selection | A checkbox column only when the list has bulk actions (6.5) |

Default sort: newest first for movements and documents, A to Z for master data. State the sort
somewhere visible.

### 6.3 Status pills

A pill is a small rounded label with a **soft background, strong text and an icon**. Use the same
statuses everywhere.

| Tone | Token | Statuses |
|---|---|---|
| Success | `success` on `success-soft` | Posted, Paid, Approved, Received, Active |
| Warning | `warning` on `warning-soft` | Pending approval, Partially paid, Low stock, Unsynced |
| Danger | `danger` on `danger-soft` | Overdue, Rejected, Negative stock, Failed |
| Info | `info` on `info-soft` | In transit, Counting, In review |
| Neutral | `muted-foreground` on `muted` | Draft, Archived, Reversed, Cancelled |

Build one `StatusPill` with a `tone` and a label. A new status picks a tone from this table; it does
not invent a colour.

### 6.4 Row actions

- **Clicking the row opens the detail.** The row is the main action.
- **At most one inline action button** per row (a quiet "Terima" or "Bayar"). Everything else goes in
  a **row menu** (a `⋯` button at the end of the row). Do not repeat "Edit" and "Hapus" buttons on
  every row.
- **Posted records have no Edit.** Their menu has "Lihat" and "Koreksi" (reverse), which asks for a
  reason (BR-GEN-05). Master data has "Ubah" and "Arsipkan". A record in use is archived, never
  deleted (BR-GEN-06).
- The row menu is reachable by keyboard and its button has `aria-label="Aksi untuk {name}"`.
- On a touch screen the row menu button is at least 40 px.

### 6.5 Selection and bulk actions

Offer selection only when there is a real bulk action. Selecting a row shows a **bar above the
table** ("3 dipilih · Arsipkan · Ekspor · Batal pilih"). A bulk action that changes data asks for
confirmation (level 1 in section 8.3) and states the count.

### 6.6 Pagination

- **Server-side** filter, sort and pagination, always (FLOW_REVIEW F-34). The browser never holds a
  full table.
- 25 rows by default, with 25, 50 and 100 as choices. Show "Menampilkan 1–25 dari 312", numbered pages
  with previous and next. Keep the page size in the URL and in the user's settings.
- Infinite scroll is for the cashier's menu and recent sales, not for back-office tables.

### 6.7 States

| State | What to show |
|---|---|
| **Loading** (first load) | Skeleton rows with the table's own columns, after 300 ms. Under 300 ms show nothing, so a fast list does not flicker |
| **Refreshing** | Keep the old rows, dim them slightly, and show a thin progress bar. Never blank the table |
| **First use (empty)** | An icon, one sentence on what this list is for, and the primary action ("Belum ada pemasok. Tambah pemasok pertama Anda."). Setup lists can link to the guide |
| **No results** | "Tidak ada hasil untuk 'kopi'." with a "Hapus filter" button. Do not show the first-use message |
| **Error** | A message saying it could not load, a "Coba lagi" button, and whether the cause is the network or the server. Keep the toolbar |
| **No permission** | "Anda tidak memiliki akses ke halaman ini." and who to ask. Do not show the page with disabled controls |

### 6.8 On a phone

Below `md`, a table becomes a **list of cards**: the name and the status pill on the first line, 2
or 3 key values below, the row menu at the right. The toolbar collapses to a search field and a
"Filter" button that opens a bottom sheet. Pagination becomes a "Muat lebih banyak" button. Do not
scroll a six-column table sideways on a phone unless the data is truly tabular.

## 7. Form view

Forms are where mistakes enter the data. Make the right thing the easy thing.

### 7.1 Choose the container

| Use a | When | Examples |
|---|---|---|
| **Dialog** (section 8) | One decision, up to 5 fields, nothing to scroll | Rename a category, confirm a void, enter a PIN |
| **Drawer** (a panel from the right, 480 px) | Create or edit **one record** of 6 to 12 fields, and keeping the list visible helps | Add an item, add a supplier |
| **Full page** | A **document with lines**, more than 12 fields, or anything with a review step | Goods receipt, opname, usage, waste, adjustment, purchase order |

Today the app puts every form, including line-item documents, in one dialog. The documents move to
full pages when the inventory screens are rebuilt.

### 7.2 Layout

- **One column**, at most about 640 px wide. Two columns only for short, related pairs such as a
  quantity and its unit, or a start and an end date, and only from `md`.
- **Label above** the field, 14 px medium. Never use the placeholder as the label.
- **Order fields as the person thinks of them**, with the commonest first and the optional ones
  last. Group related fields under a section heading with a divider (`FormSection`).
- **Width follows content.** A quantity field is narrow, a name is wide.
- **Optional fields say "(opsional)"** after the label. Most fields are required, so do not mark
  them with asterisks.
- **Help text** goes below the field in 12 px muted text, and is replaced by the error when there is
  one. Do not repeat the label in it.
- The **first field is focused** when the form opens. Do not auto-focus on a phone if it raises the
  keyboard and hides the form.

### 7.3 Field types

| Data | Control | Behaviour |
|---|---|---|
| Short text | Text input | Trims spaces. No placeholder that repeats the label. Placeholder is an example, in `muted-foreground` |
| Long text | Textarea, 3 rows | A counter only when there is a limit |
| **Money** | **`MoneyInput`**: an `Rp` prefix, right-aligned, `inputmode="numeric"` | Whole rupiah only, dots inserted as you type, accepts a pasted `Rp 15.000`, no spinner arrows, an empty field is empty not 0 (BR-GEN-01) |
| **Quantity** | **`QuantityInput`**: right-aligned, the unit as a suffix, `inputmode="decimal"` | Accepts a comma or a dot, enforces the unit's step (BR-UOM-06) with an inline message and never rounds silently, shows the unit of the item chosen |
| Percentage | Number input with a `%` suffix | Range stated in the help text |
| Date | Date picker | Defaults to today. Blocks dates the rules forbid (BR-STK-05) and says why |
| Choice of 2 to 5, all visible | Radio group | The default is preselected when there is a sensible one |
| Choice of 6 or more, or a long list | Select, or a **combobox** when it needs search | A combobox for any list that can grow (items, suppliers) |
| On or off, a value saved with the form | Checkbox | Label is a statement: "Lacak stok barang ini" |
| On or off, **takes effect at once** | Switch | Used in settings only, with no Save button |
| Reason | Select from the fixed list, plus a note when the reason is `other` (BR-WST-01) | The list is fixed, so reports can group by reason |
| Photo | A drop area and a camera button | Shows a preview and a remove button. Limits are stated (BR section 14) |
| PIN | A numeric keypad (cashier) or a 4 to 6 digit field | Masked, with a show toggle off the cashier app |

A **combobox for an item** shows the name, then the category and the stock on hand in muted text. A
"+ Tambah baru" row at the bottom creates the missing record without leaving the form.

### 7.4 Validation

- **The server decides** (BUSINESS_RULES, intro). The front end checks the same rules to answer
  quickly. A failed server check shows the same way as a front-end one.
- **When:** the first time, when the person **leaves** a field. After that, as they type. On submit,
  **focus the first invalid field** and scroll it into view. On a long form also show a short banner
  above the actions: "Periksa 3 isian di bawah."
- **How:** the field gets a danger border, a small icon and the message in `danger` text below it,
  linked with `aria-describedby`, and `aria-invalid="true"`. A message states the problem and the
  fix, from the list in BUSINESS_RULES section 14.
- **Never** validate with a toast or a browser alert, never clear what the person typed, and never
  disable the submit button as the only sign of a problem. A disabled button says nothing. Let them
  press it and show what is wrong.
- **Do not copy a schema between forms without changing its messages.** A message that says
  "Username" on a stock form is a defect.
- **Cross-field rules** (a quantity above the balance, a payment above what is owed) show on the field
  that the person can change, and show the limit ("stok: 12 kg").

### 7.5 Line-item forms (documents)

Used for goods receipts, usage, waste, adjustment and opname.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Pemasok [Toko Sumber Rejeki ▾]   Tanggal [07 Okt 2026]   Alasan [Susut ▾] │  header fields
├──────────────────────────────────────────────────────────────────────────┤
│ Barang           Sebelum   Jumlah     Sesudah   Satuan   Total         ✕  │
│ [Beras ▾      ]  80 kg     [ 20  ]    60 kg     kg       Rp 300.000    ✕  │
│ [Gula ▾       ]  50 kg     [ 5   ]    45 kg     kg       Rp  70.000    ✕  │
│ + Tambah baris                                                           │
├──────────────────────────────────────────────────────────────────────────┤
│ Catatan (opsional) […………………………………………………………………………]                       │
├──────────────────────────────────────────────────────────────────────────┤
│                         Total Rp 370.000   [ Simpan draf ] [ Posting ]    │  sticky bar
└──────────────────────────────────────────────────────────────────────────┘
```

- Columns are named **Sebelum, Jumlah, Sesudah** (Before, Quantity, After). Never "Initial",
  "Actual" and "Stock Out" together (FLOW_REVIEW F-11). **Sebelum** and **Sesudah** are read-only and
  visibly so (muted, not a disabled input), and the server recalculates them on posting (BR-STK-07).
- The item picker excludes items already in the document, and picking a duplicate focuses the existing
  row with a message. It compares item ids, not names.
- **Add a row** with the button, or with Enter in the last cell. **Remove a row** with the ✕, and ask
  only when the row has data (an undo toast is better than a dialog).
- Errors appear in the cell that has them. The row count and the total update as you type.
- The **sticky bar** keeps the total and the actions in view. The primary button posts the document;
  a quieter "Simpan draf" keeps it for later (BR-PUR-08).
- **Posting is a review step, not a "are you sure?"**: show what will happen ("Stok akan berubah
  untuk 2 barang") in a summary, then post.

### 7.6 Actions

- **Order:** the primary action on the **right**, the cancel action to its left, a destructive or
  secondary action on the far left. The same in dialogs, drawers and pages.
- **One primary button.** Its label is a verb and noun ("Simpan penerimaan"). Cancel is an outline
  or ghost button labelled "Batal". A destructive confirmation uses the `destructive` variant.
- **While saving:** the primary button shows a spinner and its label, is disabled, and the form
  cannot be submitted twice. Other fields stay readable.
- **After saving:** go back to the list with a success toast, or stay on the detail page with the
  new status. Do not leave the person on an empty form.
- **Unsaved changes:** if a form is dirty and the person navigates away, ask once ("Buang
  perubahan?"). Do not ask on an untouched form.
- **Enter submits** a single-line form. In a form with a textarea, Ctrl+Enter submits. **Esc**
  closes a dialog or drawer, asking first if it is dirty.
- A **cancel button is `type="button"`**. Only the primary button submits.
- If a person lacks permission for the action, **hide the button**. Do not show it disabled with no
  explanation. If it is disabled for a reason they can fix, say what the reason is next to it.

## 8. Dialogs, drawers and confirmation

### 8.1 Dialog

A dialog interrupts, so it must earn that. It has a title that states the task, a body, and the
actions. It traps focus, closes on Esc, returns focus to what opened it, and has an accessible
title. A dialog never opens another dialog; if the second step is needed, the dialog changes to it.

- Width: 400 px for a confirmation, 560 px for a short form, at most 80% of the screen.
- It does not scroll more than about 70% of the screen. If it needs to, use a drawer or a page.
- Click outside closes it **unless** the form is dirty.

### 8.2 Drawer

A panel from the right, 480 px wide (full width on a phone, as a bottom sheet). It keeps the list
visible, so it suits "add" and "edit" for one record. It has a header with the title and a close
button, a scrolling body, and a sticky footer with the actions.

### 8.3 Confirmation levels

Match the weight of the confirmation to the cost of a mistake.

| Level | For | What the person sees |
|---|---|---|
| **0. None, with undo** | Reversible, low cost: removing a row before saving, archiving a category | A toast with "Urungkan" for 8 seconds |
| **1. Confirm** | Changes data but is recoverable: bulk archive, discard changes | A dialog that **states the consequence and the count**: "Arsipkan 3 barang? Mereka tidak muncul di daftar, tapi riwayatnya tetap ada." Buttons: "Batal", "Arsipkan" |
| **2. Review** | Posts to the ledger or money: a goods receipt, a usage, an opname | A summary of the lines and effects, then "Posting". Nothing is edited after posting, only reversed (BR-GEN-05) |
| **3. Reason** | A correction or reversal: reverse a movement, void a sale, change a posted price | Level 1 or 2, plus a **required reason** from a list and a note |
| **4. Approval by PIN** | Above a limit, or a different person must approve (BR-USE-05, BR-WST-04, BR-SAL-06) | A PIN prompt for a person with the permission, who is not the creator. The record shows both |
| **5. Typed confirmation** | Cannot be undone at all: delete a tenant, close a period (operator console and owner settings) | The person types the name of the thing |

The dialog states **what will happen**, not "Are you sure?". Never confirm something that is easy to
undo; use undo instead, because people click through repeated confirmations.

## 9. Feedback and states

### 9.1 Which one to use

| Situation | Use | Does not use |
|---|---|---|
| A field is wrong | An inline field message | A toast |
| A form has errors | Inline messages and a banner above the actions | A dialog |
| A background action finished or failed | A **toast** | A banner |
| A state that lasts: offline, read-only, trial ends, a note from the operator | A **banner** at the top of the content | A toast |
| A whole page cannot load | A full-page error with a retry | A toast |
| The user must decide before going on | A dialog | A banner |

### 9.2 Toasts

- Bottom right on desktop, bottom centre on a phone and the cashier app. At most three at a time.
- Success disappears after 5 seconds. A failure stays for 8 seconds, **or until dismissed**, and
  carries the next step ("Coba lagi").
- A toast is read aloud politely (`aria-live="polite"`; a failure is `assertive`). It is never the
  only record of something important; the history shows it too.
- Do not toast on every save of a small edit if the screen already shows the result.

### 9.3 Banners

A banner has an icon, one or two sentences, and at most one action. It does not disappear by
itself. The standard banners are: **offline**, **unsynced sales**, **printer not connected**,
**trial ends in N days**, **read-only because the subscription lapsed** (ADR 0007), and an
**announcement** from the operator (plain text; links to Orion's own domain only, ADR 0008).

### 9.4 Loading

- Under 300 ms, show nothing.
- A page or list: skeletons in the shape of the content.
- A button action: a spinner inside the button and the button disabled.
- A long job (an import, a report): a progress message, and the person can leave and come back.
- **Never block the cashier on the network** (section 10.6). Loading states there are only for
  lists, receipts and reports.

### 9.5 Errors

Say what happened, what is safe, and what to do. Distinguish: **no connection**, **the server had a
problem**, **you do not have permission**, **this changed while you were working** (a conflict, with
the option to reload), and **the data is wrong** (a field message). Never show a stack trace or a
status code to a person. Log it, and show an id they can read to you ("Kode: 7F3A9C").

## 10. Cashier app

The cashier app is used for hours, by touch, in a hurry, with a customer waiting. Its rules are
stricter than the back office, and where they differ these win. The underlying behaviour is in
ADR 0004 (offline, devices, PINs) and ADR 0005 (the Android tablet and printing). The business
rules are BUSINESS_RULES section 10.

### 10.1 Ergonomics

| Rule | Value |
|---|---|
| Target device | Android tablet, Chrome, 10 inch, landscape. Minimum supported 1024 × 600 CSS px. Portrait works, as a fallback |
| Touch target | At least **48 × 48 px**; primary actions (Bayar, a keypad key) 56 to 72 px |
| Spacing between targets | At least 8 px, so a thick finger does not hit the neighbour |
| Smallest text | **14 px**; body 16 px; amounts 28 to 32 px |
| Hover | Nothing depends on hover. There are no tooltips as the only explanation |
| Gestures | No double-tap, long-press, swipe-to-delete or drag as the **only** way to do something. A visible button always exists |
| Scrolling | One scrolling area per screen at most. Never a scroll inside a scroll |
| Accidental taps | `touch-action: manipulation` (no double-tap zoom), `user-select: none` on tiles and keys, and `overscroll-behavior: none` so pulling down does not refresh the app |
| Screen | The app runs standalone, in full screen. It keeps the screen awake during a shift (Wake Lock) |
| Safe areas | Respect the system bars and the keyboard, so a button is never hidden behind them |
| Dialogs | One at a time. Prefer a bottom sheet for choices, and full screens for payment |

### 10.2 Screens

There are few. A cashier should never have to find anything.

| Screen | Purpose |
|---|---|
| Sign in | Pick a name, enter a PIN (10.3) |
| **Sell** | The main screen (10.4). The cashier lives here |
| Payment | Take payment and give change (10.7) |
| Done | The sale is complete; receipt options; start the next one (10.8) |
| Open and close shift | Opening and counted cash (10.9) |
| Orders on hold, recent sales | Find a bill, reprint, void or refund (with a manager PIN) |
| Status | Connection, unsynced sales, printer, device (10.6) |

There is **no sidebar** and no deep menu. Anything rare lives behind one "Menu" button in the top
bar.

### 10.3 Sign in with a PIN

Pick your **name** from a grid of large avatar tiles (initials if no photo), then a **numeric keypad**
with large keys (72 px). The PIN is shown as dots. A wrong PIN says "PIN salah. Sisa 3 percobaan." and
clears the dots, and after the limit "Terkunci 5 menit" (BR-ROL-03). Switching cashier is one tap on the
name in the top bar and a PIN, without losing the open bill.

### 10.4 The Sell screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ◆ Kafe Senja · Kasir 1      ● Online     Shift 08:02      Sari ▾    Menu ⋯   │ 56 px top bar
├───────────────────────────────────────────┬─────────────────────────────────┤
│ [ Cari menu… ]                             │ Pesanan #482          Bawa pulang ▾│
│ [Semua][Kopi][Non-kopi][Makanan][Snack] →  │ ─────────────────────────────── │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐    │ Latte (M)        − 2 +  56.000 │
│ │ foto  │ │       │ │       │ │       │    │   + Extra shot             8.000│
│ │ Latte │ │Espress│ │Americ.│ │Cappuc.│    │ Roti bakar       − 1 +  18.000 │
│ │28.000 │ │18.000 │ │20.000 │ │28.000 │    │ ─────────────────────────────── │
│ └───────┘ └───────┘ └───────┘ └───────┘    │ Subtotal                 82.000 │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐    │ Service 5%                4.100 │
│ │  …    │ │  …    │ │  …    │ │  …    │    │ Pajak 10%                 8.610 │
│ └───────┘ └───────┘ └───────┘ └───────┘    │ Pembulatan                  -10 │
│                                            │ TOTAL                  Rp 94.700 │
│                                            │ [ Tahan ]  [   Bayar Rp 94.700   ] │
└───────────────────────────────────────────┴─────────────────────────────────┘
        menu: about 60%                          order: about 40%, 380 to 440 px
```

Check of the example: subtotal 82.000, service 5% = 4.100, tax 10% of (82.000 + 4.100) = 8.610, total
94.710, rounded to the nearest Rp 100 gives 94.700 with a −10 rounding line (BR-SAL-01, 04).

- **Top bar (56 px):** outlet and device on the left; **connection status** (10.6); shift time; the
  current cashier (tap to switch); and a "Menu" button. Always visible.
- **Menu area** (left): a search field, **category chips** in one scrolling row, and a **grid of
  product tiles**. Tiles are at least 128 × 112 px.
- **Order panel** (right, fixed): the order type, the lines, the totals and the two buttons. It is
  always visible, so the cashier always sees what the customer will pay.
- **Portrait or below 1024 px:** the order panel becomes a **bottom bar** showing the item count and
  the total, with a "Lihat pesanan" button that opens it as a sheet, and "Bayar" always on the bar.

### 10.5 Product tiles and the order

**Product tile**
- A photo (square, optional), the **name** in up to two lines (16 px, semibold), the **price** below
  (tabular).
- One tap adds one. A product with required choices (size, milk) opens the **modifier sheet** instead.
- Tapping the same tile again increases the quantity; the tile shows a small count badge.
- A product turned off by the manager is dimmed and labelled "Tidak tersedia", and does nothing.
- **Low or negative stock never blocks a sale** (BR-STK-04). It may show a small "Stok menipis" label,
  but the tile stays tappable. Do not label a tile "Habis" unless the manager turned it off.

**Modifier sheet** (a bottom sheet): required groups first ("Ukuran", choose one), then optional
groups ("Tambahan", choose many), then a note field. Choices are big buttons, never a small
dropdown. The "Tambah ke pesanan" button shows the new price.

**Order line**
- The name, the modifiers in muted text under it, a **− quantity +** stepper (each button 48 px), and
  the line total on the right.
- Tapping the line opens a sheet for notes, a line discount and **Hapus**. Removing a line before the
  order is sent needs no confirmation, only an "Urungkan" toast. After it was sent to the kitchen or
  paid, removal is a void and needs permission (BR-SAL-08).

**Totals block** (order as BR-SAL-01): Subtotal, Diskon, Service, Pajak, Pembulatan, **Total**. Show a
line only when it is not zero, except Subtotal and Total. The Total is 28 to 32 px, semibold,
tabular, and is repeated on the pay button: "Bayar Rp 94.700".

### 10.6 Connection and sync

Always show the state in the top bar, as an icon **and** a word.

| State | Appearance | Meaning |
|---|---|---|
| Online | A green dot, "Online" | Everything syncs |
| Syncing | A spinner, "Mengirim 3" | Sales are being sent |
| **Offline** | An amber icon, "Offline" | **Selling continues.** Sales are kept on the tablet |
| Problem | A red icon, "Gagal kirim 2" | Some sales could not sync. Tap for details |

- Offline is **not an error.** Do not show an alert or block anything. A calm one-line banner on the
  first loss of connection says "Offline. Penjualan tetap disimpan dan akan dikirim nanti."
- A count of unsynced sales is always one tap away, and a **status page** lists them with a "Kirim
  ulang" button.
- A sale shows **"Tersimpan"** immediately. Never wait for the server to say so (ADR 0004).
- The receipt number is available at once, because it is made on the device.

### 10.7 Payment

A full screen, not a dialog. The left side shows the **amount due** (large) and the payments so far.
The right side has the method tiles and the entry area.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ←  Pembayaran                                           Pesanan #482     │
├─────────────────────────────────┬───────────────────────────────────────┤
│  Total                          │  [ Tunai ] [ QRIS ] [ E-wallet ] [ Kartu ]│
│  Rp 94.700                      │                                       │
│                                 │  Uang diterima                        │
│  Dibayar            Rp 0        │  [ Uang pas ] [ 95.000 ] [ 100.000 ]  │
│  Sisa            Rp 94.700      │                                       │
│                                 │   1  2  3                             │
│                                 │   4  5  6      Rp 100.000             │
│                                 │   7  8  9                             │
│                                 │   ⌫  0  000    [  Bayar  ]             │
└─────────────────────────────────┴───────────────────────────────────────┘
```

- **Methods** are large tiles: Tunai, QRIS, E-wallet, Kartu (recorded manually, ROADMAP), Lainnya.
  Only the methods the outlet uses are shown.
- **Cash:** quick amounts are calculated from the total: **Uang pas**, then the smallest notes that cover it
  (for Rp 94.700: Rp 95.000 and Rp 100.000, without duplicates), then a keypad for the rest. The
  entered amount is large. When it covers the total, **Kembalian** (change) appears in 32 px in the
  success colour, with the icon, before the person confirms.
- **Manual QRIS:** show the outlet's static QR large, with the amount to ask for, and a clear
  **"Konfirmasi pembayaran diterima"** button. The cashier confirms after seeing the transfer. It is
  a deliberate tap, never automatic.
- **Split payment:** a paid method is added to a list ("Tunai Rp 50.000"), and "Sisa" updates. The sum
  must equal the total (BR-SAL-07).
- A payment cannot be edited after it is confirmed. A mistake is a void or refund.
- The screen has a **back** arrow that keeps the order intact. There is no "Cancel" that loses it.

### 10.8 After payment

A **Done** screen: a check icon, "Pembayaran berhasil", the change due if any (large), and three
buttons: **Cetak struk**, **Tanpa struk**, and a primary **Pesanan baru**. It does not time out by
itself while the change is shown.

**Printing never blocks.** The sale is already saved. If the printer fails: a banner "Struk gagal
dicetak" with **Coba lagi** and **Lewati**, and the sale can be reprinted from recent sales. The top
bar shows the printer state (connected, not connected).

### 10.9 Shifts, voids and approvals

- **Open shift:** a keypad to enter the opening cash, with an optional count by notes and coins. A
  sale cannot start without an open shift (BR-SHF-01).
- **Close shift:** a summary (sales by method, discounts, voids), a field for the **counted cash**,
  and the **difference**. A difference of zero is neutral. A difference shows in the warning colour
  with the amount and no blame. The cashier confirms to close.
- **Void and refund:** a reason from a list, then the **manager PIN** overlay (confirmation level 4).
  The original sale stays visible, marked "Dibatalkan", with its receipt number (BR-SAL-08).
- **Discounts above the limit** and **cash in and out** ask for the manager PIN the same way.
- The PIN overlay is a bottom sheet with the keypad, the name of the action ("Setujui diskon 25%") and
  a "Batal" button. A wrong PIN does not close it.

### 10.10 Colour and feedback in the cashier app

- **Gold** is for **one** thing at a time: the button that moves the sale forward (Bayar, then Pesanan
  baru). Product tiles are white with ink text, so the gold button stands out.
- **Success** green only for "paid", "change due" and "online". **Danger** red only for a problem the
  cashier must act on, never for a normal event such as going offline.
- Feedback is **immediate and small**: a tile press darkens at once (under 100 ms), a quantity change
  updates the total with no animation, a tap that was accepted never needs a spinner.
- **Sound and vibration** are optional settings, off by default. A short tick on adding an item and a
  different tone on a payment are fine. Never rely on sound alone.
- **Errors** are one line and one action: "Printer tidak terhubung. [Coba lagi]". No dialogs for
  anything that is not a decision.

## 11. Operator console

The console (ADR 0008) is a separate app for you, the operator. It reuses the back-office shell,
lists and forms, with these differences:

- A **visible marker** on every screen so it can never be mistaken for a tenant's back office: the
  sidebar and header carry the label "Operator", with an accent bar in `danger` colour along the top
  of the viewport, and the browser title starts with "Orion Operator".
- **Audit first.** Every change asks for a **reason** (confirmation level 3 or higher), and the
  result links to its audit log entry.
- **Show the blast radius.** Before an action that affects several tenants (a module switch, a
  billing date), the dialog states **how many tenants** it will change and lists a sample.
- **Dangerous actions** (suspend, billing start, global module switch, large promo codes) use level 4
  or 5 in section 8.3.
- **Tenant data is aggregate.** Screens show counts, dates and status, not a tenant's sales or
  customers (ADR 0008). "View as tenant", if it ever exists, is read-only, time-limited and has a
  persistent banner.
- Language: English only.

## 12. Accessibility

Accessibility is part of "done". It is also good for a cashier in sunlight or a manager with tired
eyes. Target **WCAG 2.2 level AA**.

**Checklist for every screen**

- [ ] **Contrast:** text 4.5:1, large text (24 px, or 19 px bold) 3:1, and the edges of controls and
  icons that carry meaning 3:1. Use the tokens in 3.1, which are chosen to pass.
- [ ] **Not by colour alone.** Status has text or an icon. A required choice is not shown only by a
  red border.
- [ ] **Keyboard:** everything works with Tab, Shift+Tab, Enter, Space, Esc and the arrow keys. The
  tab order follows the visual order. There are no keyboard traps outside dialogs.
- [ ] **Focus is visible** on every control (the `ring` token, 2 px) and is never removed with
  `outline-none` without a replacement. Dialogs trap focus and return it on close.
- [ ] **Labels:** every input has a visible label that is associated with it. Placeholders are not
  labels. Icon-only buttons have an `aria-label`.
- [ ] **Structure:** one `h1` per page (the header provides it). Headings go in order. Lists are lists,
  tables are tables with header cells. Landmarks: `header`, `nav` (with a name), `main`.
- [ ] **Errors** are announced: `aria-invalid`, `aria-describedby` on the field, and a status region
  for toasts and banners.
- [ ] **Touch targets:** at least 24 × 24 px in the back office (40 px is the aim), 48 px in the
  cashier app.
- [ ] **Zoom and text size:** the layout works at 200% zoom and with larger system text without
  clipping or horizontal scrolling. Do not fix a width in pixels where text can grow.
- [ ] **Motion:** respects `prefers-reduced-motion`. Nothing flashes.
- [ ] **Language:** the page has the right `lang`, and the strings are translated, not pieced
  together. Indonesian text is about 20% longer than English, so do not size a button to its
  English label.
- [ ] **Time:** nothing disappears before it can be read. A toast with an action stays long enough
  to use it.
- [ ] **Screen readers:** test one key flow per release with TalkBack (the tablet) and a desktop
  screen reader.

## 13. Components

Where each pattern lives today, and what is still to build. Prefer the existing shadcn
components in `src/components/ui`, and wrap them rather than copying them.

### 13.1 Exists and follows this guide

| Component | Notes |
|---|---|
| `MainLayout`, `Sidebar`, `AppHeader`, `PageLoader` | The back-office shell (5.1) |
| `RouteTabs` | Sibling views as routes (5.2) |
| `Button`, `Badge`, `Checkbox`, `RadioGroup`, `Dialog`, `Popover`, `Tooltip`, `Toast` (`ui/`) | shadcn. Button variants use the gold and ink tokens |
| Tokens in `index.css`, scales in `tailwind.config.js` | Section 3 |

### 13.2 Exists but needs changing

| Component | Change |
|---|---|
| `ui/input` | The border to reach 3:1, and the placeholder to `muted-foreground` (3.1) |
| `forms/InputText`, `forms/InputNumber` | `InputNumber` uses `type="number"`, parses with `parseFloat` (an empty field becomes `NaN`), forces `min=0`, and the wheel changes the value. Replace it with `MoneyInput` and `QuantityInput`. The search icon is `text-gray-200`, which is almost invisible. Use `muted-foreground` |
| `forms/Select`, `ComboBox`, `SearchInput`, `DatePicker`, `TextArea` | Align with 7.2 to 7.4: labels above, the error pattern, the item combobox with stock |
| `table/BasicTable` | Replace with `DataTable` (6). It uses Emotion `css` and hard-coded colours, 4 px cell padding, and has no states, pagination or alignment rules |
| `modals/Modal`, `providers/ModalProvider` | Keep for dialogs (8.1), but its Cancel button is `type="submit"`, and it holds line-item documents that belong on pages (7.1) |
| `@carbon/icons-react` icons in tables, forms and pages | Move to `lucide-react` (3.5) |

### 13.3 To build

| Component | For | Spec |
|---|---|---|
| `PageHeader` | Detail and form pages | Title, status pill, actions |
| `DataTable` | Lists | Sections 6.1 to 6.8, on TanStack Table, driven by the server |
| `StatusPill` | Everywhere | A tone and a label (6.3) |
| `RowActions` | Lists | A `⋯` menu (needs `@radix-ui/react-dropdown-menu`) |
| `EmptyState`, `ErrorState`, `Skeleton` | States | 6.7 and 9 |
| `Banner` | Persistent states | 9.3 |
| `FormSection`, `FormActions` | Forms | A heading with a divider, and the sticky action bar (7.2, 7.6) |
| `MoneyInput`, `QuantityInput`, `ItemPicker` | Forms | 7.3 |
| `LineItemsEditor` | Documents | 7.5 |
| `ConfirmDialog`, `ReasonDialog`, `PinApproval` | Confirmation | 8.3 levels 1 to 4 |
| `Drawer` | Edit one record | 8.2 |
| `formatRupiah`, `formatQuantity`, `formatDate` | Everywhere | 4.2 (replaces `formatPrice`, which prints `Rp. 10.000`) |
| `ConnectionStatus`, `NumericKeypad`, `PinPad` | Cashier | 10.3, 10.6, 10.7 |
| `ProductTile`, `ModifierSheet`, `OrderPanel`, `TotalsBlock`, `PaymentMethodTile` | Cashier | 10.4, 10.5, 10.7 |

## 14. Working rules

For anyone building a screen, including the one who built the last one.

1. **Use tokens, not values.** No hex colours, no `text-white` on a gold surface, no `gray-300` for
   text. If a token is missing, add it in one place and document it here.
2. **Tailwind and the `cn()` helper.** Do not add new Emotion `css` or inline `style`. Old Emotion is
   removed when a file is next changed.
3. **Reuse before you build.** Look at section 13, then at `src/components`. If you copy a block
   from another screen, you probably needed a component.
4. **Pages are thin.** A page composes `DataTable`, a form and `PageHeader`. Layout and behaviour
   live in components.
5. **No dead ends.** Do not put a menu item, button or tab in the interface before it works. Hide it,
   or mark it "Segera hadir" if people are expecting it.
6. **Write the empty, loading and error states** at the same time as the happy path.
7. **Copy the strings, not the schema.** Each form has its own validation messages from the list in
   BUSINESS_RULES section 14.
8. **Test with the keyboard and at 200% zoom** before opening a pull request. Test cashier screens
   on a real tablet, or an emulated one at 1280 × 800, touch only, offline.
9. **Update this guide in the same pull request** when a pattern changes or a new one is added.

### Review checklist for a pull request

- [ ] Uses tokens and the components in section 13; no new hard-coded colours or Emotion.
- [ ] One primary action; the button order is right (7.6); labels are verbs.
- [ ] Money, quantity and dates use the shared formatters; numbers are right-aligned and tabular.
- [ ] Lists have loading, empty, no-result and error states, and the filters live in the URL.
- [ ] Forms validate on blur, focus the first error, and show messages from the rules; Cancel is not
  a submit.
- [ ] Anything that changes stock or money has a review step, and no Edit on posted records.
- [ ] Strings are translation keys; nothing is sized to the English label.
- [ ] Keyboard, focus and contrast checks pass (section 12).
- [ ] Cashier screens: targets at least 48 px, no hover or gesture dependence, works offline, and
  never blocks a sale.
