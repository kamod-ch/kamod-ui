/** Application Shell uses the shared showcase with its flat source file list. */
import type { ApplicationShellBlock } from "./application-shell-config";
import { BlockShowcase } from "./BlockShowcase";

const loadSource = async (file: string) =>
  (await import("./application-shell-source")).applicationShellSources[file] ?? "";

export const ShellShowcase = ({ block }: { block: ApplicationShellBlock }) => (
  <BlockShowcase block={block} loadSource={loadSource} groupedFiles={false} copyPath={false} />
);
