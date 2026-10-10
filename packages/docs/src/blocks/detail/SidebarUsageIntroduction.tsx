import { InfoIcon } from "@kamod-ch/icons/lucide";
/** Explain the editable composition before introducing the individual integration steps. */
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { DocsCallout } from "../../docs/components/DocsCallout";
import { InlineCode, PathDisplay } from "../../docs/components/PathDisplay";
import { BlockHeadingLink } from "../BlockHeadingLink";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { BlockGuideHeading } from "./BlockDocumentation";
import type { VariantGuide } from "./VariantDocumentation";

export function SidebarUsageIntroduction({
  guide,
  hasDashboard,
}: {
  guide: VariantGuide;
  hasDashboard: boolean;
}) {
  const { anchor, block, component, files } = guide;
  const dataFile = files.find((file) => file.label.startsWith("data/"));
  const pageTitle = block.id === "sidebar-13" ? "Account settings" : "Projects";
  const contentExample = hasDashboard
    ? `// Inside ${block.id}.tsx; keep existing shell props.
<DashboardShell>
  <section class="space-y-2 p-4" aria-labelledby="page-title">
    <h1 id="page-title">${pageTitle}</h1>
    <p class="text-muted-foreground">Choose a project to open its workspace.</p>
  </section>
</DashboardShell>`
    : `// Replace the placeholder panels in ${block.id}.tsx.
<section class="space-y-2 p-4" aria-labelledby="page-title">
  <h1 id="page-title">${pageTitle}</h1>
  <p class="text-muted-foreground">${block.id === "sidebar-13" ? "Manage your profile and preferences." : "Choose a project to open its workspace."}</p>
</section>`;

  return (
    <section class="blocks-sidebar-usage-model" aria-labelledby={anchor("usage-model")}>
      <BlockGuideHeading id={anchor("usage-model")} />
      <p>
        Think of this block as an <strong>Editable Starting Layout</strong>. Rendering{" "}
        <code>{`<${component} />`}</code> runs the JSX already written in your copied file: its
        sidebar, header, sample data and placeholder content. The supplied wrapper does not read
        navigation props or <code>children</code>, so your own content needs to be connected inside
        that composition first.
      </p>
      <p>
        A block such as{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-1#application-shell-usage",
          )}
        >
          Application Shell 1
        </a>{" "}
        exposes a defined API for <code>navigationGroups</code>, <code>breadcrumbs</code> and{" "}
        <code>children</code>. These sidebar variants instead expose their arrangement as source you
        can edit. That lets a documentation sidebar, a two-pane layout and a settings dialog each
        keep their own structure without fitting every difference into one configuration object. You
        get direct control over the layout, with the responsibility of wiring it to your app.
      </p>
      <section class="blocks-sidebar-model-section" aria-labelledby={anchor("composition-file")}>
        <h4 id={anchor("composition-file")} tabIndex={-1}>
          <BlockHeadingLink id={anchor("composition-file")}>
            Start with the Composition File
          </BlockHeadingLink>
        </h4>
        <p>
          The <InlineCode>{component}</InlineCode> wrapper is your local page: it arranges the
          sidebar, header and content area. The core <InlineCode>Sidebar</InlineCode> inside it
          remains a configurable UI component. Edit that arrangement in the entry file, keeping the
          existing provider and layout structure around the pieces you replace.
        </p>
        <p>
          <strong>Keep the Provider and Its Controls Together.</strong> The trigger and navigation
          share sidebar state through their existing provider. Start with a small visible edit, such
          as a heading or label, then check the desktop toggle and mobile navigation before moving
          structural elements.
        </p>
        <div class="blocks-sidebar-model-links">
          <span>
            Entry Point <span aria-hidden="true">·</span>
            <ShowcaseCodeLink blockId={block.id} file={`${block.id}.tsx`}>
              <code>{block.id}.tsx</code>
            </ShowcaseCodeLink>
          </span>
          <a href={`#${anchor("responsive")}`}>Review Responsive Behavior</a>
        </div>
      </section>

      <section class="blocks-sidebar-model-section" aria-labelledby={anchor("composition-data")}>
        <h4 id={anchor("composition-data")} tabIndex={-1}>
          <BlockHeadingLink id={anchor("composition-data")}>
            Pass Data to the Local Helpers
          </BlockHeadingLink>
        </h4>
        <p>
          The no-props entrypoint does not remove the inner components’ APIs. Your copied file
          passes data and options to its helpers. Replace the sample values in{" "}
          <PathDisplay path="data/" /> or pass application values at those call sites. Follow{" "}
          <a href={`#${anchor("customize")}`}>Adapt the Local Composition</a> for this variant’s
          example.
        </p>
        <p>
          <strong>Keep the Data Shape, Replace the Demo Values.</strong> Check the helper’s required
          fields before changing the records it receives. A new label changes what people read; a
          destination changes where they go. Neither automatically connects active styling to your
          router or turns a placeholder action into application behavior.
        </p>
        <div class="blocks-sidebar-model-links">
          {dataFile && (
            <span>
              Sample Data <span aria-hidden="true">·</span>
              <ShowcaseCodeLink blockId={block.id} file={dataFile.label}>
                <PathDisplay path={dataFile.label} />
              </ShowcaseCodeLink>
            </span>
          )}
          <a href={`#${anchor("prop-reference")}`}>Check Local Props and Data</a>
        </div>
      </section>

      <section class="blocks-sidebar-model-section" aria-labelledby={anchor("composition-content")}>
        <h4 id={anchor("composition-content")} tabIndex={-1}>
          <BlockHeadingLink id={anchor("composition-content")}>
            Replace the Page Content
          </BlockHeadingLink>
        </h4>
        <p>
          {hasDashboard ? (
            <>
              This variant uses <code>DashboardShell</code>. Its <code>children</code> replace the
              placeholder panels while retaining the surrounding shell. Add your own content spacing
              when supplying children.
            </>
          ) : (
            <>
              Replace the placeholder panels inside the existing{" "}
              <code>{block.id === "sidebar-13" ? "main" : "SidebarInset"}</code>. Retain the
              surrounding header and navigation.
            </>
          )}{" "}
          Your router decides which page to show; the block does not choose routes or fetch
          application data.
        </p>
        <p>
          <strong>Edit Inside the Existing Layout.</strong> This excerpt replaces only the content
          area in your copied file. Keep the shell’s current props and main landmark; use a{" "}
          <code>section</code> for the new content instead of adding a second <code>main</code>.
        </p>
        <CodeBlock
          code={contentExample}
          language="tsx"
          filePath={`src/components/blocks/${block.id}/${block.id}.tsx`}
        />
        <div class="blocks-sidebar-model-links">
          <span>
            Next <span aria-hidden="true">·</span> Connect routes and application state
          </span>
          <a href={`#${anchor("connect-app")}`}>Connect Your Application</a>
        </div>
      </section>
      <DocsCallout
        class="docs-callout-spaced"
        title="You Can Introduce Your Own Props Later"
        icon={<InfoIcon />}
      >
        <p>
          If multiple routes need the same layout, add a typed <code>children</code> prop or
          navigation inputs to your local <InlineCode>{component}</InlineCode>, then explicitly
          forward them to the relevant helpers. The downloaded wrapper does not do that
          automatically. Start by rendering the original below, then make the local edits one step
          at a time.
        </p>
      </DocsCallout>
    </section>
  );
}
