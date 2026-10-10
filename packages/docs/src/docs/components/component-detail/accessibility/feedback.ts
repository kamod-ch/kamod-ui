import type { AccessibilityProfiles } from "./types";

export const feedbackAccessibility: AccessibilityProfiles = {
  alert: {
    foundation:
      'Alert renders `role="alert"`. That semantic role is intended for important updates, not simply for giving any paragraph a bordered background. The visual variant does not decide whether an announcement is appropriate.',
    naming:
      "Use a concise title and a specific explanation of what happened and what to do next. State the outcome in words, not just a red icon. If a recovery link is present, name its destination or result rather than using an isolated Click here label.",
    interaction:
      "An alert should not steal focus just to announce a change. Keep recovery controls in the normal tab order. For static explanatory content, choose an ordinary note or override the semantic role intentionally rather than treating every note as urgent.",
    pitfalls:
      "Several alerts updating together can become noisy. Keep persistent errors visible while the user corrects them, and avoid rerendering identical messages in a way that repeatedly announces them. Do not promise that initial page-load alert text is announced consistently everywhere.",
    checks: [
      "Trigger the update with a screen reader running and listen for missing or repeated announcements.",
      "Follow any recovery action using only the keyboard while retaining the surrounding context.",
      "Understand the message in grayscale and with its icon hidden.",
    ],
  },
  badge: {
    foundation:
      "Badge provides compact visual emphasis; it does not automatically announce state changes or turn its label into a control. Its color and variant remain presentation choices rather than a complete status description.",
    naming:
      "Write a short status word that makes sense without color, such as Pending review. When a count belongs to a button or link, include enough context in the parent action's name. Hide a badge from assistive technology only if it duplicates information already available.",
    interaction:
      "Keep static badges out of the tab order. If a badge is used as a removable filter, compose a real, named removal button instead of attaching a click handler to the visual label.",
    pitfalls:
      "Do not make every count update a live announcement. Decide whether the change actually needs immediate attention, and keep the full status available when compact text is truncated or visually abbreviated.",
    checks: [
      "Read the badge without its color and confirm its meaning is still clear.",
      "Check that static status labels do not create unnecessary keyboard stops.",
      "Inspect names of any parent links or removal actions containing the badge.",
    ],
  },
  empty: {
    foundation:
      "Empty supplies composition for a title, description, media and actions. It does not infer why content is absent or automatically announce a changed result set. Heading semantics should be checked in the chosen composition rather than inferred from a title component's name.",
    naming:
      "Explain whether there are no items yet, no matching results or a loading failure. Give the recovery action a specific name, such as Clear filters. Decorative illustrations should not repeat the title as a long alternative description.",
    interaction:
      "Keep any create, retry or clear action in a predictable focus order. If filtering removes the focused result, preserve a useful destination such as the search field or results heading instead of leaving focus on a removed element.",
    pitfalls:
      "Do not display an empty state while data is merely loading unless the wording explains that uncertainty. For dynamically changing search results, communicate the result count through an appropriate status mechanism rather than moving focus on every keystroke.",
    checks: [
      "Test an initial empty collection, no search matches and a failed request as separate states.",
      "Reach and understand the recovery action without seeing the illustration.",
      "Clear a filter and confirm new content appears without unexpected focus movement.",
    ],
  },
  progress: {
    foundation:
      'Progress exposes `role="progressbar"`. Determinate values default to 0 with a maximum of 100 and are clamped to the valid range. `value={null}` or `indeterminate` omits the current numeric value and supplies an indeterminate value description.',
    naming:
      "Associate a visible operation label through `aria-labelledby`, or supply a short `aria-label`. Explain units with `aria-valuetext` when a raw number is ambiguous. Keep an operation name separate from its changing percentage.",
    interaction:
      "A progress bar is informational and normally has no tab stop. Pair it with separate cancel or retry controls when the operation supports them. Built-in reduced-motion handling limits indicator movement, but your surrounding animations need their own review.",
    pitfalls:
      "Do not invent percentages when the total is unknown. A progress value is not a guarantee that every update will be announced. Announce meaningful milestones or completion separately when needed, and distinguish failure from a bar that simply stops moving.",
    checks: [
      "Read the operation name and current value with a screen reader in determinate and indeterminate modes.",
      "Test zero, completion, unknown total and failure, including a long-running operation.",
      "Enable reduced motion and verify the interface still communicates that work is underway.",
    ],
    example: {
      title: "Name the Operation and Describe Its Units",
      note: "This standalone example uses a known total. In your application, derive completed and total from the real operation; use indeterminate mode when the total is unknown.",
      code: 'import { Progress } from "@kamod-ch/ui";\nimport { useId } from "preact/hooks";\n\nexport function UploadProgress() {\n  const labelId = useId();\n  return (\n    <div>\n      <p id={labelId}>Uploading documents</p>\n      <Progress value={3} max={8} aria-labelledby={labelId}\n        aria-valuetext="3 of 8 documents uploaded" />\n    </div>\n  );\n}',
    },
  },
  skeleton: {
    foundation:
      "Skeleton is a visual placeholder, not a complete status or announcement mechanism. Its shapes reserve space while content loads, but they do not tell assistive technology what the missing content represents.",
    naming:
      "Keep a stable heading for the region and provide one concise loading message when the wait needs explanation. Decorative skeleton shapes can be hidden from assistive technology; do not hide the real result region along with them.",
    interaction:
      "Do not put focusable fake controls inside loading placeholders. Keep existing content usable during background refresh when possible. Replace placeholders with success, empty or error content according to the actual result.",
    pitfalls:
      "Many individually announced placeholders make a page difficult to use. Avoid repeated loading announcements for each row, and check that pulse animations respect the user's reduced-motion preference in the final stylesheet.",
    checks: [
      "Simulate slow loading and confirm one understandable status identifies the region.",
      "Tab through the page while loading and ensure focus never enters placeholder-only content.",
      "Exercise success, empty and error responses, and verify reduced-motion presentation.",
    ],
  },
  spinner: {
    foundation:
      'Spinner includes `role="status"` and a default Loading label; its SVG is decorative. The default communicates generic activity, while your interface must explain which operation is in progress and what happens next.',
    naming:
      "Use operation-specific status text for ambiguous or long-running tasks. When the spinner accompanies already announced text, inspect the result for duplicate announcements. Keep an action button's name meaningful while its icon changes to a spinner.",
    interaction:
      "The spinner itself is not a control. Preserve access to cancel or retry actions where available, and keep focus at the action that started the request unless the task requires a deliberate move.",
    pitfalls:
      "An indefinitely spinning indicator is not recovery guidance. Handle timeouts and failures visibly, and do not imply that disabling a submit button alone explains why the app is waiting. Review motion behavior with the final theme and classes.",
    checks: [
      "Start a request and listen for one useful operation-specific status.",
      "Try completion, rejection and a stalled request while preserving a recovery path.",
      "Check that loading does not erase button names or move keyboard focus unexpectedly.",
    ],
  },
  toast: {
    foundation:
      "Toaster renders a Notifications region with polite live behavior. Individual messages can use status or alert semantics according to their urgency, and dismissal buttons have a name. Announcement behavior depends on when messages enter the live region.",
    naming:
      "Write a short result and, when relevant, a next step. Include the affected object when several background actions can finish at once. A generic Done message is less helpful than Invoice saved.",
    interaction:
      "Do not move focus into a toast merely because it appeared. Make any dismissal or action reachable without disrupting the current task. Keep important recovery information in the page after the transient message disappears.",
    pitfalls:
      "Avoid duplicating the same result in several assertive regions. Review timeout behavior for longer content and actionable messages, and reserve urgent announcements for changes that actually warrant interruption.",
    checks: [
      "Trigger success and failure while a screen reader is reading other content and compare interruptions.",
      "Reach any toast action with the keyboard and confirm dismissal leaves focus in a useful place.",
      "Let the toast expire and verify important errors or recovery actions remain available elsewhere.",
    ],
  },
  sonner: {
    foundation:
      "The current Sonner renderer displays stacked messages and a native Dismiss button. It does not add a live-region role or aria-live attribute. Do not assume another library's Sonner announcement behavior is present in this implementation.",
    naming:
      "Use clear titles and descriptions naming the affected operation. If several messages are visible, the repeated Dismiss buttons need enough context to identify which message they close; inspect and improve that relationship in the rendered UI.",
    interaction:
      "Keyboard users can reach the native dismiss action, but arrival of a message is not automatically announced. Supply an appropriate persistent status mechanism in your application or extend the renderer before relying on it for important asynchronous feedback.",
    pitfalls:
      "Do not make a toast the only evidence that saving failed. Keep field or request errors in the relevant page content, avoid moving focus to every new message, and ensure messages do not cover essential controls at narrow widths.",
    checks: [
      "Trigger a message with a screen reader and verify your chosen status mechanism actually announces it.",
      "Dismiss one of several messages using the keyboard without confusing their targets.",
      "Test a failed request with the toast closed and confirm the error and recovery action still exist.",
    ],
  },
};
