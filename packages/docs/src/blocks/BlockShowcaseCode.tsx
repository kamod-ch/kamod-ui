/** Retains file selection across tab switches, but mounts the source loader only in Code. */
import { useTimeout } from "@kamod-ch/hooks";
import { ArrowUpRightIcon, CheckIcon, FilesIcon } from "@kamod-ch/icons/lucide";
import { CopyIcon } from "@kamod-ch/icons/tabler/outline";
import { Button, TabsContent } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import type { ShowcaseBlock } from "./BlockShowcase";
import { BlockSourceFiles, type BlockSourceLoader } from "./BlockSourceFiles";
import { useShowcaseCodeNavigation } from "./ShowcaseCodeLink";
import { blockSourceDestination } from "./source-manifest";

export function BlockShowcaseCode({
  block,
  loadSource,
  groupedFiles,
  copyPath,
}: {
  block: ShowcaseBlock;
  loadSource: BlockSourceLoader;
  groupedFiles: boolean;
  copyPath: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(block.files[0]?.label ?? "");
  const setupId = block.category === "application-shell" ? "application-shell" : block.id;
  useShowcaseCodeNavigation(block.id, block.files, setSelectedFile);
  useTimeout(() => setCopied(false), copied ? 1600 : undefined);
  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(block.installCommand);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <TabsContent value="code" class="blocks-showcase-source">
      <div class="blocks-source-intro">
        <div>
          <h3>
            <FilesIcon size={15} strokeWidth={2} aria-hidden="true" />
            Inside the block
          </h3>
          <p>Explore the composition and the files that make it work.</p>
        </div>
        <a class="blocks-source-setup" href={`#${setupId}-installation`}>
          Setup guide <ArrowUpRightIcon size={14} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>
      <div class="blocks-install">
        <span class="blocks-source-path-label">
          {block.category === "sidebar" ? "Copy into" : "Import path"}
        </span>
        <code title={block.installCommand}>{block.installCommand}</code>
        {copyPath && (
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={copied ? "Block path copied" : "Copy block path"}
            onClick={copyInstall}
          >
            {copied ? (
              <CheckIcon size={14} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <CopyIcon size={14} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </Button>
        )}
      </div>
      <BlockSourceFiles
        files={block.files.map((file) => ({
          ...file,
          destination: blockSourceDestination(block, file),
        }))}
        loadSource={loadSource}
        selectedFile={selectedFile}
        onSelect={setSelectedFile}
        grouped={groupedFiles}
      />
    </TabsContent>
  );
}
