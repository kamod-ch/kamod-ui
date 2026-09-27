/** Application Shell adapts the shared showcase while preserving its heading permalink and flat file list. */
import type { ApplicationShellBlock } from "./application-shell-config";
import { BlockHeadingLink } from "./BlockHeadingLink";
import { BlockShowcase } from "./BlockShowcase";

const loadSource = async (file: string) =>
  (await import("./application-shell-source")).applicationShellSources[file] ?? "";

export const ShellShowcase = ({ block }: { block: ApplicationShellBlock }) => (
  <BlockShowcase
    block={block}
    loadSource={loadSource}
    headingLevel="h2"
    groupedFiles={false}
    copyPath={false}
    title={<BlockHeadingLink id={block.id}>{block.title}</BlockHeadingLink>}
  />
);
