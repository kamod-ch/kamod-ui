import { applicationShellBlockMetadata } from "../../../blocks/src/application-shell/metadata";
import { withBasePath } from "../base-path";
import { BlockShowcase } from "../blocks/BlockShowcase";
import { sourceFromManifest } from "../blocks/source-manifest";

const block = applicationShellBlockMetadata[0];

/** The same complete showcase as the detail page, without importing its demo registry. */
export default function HomeShellShowcase() {
  return (
    <BlockShowcase
      block={block}
      groupedFiles={false}
      setupHref={withBasePath(
        "/blocks/application-shell/application-shell-1#application-shell-installation",
      )}
      loadSource={async (file) =>
        sourceFromManifest(
          block.files,
          file,
          (await import("../blocks/application-shell-source")).applicationShellSourceFiles,
        )
      }
    />
  );
}
