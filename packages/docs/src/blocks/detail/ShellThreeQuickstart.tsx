/** A working-first installation experiment, intentionally limited to Application Shell 3. */
import { FolderDownIcon, InfoIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { DocsCallout } from "../../docs/components/DocsCallout";
import { InlineCode, PathDisplay } from "../../docs/components/PathDisplay";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { DependencyCommands } from "./DependencyCommands";

export const shellThreeStarter = `import { HouseIcon } from "@kamod-ch/icons/lucide";
import { ApplicationShell3 } from "./components/application-shell/application-shell-3";

export default function App() {
  return (
    <ApplicationShell3
      brand={{ name: "Kamod UI", description: "My workspace" }}
      navigationGroups={[{
        id: "workspace",
        items: [{ id: "home", label: "Home", href: "/", icon: HouseIcon }],
      }]}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: "Home" }]}
      currentPath="/"
    >
      <h1 class="text-2xl font-semibold">Your workspace is ready</h1>
      <p class="mt-2 text-muted-foreground">Build your first page here.</p>
    </ApplicationShell3>
  );
}`;

export function ShellThreeSetup() {
  return (
    <BlockDocSection
      id="application-shell-installation"
      introduction={
        <p>
          <>
            <strong>One download. One working screen.</strong> Start with an existing Preact app;
            the prepared folder includes the shell and every helper it needs. Add it to your
            project, check the two prerequisites below, then paste the example. You can customize it
            afterward.
          </>
        </p>
      }
    >
      <ol class="blocks-doc-steps" role="list">
        <li>
          <BlockGuideHeading id="application-shell-copy" />
          <p>
            Download and unzip the block. Move the extracted <code>application-shell</code> folder
            into <PathDisplay path="src/components" />. <strong>Keep the folder together</strong>;
            its internal imports are ready to use.
          </p>
          <div class="blocks-install-actions">
            <Button asChild variant="outline" size="sm">
              <a
                href={withBasePath("/blocks/downloads/application-shell-3.zip")}
                download="application-shell-3.zip"
              >
                <FolderDownIcon size={16} aria-hidden="true" />
                Download Shell 3
              </a>
            </Button>
            <span class="blocks-install-metadata">Source ZIP · helpers & license included</span>
          </div>
          <DocsCallout class="docs-callout-spaced" title="Check the location" icon={<InfoIcon />}>
            <p>
              <PathDisplay path="src/components/application-shell/application-shell-3/index.ts" />.
              The archive leaves out demo files, so there is nothing to clean up. If you already
              have an <code>application-shell</code> folder, compare its files before merging to
              keep your customizations. The{" "}
              <ShowcaseCodeLink blockId="application-shell-3">Code tab</ShowcaseCodeLink> remains
              available when you want to inspect the implementation.
            </p>
          </DocsCallout>
        </li>
        <li>
          <BlockGuideHeading id="application-shell-dependencies" />
          <p>
            <strong>Already using Kamod?</strong> Keep your installed packages and check that the
            dependencies below are present. Otherwise, run the command in your app’s folder using
            your usual package manager.
          </p>
          <details class="shell-quickstart-details">
            <summary>Show the install command</summary>
            <DependencyCommands
              dependencies={[
                "@kamod-ch/ui",
                "@kamod-ch/icons",
                "@kamod-ch/themes",
                "preact",
                "@preact/signals",
              ]}
            />
            <p>
              Use a UI release that includes <code>useDropdown</code>, the <code>portal</code> prop
              on <code>DropdownContent</code>, and <code>createRovingFocus</code> from{" "}
              <InlineCode>@kamod-ch/ui/lib/interactive</InlineCode>. An error about these exports
              means the installed UI release needs updating. The shell itself is local source, not a
              separate npm package to install.
            </p>
          </details>
        </li>
        <li>
          <BlockGuideHeading id="application-shell-styles" />
          <p>
            If Kamod components already look correct in your app,{" "}
            <a href="#application-shell-usage">go straight to the working example</a>. Otherwise,
            connect Tailwind and the theme once before rendering the shell.
          </p>
          <details class="shell-quickstart-details">
            <summary>Set up styles for the first time</summary>
            <p>
              Follow the <a href={withBasePath("/docs/theming/css-setup")}>CSS Setup Guide</a> to
              connect Tailwind CSS v4 to your build. For a stylesheet at <code>src/styles.css</code>
              and dependencies in your app’s <code>node_modules</code>, use:
            </p>
            <CodeBlock
              language="css"
              filePath="src/styles.css"
              code={
                '@import "tailwindcss";\n@import "@kamod-ch/themes/theme.css";\n\n@source "../node_modules/@kamod-ch/ui/dist/**/*.{js,mjs}";\n@source "./components/application-shell";'
              }
            />
            <p>
              Import this stylesheet from your app’s entry file with{" "}
              <code>import "./styles.css"</code>. Keep existing theme imports instead of adding
              duplicates. Source paths are relative to the stylesheet;{" "}
              <a href={withBasePath("/docs/theming/css-setup#make-source-detection-explicit")}>
                adjust them for a different folder layout
              </a>
              . Starting without an app? The{" "}
              <a href={withBasePath("/docs/getting-started")}>Getting Started Guide</a> covers that
              foundation.
            </p>
          </details>
        </li>
      </ol>
    </BlockDocSection>
  );
}

export function ShellThreeUsage() {
  return (
    <BlockDocSection
      id="application-shell-usage"
      introduction={
        <p>
          <strong>Get the first screen running before connecting services.</strong> This example
          supplies the shell’s required data and a single Home destination. It needs no router
          adapter or state wrapper.
        </p>
      }
    >
      <BlockGuideHeading id="application-shell-render" />
      <p>
        In a new app, use this as <PathDisplay path="src/App.tsx" /> and render <code>App</code>
        from your existing entry file. In an existing app, use it as a layout example and keep your
        current pages. The sample assumes the app’s Home page is at <code>/</code>.
      </p>
      <CodeBlock language="tsx" filePath="src/App.tsx" code={shellThreeStarter} />
      <DocsCallout class="docs-callout-spaced" title="Your first checkpoint" icon={<InfoIcon />}>
        <p>
          A compact icon rail should appear beside the page. Use the header toggle to expand the
          labels. On a small screen, the same control opens a navigation sheet. If the layout looks
          unstyled, return to <a href="#application-shell-styles">the styles step</a>. The account
          menu opens, but its actions remain inactive until you connect them below.
        </p>
      </DocsCallout>
      <BlockGuideHeading id="application-shell-connect" />
      <p>
        Make three small changes to the example, in this order.{" "}
        <strong>You can leave the shell’s internal files alone.</strong>
      </p>
      <dl class="blocks-doc-callouts">
        <div>
          <dt>Give it your identity</dt>
          <dd>
            Replace <code>brand</code> with your workspace name and <code>user</code> with the
            signed-in person. The shell creates initials automatically; a logo and avatar are
            optional.
          </dd>
        </div>
        <div>
          <dt>Put your page inside</dt>
          <dd>
            Replace the sample heading and paragraph with your content. Keep one shell around your
            pages; it already provides the <code>main</code> landmark and page padding.
          </dd>
        </div>
        <div>
          <dt>Add your real destinations</dt>
          <dd>
            Add items to <code>navigationGroups</code> with a stable <code>id</code>, a short{" "}
            <code>label</code>, a real <code>href</code> and a recognizable <code>icon</code>.
            Update <code>currentPath</code> and <code>breadcrumbs</code> for the current page.
            Ordinary links work without a callback.
          </dd>
        </div>
      </dl>
      <details class="shell-quickstart-details">
        <summary>When you’re ready: routing and account actions</summary>
        <p>
          With a client router, pass its current route to <code>currentPath</code> and connect its
          navigation function through <code>onNavigate</code>. The{" "}
          <a
            href={withBasePath(
              "/blocks/application-shell/application-shell-1#application-shell-callbacks",
            )}
          >
            shared navigation example
          </a>{" "}
          preserves open-in-new-tab and other browser shortcuts. Breadcrumbs are supplied by your
          app, not generated from the navigation tree.
        </p>
        <p>
          Connect <code>onUserAction</code> to your account, billing, notifications and sign-out
          handlers. It reports <code>account</code>, <code>billing</code>,{" "}
          <code>notifications</code>
          or <code>logout</code>; opening or selecting the menu alone does not perform those
          actions. Keep authentication and permission checks in your app.
        </p>
        <p>
          For nested destinations, custom header controls and typed data, continue to{" "}
          <a href="#application-shell-props">Props and Data</a>.
        </p>
      </details>
      <BlockGuideHeading id="application-shell-state" />
      <p>
        <strong>The compact rail is already the default.</strong> Let the built-in toggle manage it
        while you build your page. Add <code>defaultOpen={"{true}"}</code> only if you want labels
        visible on the first desktop render. Mobile navigation opens separately and always includes
        labels.
      </p>
      <p>
        Before moving on, try the toggle, a navigation link and keyboard focus at desktop and mobile
        widths. You now have a reusable frame for the rest of your app. If you later need to
        remember the desktop state, follow the{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-1#application-shell-state",
          )}
        >
          controlled state and persistence guide
        </a>
        ; it uses the same <code>open</code> and <code>onOpenChange</code> contract.
      </p>
    </BlockDocSection>
  );
}
