import { withBasePath } from "../base-path";
import { BrandText } from "./components/brand/BrandText";
import {
  LibraryDirectoryResources,
  libraryResourceContents,
} from "./components/LibraryDirectoryResources";
import { LibraryGuideSection } from "./components/LibraryGuideSection";
import { LibraryOverviewGuide } from "./components/LibraryOverviewGuide";
import { PathDisplay } from "./components/PathDisplay";
import { FormischIntegrationGuide } from "./overview/FormischIntegrationGuide";
import { FormsOverviewGuide, FormsOverviewReview } from "./overview/FormsOverviewGuide";

const contents = [
  {
    id: "library-items",
    label: "Form Guides",
    children: [
      { id: "formisch-shared-rules", label: "Shared Rules" },
      { id: "formisch-field-connections", label: "Field Connections" },
      { id: "formisch-save-lifecycle", label: "Save & Recovery" },
    ],
  },
  {
    id: "design-forms",
    label: "Design the Task",
    children: [{ id: "form-structure", label: "Native Structure" }],
  },
  { id: "form-examples", label: "Working Examples" },
  {
    id: "form-validation",
    label: "Validation",
    children: [
      { id: "validation-timing", label: "Feedback Timing" },
      { id: "validation-messages", label: "Useful Messages" },
    ],
  },
  {
    id: "form-submission",
    label: "Submission & Recovery",
    children: [
      { id: "submission-lifecycle", label: "Editing, Saving & Saved" },
      { id: "form-recovery", label: "Recovery & Dynamic Fields" },
    ],
  },
  libraryResourceContents,
  { id: "form-review", label: "Review before Shipping" },
];

/** The form overview pairs the shared reading layout with practical field and submission guidance. */
export const DocsFormsOverviewContent = () => (
  <LibraryOverviewGuide
    scope="forms"
    label="Forms"
    title="Forms that Guide People from Input to Completion"
    focus="Structure · Validate · Submit"
    contents={contents}
    description={
      <>
        <p>
          <BrandText>
            Build forms with{" "}
            <strong>Clear Labels, Useful Validation and Predictable Submission</strong>. Combine
            Kamod’s <code>Preact</code> controls with native form semantics, then add a schema and
            coordinated state when the task needs them. Your application supplies the service calls
            and business rules; the interface should make every step understandable.
          </BrandText>
        </p>
        <p>
          Start with a small working form, explore the{" "}
          <a href={withBasePath("/docs/formisch/installation")}>Formisch Integration</a> for{" "}
          <PathDisplay path={"@formisch/preact"} /> and <code>valibot</code>, and keep field styling
          aligned with the{" "}
          <a href={withBasePath("/docs/theming/css-setup")}>Shared CSS Foundation</a>. The guidance
          below covers <strong>Field Choice, State, Errors and Recovery</strong>, with copyable
          examples and checks for real content, keyboard use and both color schemes.
        </p>
      </>
    }
  >
    <LibraryGuideSection id="library-items" title="Find Your Form Starting Point">
      <FormischIntegrationGuide />
    </LibraryGuideSection>
    <FormsOverviewGuide />
    <LibraryDirectoryResources guide />
    <FormsOverviewReview />
  </LibraryOverviewGuide>
);
