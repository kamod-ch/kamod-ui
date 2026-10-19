import { ArrowRightIcon } from "@kamod-ch/icons/tabler/outline";
import { withBasePath } from "../../base-path";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { BrandText } from "../components/brand/BrandText";
import { InlineCodeLink } from "../components/InlineCodeLink";

const guidePath = "/docs/formisch/installation";
const steps = [
  {
    id: "formisch-shared-rules",
    title: "Define Shared Rules with a Schema",
    description: (
      <>
        Start with the values the task actually needs. A <code>Valibot</code> schema describes their
        shape and validation messages; <code>useForm</code> connects those rules to initial values
        and field state. Keep <strong>One Source of Truth</strong> for the rules instead of
        repeating them in every control.
      </>
    ),
    detail: (
      <>
        Install <InlineCodeLink href={`${guidePath}#installation`}>@formisch/preact</InlineCodeLink>{" "}
        and <InlineCodeLink href={`${guidePath}#schema-and-setup`}>valibot</InlineCodeLink>, then
        choose when to validate: on submission, on blur or while editing.
      </>
    ),
    context: "Rules & Timing",
    links: [
      ["Schema and Setup", "schema-and-setup"],
      ["Validation Modes", "validation-modes"],
    ],
  },
  {
    id: "formisch-field-connections",
    title: "Connect State to Familiar Controls",
    description: (
      <>
        Keep your Kamod components and theme. Connect <code>field.props</code> to an{" "}
        <InlineCodeLink href="/docs/input/installation">Input</InlineCodeLink>, give it a visible{" "}
        <InlineCodeLink href="/docs/label/installation">Label</InlineCodeLink>, and place its
        feedback nearby. Formisch coordinates the value and errors; your layout makes them
        understandable.
      </>
    ),
    detail: (
      <>
        For composite controls such as <code>Select</code>, connect the value callback to{" "}
        <code>field.onChange</code>. <strong>Avoid Mirroring Field Values</strong> in a second{" "}
        <code>useState</code>; two competing values make reset and validation harder to follow.
      </>
    ),
    context: "Bindings & Feedback",
    links: [
      ["Input Binding", "input"],
      ["Custom Controls", "select"],
      ["Displaying Errors", "displaying-errors"],
    ],
  },
  {
    id: "formisch-save-lifecycle",
    title: "Carry Submission through to Recovery",
    description: (
      <>
        Connect validated output to your application’s save operation through <code>onSubmit</code>.
        Return or await asynchronous work so the form can track submission. Give the{" "}
        <InlineCodeLink href="/docs/button/installation">Button</InlineCodeLink> a clear pending
        state and prevent duplicate requests while saving.
      </>
    ),
    detail: (
      <>
        Keep <strong>Field Errors and Service Failures</strong> distinct. A failed request should
        leave entered values available for another attempt. Add repeatable fields only when the task
        needs them, keeping labels and errors connected as items are added or removed.
      </>
    ),
    context: "Submission & Growth",
    links: [
      ["Form Methods", "form-methods"],
      ["Dynamic Fields", "array-fields"],
    ],
  },
];

/** A reading-first introduction to the integration, with deeper references alongside each step. */
export function FormischIntegrationGuide() {
  return (
    <div class="formisch-integration block-guide-prose">
      <p>
        <strong>Start with the Simplest Form that Meets the Task.</strong> Native controls may be
        enough for a short form. Introduce{" "}
        <InlineCodeLink href={guidePath}>Formisch</InlineCodeLink> when shared validation rules,
        coordinated field state or repeatable groups become useful. The integration works with your{" "}
        <BrandText>
          <code>Preact</code>
        </BrandText>{" "}
        app and existing Kamod styling.
      </p>
      <p>
        Keep your current form library if it already meets those needs. You can compare{" "}
        <a href="#form-examples">Native, Schema and Formisch Examples</a> on this page before
        choosing how much coordination to add.
      </p>
      {steps.map(({ id, title, description, detail, context, links }) => (
        <section class="formisch-integration-step" aria-labelledby={id} key={id}>
          <div>
            <h3 id={id} tabIndex={-1}>
              <BlockHeadingLink id={id}>{title}</BlockHeadingLink>
            </h3>
            <p>
              <BrandText>{description}</BrandText>
            </p>
            <p>{detail}</p>
          </div>
          <nav class="formisch-integration-links" aria-label={`Formisch: ${context}`}>
            <span>{context}</span>
            {links.map(([label, anchor]) => (
              <a href={withBasePath(`${guidePath}#${anchor}`)} key={anchor}>
                {label}
                <ArrowRightIcon size={13} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </section>
      ))}
      <div class="formisch-integration-next">
        <a href={withBasePath(guidePath)}>
          <strong>Open the Formisch Guide</strong>
          <ArrowRightIcon size={14} aria-hidden="true" />
        </a>
        <span>
          Next on this page <span aria-hidden="true">·</span>{" "}
          <a href="#design-forms">Choose the Right Fields</a>
        </span>
      </div>
    </div>
  );
}
