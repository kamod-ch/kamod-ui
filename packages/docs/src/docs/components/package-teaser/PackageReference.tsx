import { DownloadIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { lazy, Suspense } from "preact/compat";
import { useMemo, useState } from "preact/hooks";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { CodeBlock } from "../CodeBlock";
import { type DocumentDisplay, DocumentDisplayOptions } from "../DocumentDisplayOptions";
import { packageGuideReference } from "./package-guide-reference";

const Markdown = lazy(() => import("../../../blocks/PromptMarkdown"));

/** Copy and download always carry the complete Markdown, regardless of display format. */
export function PackageReference({ config }: { config: PackageTeaserConfig }) {
  const [display, setDisplay] = useState<DocumentDisplay>("text");
  const document = useMemo(() => packageGuideReference(config), [config]);
  const download = useMemo(
    () => `data:text/markdown;charset=utf-8,${encodeURIComponent(document)}`,
    [document],
  );
  return (
    <div class="package-guide-reference">
      <div class="block-guide-prose">
        <p>
          Keep the <strong>Examples, Integration Decisions and Troubleshooting Notes</strong>{" "}
          together in your project, or share them with a coding assistant. This reference works with
          any assistant; no model-specific setup is needed. Check the installed version and your
          project’s conventions before applying a suggestion.
        </p>
      </div>
      <div class="package-guide-reference-controls">
        <DocumentDisplayOptions value={display} onChange={setDisplay} label="Reference Display" />
        <Button
          class="package-reference-download"
          variant="inverse"
          href={download}
          download={`${config.slug}-reference.md`}
          aria-label="Download Markdown Reference"
          data-reference-title="Download reference"
          data-package-reference={config.title}
          data-reference-docs={config.externalDocsUrl}
        >
          <DownloadIcon size={16} aria-hidden="true" />
          <span>Download</span>
          <span class="package-reference-download-dot" aria-hidden="true">
            ·
          </span>
          <span class="package-reference-download-format">Markdown</span>
        </Button>
      </div>
      <p class="package-guide-reference-note">
        Display changes only the view. Copy and download include the complete Markdown reference.
      </p>
      <CodeBlock
        code={document}
        language={display === "code" ? "markdown" : "text"}
        filePath={`${config.slug}-reference.md`}
        className="package-guide-reference-code"
        renderedContent={
          display === "markdown" ? (
            <Suspense fallback={<p role="status">Formatting reference…</p>}>
              <Markdown prompt={document} label="Rendered Package Reference" />
            </Suspense>
          ) : undefined
        }
      />
    </div>
  );
}
