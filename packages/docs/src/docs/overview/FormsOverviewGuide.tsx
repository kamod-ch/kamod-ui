import { withBasePath } from "../../base-path";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { BrandText } from "../components/brand/BrandText";
import { InlineCodeLink } from "../components/InlineCodeLink";
import { LibraryGuideSection } from "../components/LibraryGuideSection";
import { OverviewExamples } from "../components/OverviewExamples";
import { PathDisplay } from "../components/PathDisplay";
import { FormExampleReview } from "./FormExampleReview";
import { FormOverviewPreview } from "./OverviewPreviews";
import { formExamples } from "./overview-examples";

const controls = [
  {
    task: "A short answer",
    name: "Input",
    slug: "input",
    hint: "Single-line value",
    advice: (
      <>
        Choose the right <code>type</code> and <code>autoComplete</code> hint. Keep a{" "}
        <strong>Visible Label</strong> after the person starts typing.
      </>
    ),
  },
  {
    task: "A longer answer",
    name: "Textarea",
    slug: "textarea",
    hint: "Multi-line text",
    advice: (
      <>
        Explain <a href="#validation-messages">Length Requirements</a> before submission. Set
        appropriate <code>rows</code> and leave room to review what was written.
      </>
    ),
  },
  {
    task: "One choice",
    name: "RadioGroup",
    slug: "radio-group",
    hint: "One value from a set",
    advice: (
      <>
        Show a short set of meaningful options together. For a longer list, consider{" "}
        <InlineCodeLink href="/docs/select/installation">Select</InlineCodeLink> or{" "}
        <InlineCodeLink href="/docs/native-select/installation">NativeSelect</InlineCodeLink>.
      </>
    ),
  },
  {
    task: "Independent choices",
    name: "Checkbox",
    slug: "checkbox",
    hint: "Separate selections",
    advice: (
      <>
        Use <strong>Separate Values</strong> for choices that can be combined. Explain whether at
        least one selection is required and when <a href="#validation-timing">Validation Runs</a>.
      </>
    ),
  },
  {
    task: "An on/off preference",
    name: "Switch",
    slug: "switch",
    hint: "Boolean setting",
    advice: (
      <>
        Clarify whether the change applies <strong>Immediately</strong> or needs Save. Keep the{" "}
        <a href="#submission-lifecycle">Saving Behavior</a> consistent throughout the form.
      </>
    ),
  },
  {
    task: "Related fields",
    name: "Field",
    slug: "field",
    hint: "Label, help and error",
    advice: (
      <>
        Keep labels, descriptions and errors with the control. Use a <code>fieldset</code> and{" "}
        <code>legend</code> for a{" "}
        <a href={withBasePath("/docs/field/installation#field-fieldset")}>Named Group</a>.
      </>
    ),
  },
];

