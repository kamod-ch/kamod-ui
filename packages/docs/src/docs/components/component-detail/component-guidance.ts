/** Editorial guidance complements each page's existing examples and API, without inventing props. */
export type ComponentGuidance = {
  family: string;
  purpose: string;
  integration: string;
  checks: readonly string[];
  related: readonly string[];
};

const families: { slugs: string[]; guide: ComponentGuidance }[] = [
  {
    slugs: ["type-definition"],
    guide: {
      family: "Reference & disclosure",
      purpose:
        "Separate a contract’s purpose from its implementation details. Keep the summary readable and reveal complete source only when the reader needs it.",
      integration:
        "Use title for the purpose and typeName for the exact identifier. Keep required-field metadata tied to the real declaration. Supply code rendering as children, and let one parent own open state when links or search results must reveal a definition.",
      checks: [
        "Open and close with Enter and Space; confirm hidden source and copy actions leave the tab order.",
        "Try long type names and rich metadata at narrow widths in both themes without clipping the heading or focus ring.",
        "Verify external reveal actions update the same open state, and use unique headingId values for permalink targets.",
      ],
      related: ["collapsible", "accordion", "badge"],
    },
  },
  {
    slugs: ["formisch"],
    guide: {
      family: "Forms & validation",
      purpose:
        "Keep schema rules, field state and visual feedback connected. Start with one complete form, then compare native inputs, composite controls and dynamic field arrays using the same validation model.",
      integration:
        "Define initial input and schema together. Formisch owns field state and validation; Kamod owns control presentation and interaction. Replace the demo's submitted-data panel with your service call, validate again on the server and keep entered values available when a request fails.",
      checks: [
        "Submit empty and invalid values, correct them, then verify success and reset. Show request failures separately from client validation.",
        "Add and remove array rows while preserving stable keys, explicit labels and useful focus. Enforce limits in both the schema and the interface.",
        "Test keyboard operation, validation announcements and pending submissions in both schemes. A disabled submit action needs a visible explanation.",
      ],
      related: ["field", "input", "select", "button"],
    },
  },
  {
    slugs: [
      "input",
      "input-group",
      "input-otp",
      "textarea",
      "checkbox",
      "switch",
      "radio-group",
      "select",
      "native-select",
      "combobox",
      "slider",
      "field",
      "label",
      "calendar",
      "date-picker",
      "dropzone",
      "selectable-card",
    ],
    guide: {
      family: "Forms & input",
      purpose:
        "Make the expected input clear before someone interacts, and keep the current value, help text and validation feedback connected.",
      integration:
        "Choose where the value lives before wiring up validation. Use the documented change callback, preserve the field name when submitting a native form, and associate help or error text with the control. A placeholder supplements a label; it does not replace one.",
      checks: [
        "Try an empty value, a valid value and a rejected value; keep the correction visible beside the field.",
        "Navigate using only the keyboard and verify the label identifies the focused control.",
        "Check disabled and read-only behavior separately where supported; they communicate different intentions.",
      ],
      related: ["field", "label", "input"],
    },
  },
  {
    slugs: [
      "dialog",
      "alert-dialog",
      "drawer",
      "sheet",
      "popover",
      "tooltip",
      "hover-card",
      "dropdown",
      "context-menu",
      "menubar",
      "command",
    ],
    guide: {
      family: "Overlays & actions",
      purpose:
        "Reveal the right amount of context without losing the user's place in the interface. Keep the trigger, content and dismissal behavior working as one interaction.",
      integration:
        "Keep trigger and content within the component's documented composition. Give destructive actions a clear consequence and an explicit confirmation. Let the primitive manage focus and dismissal instead of adding a second document-level keyboard handler.",
      checks: [
        "Open with the keyboard, move through the content and verify focus returns to a sensible trigger when closed.",
        "Test Escape, outside interaction and nested overlays according to the component's documented behavior.",
        "Check long titles and content on a small screen; the important action must remain reachable without clipping.",
      ],
      related: ["button", "dialog", "tooltip"],
    },
  },
  {
    slugs: ["button", "button-group", "toggle", "toggle-group", "theme-toggle"],
    guide: {
      family: "Actions & selection",
      purpose:
        "Make the next action easy to recognize. Use visual emphasis deliberately and distinguish an action from a persistent selection or a navigation link.",
      integration:
        "Use an action label that describes the result. Within a form, choose button types deliberately so a secondary action does not submit accidentally. Use the supported selected or pressed state for persistent choices, and provide an accessible name for icon-only controls.",
      checks: [
        "Check hover, focus, pressed and disabled states using both pointer and keyboard.",
        "For asynchronous actions, prevent duplicate submissions and show a useful pending label.",
        "Keep the primary action recognizable when labels wrap, text is enlarged or the theme changes.",
      ],
      related: ["button", "button-group", "spinner"],
    },
  },
  {
    slugs: [
      "accordion",
      "collapsible",
      "tabs",
      "navigation-menu",
      "breadcrumb",
      "pagination",
      "sidebar",
      "tree",
      "locale-segment-group",
    ],
    guide: {
      family: "Navigation & disclosure",
      purpose:
        "Organize content into understandable destinations and reveal detail when it becomes relevant. Keep the active location or expanded state easy to recognize.",
      integration:
        "Use stable identifiers when items come from data, especially when they can be reordered. Keep links as real destinations and use disclosure controls for revealing content. Decide whether selection belongs to local state, the URL or a parent component before connecting callbacks.",
      checks: [
        "Try long labels, nested content and an empty list without changing the focus order.",
        "Verify the documented arrow-key and activation behavior where the pattern supports it.",
        "Check the selected or expanded item after data changes and while navigating back to the page.",
      ],
      related: ["tabs", "accordion", "breadcrumb"],
    },
  },
  {
    slugs: ["alert", "badge", "empty", "progress", "skeleton", "spinner", "toast", "sonner"],
    guide: {
      family: "Status & feedback",
      purpose:
        "Explain what is happening, what changed and what someone can do next. Pair visual status with language that still makes sense without its color.",
      integration:
        "Tie feedback to the operation it describes. Distinguish waiting, success, failure and an empty result instead of reusing one message for every state. Keep essential recovery instructions available in the page even if a temporary notification disappears.",
      checks: [
        "Confirm that status is understandable without color, animation or an icon alone.",
        "Exercise both completion and failure paths; stop loading indicators when the operation finishes.",
        "Use announcements only when needed and avoid repeatedly announcing unchanged background activity.",
      ],
      related: ["alert", "empty", "progress"],
    },
  },
  {
    slugs: ["table", "data-table", "chart"],
    guide: {
      family: "Data & comparison",
      purpose:
        "Help people compare information without losing labels, units or context. Build the empty and loading states alongside the populated example.",
      integration:
        "Keep a stable identity for each record and format values at the presentation boundary. Make sorting and filtering behavior explicit, preserve meaningful headings, and provide a readable alternative when a visual representation alone cannot communicate the result.",
      checks: [
        "Test zero, one and many records, including missing values and unusually long text.",
        "Check headers, units and sort state with keyboard and assistive technology.",
        "Keep wide content within its own scroll region so it does not widen the whole page.",
      ],
      related: ["table", "empty", "skeleton"],
    },
  },
  {
    slugs: ["avatar", "image", "video", "carousel", "aspect-ratio"],
    guide: {
      family: "Media & presentation",
      purpose:
        "Give media a predictable place in the layout while keeping the surrounding content readable during loading, playback or failure.",
      integration:
        "Choose a meaningful alternative description when media conveys information; decorative media should not repeat surrounding labels. Reserve space before assets load, supply a useful fallback, and keep playback or carousel movement under the user's control.",
      checks: [
        "Try missing and slow assets, different aspect ratios and long alternative text.",
        "Check controls with the keyboard and keep automatic movement compatible with reduced motion.",
        "Review cropping at narrow widths so the subject and any important text remain visible.",
      ],
      related: ["aspect-ratio", "image", "skeleton"],
    },
  },
];

