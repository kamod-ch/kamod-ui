/**
 * Application Shell 1 introduction, composed within the shared block-page header.
 * @see https://www.shadcnblocks.com/block/application-shell1 — original design reference.
 */
import type { ApplicationShellBlock } from "./application-shell-config";
import { BlockDetailHeader } from "./BlockDetailHeader";
import { getBlockDisplayName } from "./block-overview-details";

/** Retain the shell's detailed introduction, overview anchor and About destination. */
export const ShellPageHeader = ({ block }: { block: ApplicationShellBlock }) => (
  <BlockDetailHeader
    category="application-shell"
    block={block}
    className="blocks-shell-header"
    title={`${getBlockDisplayName(block.title)} — Sidebar shell with breadcrumbs`}
    description="A responsive frame for your application, with a collapsible sidebar, grouped navigation, nested links and an account menu. Add your pages beneath the breadcrumb header and connect your own routing and user actions."
    descriptionLink={
      <a class="blocks-shell-header-about" href="#application-shell-about">
        About this block
      </a>
    }
  />
);
