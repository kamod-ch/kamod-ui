import { withBasePath } from "../../../base-path";
import { BlockPropsTable } from "../../../blocks/detail/BlockPropsTable";
import { ApiReference } from "../../components/ApiReference";
import { BrandText } from "../../components/brand/BrandText";
import { CodeBlock } from "../../components/CodeBlock";
import { InlineCode } from "../../components/PathDisplay";

import { FormischApproach } from "./FormischApproach";

const contracts = [
  [
    "useForm",
    "Create a form store from a Valibot schema and initialInput; choose validate and revalidate timing.",
  ],
  [
    "Form",
    "Pass the store with of and handle validated output in onSubmit. The service request remains yours.",
  ],
  [
    "Field",
    "Use a typed path. Read input.value and errors.value; preserve native field.props or wire a composite control's callback.",
  ],
  [
    "FieldArray",
    "Read items.value and use each stable item ID as the row key; use the current index in the field path.",
  ],
  [
    "reset",
    "Restore initial inputs and clear form validation state. Reset any separate request or result state yourself.",
  ],
  [
    "insert / remove",
    "Change rows through the form store so array state and validation stay connected.",
  ],
];

const schemaSnippet = `import * as v from "valibot";

export const ContactSchema = v.object({
  email: v.pipe(v.string(), v.email("Enter a valid email address.")),
});

export type ContactOutput = v.InferOutput<typeof ContactSchema>;`;

