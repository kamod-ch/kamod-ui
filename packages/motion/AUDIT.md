# @kamod-ch/ui-motion — component audit

Audit of Kamod UI primitives before motion wrappers (Prompt 8).

## Summary decisions

| Component    | Open state                         | Portal                 | Unmount                       | Decision                                                             |
| ------------ | ---------------------------------- | ---------------------- | ----------------------------- | -------------------------------------------------------------------- |
| Dialog       | `createControllableSignal` on root | `DialogContent` → body | Immediate unless `forceMount` | **Composition** via `DialogPortal` + `@kamod-ch/motion/presence`     |
| Alert Dialog | Dialog stack                       | Same                   | Same                          | **Composition** + `MotionAlertDialogViewport` for layout             |
| Sheet        | Dialog stack                       | Same                   | Same                          | **Composition** — `MotionSheetContent` (overlay + panel)             |
| Drawer       | Sheet + direction context          | Same                   | Same                          | Use `MotionSheetContent` with `Drawer` root (no separate wrapper)    |
| Accordion    | Internal `Set` signal              | No                     | Animated unmount in core      | **Shift** — `MotionAccordionContent` replaces `AccordionContent`     |
| Collapsible  | Controlled/uncontrolled signal     | No                     | Animated unmount in core      | **Shift** — `MotionCollapsibleContent` replaces `CollapsibleContent` |
| Tabs         | `useState` value                   | No                     | Instant panel unmount         | **Optional** — `MotionTabsIndicator` only                            |
| Toast        | Global store + `closing` flag      | No (fixed region)      | Delayed unmount               | **Deferred** — would duplicate store/exit timing                     |
| Sonner       | Global store                       | No                     | Immediate                     | **Deferred** — minimal a11y surface                                  |

## Dialog / Sheet / Alert Dialog

- **data-state:** `"open" \| "closed"` on overlay and content
- **Focus:** `useModalPanelA11y` → `trapFocus(panel)`; close refocuses trigger
- **Dismiss:** Escape on content + `createDismissableLayer` on Dialog root; overlay pointer-down on Dialog/AlertDialog
- **Core extension (additive):** `DialogPortal`, exported `useDialog`, `useModalPanelA11y`, `dialogViewportBleedClass`
- **Motion rule:** No `tw-animate-css` classes on motion-wrapped nodes — presets from `@kamod-ch/motion/presets` only

## Accordion / Collapsible

- **data-state:** `"open" \| "closed"` on item/trigger/content
- **Core animation:** imperative height/max-height (CSS transition)
- **Motion rule:** Replace content component; do not run core height animation and motion on the same property

## Tabs

- **data-state:** `"active" \| "inactive"` on triggers/content
- **Keyboard:** roving tabindex + arrows on triggers
- **MotionTabsIndicator:** optional sliding highlight; does not replace `TabsContent`

## Toast / Sonner (out of scope)

Wrapping would require replicating `closing` state, `EXIT_ANIMATION_MS`, and `aria-live` regions from `@kamod-ch/ui/toast`.

## Dependencies

- Peers: `@kamod-ch/ui`, `@kamod-ch/motion`, `preact`, `motion`
- `@kamod-ch/ui` has **no** dependency on `@kamod-ch/motion`, `motion`, `react`, or `react-dom`
