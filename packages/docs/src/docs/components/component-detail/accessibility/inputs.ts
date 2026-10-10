import type { AccessibilityProfiles } from "./types";

export const inputAccessibility: AccessibilityProfiles = {
  input: {
    example: {
      title: "Keep the Name, Help and Error Connected",
      note: "The caller supplies the validation message. useId keeps label relationships unique when this field appears more than once; the error is referenced only while it is rendered.",
      code: `import { Input, Label } from "@kamod-ch/ui";
import { useId } from "preact/hooks";

export function EmailField({ error }: { error?: string }) {
  const id = useId();
  const helpId = \`\${id}-help\`;
  const errorId = \`\${id}-error\`;
  return (
    <div>
      <Label htmlFor={id}>Email address</Label>
      <Input id={id} name="email" type="email" autoComplete="email"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={[helpId, error ? errorId : undefined].filter(Boolean).join(" ")} />
      <p id={helpId}>We send account updates to this address.</p>
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}`,
    },
    foundation:
      "Input renders a native `input` and forwards its HTML attributes. The native element owns editing, focus and form participation; Kamod adds focus, disabled and invalid styles. A styled wrapper does not provide a label or validation message.",
    naming:
      "Connect a visible `Label` or `FieldLabel` through matching `htmlFor` and `id`. Choose `type`, `autoComplete` and `inputMode` for the value being requested. Put format instructions in persistent text referenced by `aria-describedby`, rather than relying on a disappearing placeholder.",
    interaction:
      "Keep native text selection, paste, undo and keyboard editing available. Use `readOnly` when a value should remain readable and selectable without editing; use `disabled` only when the control is unavailable. Explain why an action is unavailable nearby.",
    pitfalls:
      "Set `aria-invalid` when an actual error is present, and link the correction to the input. The invalid border does not announce an error. Keep `required` on the control when using native validation; a required asterisk on a Field wrapper does not set it.",
    checks: [
      "Click the visible label and confirm focus enters the input, including when two copies of the form are mounted.",
      "Enter an invalid value, leave the field, submit and correct it; check that the description and error remain associated.",
      "Try paste, browser autofill and a narrow mobile keyboard layout without hiding the focused field.",
    ],
  },
  textarea: {
    foundation:
      "Textarea keeps native multiline editing and forwards textarea attributes. Styling for `aria-invalid` communicates the visual error state; it does not create an error description or a character-limit announcement.",
    naming:
      "Use a visible label and describe the expected content, length and privacy boundaries before entry. Give help and error text stable IDs. If showing a remaining-character count, connect it as a description and avoid announcing every keystroke through an assertive live region.",
    interaction:
      "Allow Enter to create a new line unless a clearly explained application interaction requires otherwise. Preserve selection, paste and undo. If a chat composer uses a submission shortcut, describe the shortcut and retain a normal Send button.",
    pitfalls:
      "Do not fix the height so tightly that long text or enlarged fonts become unreadable. Distinguish a maximum enforced by `maxLength` from a recommended length, and preserve the entered draft when a request fails.",
    checks: [
      "Read the label, instructions and error with the field focused; a placeholder alone must not carry the task.",
      "Paste several paragraphs and use the keyboard to reach both the start and end of the text.",
      "Increase text size and resize the viewport; keep the caret, validation and submission action reachable.",
    ],
  },
  field: {
    foundation:
      'Field provides layout and visual states. `invalid`, `disabled` and `required` on the wrapper do not automatically configure the nested control. FieldError uses `role="alert"`; FieldSet and FieldLegend provide native grouping when composed around related inputs.',
    naming:
      "Prefer explicit composition with `FieldLabel htmlFor`, a control `id`, and IDs on FieldDescription and FieldError. Reference those IDs from the control using `aria-describedby`. The legacy `label` prop renders a separate label without automatically associating it with a child input.",
    interaction:
      "Keep a group question in FieldLegend and give each individual option its own label. Put `disabled` or `required` on the actual input where appropriate. Changing a wrapper's appearance must not leave the contained input behaving differently from what the user sees.",
    pitfalls:
      "Mount error feedback when it becomes relevant, and avoid multiple nested alert regions for the same message. A visible error and an accessible description solve different problems: one must not be substituted for the other.",
    checks: [
      "Activate every visible field label and confirm it targets the intended control rather than another form instance.",
      "Inspect the actual input for required, disabled and invalid states; do not stop at wrapper data attributes.",
      "Submit, correct and resubmit while checking error announcements for missing or duplicate messages.",
    ],
  },
  label: {
    foundation:
      "Label renders the native label element. Association comes from `htmlFor` matching a labelable control's `id`, or from correctly nesting a control inside it. Color, proximity and peer-disabled styling alone do not create that relationship.",
    naming:
      "Use a short visible name that describes the requested information. Keep instructions separate and connect them with `aria-describedby`. Ensure an explicit `aria-label` on the control does not replace the visible label with unrelated wording.",
    interaction:
      "Clicking the label should focus or activate its control. Provide one coherent label per input and keep links or secondary buttons outside the label when they perform a separate action. A label cannot associate with an arbitrary non-labelable wrapper by ID alone.",
    pitfalls:
      "Avoid duplicated IDs in repeated rows and dialogs. A required marker should have a visible explanation; disabled label styling should reflect the actual control state rather than merely making text look inactive.",
    checks: [
      "Click and tap the label, including around its text edges, and confirm the expected control responds.",
      "Compare the visible name with the accessibility tree's computed name.",
      "Mount repeated instances and verify every htmlFor points to exactly one intended element.",
    ],
  },
  "input-group": {
    foundation:
      'InputGroup provides a `group` wrapper for a control and its add-ons. InputGroupInput and InputGroupTextarea retain the underlying native editing behavior. InputGroupButton defaults to `type="button"`, so supporting actions do not submit a form accidentally.',
    naming:
      "Label the editable control itself, not just the surrounding group. Describe units or prefixes when they change the meaning of the value. Give icon-only actions names such as Show password or Clear search, and hide purely decorative icons from assistive technology.",
    interaction:
      "Keep the input and its buttons in a predictable reading and tab order. Password visibility changes should preserve focus and the entered value. If an add-on opens a menu, use the appropriate trigger component to manage its expanded state.",
    pitfalls:
      "An add-on is not automatically an input label. Do not use a clickable decorative span as the only way to perform an action, and avoid duplicating the same currency or unit in both the accessible name and description unnecessarily.",
    checks: [
      "Tab through the input and each supporting action; identify every icon without seeing the surrounding graphics.",
      "Activate add-ons with Enter or Space and confirm unrelated form submission does not occur.",
      "Test long prefixes, error messages and enlarged text without clipping the input's focus indicator.",
    ],
  },
  checkbox: {
    foundation:
      'Checkbox uses a native checkbox input with a visual indicator. Its mixed state is exposed as `aria-checked="mixed"`. The indicator is decorative; the underlying input remains the focusable, labelable control.',
    naming:
      "Associate the option text through an ID and visible label, or provide an accessible name for a compact table-selection control. Name a select-all checkbox by its scope, such as Select all visible invoices, rather than simply Select all.",
    interaction:
      "Use Space to toggle after keyboard focus reaches the input. For a parent checkbox, calculate checked, unchecked and indeterminate from the actual child selections. The application decides what activating a mixed parent does; keep that decision consistent.",
    pitfalls:
      "Do not use mixed state merely to mean unavailable. Disabled and indeterminate describe different things. If the checkbox governs dependent fields, explain that relationship and avoid unexpectedly moving focus when the options appear.",
    checks: [
      "Test unchecked, checked, mixed and disabled states using the keyboard and a screen reader.",
      "Select some child rows, activate the parent, then filter the list and recheck its selection scope.",
      "Click the text label and confirm it toggles exactly once without a duplicate wrapper handler.",
    ],
  },
  switch: {
    foundation:
      'Switch is a `button` with `role="switch"` and `aria-checked`; its uncontrolled default is off. It is not a native checkbox input. Text passed as children is displayed beside the button and does not automatically label that button.',
    naming:
      "Name the setting consistently, for example Email notifications, while the checked state conveys on or off. Connect a visible label using the button's ID or `aria-labelledby`. Do not rename the setting every time its state changes.",
    interaction:
      "The button supports native Enter and Space activation. When changing a saved preference, communicate pending and failed requests and restore the previous value when appropriate. Decide whether the setting applies immediately or is saved with a larger form.",
    pitfalls:
      "A switch does not add a checkbox value to native FormData. Integrate the documented `onCheckedChange` callback with your state or form adapter. An adjacent sentence or an on/off color alone is not a reliable accessible name.",
    checks: [
      "Verify the control is announced as a named switch with the current checked state.",
      "Toggle through pointer and keyboard, including a simulated failed save and retry.",
      "Confirm form submission uses the actual state and that disabled settings include a readable explanation.",
    ],
  },
  "radio-group": {
    foundation:
      "RadioGroup exposes `role=\"radiogroup\"`; its items contain native radio inputs sharing the group's name. RadioGroupItem wraps its input and children in a label, so meaningful option text participates in the input's name.",
    naming:
      "Give the group an overall question using `aria-labelledby` or `aria-label`, then name each option distinctly. Keep descriptions of trade-offs visible. Use unique group names for unrelated questions so browser-native radio navigation does not join them accidentally.",
    interaction:
      "Native radio behavior handles selection within the same named set. Test Tab entry and arrow-key movement in supported browsers. Use the group's value callback for controlled state so the visible selection and the checked input agree.",
    pitfalls:
      "Avoid nesting additional buttons or links inside an option's label. Explain unavailable options outside the disabled control, and distinguish no selection from a valid option whose value happens to be an empty string.",
    checks: [
      "Read the group question and each option name using assistive technology.",
      "Move through options with the keyboard, skip disabled choices and verify a single selected value.",
      "Render two unrelated groups and ensure their selection and keyboard behavior remain independent.",
    ],
  },
  "selectable-card": {
    foundation:
      "SelectableCard is a card-shaped native radio option for RadioGroup. The hidden input carries checked state and the surrounding label contains the visible card content. Selection styling is distinct from keyboard focus and must be checked separately.",
    naming:
      "Keep a short option title at the start, followed by the details needed to compare choices. Name the parent RadioGroup's question. Avoid putting independent links or buttons inside the card label; place detail actions outside the selectable surface.",
    interaction:
      "Use the native radio group interaction rather than adding click-only card selection. The current card styling suppresses default input outlines, so provide and verify a visible `focus-within` treatment on the card when integrating it.",
    pitfalls:
      "A selected border is not sufficient feedback for an unselected card that has keyboard focus. Long card descriptions can also make names verbose; use an explicit title association on the input where needed and keep supporting information discoverable.",
    checks: [
      "Tab into the group and move selection with arrow keys while watching the focused card.",
      "Confirm the chosen card is announced as a checked radio, not as a generic clickable container.",
      "Compare cards at narrow widths and enlarged text without truncating prices, restrictions or focus feedback.",
    ],
  },
  "native-select": {
    foundation:
      "NativeSelect keeps the browser's native select interaction, platform picker and form behavior. Its chevron is decorative. The wrapper styles do not change how labels, required values or disabled options are interpreted by the browser.",
    naming:
      "Connect a visible label to the select's ID and write understandable option text. If selection is required, use `required` and an empty-value prompt option. Describe the expected choice and any unavailable options before the user opens the picker.",
    interaction:
      "Keep the native keyboard and touch picker available. Group related options with native optgroup where useful. Selection should update the intended field rather than unexpectedly submitting the whole form or navigating away.",
    pitfalls:
      "A disabled prompt option prevents returning to the empty state; use that only when intentional. An empty-value option is not automatically an error until your validation rules require a selection. Pair invalid styling with a linked explanation.",
    checks: [
      "Open with the keyboard and with a mobile picker; confirm labels and selected text remain clear.",
      "Submit the initial empty choice, choose a valid value and then reset the form.",
      "Check long options and localized labels without relying on the collapsed control's width alone.",
    ],
  },
  select: {
    foundation:
      "Select uses a button trigger and a listbox of options. The trigger exposes expanded state and the content ID; the listbox tracks its active option. Each SelectItem communicates selection and any disabled state.",
    naming:
      "Give SelectTrigger a visible label through its ID or `aria-labelledby`. A placeholder communicates the absence of a value, but does not replace the field name. Keep option text self-contained so it makes sense while navigating the listbox.",
    interaction:
      "The trigger opens with Arrow Up, Arrow Down, Enter or Space. In the list, arrows and Home/End move the active option; Enter or Space selects. Escape closes, and Tab exits according to the control's handler. Retain these behaviors when customizing content.",
    pitfalls:
      "Do not add interactive buttons inside an option. Put `aria-invalid` and associated error text on the trigger when validating. Do not assume a custom select participates in native form submission exactly like NativeSelect; inspect the documented value integration.",
    checks: [
      "Open, navigate past disabled options, select and reopen using only the keyboard.",
      "Confirm selected and highlighted options remain distinguishable in light, dark and high-contrast appearances.",
      "Read the field name, current choice and validation error without depending on a placeholder.",
    ],
  },
  combobox: {
    foundation:
      "Combobox composes selection, search and popover/command pieces. Arrow highlighting is controlled by `autoHighlight`, which defaults to false in the convenience composition. Do not infer a complete ARIA combobox contract solely from the component name.",
    naming:
      "Label the trigger and any separate search input according to their jobs. A filter placeholder is a hint, not a persistent label. Selected chips need identifiable removal actions; the default short Remove name may need extra context in a multi-selection interface.",
    interaction:
      "With autoHighlight enabled, supported input handlers use Up/Down to move the highlight and Enter to activate it. Check the exact composition you use, including empty results, clearing, closing and focus return; visual highlighting alone does not guarantee that active results are announced.",
    pitfalls:
      "Keep loading, no matches and no selection as separate states. Verify the rendered input/list relationship and screen-reader output before adopting the control for a critical workflow. Do not add combobox roles without the associated focus and state behavior.",
    checks: [
      "Search with the keyboard, select a result, reopen and clear the selection without losing the field label.",
      "Remove a chip and verify focus goes to a surviving control with a meaningful name.",
      "Test no matches, asynchronous results and disabled choices with your target screen reader.",
    ],
  },
  "input-otp": {
    foundation:
      "InputOTP renders one real text input over visual slots. The input defaults to the accessible name One-time password and uses one-time-code autofill. Slot count is visual presentation, not a set of separately focusable fields.",
    naming:
      "Provide a context-specific `aria-label` and matching visible instruction, such as the code's expected length and delivery channel. The component explicitly forwards `id`, `name` and its label to the input; other root attributes are not necessarily forwarded to that input.",
    interaction:
      "Preserve full-code paste, selection and normal text editing. Numeric filtering can request a numeric keyboard, but do not block paste from password managers or messages. Use a separate confirmation action when verifying a code has a consequential outcome.",
    pitfalls:
      "Do not put a tab stop on each visual slot or assume an error description attached to the wrapper is attached to the real input. Explain expired codes and resend timing in text, and avoid clearing a nearly completed code on an unrelated rerender.",
    checks: [
      "Tab once into the code input, paste a complete code, then edit a character in the middle.",
      "Inspect the actual input's accessible name and any validation relationship after customization.",
      "Try autofill, an expired code, resend and a narrow viewport while keeping instructions available.",
    ],
  },
  slider: {
    foundation:
      "Slider uses native range inputs. A range configuration renders multiple inputs with generated names such as Value 1 of 2. In the multi-thumb path, extra input attributes are spread only onto the first thumb; generic defaults are not meaningful minimum/maximum labels.",
    naming:
      "For a single slider, prefer a visible label referenced with `aria-labelledby`. Explain units and the permitted range beside it. Inspect the generated inputs when using multiple thumbs: a label on the root group does not individually name the lower and upper bounds.",
    interaction:
      "Retain native range keyboard operation and test step, bounds and orientation in supported browsers. Offer a numeric input alternative when precise values matter. Do not make dragging the only practical way to reach a permitted value.",
    pitfalls:
      "The current multi-thumb implementation has limited per-thumb attribute customization, and its generated `aria-label` follows the spread attributes. Do not assume an aria-label prop renames every thumb. Verify or extend the implementation before using ambiguous bounds in production.",
    checks: [
      "Adjust each thumb without a pointer and confirm its value and units are understandable.",
      "Try minimum, maximum and adjacent values; verify that constraints are explained rather than silently surprising.",
      "Inspect focus visibility and each thumb's computed name after applying custom classes or orientation.",
    ],
  },
  calendar: {
    foundation:
      "Calendar provides day buttons and named previous/next-month controls; dropdown captions label month and year selectors. Those visible controls are useful building blocks, but a button calendar should not be assumed to implement every ARIA date-grid keyboard convention.",
    naming:
      "Explain what date is being selected and the allowed date range. Make the displayed month, selected day and unavailable dates understandable beyond their color. When a day number is ambiguous, verify the rendered button name supplies enough date context.",
    interaction:
      "Check how Tab reaches days and month controls in the current variant before documenting shortcuts. Keep month changes and selection predictable. A disabled day needs an explanation when the reason cannot be understood from the surrounding booking or scheduling instructions.",
    pitfalls:
      "Do not assume locale formatting also changes every accessible label. Review weekday names, date order and navigation labels after localization. Keep a text-entry alternative for workflows where traversing a large date range is burdensome.",
    checks: [
      "Choose a date using only the keyboard, including crossing month and year boundaries.",
      "Read selected, today and unavailable states with assistive technology rather than relying on visual styling.",
      "Test localized labels, long month names, text zoom and touch use with the exact calendar variant.",
    ],
  },
  "date-picker": {
    foundation:
      "DatePicker combines a trigger, popover and calendar, so its accessibility depends on all three. The calendar supplies day buttons; the overlay provides its dismissal behavior. Date formatting alone does not give the field a persistent accessible name.",
    naming:
      "Associate the trigger with a visible date label and explain the accepted format or range. Keep the selected date in the trigger readable. If the variant includes text input, label that input and the calendar-opening action separately.",
    interaction:
      "Check opening, date selection, dismissal and return focus as one flow. Escape should follow the underlying popover behavior. Do not promise Arrow Down opening for an input variant unless its actual handler implements it.",
    pitfalls:
      "Avoid immediately submitting or navigating when a date is selected. Distinguish a malformed typed date from an unavailable date. Preserve an entered value after server rejection and state the timezone when it affects the meaning of a selected date/time.",
    checks: [
      "Select, clear and replace a date using the keyboard, then close and reopen the picker.",
      "Test invalid input, disabled dates and a server-rejected date with an associated correction message.",
      "Verify focus return and usable calendar dimensions on a narrow screen with enlarged text.",
    ],
  },
  dropzone: {
    foundation:
      "Dropzone overlays a native file input on the drop area, so file selection can use the browser picker as well as drag and drop. The current API forwards `accept` and `multiple` to that input; general root attributes stay on the outer div.",
    naming:
      "State file types, size limits and the intended upload destination visibly. Verify that the actual file input has an accessible name: setting `aria-label` on Dropzone's outer div does not label its nested input. Use an explicitly labeled native file input or extend the component where necessary.",
    interaction:
      "Provide a keyboard-visible focus treatment for the real picker control and confirm Enter/Space opens the file dialog. Dragging is an optional path. Give uploaded files identifiable remove/retry controls and keep successful, pending and rejected files distinguishable.",
    pitfalls:
      "The `accept` hint is not validation of dropped files, and the dropzone does not upload or announce results itself. Validate files in your application, explain rejection in text and keep upload status available outside the transparent input overlay.",
    checks: [
      "Reach and open the native picker without a pointer; inspect its name and visible focus.",
      "Select and drop disallowed, oversized and duplicate files and compare the resulting messages.",
      "Retry a failed upload and remove a queued file without losing the user's location in the file list.",
    ],
  },
};
