import { CodeDotsIcon } from "@kamod-ch/icons/tabler/outline";
import { ToggleGroup, ToggleGroupItem } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { stableExampleId } from "../../../analytics/growth-meta";
import type { PreviewAppearance } from "../../../blocks/preview-appearance";
import { ShowcaseCodePane } from "../ShowcaseCodePane";
import { ComponentExampleIntro } from "./ComponentExampleIntro";

/** A single example uses the block source viewer without its file navigator. */
export function ComponentExampleCode({
  code,
  localSourceCode,
  filePath,
  appearance,
}: {
  code: string;
  /** Docs-repo alias imports; available only when consumer snippets use package exports. */
  localSourceCode?: string;
  filePath: string;
  appearance?: PreviewAppearance;
}) {
  const [importView, setImportView] = useState<"package" | "local">("package");
  const displayed = importView === "local" && localSourceCode ? localSourceCode : code;
  const canToggle = Boolean(localSourceCode && localSourceCode !== code);
  return (
    <>
      <ComponentExampleIntro view="code" />
      {canToggle ? (
        <div class="component-example-import-toggle">
          <ToggleGroup
            type="single"
            value={importView}
            onValueChange={(value) => {
              if (value === "package" || value === "local") setImportView(value);
            }}
            class="blocks-showcase-segmented"
            aria-label="Snippet import style"
            aria-orientation={undefined}
          >
            <ToggleGroupItem value="package" class="docs-icon-button">
              Package imports
            </ToggleGroupItem>
            <ToggleGroupItem value="local" class="docs-icon-button">
              Copy source
            </ToggleGroupItem>
          </ToggleGroup>
          <p class="docs-copy component-example-import-note">
            {importView === "package"
              ? "Copy uses published @kamod-ch/ui exports for your app."
              : "Copy uses the docs app’s @/components/kamod-ui alias paths."}
          </p>
        </div>
      ) : null}
      <ShowcaseCodePane
        appearance={appearance}
        filename={filePath.split("/").at(-1) ?? filePath}
        filePath={filePath}
        code={displayed}
        growthMeta={{
          exampleId: stableExampleId(filePath),
          displayMode: `snippet:${importView}${appearance ? `|${appearance}` : ""}`,
        }}
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
