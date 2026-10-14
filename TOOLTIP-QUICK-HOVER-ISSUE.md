# Tooltip Quick Hover Issue - Pending Open/Close Timers Can Cause Delayed Tooltips to Open or Close After Pointer Leaves or Re-enters

> Local status, 23 September 2026: implemented during the feature review, with controlled/uncontrolled pointer and mouse regression tests. The explanation below records the original bug and proposed fix.

## Problem

Quickly moving the pointer across a tooltip trigger can leave its tooltip visible
after the pointer has already left. The tooltip appears after its opening delay
and stays there until another interaction dismisses it, such as hovering over
the trigger and leaving again.

Observed on the required-field icons in **Application Shell 1 → Props and data**.
The underlying problem is in the shared core Tooltip, so other consumers using
delayed hover opening can be affected too.

### Reproduce

1. Open the [Application Shell 1 page](http://localhost:5173/blocks/application-shell/application-shell-1#application-shell-prop-reference)
   with the local dev server running.
2. Move the pointer over a required icon and immediately away, before the tooltip
   appears. Do not click or focus the trigger.
3. Keep the pointer elsewhere and wait. The tooltip appears and remains visible.

**Expected:** leaving before the opening delay cancels the pending tooltip.
**Actual:** the tooltip opens after leaving and does not automatically close.

> Screenshot or recording: attach the stuck tooltip with the pointer away from its trigger.

## Cause and location

### The pending open timer is not cancelled

In [`Tooltip.tsx`](packages/core/src/components/tooltip/Tooltip.tsx),
`closeWithDelay()` returns before clearing the opening timer when the tooltip
is still closed:

```tsx
const closeWithDelay = () => {
  if (!open.value) return;
  if (openTimerRef.current !== null) {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = null;
  }
  // Existing delayed-close scheduling follows.
};
```

[`TooltipTrigger.tsx`](packages/core/src/components/tooltip/TooltipTrigger.tsx)
calls `openWithDelay()` on mouse/pointer entry and `closeWithDelay()` on exit.
With the default **250 ms opening delay**, the sequence is:

1. Enter: schedule opening; `open.value` is still `false`.
2. Leave before 250 ms: the early return skips cancellation.
3. The timer calls `setOpen(true)` after the pointer has left. No close timer was
   scheduled, and there is no new leave event to dismiss the tooltip.

[`RequiredIndicator.tsx`](packages/docs/src/blocks/RequiredIndicator.tsx) uses
the core component in controlled mode:

```tsx
<Tooltip open={open} onOpenChange={setOpen}>
```

The delayed callback therefore still asks its parent to open. The issue also
reproduces with an uncontrolled Tooltip; the icon's styling is not the cause.

### The reverse transition has the same ordering problem

`openWithDelay()` returns while already open, before cancelling a pending close
timer. Leaving and quickly returning within the default **120 ms closing delay**
can therefore close the tooltip while its trigger is hovered again.

## Proposed solution

Cancel the **opposite pending timer before checking the current open state** in
both functions. The remaining scheduling logic stays the same:

```diff
 const openWithDelay = () => {
-  if (open.value) return;
   if (closeTimerRef.current !== null) {
     window.clearTimeout(closeTimerRef.current);
     closeTimerRef.current = null;
   }
+  if (open.value) return;
```

```diff
 const closeWithDelay = () => {
-  if (!open.value) return;
   if (openTimerRef.current !== null) {
     window.clearTimeout(openTimerRef.current);
     openTimerRef.current = null;
   }
+  if (!open.value) return;
```

Keep the existing duplicate-timer guards, unmount cleanup, `setOpen()` and
`onOpenChange` behavior. Preserve focus/blur, Escape and hoverable-content handling.
This needs a core fix rather than a delay or CSS workaround in RequiredIndicator.

### Regression coverage

Extend [`Tooltip.test.tsx`](packages/core/src/components/tooltip/Tooltip.test.tsx).
Its current tests cover focus/blur and uninterrupted hover delays, but not these
interrupted transitions. For example, after rendering a tooltip with a 250 ms
opening delay and enabling fake timers:

```tsx
fireEvent.mouseEnter(trigger);
await act(async () => {
  await vi.advanceTimersByTimeAsync(50);
});
fireEvent.mouseLeave(trigger);
await act(async () => {
  await vi.advanceTimersByTimeAsync(1000);
});
expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
```

- [ ] Quick entry/exit stays closed after all timers settle.
- [ ] Re-entering before the close delay keeps an open tooltip visible.
- [ ] Cover controlled/uncontrolled state, mouse/pointer events and repeated passes.
- [ ] Normal delays, focus/blur, Escape, movement into tooltip content and unmount cleanup still work.

**Verification so far:** isolated Vitest/jsdom checks reproduced both bugs and
confirmed the proposed ordering change for controlled/uncontrolled tooltips using
mouse and pointer events. The two existing tooltip tests also passed against both
copies. The fix has only been tested in a temporary copy; project source is
unchanged, and browser verification remains part of implementation.
