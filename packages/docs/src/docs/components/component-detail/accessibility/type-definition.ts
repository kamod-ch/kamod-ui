import type { AccessibilityProfile } from "./types";

/** Disclosure behavior is inherited from core Collapsible; navigation stays with the caller. */
export const typeDefinitionAccessibility: AccessibilityProfile = {
  foundation:
    "Type Definition pairs a persistent summary with a real disclosure button. `aria-expanded` follows the actual state and `aria-controls` names the content panel. Decorative code and chevron icons are hidden from assistive technology. The card starts collapsed unless `defaultOpen` or controlled `open` says otherwise. Source children are mounted only while expanded, so hidden copy buttons are not extra tab stops.",
  naming:
    "Use a readable `title` and an exact `typeName`: the first explains the purpose; the second distinguishes similarly named actions in a screen-reader button list. The visible action label is included in the accessible name, followed by the type identifier. Translate `expandLabel` and `collapseLabel` together. Generated IDs keep separate cards independent; explicitly supplied `headingId` values must be unique across the document. Match `headingLevel` to the surrounding sections rather than choosing a heading for its font size.",
  interaction:
    "Tab reaches the disclosure and any ordinary links in its summary. Enter or Space toggles it using native button behavior, without submitting an enclosing form. Opening leaves focus on the trigger; the next Tab can enter controls supplied in the expanded content. This is a disclosure, not a composite list with arrow-key navigation. A parent can update controlled `open` from another action, but must also handle URL changes, scrolling or focus movement when its workflow needs them.",
  pitfalls:
    "The muted bar is visible whether the card is open or closed; stronger hover color is supplementary, while the label and chevron communicate state. Preserve the visible focus outline when overriding classes. At narrow widths, long identifiers wrap and metadata can move below the heading; code blocks supplied by the caller should scroll within their own width. Children unmount on collapse, so persistent editor state belongs above the card. If an external action closes a card while focus is inside it, move focus to its trigger before hiding that content.",
  checks: [
    "Activate both disclosure states using Enter and Space inside a form; verify the form does not submit and the accessible name includes the exact type identifier.",
    "Render multiple cards, including repeated titles, and inspect unique trigger/panel IDs. Tab through an expanded card, close it and confirm hidden controls are no longer reachable.",
    "Try long identifiers, translated action labels and linked metadata at 320px and enlarged text in both themes. Verify hover and focus remain distinct and the expanded source stays inside the card.",
  ],
  example: {
    title: "Match the Surrounding Heading Hierarchy",
    note: "This section already has an h2, so the card uses h3. Generated IDs are sufficient when there are no external permalink targets.",
    code: `import { TypeDefinition } from "@kamod-ch/ui";

export const Reference = () => <section aria-labelledby="payloads">
  <h2 id="payloads">Event payloads</h2>
  <TypeDefinition title="Selection change" typeName="SelectionChange" headingLevel={3}
    description="The selected item's stable identifier.">
    <pre><code>{\`type SelectionChange = { id: string };\`}</code></pre>
  </TypeDefinition>
</section>;`,
  },
};
