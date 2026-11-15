import { CodeDotsIcon } from "@kamod-ch/icons/tabler/outline";
import type { PreviewAppearance } from "../../../blocks/preview-appearance";
import type { ConsumerImportStyle } from "../../consumer-import-style";
import { ConsumerImportSwitch, useConsumerImportCode } from "../consumer-import-code";
import { ShowcaseCodePane } from "../ShowcaseCodePane";
import { ComponentExampleIntro } from "./ComponentExampleIntro";

/** A single example uses the block source viewer without its file navigator. */
export function ComponentExampleCode({
  code,
  filePath,
  appearance,
  importStyle,
  onImportStyle,
  showImportStyle,
}: {
  code: string;
  filePath: string;
  appearance?: PreviewAppearance;
  /** Set together when the example also feeds this import style to the prompt. */
  importStyle?: ConsumerImportStyle;
  onImportStyle?: (style: ConsumerImportStyle) => void;
  showImportStyle?: boolean;
}) {
  const owned = useConsumerImportCode(showImportStyle ? "" : code);
  const style = importStyle ?? owned.style;
  const shown = showImportStyle ? code : owned.code;
  const applicable = showImportStyle ?? owned.applicable;
  return (
    <>
      <ComponentExampleIntro view="code" />
      {applicable ? (
        <ConsumerImportSwitch value={style} onChange={onImportStyle ?? owned.setStyle} />
      ) : null}
      <ShowcaseCodePane
        appearance={appearance}
        filename={filePath.split("/").at(-1) ?? filePath}
        filePath={filePath}
        code={shown}
        consumerImports={false}
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
