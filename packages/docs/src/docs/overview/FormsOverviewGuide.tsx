import { withBasePath } from "../../base-path";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { LibraryGuideSection } from "../components/LibraryGuideSection";
import { OverviewExamples } from "../components/OverviewExamples";
import { PathDisplay } from "../components/PathDisplay";
import { FormOverviewPreview } from "./OverviewPreviews";
import { formExamples } from "./overview-examples";

const controls = [
  [
    "A short answer",
    "Input",
    "input",
    "Choose the right type and autocomplete hint. Keep the label visible after the person starts typing.",
  ],
  [
    "A longer answer",
    "Textarea",
    "textarea",
    "Explain length requirements before submission and leave enough room to review what was written.",
  ],
  [
    "One choice",
    "Radio Group",
    "radio-group",
    "Show a short set of meaningful options together. For a longer list, consider Select or Native Select.",
  ],
  [
    "Independent choices",
    "Checkbox",
    "checkbox",
    "Use separate values for choices that can be combined. Explain whether at least one selection is required.",
  ],
  [
    "An on/off preference",
    "Switch",
    "switch",
    "Clarify whether the change applies immediately or needs Save. Do not silently mix both models in one form.",
  ],
  [
    "Related fields",
    "Field",
    "field",
    "Keep labels, descriptions and errors with the control. Use a fieldset and legend for a named group.",
  ],
];

