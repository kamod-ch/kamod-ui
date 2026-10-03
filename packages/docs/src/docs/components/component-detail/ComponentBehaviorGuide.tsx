import type { DocPageModule } from "../../types";
import { CodeBlock } from "../CodeBlock";

const progressExample = `import { Progress } from "@kamod-ch/ui";

type TaskProgressProps = { completed: number; total: number | null };

export function TaskProgress({ completed, total }: TaskProgressProps) {
  const knownTotal = total !== null && Number.isFinite(total) && total > 0;
  const current = knownTotal ? Math.min(total, Math.max(0, completed)) : 0;
  const label = knownTotal ? \`\${current} of \${total} items\` : "Preparing items…";

  return (
    <div class="grid gap-2">
      <p>{label}</p>
      <Progress
        value={knownTotal ? current : null}
        max={knownTotal ? total : 100}
        aria-label="Processing items"
        aria-valuetext={label}
      />
    </div>
  );
}`;

const submissionExample = `import type { InferOutput } from "valibot";
import { ContactSchema } from "./contact-schema";

type ContactOutput = InferOutput<typeof ContactSchema>;

// Pass a typed service into the form instead of embedding a demo endpoint.
type ContactFormProps = {
  onSubmit: (values: ContactOutput) => Promise<void>;
};

// Inside your form component, keep the submission promise connected:
// <FormischForm of={form} onSubmit={(values) => onSubmit(values)}>
//   ...fields and a submit button...
// </FormischForm>`;

/** Practical integration boundaries, with examples only where the actual API supports them. */
export function ComponentBehaviorGuide({ doc }: { doc: DocPageModule }) {
  return (
    <>
      <p>
        <strong>Give each piece of state one owner.</strong> Keep a temporary selection inside the
        interface when nothing else needs it; lift shared values into a parent when other controls
        depend on them. Read the <a href="#component-props">prop reference</a> before combining
        controlled values with defaults. A default normally initializes a control; it is not a
        substitute for updating its current value.
      </p>
      <p>
        Connect requests in an event handler or your application’s data layer, never as a side
        effect of rendering. Keep <strong>pending, completed and failed</strong> outcomes distinct,
        preserve useful input after an error, and offer a clear recovery action. If the integration
        subscribes to an external source, remove that subscription when its owner unmounts; cancel
        or ignore obsolete requests so an earlier response cannot replace newer results.
      </p>
      {doc.slug === "progress" && (
        <>
          <p>
            <strong>Report work that actually happened.</strong> Feed <code>completed</code> from
            your task and supply a positive <code>total</code> when it becomes known. Until then,
            <code> value={"{null}"}</code> communicates an unknown duration. This wrapper derives
            the visible label and accessible value from the same numbers; it does not start a timer
            or pretend that an upload has finished.
          </p>
          <CodeBlock
            language="tsx"
            filePath="src/components/TaskProgress.tsx"
            code={progressExample}
          />
          <p>
            Reaching the maximum means the measured steps finished, not necessarily that the server
            accepted the result. Keep final processing and failure messages separate from the bar,
            and remove the loading state when the operation settles. Avoid making every percentage
            update a live announcement; announce meaningful milestones instead.
          </p>
        </>
      )}
      {doc.slug === "formisch" && (
        <>
          <p>
            Keep the schema’s output type at the service boundary. The example below uses the
            <code> ContactSchema</code> from <a href="#schema-and-setup">Schema and setup</a>;
            supply your own service through <code>onSubmit</code> and return its promise so the form
            can track the submission. Display request errors near the form and reset only after a
            confirmed success or an explicit user action.
          </p>
          <CodeBlock
            language="tsx"
            filePath="src/forms/contact-contract.ts"
            code={submissionExample}
          />
        </>
      )}
      <p>
        Start with the <a href="#component-preview">live preview</a>, then exercise the same
        interaction with your actual data. The <a href="#component-data-types">type definitions</a>{" "}
        describe accepted values; they do not implement persistence, navigation or server-side
        validation for you. Keep those responsibilities in the application that composes the UI.
      </p>
    </>
  );
}
