/**
 * Detail routes for registered application shells.
 * Each detail section owns its content and interaction state; internal links respect the site base.
 */

import { useMemo } from "preact/hooks";
import { applicationShellBlockMetadata } from "../../../blocks/src/application-shell/metadata";
import { ShellPageHeader } from "./ApplicationShellHeader";
import { ShellShowcase } from "./ApplicationShellShowcase";
import type { ApplicationShellBlock } from "./application-shell-config";
import { BlockDetailPage } from "./BlockDetailPage";
import { applicationShellSections } from "./detail/application-shell-sections";
import { createShellVariantSections } from "./detail/application-shell-variant-guides";
import { BlockDocumentation } from "./detail/BlockDocumentation";

/** Composes the showcase and guide without owning either component’s interaction state. */
const ShellDetail = ({ block }: { block: ApplicationShellBlock }) => {
  const sections = useMemo(
    () =>
      block.id === "application-shell-1"
        ? applicationShellSections
        : createShellVariantSections(block),
    [block],
  );
  return (
    <>
      <ShellShowcase key={block.id} block={block} />
      <BlockDocumentation
        block={block}
        category="application-shell"
        sections={sections}
        contentsId="application-shell-contents"
      />
    </>
  );
};

/**
 * Resolves a variant and wraps its detail view in the documentation site's top navigation.
 * Missing or unknown IDs show a not-found message while retaining the category return link.
 *
 * @param props - Route data; `blockId` must match a registry ID such as `application-shell-1`.
 */
export const BlocksApplicationShellDetailContent = ({ blockId }: { blockId?: string }) => {
  const block = applicationShellBlockMetadata.find((item) => item.id === blockId);
  return (
    <BlockDetailPage
      category="application-shell"
      header={block ? <ShellPageHeader block={block} /> : undefined}
    >
      {block ? <ShellDetail block={block} /> : <p>Block not found.</p>}
    </BlockDetailPage>
  );
};
