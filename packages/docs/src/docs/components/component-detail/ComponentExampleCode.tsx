import { CodeDotsIcon } from "@kamod-ch/icons/tabler/outline";
import { ShowcaseCodePane } from "../ShowcaseCodePane";
import { ComponentExampleIntro } from "./ComponentExampleIntro";

/** A single example uses the block source viewer without its file navigator. */
export function ComponentExampleCode({ code, filePath }: { code: string; filePath: string }) {
  return (
    <>
      <ComponentExampleIntro view="code" />
      <ShowcaseCodePane
        filename={filePath.split("/").at(-1) ?? filePath}
        filePath={filePath}
        code={code}
        footer={
          <>
            <strong class="inline-flex items-center gap-1.5 whitespace-nowrap font-medium">
              <CodeDotsIcon size={12} strokeWidth={1.75} class="shrink-0" aria-hidden="true" />
              Example Source
            </strong>{" "}
            · Adapt the data and handlers to your app.
          </>
        }
      />
    </>
  );
}
