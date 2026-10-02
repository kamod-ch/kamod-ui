import { ArrowUpRightIcon, FileCodeIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { ShowcaseCodePane } from "../ShowcaseCodePane";

/** A single example uses the block source viewer without its file navigator. */
export function ComponentExampleCode({ code, filePath }: { code: string; filePath: string }) {
  return (
    <>
      <div class="blocks-source-intro">
        <div>
          <h3>
            <FileCodeIcon size={15} strokeWidth={2} aria-hidden="true" />
            Inside the example
          </h3>
          <p>Read the imports, follow the behavior, then adapt it to your app.</p>
        </div>
        <Button class="blocks-source-setup" variant="ghost" size="sm" href="#installation">
          Installation <ArrowUpRightIcon size={14} aria-hidden="true" />
        </Button>
      </div>
      <ShowcaseCodePane
        filename={filePath.split("/").at(-1) ?? filePath}
        filePath={filePath}
        code={code}
        footer="Example source · Adapt the data and handlers to your app."
      />
    </>
  );
}
