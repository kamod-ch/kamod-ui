import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import {
  BugReportForm,
  ContactEmailsForm,
  LanguagePreferencesForm,
  NotificationPreferencesForm,
  PersonalizationForm,
  ProfileSettingsForm,
  SecuritySettingsForm,
  SubscriptionPlanForm,
  SubscriptionPreferencesForm,
} from "../forms/formisch/FormischExamples";
import { FormischGuideNotes } from "../forms/formisch/FormischGuideNotes";
import {
  arraySnippet,
  bugReportSnippet,
  checkboxSnippet,
  complexSnippet,
  inputSnippet,
  methodsSnippet,
  radioSnippet,
  selectSnippet,
  switchSnippet,
  textareaSnippet,
  validationModesSnippet,
} from "../forms/formisch/formisch-snippets";
import type { DocPageModule } from "../types";

const sections = [
  {
    id: "installation",
    title: "Installation",
    text: "Add Formisch and Valibot to the docs app. Kamod UI components stay responsible for layout and interaction, while Formisch owns the schema-backed form state.",
  },
  {
    id: "usage",
    title: "Usage",
    text: "Create a Valibot object schema, pass it to useForm, wrap controls in FormischForm, and use FormischField render props to connect Kamod UI controls.",
  },
  {
    id: "demo",
    title: "Demo",
    text: "**Follow the Complete Submission Cycle.** The bug-report demo begins validation on submission and checks edited fields again after that first attempt. It combines schema-backed values with Kamod field presentation, letting you follow one form through invalid input, correction and a submission attempt.\n\nReplace the demonstration submission with your own request and distinguish **Field Errors** from **Service Failures**. Preserve useful input after a failed save, give the user an actionable message and verify that a retry cannot create duplicate work.",
  },
  {
    id: "approach",
    title: "How the Pieces Work Together",
    text: "Build around **One Form Store**, with a clear role for each layer. `Valibot` describes valid data, `Formisch` coordinates the interaction, and Kamod UI gives it a familiar interface. Your application connects the result to a real service. Start with the [Complete Example](#demo), then use these boundaries as you adapt it.",
  },
  {
    id: "form-methods",
    title: "Form Methods",
    text: "Import only the methods you need. The methods API can inspect, validate, submit, reset, focus, and update deeply nested fields or field arrays.",
  },
  {
    id: "api-reference",
    title: "API Reference",
    text: "The most important integration APIs are useForm, Form, Field, FieldArray, reset, insert, remove, and the optional methods shown below.",
  },
  {
    id: "anatomy",
    title: "Anatomy",
    text: "A typical form has a Valibot schema, a useForm call, a FormischForm, one or more FormischField blocks, Kamod Field wrappers, visible errors, and action buttons.",
  },
  {
    id: "schema-and-setup",
    title: "Schema and Form Setup",
    text: "Valibot is the single source of truth. Input and output types are inferred from the schema, so submit handlers receive validated data.",
  },
  {
    id: "validation",
    title: "Validation",
    text: "Use Valibot pipes for length, email, picklist, array, and boolean constraints. Formisch returns field-level error strings that map directly to FieldError.",
  },
  {
    id: "validation-modes",
    title: "Validation Modes",
    text: "Choose when the first validation happens with validate, and when later checks happen with revalidate.",
  },
  {
    id: "displaying-errors",
    title: "Displaying Errors",
    text: "Set invalid state on Field, aria-invalid on the actual control, and render FieldError only when Formisch has messages.",
  },
  {
    id: "input",
    title: "Input",
    text: "**Keep Browser Input and Form State Synchronized.** Spread `field.props` onto the native input so its events stay connected to the form store. Normalize an absent text value to `''` for controlled rendering while keeping the user's actual input as the source of the displayed value.\n\nPreserve the label, description and error associations when adding styling; changing the wrapper should not break the field's validation or event binding.",
  },
  {
    id: "textarea",
    title: "Textarea",
    text: "**Guide the Answer without Competing with Validation.** Bind a textarea to the same Formisch field model used for a single-line input. A nearby character counter can explain how the answer relates to a limit, provided it reads the same value that validation checks.\n\nExplain whether the limit counts characters, words or another unit, and ensure the counter follows that rule. Leave room for longer answers and visible error messages, then test the point where an answer becomes valid again after editing.",
  },
  {
    id: "select",
    title: "Select",
    text: "**Bridge the Composite Control Explicitly.** Pass `field.input` into a composite select and forward its value callback to `field.onChange`. This explicit bridge connects the control's selection model to Formisch rather than expecting native input events from a custom trigger.\n\nUse stable option values, handle an initially empty selection deliberately, and keep the label attached to the trigger rather than only to the surrounding layout.",
  },
  {
    id: "checkbox",
    title: "Checkbox",
    text: "**Treat the Selected Options as One Field Value.** Store a checkbox collection as an array of selected values and create a new array for every change. Adding with a spread and removing with `filter` keeps updates explicit for the form store and its validation.\n\nUse stable values for each checkbox, derive checked state from that array, and place collection-level validation where it is clear which group needs attention.",
  },
  {
    id: "radio-group",
    title: "Radio Group",
    text: "**Keep the Allowed Values Aligned with the Schema.** Connect `RadioGroup` to one field value whose allowed strings match a Valibot picklist. The selected option and submitted data then share the same vocabulary, avoiding a separate translation between visual labels and accepted values.\n\nDrive the group from the field's current input and forward changes directly, rather than maintaining another selection state beside the form.",
  },
  {
    id: "switch",
    title: "Switch",
    text: "**Preserve a Boolean Throughout the Binding.** Drive `Switch` from the field's boolean input and send changes back to that same field. The visual on/off state becomes a direct view of the value Formisch will validate and include in submission.\n\nExplain the enabled state in the label and distinguish immediate settings from preferences saved on submit; the visual toggle alone does not decide that workflow.",
  },
  {
    id: "complex-forms",
    title: "Complex Forms",
    text: "**Compose Larger Workflows from the Same Small Bindings.** Build a larger form by grouping the same field primitives around plan, billing and preference choices. Each section adds context to the shared form state rather than creating independent stores for pieces of one submission.\n\nInspect the submitted shape alongside the schema, and avoid duplicating form state in presentation components when a value already belongs to Formisch.",
  },
  {
    id: "resetting-form",
    title: "Resetting the Form",
    text: '**Make the Reset Destination Predictable.** Call `reset(form)` to restore the initial inputs and clear validation state when the user deliberately starts over. Give the reset control `type="button"` so activating it does not also trigger the form\'s submit path.\n\nKeep reset separate from submission, and verify that validation feedback and derived summaries reflect the restored values rather than retaining stale state outside the form.',
  },
  {
    id: "array-fields",
    title: "Array Fields",
    text: "**Preserve Identity While Rows Move or Disappear.** Use `FieldArray` item IDs as stable row keys, and manage the collection with `insert` and `remove`. Valibot can enforce allowed lengths while each row retains its identity as neighboring entries are added or removed.\n\nAssociate each row's labels and errors with the correct field, and test removing a middle row so another person's entered values do not appear to jump between controls.",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    text: "Every preview uses stable IDs, explicit labels, fieldsets for groups, aria-invalid, alert-based errors, and descriptive remove buttons.",
  },
  {
    id: "sources",
    title: "Sources",
    text: "Related references for the ideas and APIs used on this page.",
  },
] as const;

