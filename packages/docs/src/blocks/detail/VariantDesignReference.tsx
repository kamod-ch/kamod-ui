import { ExternalLinkIcon } from "@kamod-ch/icons/lucide";
import type { LoginBlockId, SignupBlockId } from "../../../../blocks/src/auth/types";
import { BlockHeadingLink } from "../BlockHeadingLink";
import { authDesignReferences } from "./auth-design-references";
import { BlockDocSection } from "./BlockDocumentation";
import type { VariantGuide } from "./VariantDocumentation";

/** Credits the matching shadcn/ui layout while explaining the local implementation. */
export function VariantDesignReference({ guide }: { guide: VariantGuide }) {
  const { block, category, anchor, sidebar } = guide;
  const auth =
    category === "sidebar"
      ? undefined
      : authDesignReferences[block.id as LoginBlockId | SignupBlockId];
  const referenceUrl = `https://ui.shadcn.com/blocks/${category}#${block.id}`;
  const sourceUrl = `https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/new-york-v4/blocks/${block.id}`;

  return (
    <BlockDocSection
      id={anchor("reference")}
      className="blocks-doc-reference"
      introduction={
        <p>
          This variant follows the corresponding {category} design in the shadcn/ui collection. Use
          the reference to compare {sidebar?.referenceFocus ?? auth?.focus}.{" "}
          {sidebar ? (
            <>
              When adapting the Kamod version, start with your navigation hierarchy and page
              content, then follow the{" "}
              <a class="underline" href={`#${anchor("customize")}`}>
                local composition example
              </a>{" "}
              to connect the layout to your app.
            </>
          ) : (
            <>
              Adapt the branding, copy and destinations to your product, then follow the{" "}
              <a class="underline" href={`#${anchor("usage")}`}>
                usage example
              </a>{" "}
              to connect the form’s callbacks to your authentication service.
            </>
          )}
        </p>
      }
    >
      <div class="blocks-doc-attribution">
        <div class="blocks-doc-attribution-header">
          <p class="blocks-doc-attribution-title">
            <BlockHeadingLink id={anchor("reference")}>Attribution:</BlockHeadingLink>{" "}
            <a
              class="blocks-doc-attribution-source"
              href={referenceUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              shadcn/ui {block.id}
              <span class="blocks-doc-attribution-icon" aria-hidden="true">
                <ExternalLinkIcon size={16} strokeWidth={2} />
              </span>
            </a>
            .
          </p>
        </div>
        <p>
          {sidebar ? (
            <>
              Kamod expresses this layout with Preact components, its own sidebar behavior and
              semantic theme tokens. The copied variant keeps its composition, helpers and demo data
              together; your application supplies real destinations, content and actions.
            </>
          ) : (
            <>
              This version uses Kamod’s Preact form components and theme tokens. {auth?.adaptation}
            </>
          )}
          {block.id === "sidebar-10" && (
            <>
              {" "}
              The original reference is cataloged as a sidebar in a popover. Kamod’s current version
              instead uses an icon-collapsible sidebar with favorites and action menus; it does not
              place the entire sidebar in a popover.
            </>
          )}
        </p>
        <p class="blocks-doc-attribution-note">
          Inspect the{" "}
          <a href={sourceUrl} target="_blank" rel="noreferrer noopener">
            original variant’s source
          </a>{" "}
          for the reference composition. The <a href={`#${anchor("behavior")}`}>variant details</a>{" "}
          above describe this implementation’s behavior and integration boundaries.
        </p>
      </div>
      <p class="blocks-doc-reference-note">
        Use the original as a design reference. To install the Preact version shown here, follow{" "}
        <a class="underline" href={`#${anchor("installation")}`}>
          Add this block
        </a>{" "}
        and use this page’s {sidebar ? "download or Code tab" : "Code tab"}. Its files and imports
        are prepared for Kamod.
      </p>
    </BlockDocSection>
  );
}
