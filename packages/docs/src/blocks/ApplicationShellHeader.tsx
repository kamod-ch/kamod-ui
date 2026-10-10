/**
 * Variant-specific introductions composed within the shared block-page header.
 */

import type { ApplicationShellBlock } from "./application-shell-config";
import { BlockDetailHeader } from "./BlockDetailHeader";
import { getBlockDisplayName } from "./block-overview-details";
import { type ShellVariantId, shellVariantGuides } from "./detail/application-shell-profiles";

/** Retain the shell's detailed introduction, overview anchor and About destination. */
export const ShellPageHeader = ({ block }: { block: ApplicationShellBlock }) => {
  const profile = shellVariantGuides[block.id as ShellVariantId];
  return (
    <BlockDetailHeader
      category="application-shell"
      block={block}
      className="blocks-shell-header"
      title={`${getBlockDisplayName(block.title)} — ${profile?.name ?? "Sidebar shell with breadcrumbs"}`}
      description={
        profile ? (
          <>
            {profile.purpose} Supply <code>navigationGroups</code> and <code>breadcrumbs</code>,
            then render your pages through <code>children</code>.{" "}
            <strong>Routing and Account Actions Stay in Your App.</strong> Explore the working
            preview, copy the complete source bundle and follow the integration guide below.
          </>
        ) : (
          <>
            A <strong>Responsive Frame for Your Application</strong>, with a collapsible sidebar,
            grouped navigation, nested links and an account menu. Supply{" "}
            <code>navigationGroups</code> and <code>breadcrumbs</code>, then render your pages
            through <code>children</code> beneath the shared header.{" "}
            <strong>Routing and Account Actions Stay in Your App</strong>. Explore desktop collapse
            and the separate mobile navigation in the demo; the examples below explain how to
            connect your data and control the sidebar.
          </>
        )
      }
      descriptionLink={
        <a class="blocks-shell-header-about" href="#application-shell-about">
          More about this block.
        </a>
      }
    />
  );
};
