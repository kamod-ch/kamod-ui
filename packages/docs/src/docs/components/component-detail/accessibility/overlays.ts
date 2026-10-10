import type { AccessibilityProfiles } from "./types";

export const overlayAccessibility: AccessibilityProfiles = {
  dialog: {
    example: {
      title: "Use the Built-in Title and Description Relationship",
      note: "The trigger uses a real button and the dialog keeps its default close control. Add the actual task controls inside the content and verify initial focus for that task.",
      code: `import {
  Button, Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from "@kamod-ch/ui";

export function ExportDetails() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button type="button">Export details</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About this export</DialogTitle>
          <DialogDescription>The export includes the currently visible records.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}`,
    },
    foundation:
      "DialogContent supplies a modal dialog surface, focus containment, Escape dismissal and return focus. DialogTitle and DialogDescription connect its accessible name and description. The default modal presentation includes its own overlay and close control.",
    naming:
      "Use a title describing the task, followed by a concise explanation where useful. For long structured content, avoid turning every paragraph into one lengthy accessible description. Keep normal headings, labels and reading order inside the dialog.",
    interaction:
      "Open from a meaningful trigger, verify initial focus, then test forward and reverse Tab navigation and Escape. When the trigger disappears after a successful action, your application must choose a sensible surviving focus destination.",
    pitfalls:
      'Use `presentation="slot"` only when deliberately providing the custom surface the API expects. Avoid nesting a second modal shell around the content. If hiding the default close control, retain another clear, keyboard-operable way to dismiss.',
    checks: [
      "Open, traverse and close without a pointer; confirm focus does not escape into the background.",
      "Inspect the dialog's name and description, including content with long text or validation errors.",
      "Submit, dismiss and remove the opener in separate flows; verify return focus and body scrolling recover.",
    ],
  },
  "alert-dialog": {
    foundation:
      "AlertDialog wraps Kamod Dialog and locks body scrolling. AlertDialogContent uses the slot presentation to supply its own overlay and panel. Its current inherited surface uses dialog semantics; the component name does not automatically change the role to alertdialog.",
    naming:
      "State the specific consequence in the title and explanation: identify what will be deleted or changed. Use explicit action text such as Delete workspace, and provide an equally understandable cancellation action.",
    interaction:
      "Verify initial focus deliberately for consequential actions; do not assume the Cancel button automatically receives it. Test the inherited Escape and outside-interaction behavior against the confirmation flow your application needs.",
    pitfalls:
      "Do not use a destructive color as the only warning, and do not claim that this wrapper prevents every accidental dismissal. Handle pending, failed and completed actions without closing the dialog before an error can be understood.",
    checks: [
      "Open with the keyboard and confirm the initial focus target is appropriate for the consequence.",
      "Read the title, object name and both actions using a screen reader.",
      "Test cancellation, Escape and a rejected request while keeping a safe way to recover.",
    ],
  },
  sheet: {
    foundation:
      "SheetContent renders a modal dialog surface with title/description relationships and a named Close sheet control. Its side placement changes presentation, not the need for a meaningful dialog name and a complete keyboard flow.",
    naming:
      "Use SheetTitle to identify the panel, such as Account settings, and a description when the task needs context. Name close and secondary actions clearly. A mobile navigation sheet still needs its own title even when the links inside are familiar.",
    interaction:
      "Check opening, initial focus, contained Tab order and dismissal in the actual layout. Keep the final action reachable when content is taller than the viewport. After closing, focus should return to a visible trigger or another intentional destination.",
    pitfalls:
      "Avoid rendering a desktop panel and a mobile sheet as two simultaneously focusable copies. Do not cover the close action with a fixed header or footer, and preserve label IDs when responsive composition changes.",
    checks: [
      "Open and dismiss on both wide and narrow screens with focus clearly visible.",
      "Traverse a long sheet at enlarged text size and reach every action without escaping behind it.",
      "Resize while open and check that no duplicate dialog, stale body lock or lost focus remains.",
    ],
  },
  drawer: {
    foundation:
      "Drawer builds on dialog behavior and adds drawer presentation. The drag handle is decorative and hidden from assistive technology. Dragging is not a substitute for a real close or cancel control.",
    naming:
      "Provide DrawerTitle and DrawerDescription for context. Label every field and action inside the panel. If using a responsive Dialog/Drawer composition, keep the task wording and logical order consistent across both versions.",
    interaction:
      "Test keyboard opening, Tab navigation, Escape and explicit dismissal independently of dragging. Keep primary and cancel actions accessible when the onscreen keyboard reduces the available height. A visible handle must not be the only way to close.",
    pitfalls:
      "A drawer's visual motion does not explain its state to a screen reader. Avoid unmounting the focused field during a responsive switch without restoring focus, and do not let a background scroll region interfere with access to the panel.",
    checks: [
      "Complete and cancel the task without ever dragging the drawer.",
      "Open a text field on a phone-sized viewport and confirm the active input and actions stay reachable.",
      "Change viewport size while open and verify one named dialog surface remains active.",
    ],
  },
  popover: {
    foundation:
      'PopoverTrigger exposes a dialog popup relationship, expanded state and the content ID. PopoverContent uses `role="dialog"` and is labeled by the trigger by default. Escape dismissal restores focus through the component\'s behavior.',
    naming:
      "Choose trigger text that also makes sense as the panel's name, or provide a more appropriate explicit naming relationship. Label controls inside the panel individually. A vague trigger such as More may not identify a settings form adequately.",
    interaction:
      "Check the actual focus order after opening rather than assuming all popovers behave like modal dialogs. Keep any close control reachable and return focus to the opener after dismissal. For a blocking task, consider Dialog instead.",
    pitfalls:
      "Do not put essential instructions only in a dismissible popover. Avoid nesting interactive content inside a trigger button, and ensure outside clicks do not silently discard important edits without an understandable recovery path.",
    checks: [
      "Open from the keyboard, reach each control, press Escape and confirm return focus.",
      "Inspect the dialog name and trigger expanded state before and after opening.",
      "Try nested overlays and long content at narrow widths without clipping focus or the close action.",
    ],
  },
  tooltip: {
    foundation:
      "TooltipTrigger connects visible tooltip content through `aria-describedby`. It opens on focus and supports Escape dismissal through Tooltip. The default trigger is a focusable span; `asChild` lets an existing control serve as the trigger instead.",
    naming:
      "Give the underlying control its own accessible name; the tooltip should add a short explanation. Prefer asChild around an existing named button to avoid an unnecessary extra tab stop. Keep essential instructions visible elsewhere.",
    interaction:
      "Test focus, pointer hover, blur and Escape. Do not put buttons, links or required form controls inside tooltip content; interactive information belongs in a popover or another persistent surface.",
    pitfalls:
      "When customizing descriptions, inspect the final `aria-describedby` value: the visible tooltip's ID can replace a supplied description relationship. Do not assume tooltip content is available on touch devices or that it can be the only label for an icon.",
    checks: [
      "Focus the control and confirm both its independent name and optional help are understandable.",
      "Dismiss with Escape and move focus away without leaving an orphaned tooltip.",
      "Use the interface with touch and with tooltips unavailable; essential tasks must remain clear.",
    ],
  },
  "hover-card": {
    foundation:
      "HoverCard opens on pointer hover and trigger focus, and its content uses a non-modal dialog role. Escape dismisses the content. Opening on focus makes it more discoverable than pointer-only content, but it is still supplemental information.",
    naming:
      "Keep the trigger a meaningful destination or subject, such as a person's name. Give the panel an understandable name when its contents form a distinct dialog-like region, and avoid repeating a long profile as the trigger's accessible name.",
    interaction:
      "Test focus moving from the trigger toward any interactive content and then away. Delayed opening and closing must not prevent users from reaching a link. Keep the underlying profile or detail page available through a normal navigation path.",
    pitfalls:
      "Do not require hover-card access to complete an essential action. Small pointer gaps, touch input and screen-reader navigation can change how the surface is encountered. Use a deliberate popover or dialog for a task that must remain open.",
    checks: [
      "Open through focus as well as hover and dismiss using Escape.",
      "Reach any panel links without the card closing prematurely or trapping focus.",
      "Verify the same important information is available through a persistent page or control.",
    ],
  },
  dropdown: {
    foundation:
      'DropdownTrigger exposes `aria-haspopup="menu"`, expanded state and the controlled content ID. Content and items use menu roles, including checked states for checkbox and radio items. Escape closes the menu and returns to its trigger.',
    naming:
      "Name the trigger by its action scope, such as Invoice actions, and use specific item text. Keep shortcuts supplementary: the item name must describe the action even when the keyboard hint is omitted.",
    interaction:
      "Exercise the shipped menu keyboard behavior with enabled, disabled and nested items. Reuse its item components and focus handling rather than installing a second document-level listener. Verify the complete path through a submenu and back to its parent.",
    pitfalls:
      "Menu roles promise more than a visually positioned list. Test arrow-key behavior and screen-reader output in the exact composition rather than assuming parity with another library. For ordinary site destinations, consider navigation links instead of application-menu semantics.",
    checks: [
      "Open, choose an action and dismiss without a pointer; confirm return focus.",
      "Check selected/checked menu items and disabled actions with assistive technology.",
      "Traverse nested menus and long localized labels without losing focus or triggering the wrong action.",
    ],
  },
  "context-menu": {
    foundation:
      "ContextMenu uses menu and menuitem semantics, including checkbox/radio variants and submenus. Escape closes the root menu. A context menu is an additional way to reach actions, not a sufficient primary interface by itself.",
    naming:
      "Name each action by its outcome and make its target clear. If multiple items expose the same menu, ensure the action context identifies the selected file, row or object rather than operating on an unexpected prior selection.",
    interaction:
      "Test the platform keyboard context-menu gesture as well as right-click. Provide a visible Actions button or equivalent path when the trigger composition does not support keyboard invocation. Keep dismissal and return focus predictable.",
    pitfalls:
      "Touch and assistive-technology users may never discover a right-click-only action. Do not suppress the browser context menu broadly across unrelated content, and do not rely on pointer position to identify the action target after focus changes.",
    checks: [
      "Perform every essential action through a visible keyboard-operable alternative.",
      "Open the menu for different objects and verify action targets and checked states.",
      "Dismiss submenus and the root menu and confirm focus remains associated with the intended object.",
    ],
  },
  menubar: {
    foundation:
      'Menubar exposes `role="menubar"`; its triggers report expanded state and its panels/items use menu semantics. This represents application actions, not a general collection of website links.',
    naming:
      "Use familiar action categories and descriptive item names. Keep keyboard hints consistent with shortcuts your application actually implements. Name the menubar where needed to distinguish it from another application control region.",
    interaction:
      "Review movement between top-level triggers, entry into a menu, submenu traversal and Escape as one keyboard system. Verify the shipped behavior in your target browser rather than adding a role and assuming the interaction appears automatically.",
    pitfalls:
      "A menu item's visual selected style is not a substitute for checkbox/radio state. Avoid mixing unrelated form controls into a menu without a suitable interaction model, and leave site navigation in navigation landmarks.",
    checks: [
      "Complete a top-level and a nested action without using the pointer.",
      "Check disabled, checked and radio menu items with a screen reader.",
      "Verify advertised shortcuts, Escape dismissal and focus continuity when menu content changes.",
    ],
  },
  command: {
    foundation:
      "Command filters button items through a native input. `autoHighlight` defaults to false; when enabled, CommandInput handles Up/Down and Enter for highlighted-item activation. The implementation should not be described as a complete combobox/listbox pattern by default.",
    naming:
      "Label the search input independently of its placeholder, and write action names that stand on their own. Shortcuts are supplementary hints. Group headings help sighted scanning, but verify their relationships in the rendered accessibility tree.",
    interaction:
      "With autoHighlight off, keep matching item buttons reachable through ordinary focus. With it on, verify that highlight movement and activation remain understandable to screen-reader users as well as visually. Test an empty query, no results and disabled matches.",
    pitfalls:
      "A highlighted background is not automatically an announced active descendant. If embedding Command in a dialog, the outer dialog still needs a name, dismissal and focus return. Do not imply unavailable shortcuts or selection semantics through decorative text.",
    checks: [
      "Search and activate an enabled result using each configured keyboard path.",
      "Read result changes with a screen reader and inspect whether the highlighted result is conveyed.",
      "Clear the query, disable a matching action and close any enclosing dialog without losing focus.",
    ],
  },
};
