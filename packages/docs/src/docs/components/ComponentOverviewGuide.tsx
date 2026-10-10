import { withBasePath } from "../../base-path";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { BrandText } from "./brand/BrandText";
import { ComponentOverviewExamples } from "./ComponentOverviewExamples";
import { LibraryGuideSection } from "./LibraryGuideSection";
import { PathDisplay } from "./PathDisplay";

const choices = [
  {
    task: "Trigger an action",
    links: [
      ["Button", "button"],
      ["Button Group", "button-group"],
    ],
    advice:
      "Use a button for an action and a link for navigation. Name the result: Save changes is clearer than Submit outside a form.",
  },
  {
    task: "Collect a value",
    links: [
      ["Input", "input"],
      ["Field", "field"],
      ["Select", "select"],
    ],
    advice:
      "Start with a visible label and helpful instructions. Keep validation next to the field and explain how to fix an invalid value.",
  },
  {
    task: "Choose or toggle",
    links: [
      ["Checkbox", "checkbox"],
      ["Switch", "switch"],
      ["Radio Group", "radio-group"],
    ],
    advice:
      "Use a switch for an on/off setting, checkboxes for independent choices, and a radio group for one choice from a visible set.",
  },
  {
    task: "Reveal related content",
    links: [
      ["Tabs", "tabs"],
      ["Accordion", "accordion"],
      ["Dialog", "dialog"],
    ],
    advice:
      "Tabs switch between related views; accordions disclose sections. Use a dialog when the task needs focused interaction, with a clear way to close it.",
  },
  {
    task: "Explain a state",
    links: [
      ["Alert", "alert"],
      ["Skeleton", "skeleton"],
      ["Progress", "progress"],
    ],
    advice:
      "Show what is loading, what changed and what the user can do next. A skeleton is temporary structure, not an error or empty state.",
  },
  {
    task: "Organize information",
    links: [
      ["Card", "card"],
      ["Table", "table"],
      ["Badge", "badge"],
    ],
    advice:
      "Group related content, retain meaningful table headers, and pair status colors with labels. Avoid making every piece of information its own card.",
  },
];

