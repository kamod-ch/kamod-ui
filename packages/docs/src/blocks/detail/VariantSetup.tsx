/** Copy paths and working local imports for the self-contained page examples. */
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { PathDisplay } from "../../docs/components/PathDisplay";
import { getBlockOverviewDetails } from "../block-overview-details";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { AuthUsage } from "./AuthUsage";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { DependencyCommands } from "./DependencyCommands";
import { SidebarInstallation } from "./SidebarInstallation";
import { SidebarUsage } from "./SidebarUsage";
import type { VariantGuide } from "./VariantDocumentation";
import { variantImport } from "./variant-examples";

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
                and copy the files below relative to <PathDisplay path={"src/components/blocks"} />.
                Keep the source folder structure so relative imports resolve. These are destination
                paths; the Code tab’s display labels such as{" "}
                <PathDisplay path={`app/${category}/page.tsx`} /> are not the installation paths.
                The examples below assume your importing file is{" "}
                <PathDisplay path={"src/App.tsx"} />.
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
            The <PathDisplay path={block.installCommand} /> path identifies source in this
            repository; the blocks package is private. Use the local import above rather than trying
            to install that path as a published package.
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
  if (guide.category === "sidebar") return <SidebarUsage guide={guide} />;
  return <AuthUsage guide={guide} />;
}
