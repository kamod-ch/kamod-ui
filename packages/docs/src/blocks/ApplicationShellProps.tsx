import { InfoIcon } from "@kamod-ch/icons/lucide";
import { BrandText } from "../docs/components/brand/BrandText";
import { DocsCallout } from "../docs/components/DocsCallout";
/** @file Guided props and data reference, backed by the block's checked-in types.ts. */

import { ApiSourceNote } from "../docs/components/ApiSourceNote";
import {
  ShellCallbacks,
  ShellNavigationData,
  ShellSidebarState,
} from "./ApplicationShellIntegration";
import {
  type ShellTypeDefinitions,
  useShellTypeDefinitions,
} from "./ApplicationShellTypeDefinition";
import { ApplicationShellWrapperNote } from "./ApplicationShellWrapperNote";
import { dataTypes, propDescriptions } from "./application-shell-api-data";
import { applicationShellPropFields } from "./application-shell-type-source";
import { BlockDocSection, BlockGuideHeading } from "./detail/BlockDocumentation";
import { BlockPropsTable } from "./detail/BlockPropsTable";
import { RequiredIndicator } from "./RequiredIndicator";

/** Complete prop coverage with links to individual type definitions. */
const ShellComponentProps = ({ renderTypeLink, renderDefinition }: ShellTypeDefinitions) => (
  <section class="blocks-api-section" aria-labelledby="application-shell-prop-reference">
    <BlockGuideHeading id="application-shell-prop-reference" />
    <p>
      <BrandText>
        Each row lists a prop accepted by <code>ApplicationShell1</code>, its TypeScript type and
        how it affects the shell. Follow a linked type to open its full definition, including
        individual fields and their documentation. Optional props let you supply page content,
        connect navigation and account actions, control desktop expansion or adjust wrapper styling.
      </BrandText>
    </p>
    {/* Core Tooltip renders a div; an ARIA paragraph keeps the inline example valid in SSR. */}
    <div role="paragraph">
      The red asterisk{" "}
      <RequiredIndicator label="Required Prop Indicator" tooltip="Required component prop" /> marks
      the four required props: <code>brand</code>, <code>navigationGroups</code>, <code>user</code>{" "}
      and <code>breadcrumbs</code>. Supply all four when using the block; the two array props may be
      empty. Props without this marker are optional. Hover, focus or tap the icon to see its label.
    </div>
    <BlockPropsTable
      labelledBy="application-shell-prop-reference"
      caption="ApplicationShell1 props, types and descriptions; required props are marked"
      rows={applicationShellPropFields.map((row) => ({
        key: row.name,
        name: row.name,
        required: row.required,
        type: row.definition ? renderTypeLink(row.definition, row.type) : row.type,
        description: (
          <>
            {propDescriptions[row.name]}
            {row.name === "navigationGroups" && (
              <>
                {" "}
                See <a href="#application-shell-navigation-data">Type Your Navigation Data</a>.
              </>
            )}
            {row.name === "open" && (
              <>
                {" "}
                See <a href="#application-shell-state">Sidebar State</a>.
              </>
            )}
          </>
        ),
      }))}
    />
    <ApplicationShellWrapperNote />
    {renderDefinition({
      name: "ApplicationShell1Props",
      title: "Complete Component Signature",
      description: "All required and optional inputs in one copyable declaration.",
    })}
  </section>
);

/** Data-shape reading guides alongside expandable, copyable definitions. */
const ShellDataTypes = ({ renderDefinition }: Pick<ShellTypeDefinitions, "renderDefinition">) => (
  <section class="blocks-api-section" aria-labelledby="application-shell-data-types">
    <BlockGuideHeading id="application-shell-data-types" />
    <p>
      Open a definition to inspect its exact fields, optional markers and original JSDoc. Multiple
      definitions can stay open for comparison. Types joined with <code>&amp;</code> inherit the
      fields of the referenced type. The asterisk identifies each shape's required fields, including
      inherited ones.
    </p>
    <div role="paragraph">
      <strong>Required Type</strong>{" "}
      <RequiredIndicator label="Required Type Indicator" tooltip="Required type" /> marks a type
      used directly by a required shell prop. The prop must be supplied;{" "}
      <code>navigationGroups</code> and <code>breadcrumbs</code> may still be empty arrays.
    </div>
    <p>
      <BrandText>
        <code>ComponentChildren</code>, <code>ComponentType</code> and <code>JSX</code> in these
        definitions are Preact types. The copied <code>types.ts</code> already imports them.
      </BrandText>
    </p>
    <div class="blocks-api-types">{dataTypes.map(renderDefinition)}</div>
    <DocsCallout class="docs-callout-spaced" title="Branch Selection" icon={<InfoIcon />}>
      <p>
        An active child makes the branch start expanded and highlights its icon-mode menu or
        URL-free disclosure trigger. A parent rendered as a separate link keeps its own active
        state; a child does not mark that parent link as the current page. Later path changes do not
        reset an already mounted disclosure. Switching to desktop icon mode replaces the disclosure
        with a dropdown; expanding the sidebar creates a new disclosure from the current active
        state.
      </p>
    </DocsCallout>
  </section>
);

/** API overview, source definitions and consumer integration, in reading order. */
export const ShellProps = () => {
  const definitions = useShellTypeDefinitions();
  return (
    <BlockDocSection
      id="application-shell-props"
      className="blocks-api"
      introduction={
        <>
          <p>
            Supply the identity, destinations and page content; the shell supplies the layout and
            controls. Start with the four required data props, then add callbacks or controlled
            desktop state as your app needs them. All ten public types are exported by your local{" "}
            <code>application-shell-1</code> entrypoint.
          </p>
          <ApiSourceNote>
            <strong>Definitions and field comments</strong> below come directly from{" "}
            <code>types.ts</code>, keeping the reference aligned with the block's public API.
            Explore the <a href="#application-shell-data-types">Data Type Reference</a> for complete
            data shapes, required and optional fields, and practical notes on how each type is used.
          </ApiSourceNote>
        </>
      }
    >
      <ShellComponentProps {...definitions} />
      <ShellNavigationData renderTypeLink={definitions.renderTypeLink} />
      <ShellDataTypes renderDefinition={definitions.renderDefinition} />
      <ShellCallbacks renderDefinition={definitions.renderDefinition} />
      <ShellSidebarState />
    </BlockDocSection>
  );
};
