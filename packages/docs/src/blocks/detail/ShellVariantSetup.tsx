import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { InlineCodeLink } from "../../docs/components/InlineCodeLink";
import { PathDisplay } from "../../docs/components/PathDisplay";
import type { ApplicationShellBlock } from "../application-shell-config";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { type ShellVariantId } from "./application-shell-profiles";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { DependencyCommands } from "./DependencyCommands";

/** Setup guidance shared by the data-driven application shell variants. */
export function ShellVariantSetup({ block }: { block: ApplicationShellBlock }) {
  const id = block.id as ShellVariantId;
  const number = id.split("-").at(-1);
  return (
    <BlockDocSection
      id="application-shell-installation"
      introduction={
        <p>
          <strong>Copy the Complete Composition.</strong> This block is editable Preact source. Its
          variant entrypoint chooses the layout; shared helpers own the responsive frame and the
          established navigation behavior.
        </p>
      }
    >
      <BlockGuideHeading id="application-shell-copy" />
      <p>
        Copy all files from the <ShowcaseCodeLink blockId={id}>Code tab</ShowcaseCodeLink> into{" "}
        <PathDisplay path="src/components/application-shell" />, preserving the displayed folders.
        The <code>{id}</code> folder, <code>shared</code> folder and the{" "}
        <code>application-shell-1</code> navigation helpers form one source bundle. The helpers do
        not require mounting Shell 1.
      </p>
      <p>
        For production, omit <code>{id}/preview.tsx</code>, <code>shared/preview.tsx</code>,{" "}
        <code>shared/preview-data.ts</code> and the demo logo at{" "}
        <code>application-shell-1/assets/kamod-ui-logo.svg</code>. Keep the remaining files and the
        repository’s{" "}
        <a href="https://github.com/kamod-ch/kamod-ui/blob/main/LICENSE.md">License Notice</a>. The
        blocks package is private: copy the source instead of attempting to install{" "}
        <code>{block.installCommand}</code> from npm. If you already copied another new shell, reuse
        matching shared helpers and review local changes before replacing them.
      </p>
      <BlockGuideHeading id="application-shell-dependencies" />
      <p>
        Install only missing dependencies in the application workspace. The menu adapters require
        Kamod’s <code>useDropdown</code>, portaled <code>DropdownContent</code> and{" "}
        <code>createRovingFocus</code> export from <code>@kamod-ch/ui/lib/interactive</code>. Verify
        those APIs in your installed UI release.
      </p>
      <DependencyCommands
        dependencies={[
          "@kamod-ch/ui",
          "@kamod-ch/icons",
          "@kamod-ch/themes",
          "preact",
          "@preact/signals",
        ]}
      />
      <BlockGuideHeading id="application-shell-styles" />
      <p>
        Use the project’s existing{" "}
        <InlineCodeLink href="/docs/theming/css-setup">Tailwind CSS</InlineCodeLink> setup. Import
        the theme once, ensure Tailwind scans copied files and the installed UI package, then verify
        a focused control and a sidebar surface in both color modes. The public entrypoint contains
        no preview data.
      </p>
      <CodeBlock
        language="css"
        filePath="src/styles.css"
        code={
          '@import "tailwindcss";\n@import "@kamod-ch/themes/theme.css";\n\n/* Add the UI source path documented for your project’s layout. */'
        }
      />
      <CodeBlock
        language="tsx"
        filePath="src/App.tsx"
        code={`import { ApplicationShell${number} } from "./components/application-shell/${id}";`}
      />
      <p>
        Continue with <a href="#application-shell-usage">Render and Connect the Shell</a>. If the
        first render is unstyled, follow{" "}
        <a href={withBasePath("/docs/theming/css-setup#make-source-detection-explicit")}>
          Source Discovery
        </a>{" "}
        before adding local color overrides.
      </p>
    </BlockDocSection>
  );
}
