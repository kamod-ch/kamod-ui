/** Application shells share the source browser while preserving each variant’s file closure. */
import type { ApplicationShellBlock } from "./application-shell-config";
import { BlockShowcase } from "./BlockShowcase";
import { sourceFromManifest } from "./source-manifest";

export const ShellShowcase = ({ block }: { block: ApplicationShellBlock }) => (
  <BlockShowcase
    block={block}
    groupedFiles={block.id !== "application-shell-1"}
    loadSource={async (file) =>
      sourceFromManifest(
        block.files,
        file,
        (await import("./application-shell-source")).applicationShellSourceFiles,
      )
    }
  />
);
