import { withBasePath } from "../base-path";
import { LibraryGrid } from "./components/LibraryDirectory";
import {
  LibraryDirectoryResources,
  libraryResourceContents,
} from "./components/LibraryDirectoryResources";
import { LibraryGuideSection } from "./components/LibraryGuideSection";
import { LibraryOverviewGuide } from "./components/LibraryOverviewGuide";
import { PathDisplay } from "./components/PathDisplay";
import { FormsOverviewGuide, FormsOverviewReview } from "./overview/FormsOverviewGuide";
import { formDocPages } from "./registry";

const forms = [...formDocPages].sort((a, b) => a.title.localeCompare(b.title));
const contents = [
  { id: "library-items", label: "Form guides" },
  {
    id: "design-forms",
    label: "Design the task",
    children: [{ id: "form-structure", label: "Native structure" }],
  },
  { id: "form-examples", label: "Working examples" },
  {
    id: "form-validation",
    label: "Validation",
    children: [
      { id: "validation-timing", label: "Feedback timing" },
      { id: "validation-messages", label: "Useful messages" },
    ],
  },
  {
    id: "form-submission",
    label: "Submission & recovery",
    children: [
      { id: "submission-lifecycle", label: "Editing, saving & saved" },
      { id: "form-recovery", label: "Recovery & dynamic fields" },
    ],
  },
  libraryResourceContents,
  { id: "form-review", label: "Review before shipping" },
];

/** The form overview pairs the shared reading layout with practical field and submission guidance. */
export const DocsFormsOverviewContent = () => (
  <LibraryOverviewGuide
    scope="forms"
    label="Forms"
    title="Forms that guide people from input to completion"
    focus="Structure · Validate · Submit"
    contents={contents}
    jumps={[
      { id: "library-items", label: "Form guides" },
      { id: "form-examples", label: "Working examples" },
      { id: "library-guides", label: "Setup & theming" },
    ]}
    description={
      <>
        <p>
          Build forms with{" "}
          <strong>clear labels, useful validation and predictable submission</strong>. Combine
          Kamod’s <code>Preact</code> controls with native form semantics, then add a schema and
          coordinated state when the task needs them. Your application supplies the service calls
          and business rules; the interface should make every step understandable.
        </p>
        <p>
          Start with a small working form, explore the{" "}
          <a href={withBasePath("/docs/formisch/installation")}>Formisch integration</a> for{" "}
          <PathDisplay path={"@formisch/preact"} /> and <code>valibot</code>, and keep field styling
          aligned with the{" "}
          <a href={withBasePath("/docs/theming/css-setup")}>shared CSS foundation</a>. The guidance
          below covers <strong>field choice, state, errors and recovery</strong>, with copyable
          examples and checks for real content, keyboard use and both color schemes.
        </p>
      </>
    }
  >
    <LibraryGuideSection id="library-items" title="Find your form starting point">
      <div class="block-guide-prose">
        <p>
          <strong>Use the integration that matches the complexity of the form.</strong> A small
          native form may need only <code>Input</code>, <code>Label</code> and <code>Button</code>.
          The Formisch guide adds schema-backed state, validation modes, custom controls and dynamic
          fields, with examples you can adapt to your project.
        </p>
        <p>
          Browse the available {forms.length === 1 ? "guide" : "guides"} below, or start with the{" "}
          <a href="#form-examples">focused examples</a> on this page. Keep your existing form
          library when it already meets your needs; the Kamod controls are the presentation layer,
          not a requirement to change how your application validates data.
        </p>
      </div>
      <LibraryGrid
        label="Form guides"
        items={forms.map((doc) => ({
          label: doc.title,
          href: `/docs/${doc.slug}/installation`,
          detail: doc.usageLabel,
          packagePath: doc.packagePath,
        }))}
      />
    </LibraryGuideSection>
    <FormsOverviewGuide />
    <LibraryDirectoryResources guide />
    <FormsOverviewReview />
  </LibraryOverviewGuide>
);
