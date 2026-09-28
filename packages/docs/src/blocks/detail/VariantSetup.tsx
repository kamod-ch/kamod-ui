/** Copy paths and working local imports for the self-contained page examples. */
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { getBlockOverviewDetails } from "../block-overview-details";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { DependencyCommands } from "./DependencyCommands";
import { SidebarInstallation } from "./SidebarInstallation";
import type { VariantGuide } from "./VariantDocumentation";
import { integrationExample, variantImport } from "./variant-examples";

export function VariantSetup({ guide }: { guide: VariantGuide }) {
  const { block, category, anchor, files } = guide;
  const sidebar = category === "sidebar";
  const details = getBlockOverviewDetails(category, block);
  return (
    <BlockDocSection
      id={anchor("installation")}
      introduction={
        <p>
          {sidebar ? "Download" : "Copy"} this variant into your Preact project, install the
          dependencies you are missing and connect your own{" "}
          {sidebar ? "navigation and page content" : "authentication service"}. The source stays
          local, so you can change its layout without introducing another application framework.
        </p>
      }
    >
      <ol class="blocks-doc-steps" role="list">
        <li>
          <BlockGuideHeading id={anchor("copy")} />
          {sidebar ? (
            <SidebarInstallation guide={guide} />
          ) : (
            <>
              <p>
                <ShowcaseCodeLink blockId={block.id}>Open the showcase’s Code tab</ShowcaseCodeLink>{" "}
                and copy the files below relative to <code>src/components/blocks</code>. Keep the
                source folder structure so relative imports resolve. These are destination paths;
                the Code tab’s display labels such as <code>app/{category}/page.tsx</code> are not
                the installation paths. The examples below assume your importing file is{" "}
                <code>src/App.tsx</code>.
              </p>
              <CodeBlock
                code={files.map((file) => file.path.replace(/^src\//, "")).join("\n")}
                language="text"
              />
              <p class="blocks-doc-note">
                Forms use shared validation and provider helpers. Branded and illustrated layouts
                also need their listed SVGs and URL helpers. Keep <code>?url</code> imports in a
                Vite app, or adapt them to your bundler. If TypeScript cannot resolve an SVG import,
                include Vite’s client types (for example, <code>import "vite/client"</code> in an
                existing declaration file). Keep the repository’s license with your copied source.
              </p>
            </>
          )}
        </li>
        <li>
          <BlockGuideHeading id={anchor("dependencies")} />
          <p>
            Install only what your app does not already have. Preact renders the block, Kamod UI
            provides its interactive components, and Icons supplies its icons. Themes and Signals
            support the shared Kamod setup.
          </p>
          <DependencyCommands dependencies={details.dependencies} />
        </li>
        <li>
          <BlockGuideHeading id={anchor("styles")} />
          <p>
            Follow the{" "}
            <a class="underline" href={withBasePath("/docs/theming/css-setup")}>
              theme and Tailwind setup
            </a>
            . Import your global stylesheet and make sure Tailwind scans the copied source and Kamod
            components. Keep your existing setup if the app already uses Kamod.
          </p>
          <CodeBlock code={variantImport(guide)} language="tsx" />
          <p class="blocks-doc-note">
            The <code>{block.installCommand}</code> path identifies source in this repository; the
            blocks package is private. Use the local import above rather than trying to install that
            path as a published package.
          </p>
          <p class="blocks-doc-note">
            <strong>Check the first render:</strong> the {sidebar ? "sidebar" : "form controls"},
            borders and page background should follow your app’s theme. If the layout appears
            unstyled, check the global CSS import and Tailwind source detection before changing the
            block’s classes. If an import fails, first compare your folder paths with the copy list;
            renaming only one file can break its relative imports.
          </p>
        </li>
      </ol>
    </BlockDocSection>
  );
}

export function VariantUsage({ guide }: { guide: VariantGuide }) {
  const { anchor, component, category } = guide;
  return (
    <BlockDocSection
      id={anchor("usage")}
      introduction={
        <p>
          Render <code>{`<${component} />`}</code> to reproduce this complete page. That exported
          wrapper takes <strong>no props</strong>. To integrate application data, edit your copied
          page or compose its local helpers directly as shown below.
        </p>
      }
    >
      <CodeBlock
        code={`${variantImport(guide)}\n\nexport const App = () => <${component} />;`}
        language="tsx"
      />
      <p>
        {category === "sidebar" ? (
          <>
            Your copied <code>{guide.block.id}.tsx</code> contains the complete composition. Replace
            its placeholder content and edit the supplied demo data first. The example below shows
            one integration point in this variant; keep the remaining composition around it to
            preserve the preview layout.
          </>
        ) : (
          <>
            The form accepts callbacks; the page wrapper does not forward them. Render the form
            below inside your own layout, or pass the same props to the form in your copied{" "}
            <code>page.tsx</code> to keep this variant’s layout.
          </>
        )}
      </p>
      <CodeBlock code={integrationExample(guide)} language="tsx" />
      <p class="blocks-doc-note">
        {category === "sidebar" ? (
          <>
            Keep the sidebar and its trigger inside the same <code>SidebarProvider</code>. Preserve
            the existing main landmark instead of nesting another <code>main</code>. Placeholder{" "}
            <code>#</code> links stay inert; real URLs navigate normally. Set current-page styling
            from your router and connect search, form and action controls separately.
          </>
        ) : (
          <>
            Supplying <code>onSubmit</code> connects your service but does not remove the demo
            delay, the deliberate rejection of emails containing <code>error</code>, or the demo
            success messages. Replace these in the copied form before production use. Provider
            buttons also need your social callback.
          </>
        )}
      </p>
    </BlockDocSection>
  );
}