/** Task-oriented reading sections complement the complete component index. */
export function ComponentOverviewGuide() {
  return (
    <>
      <LibraryGuideSection id="choose-components" title="Choose the Right Building Blocks">
        <div class="block-guide-prose">
          <p>
            <strong>Start with the User’s Task, Then Choose the Control.</strong> A familiar visual
            treatment is useful only when the interaction underneath matches what people expect.
            Pick the smallest component that handles the job, open its examples, and read its API
            before adding a custom abstraction. The links below are starting points, not a required
            list of dependencies.
          </p>
          <p>
            Prefer existing keyboard, focus and overlay behavior over rebuilding it with generic
            elements. Your application still supplies the data, routing, validation rules and
            service callbacks. Kamod components give those decisions a consistent interface.
          </p>
        </div>
        <div
          class="block-guide-table"
          tabIndex={0}
          role="region"
          aria-label="Component selection reference"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">What you need</th>
                <th scope="col">Start here</th>
                <th scope="col">Make the choice deliberate</th>
              </tr>
            </thead>
            <tbody>
              {choices.map(({ task, links, advice }) => (
                <tr key={task}>
                  <th scope="row">{task}</th>
                  <td>
                    {links.map(([name, slug], index) => (
                      <span key={slug}>
                        {index > 0 && " · "}
                        <a href={withBasePath(`/docs/${slug}/installation`)}>
                          <code>{name}</code>
                        </a>
                      </span>
                    ))}
                  </td>
                  <td>{advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="block-guide-prose">
          <h3 id="components-or-blocks">
            <BlockHeadingLink id="components-or-blocks">
              A Component or a Complete Block?
            </BlockHeadingLink>
          </h3>
          <p>
            Choose a component when you are building one interaction or refining an existing screen.
            Choose a <a href={withBasePath("/blocks")}>Block</a> when you need a complete starting
            composition such as a sidebar, login page or application shell. Blocks reuse the same
            primitives, so the styling and accessibility work you learn here carries over.
          </p>
          <p>
            <strong>Keep the Boundary Small.</strong> Wrap a repeated arrangement when it solves a
            real problem in your project. Avoid hiding every prop behind a second API before you
            know which differences your screens need. Start with explicit props and ordinary{" "}
            <code>children</code>; extract a shared wrapper after the pattern becomes clear.
          </p>
        </div>
      </LibraryGuideSection>

      <LibraryGuideSection id="compose-components" title="Compose a Small, Working Interface">
        <div class="block-guide-prose">
          <p>
            <BrandText>
              Work in an <strong>Already Configured Preact Project</strong>. Follow the{" "}
              <a href={withBasePath("/docs/theming/installation")}>Installation Guide</a> and{" "}
              <a href={withBasePath("/docs/theming/css-setup")}>CSS Setup</a> before trying these
              examples. Import public components from <PathDisplay path={"@kamod-ch/ui"} />, use
              Preact’s <code>useState</code> for local state, and keep the paths below aligned with
              your own folder structure.
            </BrandText>
          </p>
          <p>
            Each example isolates a different responsibility:{" "}
            <strong>Action Hierarchy, a Controlled Value, or Layout</strong>. Copy the source into
            your app and connect real behavior there. The examples do not introduce a router,
            backend or additional state library.
          </p>
        </div>
        <ComponentOverviewExamples />
      </LibraryGuideSection>

      <LibraryGuideSection id="component-behavior" title="Connect State without Losing Behavior">
        <div class="block-guide-prose">
          <h3 id="component-state">
            <BlockHeadingLink id="component-state">Give Each Value One Owner</BlockHeadingLink>
          </h3>
          <p>
            Read the component’s API to choose controlled or uncontrolled usage. A controlled
            component receives its current value and reports changes to its parent; an uncontrolled
            component owns its local value after initialization. A <code>defaultValue</code> or{" "}
            <code>defaultChecked</code> is an initial value, not a way to update state later. Prop
            names vary by component: verify them rather than assuming every control uses{" "}
            <code>onChange</code>.
          </p>
          <p>
            Share state only as widely as the interaction requires. Keep an open menu local unless
            another part of the screen needs to control it. Put a saved preference in the app’s
            state or service layer, and distinguish{" "}
            <strong>The Current Input, the Pending Request, and the Last Saved Value</strong>. This
            makes cancellation and recovery easier to explain.
          </p>
          <h3 id="component-accessibility">
            <BlockHeadingLink id="component-accessibility">
              Preserve Labels, Focus and Semantics
            </BlockHeadingLink>
          </h3>
          <p>
            A placeholder is not a label. Connect a visible <code>Label</code> to its control using
            matching <code>htmlFor</code> and <code>id</code> values. Use unique IDs for repeated
            instances, link supporting text with <code>aria-describedby</code>, and give icon-only
            actions a meaningful <code>aria-label</code>. Keep decorative icons out of the
            accessible name with <code>aria-hidden</code>.
          </p>
          <p>
            Preserve the documented trigger/content composition for menus and dialogs. Avoid nesting
            buttons inside links or adding click handlers to non-interactive text. Check{" "}
            <strong>Tab, Shift+Tab, Arrow Keys and Escape</strong> wherever the component supports
            them, then confirm focus returns to a useful place after closing an overlay.
          </p>
          <h3 id="component-feedback">
            <BlockHeadingLink id="component-feedback">
              Design the States Around the Happy Path
            </BlockHeadingLink>
          </h3>
          <p>
            A successful preview is one state. Add explicit loading, empty and failure states for
            real requests. Disable repeat submissions while an operation is pending and describe the
            next step when it fails. Keep useful input intact so a person can retry without starting
            over. Use an <a href={withBasePath("/docs/alert/installation")}>Alert</a> for persistent
            feedback and reserve announcements for changes that need attention.
          </p>
        </div>
      </LibraryGuideSection>
    </>
  );
}

export function ComponentOverviewReview() {
  return (
    <LibraryGuideSection id="component-review" title="Review the Screen You Will Ship">
      <div class="block-guide-prose">
        <p>
          Review the <strong>Assembled Interface</strong> with real content, not just each component
          in isolation. Layout, routes and service responses introduce conditions that a standalone
          example cannot cover. Use these checks after your first integration and after substantial
          styling changes.
        </p>
        <ul>
          <li>
            <strong>Content and Layout.</strong> Try empty values, long names, translated labels and
            enlarged text. Test a narrow phone and a wide desktop. Confine horizontal scrolling to
            tables or code; keep primary actions reachable.
          </li>
          <li>
            <strong>Theme and Focus.</strong> Check the actual theme preset in both{" "}
            <code>light</code> and <code>dark</code> modes. Review foreground/background pairs,
            disabled controls, validation messages and visible keyboard focus.
          </li>
          <li>
            <strong>State and Recovery.</strong> Simulate slow and failed requests. Check repeat
            submissions, cancellation and retry. Decide which state should survive navigation or a
            reload, and make persistence an explicit application concern.
          </li>
          <li>
            <strong>Production Output.</strong> Run the scripts your project defines in{" "}
            <code>package.json</code>, including its typecheck, tests and production build. Serve
            that output and visit a nested route directly to verify assets, styles and
            initialization.
          </li>
        </ul>
        <p>
          If a component looks unstyled, revisit{" "}
          <a href={withBasePath("/docs/theming/css-setup")}>Global CSS and Source Detection</a>{" "}
          before adding local overrides. If behavior differs from the docs, compare your installed
          package version with the relevant API and reduce the issue to a small reproduction.
          Include that example and the affected browser when reporting it.
        </p>
      </div>
    </LibraryGuideSection>
  );
}
