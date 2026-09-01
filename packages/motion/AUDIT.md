# @kamod-ch/ui-motion — component audit

Audit of Kamod UI primitives and motion adapter composition (Prompt 1).

## Package status

`@kamod-ch/ui-motion` exists at `packages/motion` (v0.1.0). ESM-only, peers on `@kamod-ch/ui`, `@kamod-ch/motion`, `preact`, `motion`. `@kamod-ch/ui` has **no** dependency on motion, React, or React DOM.

## Export map

| Subpath                            | Exports                                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `@kamod-ch/ui-motion`              | Re-exports all adapters + `MotionComponentProps`                                                               |
| `@kamod-ch/ui-motion/dialog`       | `MotionDialogPortal`, `MotionDialogOverlay`, `MotionDialogContent`                                             |
| `@kamod-ch/ui-motion/alert-dialog` | `MotionAlertDialogPortal`, `MotionAlertDialogOverlay`, `MotionAlertDialogViewport`, `MotionAlertDialogContent` |
| `@kamod-ch/ui-motion/sheet`        | `MotionSheetPortal`, `MotionSheetContent`                                                                      |
| `@kamod-ch/ui-motion/accordion`    | `MotionAccordionContent`                                                                                       |
| `@kamod-ch/ui-motion/collapsible`  | `MotionCollapsibleContent`                                                                                     |
| `@kamod-ch/ui-motion/tabs`         | `MotionTabsIndicator` (optional docs demo)                                                                     |

## Per-component audit

### 1. Dialog / MotionDialogContent

| Concern                  | Core (`Dialog`, `DialogContent`)                                                                  | Motion adapter                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **State**                | Controlled/uncontrolled via `createControllableSignal` on `Dialog`                                | Reads `useDialog().open` — same semantics                                                        |
| **data-state**           | `"open" \| "closed"` on root, overlay, content                                                    | Same on overlay + `MotionDialogContent`                                                          |
| **forceMount / unmount** | `DialogPortal forceMount` + `DialogContent forceMount` keep portal during exit                    | `MotionDialogPortal` + `useMotionMount` + `Presence`; exit completes before unmount              |
| **Portal**               | `DialogContent` portals to body; `DialogPortal` for custom layouts                                | `MotionDialogPortal` → `DialogPortal forceMount` → `Presence`                                    |
| **Ref**                  | `useModalPanelA11y` → `panelRef` on panel                                                         | `ref={panelRef}` on `Motion` panel                                                               |
| **Focus**                | `trapFocus(panel)` while open; trigger refocus on close                                           | Unchanged — uses `useModalPanelA11y`                                                             |
| **CSS animation**        | `tw-animate` fade/zoom on overlay + panel                                                         | **Replaced** by `@kamod-ch/motion/presets` `scale` + `fade` — no parallel CSS on same properties |
| **Composition**          | `Dialog` + `DialogTrigger` + `MotionDialogPortal` + `MotionDialogOverlay` + `MotionDialogContent` | Drop-in for `DialogContent`; overlay dismiss via `onPointerDown` on `MotionDialogOverlay`        |

### 2. Alert Dialog / MotionAlertDialogContent

| Concern                  | Core                                                  | Motion adapter                                                                                                                                      |
| ------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **State**                | `AlertDialog` → `Dialog` stack                        | Same                                                                                                                                                |
| **data-state**           | On outer `alert-dialog-content` shell + inner panel   | On overlay, panel (`alert-dialog-panel`)                                                                                                            |
| **forceMount / unmount** | Immediate unless `forceMount`                         | `MotionAlertDialogPortal` + `Presence` + `useMotionMount`                                                                                           |
| **Portal**               | `DialogContent presentation="slot"`                   | `MotionAlertDialogPortal` with `data-slot="alert-dialog-content"` wrapper (`display: contents`) so overlay clicks are in-layer (no outside dismiss) |
| **Ref / ARIA**           | `useModalPanelA11y`; `role="alertdialog"` via slot    | `MotionAlertDialogContent`: `role="alertdialog"`, `aria-modal`, labelled/describedby                                                                |
| **Focus**                | Escape closes; focus return on dismiss                | Same via `Dialog` root                                                                                                                              |
| **Outside click**        | Core slot shell is dismissible on direct backdrop hit | Motion: overlay clicks do **not** dismiss (wrapper in dismiss layer)                                                                                |
| **CSS animation**        | Fade on shell + `data-open` on panel                  | `scale` preset on panel; fade on overlay — no CSS animate classes                                                                                   |
| **Composition**          | Single `AlertDialogContent`                           | `MotionAlertDialogPortal` → `MotionAlertDialogOverlay` → `MotionAlertDialogViewport` → `MotionAlertDialogContent`                                   |

