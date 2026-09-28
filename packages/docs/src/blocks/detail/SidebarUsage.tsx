/** Practical integration steps tailored to the files included with each sidebar. */
import { CodeBlock } from "../../docs/components/CodeBlock";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { SidebarUsageIntroduction } from "./SidebarUsageIntroduction";
import type { VariantGuide } from "./VariantDocumentation";
import { integrationExample, sidebarPageContentExample, variantImport } from "./variant-examples";

export function SidebarUsage({ guide }: { guide: VariantGuide }) {
  const { anchor, block, component, files } = guide;
  const hasDashboard = files.some((file) => file.label === "components/dashboard-shell.tsx");
  const hasNavigationExample = files.some((file) =>
    [
      "components/nav-main.tsx",
      "components/nav-docs.tsx",
      "components/nav-main-dropdowns.tsx",
    ].includes(file.label),
  );
  const isSettingsDialog = block.id === "sidebar-13";

  return (
    <BlockDocSection
      id={anchor("usage")}
      className="blocks-doc-usage"
      introduction={
        <p>
          Start with the complete preview composition, then adapt its local source to your app. The
          exported <code>{component}</code> takes <strong>no props</strong>; navigation, content and
          behavior are configured inside your copied files.
        </p>
      }
    >
      <SidebarUsageIntroduction guide={guide} hasDashboard={hasDashboard} />
      <section aria-labelledby={anchor("render")}>
        <BlockGuideHeading id={anchor("render")} />
        <p>
          Render the block once in your page or route layout. It already includes its own{" "}
          <code>SidebarProvider</code>, so you do not need another provider around this example.
          {isSettingsDialog && " This variant first shows a button that opens the settings dialog."}
        </p>
        <CodeBlock
          code={`${variantImport(guide)}\n\nexport const App = () => <${component} />;`}
          language="tsx"
        />
      </section>
      <section aria-labelledby={anchor("customize")}>
        <BlockGuideHeading id={anchor("customize")} />
        <p>
          Your copied <code>{block.id}.tsx</code> contains the complete composition. Start with its
          imports from <code>data/</code> to replace sample labels and destinations, then update the
          local components that consume them. The snippet below replaces one part of that file; keep
          the surrounding provider and layout in place.
        </p>
        <CodeBlock code={integrationExample(guide)} language="tsx" />
        <p class="blocks-doc-note">
          These are local edits, not props to pass to <code>{`<${component} />`}</code>. See{" "}
          <a href={`#${anchor("prop-reference")}`}>Local props and data</a> for the helpers this
          variant actually includes and their supported inputs.
        </p>
      </section>
      <section aria-labelledby={anchor("connect-app")}>
        <BlockGuideHeading id={anchor("connect-app")} />
        <p>
          {hasDashboard ? (
            <>
              Pass your page content as <code>children</code> to the existing{" "}
              <code>DashboardShell</code> to replace its placeholder content. Supply{" "}
              <code>breadcrumbs</code> from the current route, with the current page last. Custom
              children replace the demo’s padded content wrapper too, so add your own spacing.
            </>
          ) : isSettingsDialog ? (
            <>
              Replace the placeholder panels inside the dialog’s existing <code>main</code> with
              your settings form. Keep <code>DialogTitle</code> for its accessible name and connect
              the navigation buttons to the panel your app should display.
            </>
          ) : (
            <>
              Replace the placeholder panels inside the existing <code>SidebarInset</code> with your
              page content. Keep the surrounding header and trigger, and update the breadcrumb
              labels and links alongside your route. The inset already supplies the main landmark.
            </>
          )}
        </p>
        {hasDashboard && hasNavigationExample && (
          <CodeBlock code={sidebarPageContentExample(block.id)} language="tsx" />
        )}
        <ul class="blocks-doc-integration-notes">
          <li>
            <strong>{isSettingsDialog ? "Selection and actions." : "Routing and actions."}</strong>{" "}
            {isSettingsDialog ? (
              <>
                The first settings item is highlighted in the demo; derive that selection from your
                own state.
              </>
            ) : (
              <>
                Real URLs navigate normally; <code>#</code> links are placeholders. For client-side
                routing, adapt the local links to your router and derive active styling from its
                current route. Expanding a navigation group does not select a destination.
              </>
            )}{" "}
            Connect any search, account or form controls you keep to real application handlers.
          </li>
          {!isSettingsDialog && (
            <li>
              <strong>Close mobile navigation deliberately.</strong> The demo link helper only
              prevents <code>#</code> navigation. It does not close the mobile sheet after a
              client-side route change. In a helper rendered inside the existing provider, use{" "}
              <code>useSidebar()</code> and call <code>setOpenMobile(false)</code> after handling an
              ordinary destination click. Preserve modified clicks and avoid closing the sheet when
              a user only expands a branch.
            </li>
          )}
          <li>
            <strong>Preserve the layout.</strong> Keep the existing main landmark and keep sidebar
            controls inside their existing provider. Keep the composition mounted across page
            changes to retain its local UI state. Review this variant’s{" "}
            <a href={`#${anchor("responsive")}`}>responsive behavior</a> before moving controls;
            desktop and mobile navigation can differ. Follow the{" "}
            <a href={`#${anchor("production")}`}>production checklist</a> before shipping.
          </li>
        </ul>
      </section>
    </BlockDocSection>
  );
}