/** Context alongside the existing demos: integration boundaries, not a second form implementation. */
export function FormischGuideNotes({ sectionId }: { sectionId: string }) {
  switch (sectionId) {
    case "installation":
      return (
        <div class="block-guide-prose">
          <p>
            <BrandText>
              Run the command in <strong>Your Application Package</strong>. It adds the form and
              schema libraries to an existing Preact/Kamod setup. In this repository, the equivalent
              workspace command is{" "}
              <code>pnpm --filter @kamod-ch/ui-docs add @formisch/preact valibot</code>. Keep your
              existing dependencies and connect the{" "}
              <a href={withBasePath("/docs/theming/css-setup")}>Global Stylesheet</a> once.
            </BrandText>
          </p>
        </div>
      );
    case "usage":
      return (
        <div class="block-guide-prose">
          <p>
            Follow the <a href="#demo">Complete Bug-Report Example</a> before extracting a field.
            Import <code>Field as FormischField</code> and <code>Form as FormischForm</code> from
            <InlineCode>@formisch/preact</InlineCode>; keep Kamod’s <code>Field</code> for the
            visible wrapper.
            <strong> These Components Have Different Jobs</strong>, even though their names overlap.
          </p>
          <p>
            The previews keep submitted data in memory for inspection. They do not persist it or
            call a backend. Use their Code panels as focused integration examples; their visual
            wrappers can differ from the full demos, whose source is linked in the header.
          </p>
        </div>
      );
    case "approach":
      return <FormischApproach />;
    case "api-reference":
      return (
        <>
          <ApiReference
            sections={[
              {
                title: "Example",
                description:
                  "The local demonstration wrappers accept an ID prefix so labels and controls stay unique when several examples appear on one page. This is a demo contract, not a prop of FormischForm.",
                rows: [
                  {
                    prop: "idPrefix",
                    type: "string",
                    defaultValue: "No default; required",
                    description:
                      "A unique prefix used to build the form and control IDs in each example. Supply a different prefix for every mounted instance to preserve label associations.",
                  },
                ],
              },
            ]}
          />
          <p class="docs-copy">
            The following integration points come from <InlineCode>@formisch/preact</InlineCode>.
            They describe the roles used throughout the examples; follow the package reference for
            their complete generic signatures.
          </p>
          <BlockPropsTable
            labelledBy="component-props"
            caption="Formisch integration contracts"
            rows={contracts.map(([name, description]) => ({
              key: name,
              name,
              type: "@formisch/preact",
              required: false,
              description,
            }))}
          />
          <p class="docs-copy">
            This is an integration map, not a replacement for the{" "}
            <a href="https://formisch.dev/">Formisch API Documentation</a>. Check the installed
            version before adopting optional methods.
          </p>
        </>
      );
    case "anatomy":
      return (
        <div class="block-guide-prose">
          <ol>
            <li>Define the schema and create the store inside the form component.</li>
            <li>
              Wrap fields in <code>FormischForm</code> and give every control a stable label
              association.
            </li>
            <li>
              Bind the field value, display its errors and distinguish submit actions from secondary
              buttons.
            </li>
            <li>
              Use validated output for your request; keep pending, failure and success feedback
              visible.
            </li>
          </ol>
        </div>
      );
    case "schema-and-setup":
      return (
        <>
          <CodeBlock code={schemaSnippet} language="tsx" filePath="src/forms/contact-schema.ts" />
          <p class="docs-copy">
            Pass this schema to <code>useForm</code> with{" "}
            <code>{'initialInput: { email: "" }'}</code>. Keep the schema outside the component when
            its rules are static, and the form store inside the component that owns the interaction.
          </p>
        </>
      );
    case "validation":
      return (
        <div class="block-guide-prose">
          <p>
            <strong>
              Client Validation Helps People Correct Mistakes; It Does Not Authorize a Request.
            </strong>{" "}
            Validate submitted data again on the server. Keep network or permission failures
            distinct from field constraints, and preserve the entered values so the user can
            recover.
          </p>
        </div>
      );
    case "validation-modes":
      return (
        <div class="block-guide-prose">
          <p>
            The snippets below compare options for an existing schema. Start with{" "}
            <code>validate: "submit"</code> and <code>revalidate: "input"</code> when you want
            feedback after the first attempt, then prompt correction while editing. Choose blur or
            live validation deliberately; avoid displaying untouched-field errors before someone has
            a chance to answer.
          </p>
        </div>
      );
    case "displaying-errors":
      return (
        <div class="block-guide-prose">
          <p>
            <BrandText>
              In the Preact adapter, <code>field.input</code> and <code>field.errors</code> are
              signals. Read their <code>.value</code> when branching, mapping errors or passing a
              primitive into a controlled input.
            </BrandText>
          </p>
          <CodeBlock
            language="tsx"
            filePath="src/forms/field-feedback.ts"
            code={`// Inside a FormischField render callback:
const value = typeof field.input.value === "string" ? field.input.value : "";
const invalid = Boolean(field.errors.value?.length);
const errors = field.errors.value?.map((message) => ({ message }));`}
          />
          <p>
            Keep <code>FieldLabel</code>, the input ID and any <code>aria-describedby</code> targets
            in sync. A red border alone is not an error message. Use unique IDs if the same form
            appears more than once.
          </p>
        </div>
      );
    case "form-methods":
      return (
        <div class="block-guide-prose">
          <p>
            The following lines are independent operations on an existing <code>form</code>, with{" "}
            <code>schema</code> and <code>initialInput</code> supplied by your component. Do not
            execute the whole list during render. Call mutations from the relevant event handler.
          </p>
        </div>
      );
    case "resetting-form":
      return (
        <div class="block-guide-prose">
          <p>
            <code>reset(form)</code> resets the form store. The demo also clears its separately
            stored result. In your app, decide whether reset should clear a request error or restore
            freshly loaded server values. The preview toolbar’s <strong>Reset</strong> remounts only
            that example and retains its selected container width.
          </p>
        </div>
      );
    case "array-fields":
      return (
        <div class="block-guide-prose">
          <p>
            Keep <strong>Row Identity Separate from Field Position</strong>: key rows by the IDs
            from <code>array.items.value</code>, and bind fields with their current index. Check
            removal in the middle of the list, an empty new row, the five-row limit and keyboard
            focus after removal.
          </p>
        </div>
      );
    case "sources":
      return (
        <div class="block-guide-prose">
          <p>
            <BrandText>
              The original{" "}
              <a href="https://ui.shadcn.com/docs/forms/formisch">shadcn/ui Formisch Guide</a> is a
              reference for the form patterns. Its examples use React; this page integrates{" "}
              <InlineCode>@formisch/preact</InlineCode> with Kamod’s Preact components. Consult
              Formisch for form APIs and Valibot for schema APIs, and check each project’s license
              when reusing source.
            </BrandText>
          </p>
        </div>
      );
    default:
      return null;
  }
}