### 3. Sheet / MotionSheetContent

| Concern                  | Core (`Sheet`, `SheetContent`)                                                   | Motion adapter                                                           |
| ------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **State**                | `Sheet` → `Dialog`                                                               | Same                                                                     |
| **data-state**           | On overlay + `sheet-content`                                                     | Same slots                                                               |
| **forceMount / unmount** | Immediate unless `forceMount`                                                    | Built-in `MotionSheetPortal` + `Presence`                                |
| **Portal**               | `SheetContent` portals overlay + panel                                           | `MotionSheetContent` includes `MotionSheetPortal`                        |
| **Ref / ARIA**           | `useModalPanelA11y` on panel                                                     | Same                                                                     |
| **Focus**                | Escape on content; dismiss layer                                                 | Overlay has no dismiss handler (sheet uses dismiss layer)                |
| **Side presets**         | CSS `slide-in-from-*` per `side`                                                 | `sheetPreset(side)` → `slideLeft/Right/Up/Down` with `reduced: fadeOnly` |
| **CSS animation**        | tw-animate slide + fade on overlay                                               | Motion presets only                                                      |
| **Composition**          | Replace `SheetContent` with `MotionSheetContent side="top\|right\|bottom\|left"` | Optional separate `MotionSheetPortal` if splitting overlay/panel         |

### 4. Accordion / MotionAccordionContent

| Concern                  | Core (`AccordionContent`)                                                 | Motion adapter                                                                               |
| ------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **State**                | `useAccordionItem().isOpen` from accordion `Set` signal                   | Same hook                                                                                    |
| **data-state**           | On content wrapper                                                        | Same on outer wrapper                                                                        |
| **forceMount / unmount** | Height CSS transition; unmount after `transitionend`                      | `useMotionMount` + `Presence`; unmount after exit                                            |
| **Portal**               | None                                                                      | None                                                                                         |
| **Ref**                  | `outerRef` / `innerRef` for height measure                                | No height measure — `slideUp` preset on inner `Motion` (docs: replace CSS height transition) |
| **Focus**                | Trigger roving; content `inert` when closed                               | Same `inert` / `aria-hidden`                                                                 |
| **CSS animation**        | Imperative height/max-height transition                                   | **Replaced** by motion `slideUp` — no parallel height CSS                                    |
| **Composition**          | Swap `AccordionContent` → `MotionAccordionContent` inside `AccordionItem` |                                                                                              |

### 5. Collapsible / MotionCollapsibleContent

Same pattern as accordion: `useCollapsible().open`, `Presence` + `slideUp`, swap `CollapsibleContent` → `MotionCollapsibleContent`.

## Deferred (out of scope)

| Component      | Reason                                                                   |
| -------------- | ------------------------------------------------------------------------ |
| Toast / Sonner | Would duplicate store, `closing` flag, and `aria-live` timing            |
| Drawer         | Use `MotionSheetContent` with `Drawer` root — no separate wrapper        |
| Tabs content   | Instant unmount; only `MotionTabsIndicator` added for optional highlight |

## Shared types

- `MotionComponentProps` — `Pick<MotionProps, "initial" | "animate" | "exit" | "transition" | "reducedMotion">` for optional overrides at the type boundary.

## Core extensions (additive, motion-independent)

- `DialogPortal` with `forceMount`
- Exported `useDialog`, `useModalPanelA11y`, `dialogViewportBleedClass`

## Dependencies

- Peers: `@kamod-ch/ui`, `@kamod-ch/motion`, `preact`, `motion`, `@preact/signals`
- Engine: `@kamod-ch/motion/motion` (motion/mini) — no `motion/react`, no Preact React compat for React packages
