import { TabsContent, useTabs } from "@kamod-ch/ui/tabs";
import { useEffect, useState } from "preact/hooks";
import { CodeBlock } from "../CodeBlock";
import type { DocumentDisplay } from "../DocumentDisplayOptions";
import { lazyShowcase } from "../lazy-showcase";
import { ShowcaseLoading } from "../ShowcaseLoading";

const Markdown = lazyShowcase(() => import("../../../blocks/PromptMarkdown"));

/** Let each selected view paint its pending state before preparing the source or Markdown. */
export function PackageReferenceDocument({
  document,
  title,
  filePath,
}: {
  document: string;
  title: string;
  filePath: string;
}) {
  const { value } = useTabs();
  const display = value as DocumentDisplay;
  // Initial plain text stays complete during SSR; retain only the latest prepared view.
  const [prepared, setPrepared] = useState({ document, display });
  const pending = prepared.document !== document || prepared.display !== display;
  useEffect(() => {
    if (pending) setPrepared({ document, display });
  }, [document, display, pending]);
  const loading = (
    <ShowcaseLoading
      view={display === "markdown" ? "markdown" : "code"}
      detail={`${title} reference`}
    />
  );
  return (
    <TabsContent value={display} class="package-reference-panel">
      <CodeBlock
        key={display}
        class="package-guide-reference-code"
        code={document}
        language={display === "code" ? "markdown" : "text"}
        inferLanguage={display !== "text"}
        filePath={filePath}
        defaultWrapped
        loadingContent={loading}
        renderedContent={
          pending ? (
            loading
          ) : display === "markdown" ? (
            <Markdown
              prompt={document}
              label="Rendered Package Reference"
              pendingContent={loading}
              fallback={loading}
            />
          ) : undefined
        }
      />
    </TabsContent>
  );
}
