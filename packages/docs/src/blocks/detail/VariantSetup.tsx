/** Copy paths and working local imports for the self-contained page examples. */
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { getBlockOverviewDetails } from "../block-overview-details";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { DependencyCommands } from "./DependencyCommands";
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
          Copy this variant into your Preact project, install the dependencies you are missing and
          connect your own {sidebar ? "navigation and page content" : "authentication service"}. The
          source stays local, so you can change its layout without introducing another application
          framework.
        </p>
      }
    >
      <ol class="blocks-doc-steps" role="list">
        <li>
          <BlockGuideHeading id={anchor("copy")} />
          <p>
            Open the showcase’s <strong>Code</strong> tab and copy the files below. Use these source
            paths relative to <code>src/components/blocks</code>, keeping the folder structure so
            the existing relative imports resolve. The Code tab’s labels are display names; they are
            not replacement import paths.
          </p>
          <CodeBlock
            code={files.map((file) => file.path.replace(/^src\//, "")).join("\n")}
            language="text"
          />
          <p class="blocks-doc-note">
            {sidebar ? (
              <>
                The page selects its configuration from <code>sidebar-data.ts</code>. Its shared
                renderer imports the other sidebar compositions too, so keep the listed support
                files together even when copying a single variant.
              </>
            ) : (
              <>
                The form imports shared validation and provider helpers. Branded and illustrated
                layouts also need their listed SVGs and URL helpers. Keep the <code>?url</code>{" "}
                asset imports in a Vite app, or adapt them to your bundler’s asset handling.
              </>
            )}
          </p>
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
            This minimal composition illustrates the shared helpers, rather than reproducing every
            specialized part of this variant. To retain the exact preview layout, replace the
            placeholder content in its selected composition inside{" "}
            <code>SidebarBlockShell.tsx</code>.
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
            Keep the sidebar and its trigger inside the same <code>SidebarProvider</code>.{" "}
            <code>DashboardShell</code> renders the page’s main landmark; avoid nesting another{" "}
            <code>main</code> inside it. Replace sample links and their click handlers before
            connecting your router.
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
