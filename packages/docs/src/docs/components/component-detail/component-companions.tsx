import type { ComponentChildren } from "preact";

type CompanionProfile = {
  heading: string;
  description: ComponentChildren;
  connection: ComponentChildren;
};

/** Explain composition responsibilities without assuming that neighboring controls share an API. */
export const componentCompanions: Record<string, CompanionProfile> = {
  switch: {
    heading: "Give a Reading Preference One Clear Control",
    description: (
      <>
        Use a named <strong>On/Off Preference</strong> when a setting takes effect immediately. Keep
        its checked state and visible label connected, and leave enough space to operate it with a
        pointer or keyboard.
      </>
    ),
    connection: (
      <>
        Code already includes a <code>Switch</code> for wrapping. Configure it with
        <code> defaultWrapped</code> and <code>showWrapControl</code> instead of adding a second
        control for the same preference.
      </>
    ),
  },
  button: {
    heading: "Make the Next Action Explicit",
    description: (
      <>
        Give the action a <strong>Result-Oriented Label</strong>, such as “Save changes” or “Try
        again”. Inside a form, use <code>type="submit"</code> for submission and{" "}
        <code>type="button"</code> for auxiliary actions so opening a menu does not accidentally
        save the form.
      </>
    ),
    connection: (
      <>
        Derive the label and <code>disabled</code> state from the operation that owns the request.
        Keep the reason for a disabled action visible nearby.
      </>
    ),
  },
  badge: {
    heading: "Make the Current State Easy to Read",
    description: (
      <>
        Use a short <strong>Text Status</strong> such as “Draft”, “Published” or “Needs review” to
        give an item context. Color supports the label; it should not be the only way to distinguish
        states. A badge describes the record rather than acting as its primary control.
      </>
    ),
    connection: (
      <>
        Derive its text from the same <code>status</code> value used by the surrounding content.
        Keep a save failure or recovery instruction in a visible message rather than squeezing it
        into a badge.
      </>
    ),
  },
  card: {
    heading: "Give the Whole Task a Clear Boundary",
    description: (
      <>
        Group a <strong>Heading, Explanation and Next Action</strong> when they belong to one task
        or record. Preserve that reading order when the layout changes. Use a card for a meaningful
        boundary; ordinary subsections can rely on spacing and a subtle separator.
      </>
    ),
    connection: (
      <>
        Pair <code>bg-card</code> with <code>text-card-foreground</code>. If the card contains
        several actions, keep each control separate instead of wrapping the entire card in another
        interactive element.
      </>
    ),
  },
  alert: {
    heading: "Keep the Explanation beside the Recovery",
    description: (
      <>
        Use an in-page message for <strong>Important Context or a Recoverable Failure</strong>. Say
        what happened, what remains available and what the person can do next. Keep the explanation
        visible while the issue still affects the task.
      </>
    ),
    connection: (
      <>
        Connect a retry action to the failed operation. Review the rendered <code>role</code> and
        avoid repeating the same announcement in a toast and an alert.
      </>
    ),
  },
  empty: {
    heading: "Explain a Completed Search with No Results",
    description: (
      <>
        Show an empty state after the operation has <strong>Finished Successfully</strong> but there
        is nothing to display. Distinguish a new collection from a filtered view with no matches;
        they need different explanations and actions.
      </>
    ),
    connection: (
      <>
        Check <code>status</code> before <code>items.length</code>. Offer creation for a new
        collection or a filter reset for an empty search, rather than presenting a request failure
        as “no results”.
      </>
    ),
  },
  progress: {
    heading: "Show How the Operation Is Advancing",
    description: (
      <>
        Use <strong>Measured Completion</strong> when the operation can report it. Give the
        indicator a useful label and an explicit completion or failure message. Avoid presenting an
        estimated percentage as a measurement.
      </>
    ),
    connection: (
      <>
        Feed the documented <code>value</code> from the operation itself. For work without
        measurable progress, use the supported indeterminate treatment or a labeled waiting
        indicator.
      </>
    ),
  },
  field: {
    heading: "Keep the Control and Its Explanation Together",
    description: (
      <>
        Group the <strong>Label, Hint and Validation Message</strong> with the control they
        describe. Explain unfamiliar requirements before entry, and leave an actionable error close
        to the field after validation.
      </>
    ),
    connection: (
      <>
        Preserve the control’s <code>id</code>, label relationship and <code>aria-describedby</code>{" "}
        references when moving it into a larger form.
      </>
    ),
  },
  label: {
    heading: "Name the Control before Interaction",
    description: (
      <>
        Give each input a <strong>Persistent, Visible Name</strong>. A placeholder may show an
        example, but it disappears during entry and cannot carry the label’s whole responsibility.
      </>
    ),
    connection: (
      <>
        Connect <code>htmlFor</code> to the input’s unique <code>id</code>. Generate identities for
        repeated fields instead of copying the same ID into every row.
      </>
    ),
  },
  input: {
    heading: "Collect One Clear Piece of Information",
    description: (
      <>
        Choose an appropriate <strong>Input Type and Hint</strong> for the value. Keep the entered
        text available after a failed save, and explain how to correct validation errors without
        forcing someone to start again.
      </>
    ),
    connection: (
      <>
        Connect <code>value</code> and <code>onInput</code> to the form’s owner. Keep field
        validation distinct from a failure to send an otherwise valid request.
      </>
    ),
  },
  select: {
    heading: "Offer a Stable Set of Choices",
    description: (
      <>
        Use selection when a <strong>Defined Option</strong> is more useful than free text. Keep the
        placeholder distinct from real choices and make the current choice understandable after the
        menu closes.
      </>
    ),
    connection: (
      <>
        Use stable option <code>value</code> identifiers. Decide what happens when a selected option
        disappears after the available data changes.
      </>
    ),
  },
  "button-group": {
    heading: "Keep Related Actions in a Deliberate Order",
    description: (
      <>
        Group actions that share a <strong>Single Context</strong>, such as controls for one
        preview. Preserve a clear primary action rather than giving every item equal visual weight.
      </>
    ),
    connection: (
      <>
        Keep each action’s name and keyboard behavior intact. A grouped surface does not turn
        ordinary buttons into a tab list or a persistent selection control.
      </>
    ),
  },
  spinner: {
    heading: "Acknowledge Work without Losing Context",
    description: (
      <>
        Place a waiting indicator beside the <strong>Action or Region Doing the Work</strong>. Pair
        it with readable text such as “Saving…” and stop it when the request settles.
      </>
    ),
    connection: (
      <>
        Derive visibility from the operation’s pending state. Keep the outcome in a suitable{" "}
        <code>role="status"</code> message when an announcement is useful.
      </>
    ),
  },
  dialog: {
    heading: "Keep a Focused Task in Its Own Space",
    description: (
      <>
        Use an overlay for a <strong>Bounded Task</strong> that should preserve the surrounding
        page. Provide a title, a reachable dismissal action and a predictable place for focus to
        return.
      </>
    ),
    connection: (
      <>
        Keep the documented trigger and content relationship. If you control <code>open</code>,
        update it through the primitive’s documented callback instead of adding a second focus
        manager.
      </>
    ),
  },
  tooltip: {
    heading: "Add Context without Hiding Instructions",
    description: (
      <>
        Use a tooltip for <strong>Brief, Supplementary Help</strong>, especially around familiar
        utility actions. Essential instructions and recovery messages should remain visible without
        hovering.
      </>
    ),
    connection: (
      <>
        Give icon-only controls an <code>aria-label</code> of their own. Check focus and touch use;
        the tooltip is additional context, not the control’s only name.
      </>
    ),
  },
  tabs: {
    heading: "Switch Views without Losing the Task",
    description: (
      <>
        Use tabs for <strong>Related Views in One Context</strong>. Keep panel labels meaningful and
        make the selected view clear after keyboard navigation or a data refresh.
      </>
    ),
    connection: (
      <>
        Use stable <code>value</code> identifiers and preserve the trigger/panel structure. Put
        selection in the URL only when bookmarking or history should restore it.
      </>
    ),
  },
  accordion: {
    heading: "Reveal Supporting Detail at the Right Moment",
    description: (
      <>
        Organize secondary information under <strong>Descriptive Section Headings</strong>. Keep the
        essential task visible so someone does not have to open every panel to discover the next
        action.
      </>
    ),
    connection: (
      <>
        Use stable item <code>value</code> identifiers. Decide whether several sections can remain
        open and verify the documented keyboard behavior after rearranging content.
      </>
    ),
  },
  collapsible: {
    heading: "Let the Summary Stand on Its Own",
    description: (
      <>
        Use a disclosure for <strong>One Optional Layer of Detail</strong>. The trigger should
        explain what will be revealed, while the surrounding summary remains useful with the content
        closed.
      </>
    ),
    connection: (
      <>
        Keep the primitive’s <code>aria-expanded</code> and focus behavior intact. If another link
        reveals the content, connect it to the same open-state owner.
      </>
    ),
  },
  breadcrumb: {
    heading: "Show Where the Task Belongs",
    description: (
      <>
        Use breadcrumbs to explain the <strong>Page Hierarchy</strong>, particularly when people
        enter a deep route directly. Link ancestors to real destinations and clearly identify the
        current page.
      </>
    ),
    connection: (
      <>
        Keep each <code>href</code> aligned with the router. Breadcrumbs explain location; local
        tabs and disclosures still need their own selection state.
      </>
    ),
  },
  table: {
    heading: "Keep Comparisons Legible",
    description: (
      <>
        Give records <strong>Meaningful Column Headings and Units</strong>. Include long values,
        missing data and narrow screens in the design before adding sorting or filtering controls.
      </>
    ),
    connection: (
      <>
        Use stable row <code>key</code> values and preserve header relationships. Keep horizontal
        overflow inside the table region instead of widening the entire page.
      </>
    ),
  },
  skeleton: {
    heading: "Reserve Space while Content Arrives",
    description: (
      <>
        Suggest the <strong>Shape of the Incoming Content</strong> so nearby controls do not jump
        around during loading. Replace placeholders with real content, an empty state or an error
        once the request finishes.
      </>
    ),
    connection: (
      <>
        Drive placeholders from the same pending state as the request. Keep decorative shapes out of
        the accessibility tree with <code>aria-hidden</code> where appropriate and announce loading
        only once.
      </>
    ),
  },
  "aspect-ratio": {
    heading: "Reserve the Media’s Place in the Layout",
    description: (
      <>
        Choose a <strong>Predictable Media Proportion</strong> before the asset loads. Review both
        portrait and landscape content so the chosen frame does not hide the information people
        need.
      </>
    ),
    connection: (
      <>
        Combine the documented <code>ratio</code> with a deliberate <code>object-fit</code> choice
        on the media. The frame sets geometry; the asset still needs its own description and
        fallback.
      </>
    ),
  },
  image: {
    heading: "Make Media Useful When Loading Fails",
    description: (
      <>
        Write <strong>Alternative Text for the Information</strong> the image contributes.
        Decorative media should not repeat nearby labels. Keep a broken asset from removing the only
        explanation of the record.
      </>
    ),
    connection: (
      <>
        Review <code>alt</code>, dimensions and fallback behavior together. Test a missing asset as
        well as a fast cached load.
      </>
    ),
  },
  separator: {
    heading: "Mark a Meaningful Change of Context",
    description: (
      <>
        Use a light rule and spacing to separate <strong>Different Groups of Content</strong>. Avoid
        dividing every line when proximity already explains the relationship.
      </>
    ),
    connection: (
      <>
        Choose the documented decorative or semantic behavior intentionally. A visual separator
        should not create an unnecessary interruption in the reading order.
      </>
    ),
  },
  typography: {
    heading: "Make the Reading Order Visible",
    description: (
      <>
        Give headings, explanations and supporting details a <strong>Consistent Hierarchy</strong>.
        Use emphasis for the decision that matters, then keep the rest of the text comfortably
        readable.
      </>
    ),
    connection: (
      <>
        Preserve the order of <code>h2</code>, <code>h3</code> and subsequent headings. Visual size
        and document structure should support one another.
      </>
    ),
  },
};
