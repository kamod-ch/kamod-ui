/** Application Shell adapts the shared showcase while preserving its heading permalink and flat file list. */
import type { ApplicationShellBlock } from "./application-shell-config";
import { BlockShowcase } from "./BlockShowcase";
import { ShellHeadingLink } from "./ShellHeadingLink";

const loadSource = async (file: string) =>
  (await import("./application-shell-source")).applicationShellSources[file] ?? "";

export const ShellShowcase = ({ block }: { block: ApplicationShellBlock }) => (
  <BlockShowcase
    block={block}
    loadSource={loadSource}
    headingLevel="h2"
    groupedFiles={false}
    copyPath={false}
    title={<ShellHeadingLink id={block.id}>{block.title}</ShellHeadingLink>}
  />
);
