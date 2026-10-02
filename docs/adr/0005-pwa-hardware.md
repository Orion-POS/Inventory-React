# 0005. First release targets Android tablets; printing needs an early spike

Status: proposed (pending the hardware spike)

## Context

The first release is a PWA. Web Bluetooth, WebUSB and Web Serial work in Chrome on Android but not
in Safari on iOS or iPadOS. Browser-to-Bluetooth thermal printing is also known to be unreliable
across printer models. The cash drawer is normally opened by a pulse sent through the printer.

## Decision

- Support **Android tablets with Chrome only** for the first release. iPad is out of scope.
- Before Phase 2 work starts, spend about one week on a spike with a real 58 mm or 80 mm ESC/POS
  printer: print a receipt and open a drawer over Web Bluetooth and over WebUSB.
- Keep `window.print()` as a fallback path.

If the spike fails, the fallbacks in order are a small local print agent, the RawBT app, and
wrapping the PWA in a thin Android shell (TWA or Capacitor).

## Consequences

- Owners are told up front that iPads are unsupported.
- This record is updated to "accepted" or superseded once the spike has results.
