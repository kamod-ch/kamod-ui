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
    description={
      <>
        A <strong>responsive frame for your application</strong>, with a collapsible sidebar,
        grouped navigation, nested links and an account menu. Supply <code>navigationGroups</code>{" "}
        and <code>breadcrumbs</code>, then render your pages through <code>children</code> beneath
        the shared header. <strong>Routing and account actions stay in your app</strong>. Explore
        desktop collapse and the separate mobile navigation in the demo; the examples below explain
        how to connect your data and control the sidebar.
      </>
    }
    descriptionLink={
      <a class="blocks-shell-header-about" href="#application-shell-about">
        About this block
      </a>
    }
  />
);
