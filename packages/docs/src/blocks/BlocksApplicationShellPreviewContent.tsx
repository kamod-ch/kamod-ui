/** Isolated previews must not import their article, source viewer or documentation shell. */
import { applicationShellBlocks } from "../../../blocks/src/application-shell/registry";
import { withBasePath } from "../base-path";

/** Keep previews synchronous inside the route boundary, including the initial server render. */
export function ApplicationShellBlocksPreviewContent({ id }: { id?: string }) {
  const block = applicationShellBlocks.find((item) => item.id === id);
  if (!block)
    return (
      <main>
        <p>Block not found.</p>
        <a href={withBasePath("/blocks/application-shell")}>All Application Shell Blocks</a>
      </main>
    );
  const Preview = block.component;
  return <Preview />;
}