/** Form-specific guidance stays separate from the shared reading layout and interactive examples. */
export function FormsOverviewGuide() {
  return (
    <>
      <LibraryGuideSection id="design-forms" title="Design the task before the fields">
        <div class="block-guide-prose">
          <p>
            <strong>Ask for the smallest set of information that completes the task.</strong> Give
            the form a clear purpose and make the primary action describe the result. A short
            profile update and a multi-step application have different needs; neither benefits from
            collecting fields that the application will not use.
          </p>
          <p>
            Order fields the way people think about the information. Group related choices, explain
            unfamiliar requirements before the input, and distinguish optional fields consistently.
            Keep <strong>labels, instructions and errors</strong> close enough to read as one unit.
          </p>
        </div>
        <div
          class="block-guide-table"
          role="region"
          aria-label="Form control selection"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">The input</th>
                <th scope="col">Start with</th>
                <th scope="col">Design detail</th>
              </tr>
            </thead>
            <tbody>
              {controls.map(([task, label, slug, advice]) => (
                <tr key={slug}>
                  <th scope="row">{task}</th>
                  <td>
                    <a href={withBasePath(`/docs/${slug}/installation`)}>{label}</a>
                  </td>
                  <td>{advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="block-guide-prose">
          <h3 id="form-structure">
            <BlockHeadingLink id="form-structure">Keep the structure native</BlockHeadingLink>
          </h3>
          <p>
            Start with <code>form</code>, a visible label, a named input and a submit button. The
            browser already understands keyboard submission, required fields and many common input
            types. Kamod’s <code>Input</code>, <code>Label</code> and <code>Button</code> let you
            retain those semantics while using your app’s theme.
          </p>
          <p>
            Give every submitted control a <code>name</code>. Match <code>htmlFor</code> to a unique{" "}
            <code>id</code>, connect helper text with <code>aria-describedby</code>, and use
            explicit button types. A secondary action inside a form should usually be{" "}
            <code>type="button"</code>; use <code>type="reset"</code> only when clearing the form is
            intentional and understandable.
          </p>
          <p>
            Prefer a single column on small screens. Two fields can share a row when their
            relationship is clear, but the reading and keyboard order should remain predictable.
            Long error messages must wrap without pushing controls beyond the screen edge.
          </p>
        </div>
      </LibraryGuideSection>
      <LibraryGuideSection id="form-examples" title="Build from a small, working example">
        <div class="block-guide-prose">
          <p>
            These examples assume your <code>Preact</code> app already has Kamod UI and its styles
            configured. Start with the native version, introduce a schema when rules need to be
            reused, then use{" "}
            <strong>Formisch for coordinated values, validation and submission</strong>. The schema
            and Formisch examples additionally require <code>valibot</code> and{" "}
            <PathDisplay path={"@formisch/preact"} />; follow the{" "}
            <a href={withBasePath("/docs/formisch/installation")}>Formisch installation guide</a>.
          </p>
          <p>
            The preview is a safe place to try empty input, an invalid email and a successful check.{" "}
            <strong>It does not save data or contact a service.</strong> Copy the source into your
            own project and supply the application callback when you are ready to integrate it.
          </p>
        </div>
        <OverviewExamples
          label="Form examples"
          examples={formExamples}
          preview={(id) => (id === "native" ? <FormOverviewPreview /> : null)}
        />
      </LibraryGuideSection>
      <LibraryGuideSection id="form-validation" title="Make validation understandable">
        <div class="block-guide-prose">
          <h3 id="validation-timing">
            <BlockHeadingLink id="validation-timing">Choose when feedback appears</BlockHeadingLink>
          </h3>
          <p>
            For many forms, validating on submit avoids showing errors before someone has had a
            chance to answer. After an error appears, revalidating while editing helps people see
            when they have fixed it. Validation on blur can suit longer forms, but it should not
            interrupt the flow of entering a value.
          </p>
          <p>
            Formisch exposes <code>validate</code> and <code>revalidate</code> settings. Choose them
            deliberately for the task, and avoid duplicate custom validation paths that disagree
            with the schema. If you turn off browser validation with <code>noValidate</code>, make
            sure the form library provides the complete feedback path instead.
          </p>
          <h3 id="validation-messages">
            <BlockHeadingLink id="validation-messages">
              Explain the fix, not just the failure
            </BlockHeadingLink>
          </h3>
          <p>
            <strong>“Enter a valid email address” is useful; “Invalid input” is not enough.</strong>
            Describe the requirement in plain language, retain what was entered and associate the
            message with its field. Pair an error color with text and <code>aria-invalid</code>;
            color alone does not explain what happened.
          </p>
          <p>
            For several errors, an error summary can point to the affected fields. Decide where
            focus should go after submission and check that the first invalid field is reachable.
            Avoid repeatedly moving focus while someone is typing or announcing every keystroke.
          </p>
          <p>
            Client rules are a convenience, not an authorization boundary. Validate again on the
            server and return errors that the form can map to a field or a general message. Treat a
            conflict, an expired session and a network failure as different situations when their
            recovery steps differ.
          </p>
        </div>
      </LibraryGuideSection>
      <LibraryGuideSection id="form-submission" title="Connect submission and recovery">
        <div class="block-guide-prose">
          <h3 id="submission-lifecycle">
            <BlockHeadingLink id="submission-lifecycle">
              Separate editing, saving and saved state
            </BlockHeadingLink>
          </h3>
          <p>
            Keep the current field values separate from the last confirmed result. When saving
            starts, show a concise pending label and prevent duplicate submissions.{" "}
            <strong>Await the actual operation</strong> before showing success. A resolved client
            handler does not mean the server accepted the change unless your integration checks the
            response.
          </p>
          <p>
            Let the owning page supply the request, authentication and routing. A reusable form
            should accept a callback rather than hard-code an endpoint. Return its promise to the
            form library so pending state follows the work, and translate a rejected request into a
            useful message.
          </p>
          <h3 id="form-recovery">
            <BlockHeadingLink id="form-recovery">Keep a path back to progress</BlockHeadingLink>
          </h3>
          <p>
            On failure, keep useful input and make retry possible. On success, decide whether the
            form stays open, resets or navigates away; show what happened before removing the
            context. An optimistic update needs a defined rollback path if the request fails.
          </p>
          <p>
            For dynamic fields, use stable keys and meaningful labels. A removed row should not make
            keyboard focus disappear. For custom Select, Checkbox or Switch controls, connect the
            documented value/change props to Formisch explicitly. Use the
            <a href={withBasePath("/docs/formisch/usage")}> full integration examples</a> for field
            arrays, reset behavior and supported control adapters.
          </p>
        </div>
      </LibraryGuideSection>
    </>
  );
}

export function FormsOverviewReview() {
  return (
    <LibraryGuideSection id="form-review" title="Review every path through the form">
      <div class="block-guide-prose">
        <p>
          Test the complete task with <strong>realistic input and service responses</strong>. A form
          that looks correct with one valid value may still be difficult to use when data is
          missing, a request is slow or a label is translated.
        </p>
        <ul>
          <li>
            <strong>Keyboard and labels.</strong> Tab through every control, submit with Enter where
            appropriate, and verify focus after errors, reset and dynamic field changes. Check that
            every control has an accessible name.
          </li>
          <li>
            <strong>Boundaries.</strong> Try empty input, surrounding whitespace, long text and
            values at each minimum or maximum. Verify that the server and client rules agree.
          </li>
          <li>
            <strong>Request states.</strong> Simulate pending, success, validation failure, offline
            behavior and retry. Confirm repeated clicks cannot trigger duplicate writes.
          </li>
          <li>
            <strong>Presentation.</strong> Check both color modes, enlarged text and narrow screens.
            Error text should wrap, the primary action should stay reachable and focus should remain
            visible.
          </li>
          <li>
            <strong>Production.</strong> Run the relevant tests and build from{" "}
            <code>package.json</code>. Open the form route directly in the production output and
            verify styles, initial values and any restored draft behavior.
          </li>
        </ul>
        <p>
          Keep a small regression test for the most important success and failure paths. If a
          pattern repeats, extract the field composition or submit adapter after its behavior is
          clear. <strong>Reuse the interaction, not just the appearance.</strong>
        </p>
      </div>
    </LibraryGuideSection>
  );
}
