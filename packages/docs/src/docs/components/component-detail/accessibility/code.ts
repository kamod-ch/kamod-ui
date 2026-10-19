import type { AccessibilityProfile } from "./types";

/** Code exposes reading preferences without changing the original source string. */
export const codeAccessibility: AccessibilityProfile = {
  foundation:
    "Code renders native pre and code elements. Its source viewport is keyboard focusable, imports use a button with aria-expanded and aria-controls, and wrapping uses a named switch. Syntax colors supplement the source text; the escaped plain-text fallback remains readable before highlighting loads.",
  naming:
    "Use a meaningful filePath and explain the example with a nearby heading. Copy retains an accessible name even when its visible label is hidden on narrow screens. Give custom toolbar actions their own names, and keep the supplied actions in renderToolbar when readers still need them.",
  interaction:
    "Tab to the import disclosure and activate it with Enter or Space. Tab to the wrap switch and toggle it with Space. The source viewport supports native keyboard scrolling; focus can leave it normally. Copy success and failure are announced through a polite status message without moving focus.",
  pitfalls:
    "Copy always includes hidden imports and original line breaks, so explain that behavior when it matters. A rejected clipboard request shows a retry action and announces manual copying as a fallback. renderedContent replaces the source viewport: its heading structure, links and accessible reading order are the caller's responsibility. Never turn untrusted source into raw HTML.",
  checks: [
    "Use every reading control and the copy action with only the keyboard, then verify focus can continue to the next section.",
    "Check long lines, filenames and control labels at 320px and with text zoom in both light and dark themes.",
    "Compare copied text against the original after folding and wrapping; deny clipboard permission and verify the failure is announced without reporting success.",
  ],
  example: {
    title: "Give the source a useful context",
    note: "A real heading describes the example; the filename identifies its destination. Keep code as text so it can be read and copied safely.",
    code: '<section aria-labelledby="save-example">\n  <h3 id="save-example">Save account preferences</h3>\n  <Code code={source} filePath="src/account/save.ts" defaultWrapped />\n</section>',
  },
};
