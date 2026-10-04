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
        footer="Example source · Adapt the data and handlers to your app."
      />
    </>
  );
}
