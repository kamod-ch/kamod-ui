/** @file Guided props and data reference, backed by the block's checked-in types.ts. */
import { CodeIcon } from "@kamod-ch/icons/lucide";
import { Badge } from "@kamod-ch/ui";
import {
  ShellCallbacks,
  ShellNavigationData,
  ShellSidebarState,
} from "./ApplicationShellIntegration";
import {
  type ShellTypeDefinitions,
  useShellTypeDefinitions,
} from "./ApplicationShellTypeDefinition";
import { dataTypes, propDescriptions } from "./application-shell-api-data";
import { applicationShellPropFields } from "./application-shell-type-source";
import { RequiredIndicator } from "./RequiredIndicator";
import { ShellHeadingLink } from "./ShellHeadingLink";

/** Complete prop coverage with links to individual type definitions. */
const ShellComponentProps = ({ renderTypeLink, renderDefinition }: ShellTypeDefinitions) => (
  <section class="blocks-api-section" aria-labelledby="application-shell-prop-reference">
    <h3 id="application-shell-prop-reference" tabIndex={-1}>
      <ShellHeadingLink id="application-shell-prop-reference">Component props</ShellHeadingLink>
    </h3>
    <p>
      Each row lists a prop accepted by <code>ApplicationShell1</code>, its TypeScript type and how
      it affects the shell. Follow a linked type to open its full definition, including individual
      fields and their documentation. Optional props let you supply page content, connect navigation
      and account actions, control desktop expansion or adjust wrapper styling.
    </p>
    {/* Core Tooltip renders a div; an ARIA paragraph keeps the inline example valid in SSR. */}
    <div role="paragraph">
      The red asterisk{" "}
      <RequiredIndicator label="Required prop indicator" tooltip="Required component prop" /> marks
      the four required props: <code>brand</code>, <code>navigationGroups</code>, <code>user</code>{" "}
      and <code>breadcrumbs</code>. Supply all four when using the block; the two array props may be
      empty. Props without this marker are optional. Hover, focus or tap the icon to see its label.
    </div>
    <div
      class="blocks-doc-table blocks-api-props-table"
      role="region"
      aria-labelledby="application-shell-prop-reference"
      tabIndex={0}
    >
      <table>
        <caption class="sr-only">
          ApplicationShell1 props, types and descriptions; required props are marked
        </caption>
        <thead>
          <tr>
            <th scope="col">Prop / type</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {applicationShellPropFields.map((row) => (
            <tr key={row.name}>
              <th scope="row">
                <div class="blocks-api-prop-label">
                  <code>{row.name}</code>
                  {row.required && <RequiredIndicator label={`Required prop: ${row.name}`} />}
                </div>
                <span class="blocks-api-prop-type">
                  {row.definition ? renderTypeLink(row.definition, row.type) : row.type}
                </span>
              </th>
              <td>
                {propDescriptions[row.name]}
                {row.name === "navigationGroups" && (
                  <>
                    {" "}
                    See <a href="#application-shell-navigation-data">Type your navigation data</a>.
                  </>
                )}
                {row.name === "open" && (
                  <>
                    {" "}
                    See <a href="#application-shell-state">Sidebar state</a>.
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p class="blocks-doc-note">
      <strong>Wrapper styling:</strong> <code>class</code> and <code>className</code> target the
      shell's outer wrapper. Arbitrary HTML attributes and other provider options are not forwarded.
      The shell already renders <code>main</code>; do not add another one inside it.
    </p>
    {renderDefinition({
      name: "ApplicationShell1Props",
      title: "Complete component signature",
      description: "All required and optional inputs in one copyable declaration.",
    })}
  </section>
);

/** Data-shape reading guides alongside expandable, copyable definitions. */
const ShellDataTypes = ({ renderDefinition }: Pick<ShellTypeDefinitions, "renderDefinition">) => (
  <section class="blocks-api-section" aria-labelledby="application-shell-data-types">
    <h3 id="application-shell-data-types" tabIndex={-1}>
      <ShellHeadingLink id="application-shell-data-types">Data type reference</ShellHeadingLink>
    </h3>
    <p>
      Open a definition to inspect its exact fields, optional markers and original JSDoc. Multiple
      definitions can stay open for comparison. Types joined with <code>&amp;</code> inherit the
      fields of the referenced type. The asterisk identifies each shape's required fields, including
      inherited ones.
    </p>
    <div role="paragraph">
      <strong>Required type</strong>{" "}
      <RequiredIndicator label="Required type indicator" tooltip="Required type" /> marks a type
      used directly by a required shell prop. The prop must be supplied;{" "}
      <code>navigationGroups</code> and <code>breadcrumbs</code> may still be empty arrays.
    </div>
    <p>
      <code>ComponentChildren</code>, <code>ComponentType</code> and <code>JSX</code> in these
      definitions are Preact types. The copied <code>types.ts</code> already imports them.
    </p>
    <div class="blocks-api-types">{dataTypes.map(renderDefinition)}</div>
    <p class="blocks-doc-note">
      <strong>Branch selection:</strong> an active child also highlights its parent branch, even
      when the parent's own <code>active</code> is false. An active branch starts expanded; later
      path changes update highlighting without resetting its disclosure while mounted. In desktop
      icon mode, the branch becomes a dropdown containing its destinations.
    </p>
  </section>
);

/** API overview, source definitions and consumer integration, in reading order. */
export const ShellProps = () => {
  const definitions = useShellTypeDefinitions();
  return (
    <section class="blocks-doc-section blocks-api" aria-labelledby="application-shell-props">
      <header class="blocks-doc-section-header">
        <p class="blocks-doc-eyebrow">API reference</p>
        <h2 id="application-shell-props" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-props">Props and data</ShellHeadingLink>
        </h2>
        <p>
          Supply the identity, destinations and page content; the shell supplies the layout and
          controls. Start with the four required data props, then add callbacks or controlled
          desktop state as your app needs them. All ten public types are exported by your local{" "}
          <code>application-shell-1</code> entrypoint.
        </p>
        <div class="blocks-api-source-note">
          <CodeIcon
            size={18}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          <span>
            Definitions and field comments below come directly from <code>types.ts</code>, keeping
            the reference aligned with the block's public API. Explore the{" "}
            <a href="#application-shell-data-types">Data type reference</a> for complete data
            shapes, required and optional fields, and practical notes on how each type is used.
          </span>
          <Badge variant="secondary" size="sm">
            TypeScript
          </Badge>
        </div>
      </header>

      <ShellComponentProps {...definitions} />
      <ShellNavigationData renderTypeLink={definitions.renderTypeLink} />
      <ShellDataTypes renderDefinition={definitions.renderDefinition} />
      <ShellCallbacks renderDefinition={definitions.renderDefinition} />
      <ShellSidebarState />
    </section>
  );
};
