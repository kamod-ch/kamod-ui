import { CheckIcon } from "@kamod-ch/icons/lucide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { linkTitle } from "../../link-title";
import { CodeBlock } from "./CodeBlock";
import { DocsCallout } from "./DocsCallout";

export type OverviewExample = {
  id: string;
  label: string;
  title: string;
  description: string;
  code: string;
  filePath: string;
  language: "tsx" | "bash";
  check: string;
};

/** Shared keyboard-accessible examples with copyable source and optional working previews. */
export function OverviewExamples({
  label,
  examples,
  preview,
  review,
}: {
  label: string;
  examples: readonly OverviewExample[];
  preview?: (id: string) => ComponentChildren;
  /** Optional topic-specific guidance beneath the source. */
  review?: (example: OverviewExample) => ComponentChildren;
}) {
  return (
    <Tabs defaultValue={examples[0].id} class="guide-next-exercises">
      <TabsList variant="line" aria-label={label} class="guide-next-tabs">
        {examples.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {examples.map((example) => (
        <TabsContent key={example.id} value={example.id}>
          <div class="guide-next-example-intro">
            <strong>{linkTitle(example.title)}</strong>
            <p>{example.description}</p>
          </div>
          {preview?.(example.id)}
          <CodeBlock code={example.code} language={example.language} filePath={example.filePath} />
          {review ? (
            review(example)
          ) : (
            <DocsCallout class="docs-callout-spaced" icon={<CheckIcon />} title="Check the result">
              <p>{example.check}</p>
            </DocsCallout>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
