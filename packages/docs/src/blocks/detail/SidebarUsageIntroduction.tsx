/** Explain the editable composition before introducing the individual integration steps. */
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
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
  const { anchor, block, component } = guide;
  const contentExample = hasDashboard
    ? `// Inside ${block.id}.tsx; keep existing shell props.
<DashboardShell>
  <div class="p-4">Your page content</div>
</DashboardShell>`
    : `// Replace the placeholder panels in ${block.id}.tsx.
<section class="p-4" aria-labelledby="page-title">
  <h1 id="page-title">${block.id === "sidebar-13" ? "Account settings" : "Projects"}</h1>
</section>`;

  return (
    <section class="blocks-sidebar-usage-model" aria-labelledby={anchor("usage-model")}>
      <BlockGuideHeading id={anchor("usage-model")} />
      <p>
        Think of this block as an <strong>editable starting layout</strong>. Rendering{" "}
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
      <dl class="blocks-doc-callouts">
        <div>
          <dt>The file you render owns the composition</dt>
          <dd>
            Open{" "}
            <ShowcaseCodeLink blockId={block.id} file={`${block.id}.tsx`}>
              <code>{block.id}.tsx</code>
            </ShowcaseCodeLink>{" "}
            to see how the pieces fit together. Keep its provider and layout structure while
            replacing the parts you need. The <code>{component}</code> wrapper is your local page;
            the core <code>Sidebar</code> inside it is a configurable UI component.
          </dd>
        </div>
        <div>
          <dt>Data and helper props still do the work</dt>
          <dd>
            The no-props entrypoint does not remove the inner components’ APIs. Your copied file
            passes data and options to the helpers it uses. Update the sample values in{" "}
            <code>data/</code> or pass application values at those call sites. Follow{" "}
            <a href={`#${anchor("customize")}`}>Adapt the local composition</a> for this variant’s
            example and <a href={`#${anchor("prop-reference")}`}>Local props and data</a> for the
            supported inputs.
          </dd>
        </div>
        <div>
          <dt>Your content goes into the existing page area</dt>
          <dd>
            {hasDashboard ? (
              <>
                This variant uses <code>DashboardShell</code>. Its <code>children</code> replace the
                placeholder panels while retaining the surrounding shell.
              </>
            ) : (
              <>
                Replace the placeholder panels inside the existing{" "}
                <code>{block.id === "sidebar-13" ? "main" : "SidebarInset"}</code>. Retain the
                surrounding header and navigation.
              </>
            )}{" "}
            Your router decides which page to show; the block does not choose routes or fetch your
            application data. See <a href={`#${anchor("connect-app")}`}>Connect your application</a>
            .
          </dd>
        </div>
      </dl>
      <p>
        <strong>A small content change looks like this.</strong> This is an excerpt to edit inside
        your copied file, keeping the rest of its JSX in place. It is not a replacement for the
        whole block or a new prop on <code>{component}</code>.
      </p>
      <CodeBlock code={contentExample} language="tsx" />
      <p class="blocks-doc-note">
        <strong>You can introduce your own props later.</strong> If multiple routes need the same
        layout, add a typed <code>children</code> prop or navigation inputs to your local{" "}
        <code>{component}</code>, then explicitly forward them to the relevant helpers. The
        downloaded wrapper does not do that automatically. Start by rendering the original below,
        then make the local edits one step at a time.
      </p>
    </section>
  );
}
