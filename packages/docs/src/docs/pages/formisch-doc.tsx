import { CodeBlock } from "../components/CodeBlock";
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
    text: "This bug-report form validates on submit and revalidates as you edit after the first submit.",
  },
  {
    id: "approach",
    title: "Approach",
    text: "The integration is headless: Formisch supplies typed input, errors, and methods; Kamod UI supplies accessible Field, Input, Select, Checkbox, RadioGroup, Switch, Button, and Card primitives.",
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
    text: "Native inputs can spread field.props and normalize undefined to an empty string for controlled rendering.",
  },
  {
    id: "textarea",
    title: "Textarea",
    text: "Textareas use the same binding model as inputs and can display length counters next to validation feedback.",
  },
  {
    id: "select",
    title: "Select",
    text: "Composite controls use their value callback. Read field.input, pass it to the control, and call field.onChange with the next value.",
  },
  {
    id: "checkbox",
    title: "Checkbox",
    text: "For checkbox groups, keep arrays immutable: add with a new array and remove with filter.",
  },
  {
    id: "radio-group",
    title: "Radio Group",
    text: "RadioGroup maps one selected string to a Valibot picklist.",
  },
  { id: "switch", title: "Switch", text: "Switch maps a controlled boolean to Formisch state." },
  {
    id: "complex-forms",
    title: "Complex Forms",
    text: "Larger forms compose the same primitives for plan, billing, add-ons, and email preferences.",
  },
  {
    id: "resetting-form",
    title: "Resetting the Form",
    text: "Call reset(form) to restore initial inputs and clear validation state. Reset buttons are type=button so they do not submit.",
  },
  {
    id: "array-fields",
    title: "Array Fields",
    text: "FieldArray exposes stable item IDs. Use insert and remove to manage dynamic rows and let Valibot enforce min and max lengths.",
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
  navGroup: "forms",
  command: "pnpm --filter @kamod-ch/ui-docs add @formisch/preact valibot",
  usageLabel: "Schema-first form handling for Kamod UI docs with Preact, Formisch, and Valibot.",
  packagePath: "@formisch/preact + valibot",
  sections: [...sections],
  renderMain: (context) => {
    const renderExample = (sectionId: string) => {
      switch (sectionId) {
        case "demo":
          return context.renderPreviewAndCodeTabs({
            preview: <BugReportForm idPrefix="formisch-demo" />,
            codeSnippet: bugReportSnippet,
            previewClass,
          });
        case "form-methods":
          return <CodeBlock code={methodsSnippet} language="tsx" className="docs-tab-code mt-4" />;
        case "validation-modes":
          return (
            <CodeBlock
              code={validationModesSnippet}
              language="tsx"
              className="docs-tab-code mt-4"
            />
          );
        case "input":
          return context.renderPreviewAndCodeTabs({
            preview: <ProfileSettingsForm idPrefix="formisch-input" />,
            codeSnippet: inputSnippet,
            previewClass,
          });
        case "textarea":
          return context.renderPreviewAndCodeTabs({
            preview: <PersonalizationForm idPrefix="formisch-textarea" />,
            codeSnippet: textareaSnippet,
            previewClass,
          });
        case "select":
          return context.renderPreviewAndCodeTabs({
            preview: <LanguagePreferencesForm idPrefix="formisch-select" />,
            codeSnippet: selectSnippet,
            previewClass,
          });
        case "checkbox":
          return context.renderPreviewAndCodeTabs({
            preview: <NotificationPreferencesForm idPrefix="formisch-checkbox" />,
            codeSnippet: checkboxSnippet,
            previewClass,
          });
        case "radio-group":
          return context.renderPreviewAndCodeTabs({
            preview: <SubscriptionPlanForm idPrefix="formisch-radio" />,
            codeSnippet: radioSnippet,
            previewClass,
          });
        case "switch":
          return context.renderPreviewAndCodeTabs({
            preview: <SecuritySettingsForm idPrefix="formisch-switch" />,
            codeSnippet: switchSnippet,
            previewClass,
          });
        case "complex-forms":
          return context.renderPreviewAndCodeTabs({
            preview: <SubscriptionPreferencesForm idPrefix="formisch-complex" />,
            codeSnippet: complexSnippet,
            previewClass,
          });
        case "resetting-form":
          return context.renderPreviewAndCodeTabs({
            preview: <BugReportForm idPrefix="formisch-reset" />,
            codeSnippet: bugReportSnippet,
            previewClass,
          });
        case "array-fields":
          return context.renderPreviewAndCodeTabs({
            preview: <ContactEmailsForm idPrefix="formisch-array" />,
            codeSnippet: arraySnippet,
            previewClass,
          });
        case "sources":
          return (
            <ul class="docs-copy mt-4 list-disc pl-5">
              <li>
                <a href="https://ui.shadcn.com/docs/forms/formisch">shadcn/ui Formisch forms</a>
              </li>
              <li>
                <a href="https://formisch.dev/">Formisch documentation</a>
              </li>
              <li>
                <a href="https://valibot.dev/">Valibot documentation</a>
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
        })}
        {context.sections.map((section) => (
          <section key={section.id} id={section.id} class="docs-section">
            <h2>{section.title}</h2>
            <p class="docs-copy">{section.text}</p>
            {renderExample(section.id)}
          </section>
        ))}
      </>
    );
  },
};
