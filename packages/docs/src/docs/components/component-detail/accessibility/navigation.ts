import type { AccessibilityProfiles } from "./types";

export const navigationAccessibility: AccessibilityProfiles = {
  button: {
    foundation:
      "Button renders a native button, an anchor when `href` is supplied, or the provided child with `asChild`. Its variant changes appearance, not semantics. The native button path does not set a default type, so browser form-submission behavior still matters.",
    naming:
      "Use visible action text wherever possible. An icon-only button needs a name describing its result, such as Download invoice. Decorative icons should be hidden from assistive technology, and a tooltip should supplement rather than supply the only dependable name.",
    interaction:
      'Native buttons activate with Enter and Space; links retain normal navigation behavior. Set `type="button"` for secondary form actions and `type="submit"` for submission. With asChild, choose an element that already supports the required interaction.',
    pitfalls:
      "A disabled-looking anchor is still a link unless your application handles it appropriately. Avoid replacing a button with a clickable div, hiding the focus ring or using loading feedback that erases the action's accessible name.",
    checks: [
      "Activate each variant by keyboard and verify a secondary action does not submit its surrounding form.",
      "Inspect icon-only names and loading/disabled states without relying on a tooltip.",
      "Check that links have real destinations and that custom children preserve one interactive element.",
    ],
  },
  "button-group": {
    foundation:
      'ButtonGroup is a grouping wrapper with `role="group"`; it does not turn its children into a toolbar with managed arrow-key focus. Each button or link retains its own behavior and tab stop.',
    naming:
      "Give the group a name when its relationship is not obvious from a nearby heading, and keep each action individually understandable. Do not repeat a long group description in every button name. Name icon-only actions even when adjacent buttons have visible text.",
    interaction:
      "Use Tab to visit child controls in document order. Choose explicit button types within forms. If the controls represent persistent choices, use ToggleGroup or RadioGroup instead of manually coloring ordinary buttons as selected.",
    pitfalls:
      "Shared borders can hide an individual button's focus ring. Check each edge and the separators when controls wrap or become disabled. A compact group still needs practical pointer and touch targets.",
    checks: [
      "Tab through every available action and identify the focused control independently of its neighbors.",
      "Verify wrapping preserves logical order and does not separate icons from their labels.",
      "Check that disabled controls are actually unavailable and that the group name describes its purpose.",
    ],
  },
  toggle: {
    foundation:
      "Toggle renders a button with `aria-pressed` reflecting its state. Pressed state represents a persistent choice, not just the brief visual feedback of clicking a normal action button.",
    naming:
      "Keep the label stable while the state changes: Bold remains Bold whether pressed or not. Give icon-only toggles an explicit name. Add a description when the effect is scoped to a selected item or part of the document.",
    interaction:
      "Enter and Space activate the button. Controlled `pressed` state and its callback must stay in sync with the actual application setting. A failed save should not leave an apparently enabled feature that did not take effect.",
    pitfalls:
      "Do not use pressed styling for navigation to the current page; use a link and current-page semantics instead. Keep focus and pressed treatments distinguishable, and avoid communicating selection with color alone.",
    checks: [
      "Toggle twice using the keyboard and confirm the pressed state is announced each time.",
      "Verify the name stays meaningful while selected, unselected and disabled.",
      "Simulate an external state update or failed persistence and confirm the control reflects the true value.",
    ],
  },
  "toggle-group": {
    foundation:
      "ToggleGroup groups toggle buttons and defaults to single selection. Each item exposes `aria-pressed`; the root is a group, not a radiogroup. Do not assume mutually exclusive values imply native radio keyboard behavior.",
    naming:
      "Label the choice set and every option. Use stable option names, such as List and Grid, rather than changing labels into instructions after selection. Describe whether users may choose more than one option when that is not visually obvious.",
    interaction:
      "Keep each item keyboard reachable and use the documented value shape for single or multiple selection. Decide whether an empty selection is permitted before wiring controlled state. Do not add a toolbar role unless you also implement its keyboard model.",
    pitfalls:
      "A highlighted item can be pressed, focused or both; show those states distinctly. If the task requires exactly one answer with radio conventions, consider RadioGroup instead of forcing toggle semantics into that role.",
    checks: [
      "Select and deselect options using only the keyboard, including the final selected option.",
      "Inspect pressed states after parent-controlled updates and after disabling an item.",
      "Verify the group question and all option names remain readable at narrow widths.",
    ],
  },
  "theme-toggle": {
    foundation:
      "ThemeToggle uses a button with decorative sun/moon icons. Without custom children, its accessible label describes the next action: Light mode or Dark mode. Custom visible children change how the name is supplied.",
    naming:
      "Keep the theme action clear without relying on the icon shape. If supplying custom children or an aria-label, make that name agree with what clicking does. When the control changes only a preview, say so rather than implying a site-wide change.",
    interaction:
      "Allow ordinary button activation and retain focus as the theme updates. Theme changes should preserve contrast and focus indicators on the control itself as well as on surrounding content.",
    pitfalls:
      "Do not use theme selection as the sole way to obtain readable text. Check both schemes and any system preference path your application adds. Avoid unnecessary announcements of every color change; the control name and resulting state should be understandable.",
    checks: [
      "Activate with Enter and Space and verify the action label changes appropriately.",
      "Check contrast and focus before and after switching, including any locally themed preview.",
      "Reload and inspect the intended persisted appearance without a confusing mismatch in the control label.",
    ],
  },
  accordion: {
    foundation:
      "AccordionTrigger is a button with `aria-expanded`; disabled items use the button's native disabled state. Accordion defaults to single-item selection. The current trigger does not automatically create a heading or a trigger-to-panel `aria-controls` relationship.",
    naming:
      "Write a useful title for each disclosure and place it at an appropriate heading level when it represents a document section. Add stable trigger/content IDs and a relationship when your composition needs it; do not invent IDs that differ between server and client.",
    interaction:
      "Tab reaches available triggers; Enter and Space toggle through native button behavior. Do not promise Up/Down or Home/End navigation between headers when using this implementation. Confirm collapsed content cannot retain unreachable keyboard focus.",
    pitfalls:
      "Keep links and secondary buttons outside the trigger button. Avoid collapsing the only explanation for an invalid field without providing a way to reveal it, and preserve expanded state when a user is working inside the panel.",
    checks: [
      "Open and close every item with the keyboard, including disabled and initially expanded items.",
      "Inspect expanded state and any explicit IDs after rendering multiple accordions.",
      "Tab through an expanded panel, collapse it and confirm hidden descendants no longer receive focus.",
    ],
  },
  collapsible: {
    foundation:
      "CollapsibleTrigger communicates `aria-expanded`, while closed content uses hidden/inert handling. It is a disclosure pattern, not a dialog: opening content does not imply a modal focus trap or a new window.",
    naming:
      "Give the trigger a persistent subject, such as Advanced filters, so its expanded state can explain visibility. Name icon-only triggers explicitly. If adding `aria-controls`, point it to the actual content ID and keep that ID unique.",
    interaction:
      "A native trigger button supports Enter and Space. After opening, subsequent Tab navigation should reach the revealed controls in document order. If closing while focus is inside, move focus to a useful surviving element rather than hiding it.",
    pitfalls:
      "Do not use CSS opacity alone to hide interactive content. Keep hidden-state behavior intact when customizing animation, and avoid putting the only route to required fields behind an unlabeled chevron.",
    checks: [
      "Toggle from the keyboard and verify the announced expanded state matches visible content.",
      "Check focus during close transitions, including reduced-motion settings.",
      "Render a second disclosure and verify state and any custom content IDs remain independent.",
    ],
  },
  tabs: {
    foundation:
      "TabsList exposes tablist semantics and orientation. TabsTrigger supplies selected state and its panel relationship; TabsContent is a labeled tabpanel. The trigger implements direction-aware arrow movement and Home/End navigation among enabled tabs.",
    naming:
      "Name the tablist by the set of views it switches, and give each tab a concise subject. Keep tab values stable when labels are translated. Panel content still needs normal headings and labels; its tab name is context rather than a replacement for all internal structure.",
    interaction:
      "Test horizontal or vertical arrow movement according to the configured orientation. Selection occurs with the component's focus/navigation behavior, so avoid loading expensive work on every focus move without considering responsiveness. Preserve normal keyboard access inside the active panel.",
    pitfalls:
      "Tabs switch related content in place; ordinary route navigation usually belongs in links. Keep disabled tabs out of the expected selection flow and avoid rendering duplicate panel IDs when multiple tabsets coexist.",
    checks: [
      "Use arrows, Home/End and Tab to enter the selected panel without visiting hidden panels.",
      "Inspect selected state and tab-to-panel relationships after controlled value updates.",
      "Check long tab labels, vertical orientation and a second tabset on the same page.",
    ],
  },
  breadcrumb: {
    foundation:
      'Breadcrumb renders a named navigation landmark. BreadcrumbPage marks the current location with `aria-current="page"`; separators are decorative. Ancestors should remain real links with meaningful destinations.',
    naming:
      "Use human-readable page names rather than raw IDs or filesystem paths. Distinguish this landmark from other navigation if your layout has several. A shortened visible label should still let people understand the destination.",
    interaction:
      "Only navigable ancestors should be keyboard actions. The current page normally remains a non-navigation item. If collapsing intermediate ancestors into a menu, provide a named button and reuse the menu's focus and dismissal behavior.",
    pitfalls:
      "Do not turn a decorative ellipsis into an action through a click handler alone. Breadcrumbs show hierarchy, not necessarily browser history; keep parent links stable even when the user arrived through search.",
    checks: [
      "Read the trail as navigation and identify the current page without the visual separator.",
      "Tab through ancestors and verify each link leads to the intended level.",
      "Test a long trail and any overflow menu at narrow widths with keyboard focus visible.",
    ],
  },
  pagination: {
    foundation:
      'Pagination provides a navigation landmark, named previous/next controls and `aria-current="page"` on the active PaginationLink. Ellipsis is decorative rather than another selectable page.',
    naming:
      "Use page links whose accessible names make their purpose clear in context. Distinguish pagination landmarks when a page contains several independent result lists, and show a useful result range or total near the controls.",
    interaction:
      "Keep page destinations as links when navigation changes the URL. For in-place updates, preserve a sensible focus location and communicate the changed results. The current-page indicator must follow the actual dataset, not a stale local counter.",
    pitfalls:
      "A visually disabled previous/next link may still navigate if it keeps an active href. Handle boundary behavior intentionally. Avoid moving keyboard focus to the document top after every update without a reason.",
    checks: [
      "Visit first, middle and final pages and inspect current and unavailable navigation states.",
      "Use keyboard navigation and browser Back to confirm the selected page and results agree.",
      "Filter to fewer pages and ensure the current page is still valid and the result count is understandable.",
    ],
  },
  "navigation-menu": {
    foundation:
      'NavigationMenu is navigation with button disclosures and links. Triggers expose expanded state; active links can expose `aria-current="page"`. This site-navigation pattern should not be confused with an application menubar merely because it has dropdown panels.',
    naming:
      "Give the navigation landmark a useful name and use descriptive destination text. A trigger should identify the group it reveals. Keep a real overview link separate when the same group also has a landing page.",
    interaction:
      "Verify Tab order through triggers, revealed links and subsequent page content. Escape and outside dismissal should follow the component's behavior. Preserve a sensible trigger destination for focus when a panel closes.",
    pitfalls:
      "Do not make a hover-only panel the sole path to a destination. Avoid nesting anchors inside buttons, and keep expanded panels usable when text grows or the viewport becomes narrower.",
    checks: [
      "Reach all destinations without a pointer, then close the panel and continue through the page.",
      "Check the current link and disclosure state after route changes.",
      "Try touch input, long link names and a keyboard-open panel at small widths.",
    ],
  },
  sidebar: {
    foundation:
      "Sidebar includes a labeled SidebarTrigger and uses Sheet for its mobile overlay. Desktop collapse and mobile open state serve different layouts. Navigation links still require application-supplied destinations, labels and current-page semantics.",
    naming:
      'Name navigation landmarks and groups by their purpose. When desktop collapse hides text, retain accessible names on icon links and controls. Add `aria-current="page"` to the actual current destination rather than assuming an active background announces location.',
    interaction:
      "Check desktop tab order, collapse/expand and the mobile sheet as separate flows. The provider includes a Ctrl/Meta shortcut; verify it does not conflict with your app. Mobile dismissal should return focus to a useful trigger.",
    pitfalls:
      "Do not leave duplicate desktop/mobile navigation trees exposed to keyboard users. Hidden groups must not retain focusable descendants, and a scrollable sidebar must not hide the currently focused link beneath a pinned footer.",
    checks: [
      "Navigate a long sidebar by keyboard, collapse it and verify every surviving icon has a name.",
      "Open and close the mobile sheet with keyboard and touch, checking focus containment and return.",
      "Change routes, resize across the breakpoint and confirm current-page and open-group states remain coherent.",
    ],
  },
  tree: {
    foundation:
      "Tree uses tree/treeitem/group roles, hierarchical levels, expanded state and optional selection state. It requires an accessible name and warns during development when one is missing. Selection mode and expansion are separate concerns.",
    naming:
      "Name the tree's purpose, such as Project files, and give nodes useful labels independent of their folder/file icon. Distinguish duplicate filenames through nearby hierarchy or descriptions. Keep each node's identity stable as data changes.",
    interaction:
      "Use the component's tree keyboard handling for hierarchical movement rather than making every nested node a tab stop. Verify expansion, activation and selection with the exact selection mode you enable, including disabled nodes and filtered results.",
    pitfalls:
      "A tree is appropriate for an interactive hierarchy, not every nested navigation list. If deleting or filtering the focused node, choose a surviving focus target. Do not silently reset selection whenever an unrelated branch loads.",
    checks: [
      "Traverse parent, child and sibling nodes using the documented keyboard controls.",
      "Read level, expanded and selected states and compare them with the visible hierarchy.",
      "Remove or filter the focused node and verify a meaningful node retains focus.",
    ],
  },
  "locale-segment-group": {
    foundation:
      "LocaleSegmentGroup renders a named group, defaulting to Language, and buttons whose `aria-pressed` reflects the selected locale. These are toggle-style buttons, not native radio inputs.",
    naming:
      "Use recognizable language names rather than flags alone. Set the group name for the audience and keep language names understandable in their own language where appropriate. A locale abbreviation should have enough context to disambiguate it.",
    interaction:
      "Keep focus on a useful control while changing translations. Update application language metadata and reading direction where needed; the selection control alone does not translate the document or configure the browser's language interpretation.",
    pitfalls:
      "A language change can alter label lengths and layout direction. Preserve entered form values and the user's location unless the workflow explicitly requires a restart. Keep available languages operable before loading translated content.",
    checks: [
      "Switch languages with the keyboard and inspect pressed state and visible names.",
      "Verify document lang, localized labels and any RTL layout after the update.",
      "Test long translations, failed translation loading and a form with partially entered values.",
    ],
  },
};
