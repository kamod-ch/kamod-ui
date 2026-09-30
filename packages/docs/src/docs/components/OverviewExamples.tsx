import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { CodeBlock } from "./CodeBlock";

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
}: {
  label: string;
  examples: readonly OverviewExample[];
  preview?: (id: string) => ComponentChildren;
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
            <strong>{example.title}</strong>
            <p>{example.description}</p>
          </div>
          {preview?.(example.id)}
          <CodeBlock code={example.code} language={example.language} filePath={example.filePath} />
          <div class="guide-next-check">
            <div>
              <strong>Check the result</strong>
              <p>{example.check}</p>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
