import { DownloadIcon, FileDownIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { Tabs, TabsList, TabsTrigger } from "@kamod-ch/ui/tabs";
import { useMemo } from "preact/hooks";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { documentDisplayFormats } from "../DocumentDisplayOptions";
import { PackageReferenceDocument } from "./PackageReferenceDocument";
import { packageGuideReference } from "./package-guide-reference";

/** Copy and download always carry the complete Markdown, regardless of display format. */
export function PackageReference({ config }: { config: PackageTeaserConfig }) {
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
        <div class="package-reference-heading">
          <FileDownIcon size={13} strokeWidth={2} aria-hidden="true" />
          <strong>Keep It Handy</strong>
          <span aria-hidden="true">·</span>
          <span class="package-reference-caption">Ready for your project</span>
        </div>
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
          <span class="package-reference-download-icon" aria-hidden="true">
            <DownloadIcon size={16} strokeWidth={2} />
          </span>
          <span>Download</span>
          <span class="package-reference-download-dot" aria-hidden="true">
            ·
          </span>
          <span class="package-reference-download-format">Markdown</span>
        </Button>
      </div>
      <div class="package-reference-workspace">
        <Tabs defaultValue="text" class="docs-tabs package-reference-tabs">
          <TabsList variant="line" class="docs-tabs-list" aria-label="Reference Display">
            {documentDisplayFormats.map(({ value, label, Icon }) => (
              <TabsTrigger
                value={value}
                key={value}
                aria-label={value === "code" ? "Code (Markdown)" : label}
              >
                <Icon class="size-[14px]" size={14} aria-hidden="true" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <PackageReferenceDocument
            document={document}
            title={config.title}
            filePath={`${config.slug}-reference.md`}
          />
        </Tabs>
        <footer class="package-guide-reference-note">
          Display changes only the view. Copy and download include the{" "}
          <strong>complete Markdown reference.</strong>
        </footer>
      </div>
    </div>
  );
}
