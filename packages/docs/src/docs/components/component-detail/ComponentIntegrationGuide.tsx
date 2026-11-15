import type { DocPageModule } from "../../types";
import { CodeBlock } from "../CodeBlock";
import { ComponentDocSection } from "./ComponentDocSection";

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

/** Only the pages with a real data boundary keep a short connect example. */
export function getComponentIntegrationContents(doc: DocPageModule) {
  if (doc.slug !== "progress" && doc.slug !== "formisch") return [];
  return [{ id: "integration-guide", label: "Connect it to your data" }];
}

/** Practical integration examples. Shared layout advice lives in the styles and theming guides. */
export function ComponentIntegrationGuide({ doc }: { doc: DocPageModule }) {
  if (doc.slug === "progress") {
    return (
      <ComponentDocSection
        section={{
          id: "integration-guide",
          title: "Connect it to your data",
          text: "Feed completed from the task and pass a positive total once it is known. Until then, value={null} means the duration is unknown. Reaching the maximum means the measured steps finished, not that the server accepted the result.",
        }}
      >
        <CodeBlock
          language="tsx"
          filePath="src/components/TaskProgress.tsx"
          code={progressExample}
        />
      </ComponentDocSection>
    );
  }
  if (doc.slug === "formisch") {
    return (
      <ComponentDocSection
        section={{
          id: "integration-guide",
          title: "Connect it to your data",
          text: "Keep the schema output at the service boundary. Pass your own onSubmit and return its promise so the form can track the submission. Show request errors beside the form, and reset only after a confirmed success.",
        }}
      >
        <CodeBlock
          language="tsx"
          filePath="src/forms/contact-contract.ts"
          code={submissionExample}
        />
      </ComponentDocSection>
    );
  }
  return null;
}
