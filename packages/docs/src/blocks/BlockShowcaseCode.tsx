/** Retains file selection across tab switches, but mounts the source loader only in Code. */
import { TabsContent } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { BlockImportPath } from "./BlockImportPath";
import type { ShowcaseBlock } from "./BlockShowcase";
import { BlockShowcaseIntro } from "./BlockShowcaseIntro";
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
  const [selectedFile, setSelectedFile] = useState(block.files[0]?.label ?? "");
  useShowcaseCodeNavigation(block.id, block.files, setSelectedFile);

  return (
    <TabsContent value="code" class="blocks-showcase-source">
      <BlockShowcaseIntro
        block={block}
        view="code"
        metadata={
          <BlockImportPath
            path={block.installCommand}
            label={block.category === "sidebar" ? "Copy into" : "Import path"}
            copyable={copyPath}
          />
        }
      />
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