/** Form-specific guidance stays separate from the shared reading layout and interactive examples. */
export function FormsOverviewGuide() {
  return (
    <>
      <LibraryGuideSection id="design-forms" title="Design the Task before the Fields">
        <div class="block-guide-prose">
          <p>
            <strong>Ask for the Smallest Set of Information that Completes the Task.</strong> Give
            the form a <strong>Clear Purpose</strong> and make its{" "}
            <InlineCodeLink href="/docs/button/installation">Button</InlineCodeLink> describe the
            result—“Save Profile” or “Send Request.” A short profile update and a multi-step
            application have different needs; collect only the values the application will use.
            Start with a <a href="#form-examples">Working Example</a>, then choose the controls
            below.
          </p>
          <p>
            <strong>Group Related Choices in a Predictable Order.</strong> Keep{" "}
            <a href="#form-structure">Labels and Instructions</a> close to their inputs, explain
            unfamiliar requirements before entry, and mark optional fields consistently. Use{" "}
            <code>required</code> when an answer is necessary, then plan{" "}
            <a href="#validation-timing">When to Validate</a> and{" "}
            <a href="#validation-messages">How to Explain Errors</a> before connecting submission.
            The <a href="#form-submission">Submission and Recovery Guide</a> covers what happens
            next.
          </p>
        </div>
        <div
          class="block-guide-table form-control-reference"
          role="region"
          aria-label="Form control selection"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">
                  <span class="form-control-wide-label">The Input</span>
                  <span class="form-control-compact">Input &amp; Control</span>
                </th>
                <th scope="col" class="form-control-start">
                  Start With
                </th>
                <th scope="col">Design Detail</th>
              </tr>
            </thead>
            <tbody>
              {controls.map(({ task, name, slug, hint, advice }) => (
                <tr key={slug}>
                  <th scope="row">
                    {task}
                    <span class="form-control-compact">
                      <InlineCodeLink href={`/docs/${slug}/installation`} hint={hint}>
                        {name}
                      </InlineCodeLink>
                    </span>
                  </th>
                  <td class="form-control-start">
                    <InlineCodeLink href={`/docs/${slug}/installation`} hint={hint}>
                      {name}
                    </InlineCodeLink>
                  </td>
                  <td>{advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="block-guide-prose">
          <h3 id="form-structure">
            <BlockHeadingLink id="form-structure">Keep the Structure Native</BlockHeadingLink>
          </h3>
          <p>
            Start with a native{" "}
            <InlineCodeLink href="#form-examples" title="See the native form example">
              form
            </InlineCodeLink>
            , a <strong>Visible Label</strong>, a named input and a submit button. The browser
            already understands keyboard submission, required fields and many common input types.
            Kamod’s <InlineCodeLink href="/docs/input/installation">Input</InlineCodeLink>,{" "}
            <InlineCodeLink href="/docs/label/installation">Label</InlineCodeLink> and{" "}
            <InlineCodeLink href="/docs/button/installation">Button</InlineCodeLink> let you retain
            those semantics while using your app’s theme.
          </p>
          <p>
            Give every submitted control a{" "}
            <InlineCodeLink href="/docs/input/installation#api-reference">name</InlineCodeLink>.
            Match{" "}
            <InlineCodeLink href="/docs/label/installation#api-reference">htmlFor</InlineCodeLink>{" "}
            to a unique <code>id</code>, connect helper text with{" "}
            <InlineCodeLink href="/docs/input/installation#accessibility">
              aria-describedby
            </InlineCodeLink>
            , and use <strong>Explicit Button Types</strong>. A secondary action inside a form
            should usually be{" "}
            <InlineCodeLink href="/docs/button/installation#api-reference">
              {'type="button"'}
            </InlineCodeLink>
            ; use{" "}
            <InlineCodeLink
              href="#form-recovery"
              title="Read about form recovery and reset behavior"
            >
              {'type="reset"'}
            </InlineCodeLink>{" "}
            only when clearing the form is intentional and understandable.
          </p>
          <p>
            Prefer a <strong>Single Column</strong> on small screens. Two fields can share a row
            when their relationship is clear, but the reading and keyboard order should remain
            predictable. Long error messages must wrap without pushing controls beyond the screen
            edge. Use the <a href="#form-review">Form Review Checklist</a> to check keyboard order,
            focus and narrow layouts.
          </p>
        </div>
      </LibraryGuideSection>
      <LibraryGuideSection id="form-examples" title="Build from a Small, Working Example">
        <div class="block-guide-prose">
          <p>
            <BrandText>
              These examples assume your <code>Preact</code> app already has Kamod UI and its styles
              configured. Start with the native version, introduce a schema when rules need to be
              reused, then use{" "}
              <InlineCodeLink href="/docs/formisch/installation">Formisch</InlineCodeLink>{" "}
              <strong>for Coordinated Values, Validation and Submission</strong>. The schema and
              Formisch examples additionally require <code>valibot</code> and{" "}
              <PathDisplay path={"@formisch/preact"} />; follow the{" "}
              <a href={withBasePath("/docs/formisch/installation")}>Formisch Installation Guide</a>.
            </BrandText>
          </p>
          <p>
            The preview is a safe place to try empty input, an invalid email and a successful check.{" "}
            <strong>It Does Not Save Data or Contact a Service.</strong> Copy the source into your
            own project and supply the application callback when you are ready to integrate it.
          </p>
        </div>
        <OverviewExamples
          label="Form Examples"
          examples={formExamples}
          preview={(id) => (id === "native" ? <FormOverviewPreview /> : null)}
          review={(example) => <FormExampleReview example={example} />}
        />
      </LibraryGuideSection>
      <LibraryGuideSection id="form-validation" title="Make Validation Understandable">
        <div class="block-guide-prose">
          <h3 id="validation-timing">
            <BlockHeadingLink id="validation-timing">Choose When Feedback Appears</BlockHeadingLink>
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
              Explain the Fix, Not Just the Failure
            </BlockHeadingLink>
          </h3>
          <p>
            <strong>“Enter a valid email address” Is Useful; “Invalid input” Is Not Enough.</strong>
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
      <LibraryGuideSection id="form-submission" title="Connect Submission and Recovery">
        <div class="block-guide-prose">
          <h3 id="submission-lifecycle">
            <BlockHeadingLink id="submission-lifecycle">
              Separate Editing, Saving and Saved State
            </BlockHeadingLink>
          </h3>
          <p>
            Keep the current field values separate from the last confirmed result. When saving
            starts, show a concise pending label and prevent duplicate submissions.{" "}
            <strong>Await the Actual Operation</strong> before showing success. A resolved client
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
            <BlockHeadingLink id="form-recovery">Keep a Path Back to Progress</BlockHeadingLink>
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
            <a href={withBasePath("/docs/formisch/usage")}> Full Integration Examples</a> for field
            arrays, reset behavior and supported control adapters.
          </p>
        </div>
      </LibraryGuideSection>
    </>
  );
}

export function FormsOverviewReview() {
  return (
    <LibraryGuideSection id="form-review" title="Review Every Path through the Form">
      <div class="block-guide-prose">
        <p>
          Test the complete task with <strong>Realistic Input and Service Responses</strong>. A form
          that looks correct with one valid value may still be difficult to use when data is
          missing, a request is slow or a label is translated.
        </p>
        <ul>
          <li>
            <strong>Keyboard and Labels.</strong> Tab through every control, submit with Enter where
            appropriate, and verify focus after errors, reset and dynamic field changes. Check that
            every control has an accessible name.
          </li>
          <li>
            <strong>Boundaries.</strong> Try empty input, surrounding whitespace, long text and
            values at each minimum or maximum. Verify that the server and client rules agree.
          </li>
          <li>
            <strong>Request States.</strong> Simulate pending, success, validation failure, offline
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
          clear. <strong>Reuse the Interaction, Not Just the Appearance.</strong>
        </p>
      </div>
    </LibraryGuideSection>
  );
}