const previewClass = "data-[chromeless=true]:h-auto overflow-visible";

export const formischDocPage: DocPageModule = {
  slug: "formisch",
  title: "Formisch",
  headline: "Schema-first forms with Formisch",
  navGroup: "forms",
  command: "pnpm add @formisch/preact valibot",
  usageLabel: "Schema-first forms with Preact, Formisch, Valibot and Kamod UI.",
  packagePath: "@formisch/preact + valibot",
  sections: [...sections],
  exampleSectionIds: [
    "demo",
    "input",
    "textarea",
    "select",
    "checkbox",
    "radio-group",
    "switch",
    "complex-forms",
    "resetting-form",
    "array-fields",
  ],
  renderMain: (context) => {
    const renderExample = (sectionId: string) => {
      switch (sectionId) {
        case "demo":
          return context.renderPreviewAndCodeTabs({
            preview: <BugReportForm idPrefix="formisch-demo" />,
            codeSnippet: bugReportSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "form-methods":
          return (
            <CodeBlock
              code={methodsSnippet}
              language="tsx"
              filePath="src/forms/form-methods.ts"
              className="docs-tab-code mt-4"
            />
          );
        case "validation-modes":
          return (
            <CodeBlock
              code={validationModesSnippet}
              filePath="src/forms/validation-modes.ts"
              language="tsx"
              className="docs-tab-code mt-4"
            />
          );
        case "input":
          return context.renderPreviewAndCodeTabs({
            preview: <ProfileSettingsForm idPrefix="formisch-input" />,
            codeSnippet: inputSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "textarea":
          return context.renderPreviewAndCodeTabs({
            preview: <PersonalizationForm idPrefix="formisch-textarea" />,
            codeSnippet: textareaSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "select":
          return context.renderPreviewAndCodeTabs({
            preview: <LanguagePreferencesForm idPrefix="formisch-select" />,
            codeSnippet: selectSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "checkbox":
          return context.renderPreviewAndCodeTabs({
            preview: <NotificationPreferencesForm idPrefix="formisch-checkbox" />,
            codeSnippet: checkboxSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "radio-group":
          return context.renderPreviewAndCodeTabs({
            preview: <SubscriptionPlanForm idPrefix="formisch-radio" />,
            codeSnippet: radioSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "switch":
          return context.renderPreviewAndCodeTabs({
            preview: <SecuritySettingsForm idPrefix="formisch-switch" />,
            codeSnippet: switchSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "complex-forms":
          return context.renderPreviewAndCodeTabs({
            preview: <SubscriptionPreferencesForm idPrefix="formisch-complex" />,
            codeSnippet: complexSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "resetting-form":
          return context.renderPreviewAndCodeTabs({
            preview: <BugReportForm idPrefix="formisch-reset" />,
            codeSnippet: bugReportSnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "array-fields":
          return context.renderPreviewAndCodeTabs({
            preview: <ContactEmailsForm idPrefix="formisch-array" />,
            codeSnippet: arraySnippet,
            previewClass,
            filePath: `src/forms/${sectionId}.tsx`,
          });
        case "sources":
          return (
            <ul class="docs-copy mt-4 list-disc pl-5">
              <li>
                <a href="https://ui.shadcn.com/docs/forms/formisch">shadcn/ui Formisch Forms</a>
              </li>
              <li>
                <a href="https://formisch.dev/">Formisch Documentation</a>
              </li>
              <li>
                <a href="https://valibot.dev/">Valibot Documentation</a>
              </li>
            </ul>
          );
        default:
          return null;
      }
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <BugReportForm idPrefix="formisch-hero" />,
          codeSnippet: bugReportSnippet,
          previewClass,
          filePath: "src/forms/BugReportForm.tsx",
        })}
        {context.sections.map((section) => (
          <ComponentDocSection key={section.id} section={section}>
            {section.id === "installation" && context.renderSectionExtraContent("installation")}
            <FormischGuideNotes sectionId={section.id} />
            {renderExample(section.id)}
          </ComponentDocSection>
        ))}
      </>
    );
  },
};
