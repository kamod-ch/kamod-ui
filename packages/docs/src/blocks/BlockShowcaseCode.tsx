/** Retains file selection across tab switches, but mounts the source loader only in Code. */
import { useTimeout } from "@kamod-ch/hooks";
import { CheckIcon } from "@kamod-ch/icons/lucide";
import { CopyIcon } from "@kamod-ch/icons/tabler/outline";
import { Button, TabsContent } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import type { ShowcaseBlock } from "./BlockShowcase";
import { BlockSourceFiles, type BlockSourceLoader } from "./BlockSourceFiles";

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
    <TabsContent value="code">
      <div class="blocks-install">
        <code>{block.installCommand}</code>
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
        files={block.files}
        loadSource={loadSource}
        selectedFile={selectedFile}
        onSelect={setSelectedFile}
        grouped={groupedFiles}
      />
    </TabsContent>
  );
}
