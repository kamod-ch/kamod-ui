/** Retains file selection across tab switches, but mounts the source loader only in Code. */
import { TabsContent } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import type { ShowcaseBlock } from "./BlockShowcase";
import { BlockShowcaseIntro } from "./BlockShowcaseIntro";
import { BlockSourceFiles, type BlockSourceLoader } from "./BlockSourceFiles";
import type { PreviewAppearance } from "./preview-appearance";
import { useShowcaseCodeNavigation } from "./ShowcaseCodeLink";
import { blockSourceDestination } from "./source-manifest";

export function BlockShowcaseCode({
  appearance,
  block,
  loadSource,
  setupHref,
  groupedFiles,
}: {
  appearance: PreviewAppearance;
  block: ShowcaseBlock;
  loadSource: BlockSourceLoader;
  setupHref?: string;
  groupedFiles: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState(block.files[0]?.label ?? "");
  useShowcaseCodeNavigation(block.id, block.files, setSelectedFile);

  return (
    <TabsContent value="code" class="blocks-showcase-source">
      <BlockShowcaseIntro block={block} view="code" setupHref={setupHref} />
      <BlockSourceFiles
        appearance={appearance}
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