const composition: ComponentGuidance = {
  family: "Composition & layout",
  purpose:
    "Build a clear hierarchy with reusable structure, consistent spacing and semantic surfaces. Keep layout decisions close to the content they organize.",
  integration:
    "Start from the smallest example that expresses your intent. Keep document order meaningful, use native semantics for headings and landmarks, and let the parent layout own page-level spacing. Avoid nesting interactive elements just to match a visual treatment.",
  checks: [
    "Review long content, empty content and narrow containers without relying on a fixed height.",
    "Check text zoom, visible focus and contrast in light and dark appearances.",
    "Use documented extension points and verify class overrides do not erase essential interaction styles.",
  ],
  related: ["card", "separator", "typography"],
};

export function componentGuidance(slug: string): ComponentGuidance {
  return families.find(({ slugs }) => slugs.includes(slug))?.guide ?? composition;
}

// Matching categories verified in the public Shadcnblocks directory, October 2026.
// These are design references, not a claim that Kamod's implementation was copied from them.
const referenceCategories = new Set([
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "drawer",
  "dropzone",
  "empty",
  "field",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "theme-toggle",
  "toggle",
  "toggle-group",
  "tooltip",
  "tree",
]);
export function componentDesignReference(slug: string): string | undefined {
  const category = slug === "dropdown" ? "dropdown-menu" : slug === "video" ? "video-player" : slug;
  return referenceCategories.has(category) ||
    category === "dropdown-menu" ||
    category === "video-player"
    ? `https://www.shadcnblocks.com/components/${category}`
    : undefined;
}

/** Link to the implementation rather than sending every component to the repository root. */
export function componentSourceUrl(slug: string, motion = false): string {
  const path =
    slug === "formisch"
      ? "packages/docs/src/docs/forms/formisch"
      : motion || slug === "ui-motion"
        ? "packages/ui-motion"
        : slug === "cn"
          ? "packages/core/src/utils.ts"
          : `packages/core/src/components/${slug}`;
  return `https://github.com/kamod-ch/kamod-ui/${slug === "cn" ? "blob" : "tree"}/main/${path}`;
}
