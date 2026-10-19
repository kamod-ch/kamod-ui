import { InfoIcon } from "@kamod-ch/icons/lucide";
import { BrandText } from "../docs/components/brand/BrandText";
import { DocsCallout } from "../docs/components/DocsCallout";
import { PathDisplay } from "../docs/components/PathDisplay";
/** Copy-and-adapt setup instructions and a minimal Preact integration. */

import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { BlockDocSection, BlockGuideHeading } from "./detail/BlockDocumentation";
import { DependencyCommands } from "./detail/DependencyCommands";
import { RequiredIndicator } from "./RequiredIndicator";
import { ShowcaseCodeLink } from "./ShowcaseCodeLink";

const shellImport = `import { ApplicationShell1 } from "./components/application-shell-1";`;

/**
 * Explains copying the block, installing missing dependencies and enabling its styles.
 * The blocks package is private, so the example imports from the reader's local components.
 * The compatibility note identifies the public dropdown hook and portal support used by the menus.
 */
export const ShellSetup = () => (
  <BlockDocSection
    id="application-shell-installation"
    introduction={
      <>
        <p>
          <BrandText>
            Add a complete navigation layout to an existing Preact app in three steps. Copy the
            source, connect the Kamod dependencies and bring your own pages. The files live in your
            project, so you can adapt the sidebar, header and account menu as your application
            grows.
          </BrandText>
        </p>
      </>
    }
  >
    <ol class="blocks-doc-steps" role="list">
      <li>
        <BlockGuideHeading id="application-shell-copy" />
        <p>
          Copy the files from the{" "}
          <ShowcaseCodeLink blockId="application-shell-1">showcase’s Code tab</ShowcaseCodeLink>{" "}
          into <PathDisplay path={"src/components/application-shell-1"} />. Skip{" "}
          <code>preview.tsx</code>, <code>demo-data.tsx</code> and{" "}
          <PathDisplay path={"assets/kamod-ui-logo.svg"} /> unless you want the demo. To keep the
          demo branding, copy the SVG into the same <code>assets</code> subfolder.
        </p>
        <p>
          <strong>Keep the Reusable Files Together:</strong> <code>application-shell-1.tsx</code>,{" "}
          <code>app-sidebar.tsx</code>, <code>nav-main.tsx</code>, <code>nav-user.tsx</code>,{" "}
          <code>menu.tsx</code>, <code>types.ts</code> and <code>index.ts</code>. Their relative
          imports work within this folder; the entrypoint exports the component and its public
          types. The examples assume an importing file at <PathDisplay path={"src/App.tsx"} />;
          adjust the relative import if yours lives elsewhere. Keep the repository’s license with
          your copy.
        </p>
      </li>
      <li>
        <BrandText>
          <BlockGuideHeading id="application-shell-dependencies" />
          <p>
            Install the packages your app does not already have. Kamod UI supplies the interactive
            components, Icons supplies the SVG icons, and Themes and Preact Signals support the
            shared styling and state setup. Use your project's existing package manager.
          </p>
          <DependencyCommands
            dependencies={[
              "@kamod-ch/ui",
              "@kamod-ch/icons",
              "@kamod-ch/themes",
              "@preact/signals",
            ]}
          />
          <DocsCallout
            class="docs-callout-spaced"
            title="Keep your existing setup"
            icon={<InfoIcon />}
          >
            <div role="paragraph">
              <strong>Compatibility:</strong>{" "}
              <RequiredIndicator
                label="Required UI Compatibility"
                tooltip="Required Kamod UI APIs"
              />{" "}
              <PathDisplay path={"@kamod-ch/ui"} /> must export <code>useDropdown</code> and support
              the <code>portal</code> prop on <code>DropdownContent</code>, and expose{" "}
              <code>createRovingFocus</code> from{" "}
              <PathDisplay path={"@kamod-ch/ui/lib/interactive"} />. The shell's menu adapters use
              these APIs to manage keyboard navigation and keep menus outside the sidebar's scroll
              container. Use a UI release that includes these APIs before integrating the block.
            </div>
          </DocsCallout>
        </BrandText>
      </li>
      <li>
        <BrandText>
          <BlockGuideHeading id="application-shell-styles" />
          <div role="paragraph">
            Follow the{" "}
            <a class="underline" href={withBasePath("/docs/theming/css-setup")}>
              Theme and Tailwind Setup
            </a>{" "}
            <RequiredIndicator label="Required Styling Setup" tooltip="Required CSS setup" /> in
            your app's global stylesheet, then ensure Tailwind scans the copied files as well as the
            Kamod components. An app that already uses Kamod can keep its existing theme setup.
            Import the shell from your new local folder:
          </div>
          <CodeBlock code={shellImport} language="tsx" />
          <DocsCallout
            class="docs-callout-spaced"
            title="Check the First Render"
            icon={<InfoIcon />}
          >
            <p>
              The sidebar, borders and page background should follow your app's theme. If the layout
              appears unstyled, check the global CSS import and Tailwind source detection before
              changing the block's classes.
            </p>
          </DocsCallout>
        </BrandText>
      </li>
    </ol>
  </BlockDocSection>
);

const usage = `${shellImport}

export const App = () => (
  <ApplicationShell1
    brand={{ name: "Kamod UI", description: "Component library", href: "/" }}
    navigationGroups={[{
      id: "workspace", label: "Workspace",
      items: [{ id: "overview", label: "Overview", href: "/overview" }],
    }]}
    user={{ name: "Alex Morgan", email: "alex@example.com" }}
    breadcrumbs={[{ label: "Overview" }]}
    currentPath="/overview"
    onUserAction={(action) => console.log(action)}
  >
    <h1 class="text-2xl font-semibold">Overview</h1>
    <p>Your application content goes here.</p>
  </ApplicationShell1>
);`;

/** Shows a minimal integration and identifies where the app connects routing and account actions. */
export const ShellUsage = () => (
  <BlockDocSection
    id="application-shell-usage"
    introduction={
      <>
        <div role="paragraph">
          Pass your brand, navigation, user and breadcrumbs{" "}
          <RequiredIndicator label="Required Usage Data" tooltip="Four required data props" />, then
          place your page content inside the shell. Mount it in your app's shared layout so pages
          can reuse the same navigation. The example below starts with one destination and lets the
          shell manage its own sidebar state.
        </div>
      </>
    }
  >
    <CodeBlock code={usage} language="tsx" />
    <DocsCallout
      class="docs-callout-spaced"
      title="Keep the Shell Mounted Across Routes"
      icon={<InfoIcon />}
    >
      <p>
        Replace its children and route data without changing the shell’s key to preserve local
        sidebar state. The shell already owns its <code>SidebarProvider</code>; adding a second
        provider outside it will not control its inner navigation. Use the public{" "}
        <a href="#application-shell-state">Desktop State Props</a> instead.
      </p>
    </DocsCallout>
    <dl class="blocks-doc-callouts">
      <div>
        <dt>Connect navigation</dt>
        <dd>
          Links use their <code>href</code> by default. With a client router, pass its current path
          to <code>currentPath</code> and handle ordinary clicks in <code>onNavigate</code>. Update
          the breadcrumbs with each page; they are not inferred from the navigation tree.
        </dd>
      </div>
      <div>
        <dt>Connect account actions</dt>
        <dd>
          Replace the example's console logging with your account, billing, notification and logout
          handlers. Place your routed content inside the shell; it already provides the page's{" "}
          <code>main</code> landmark and content padding.
        </dd>
      </div>
    </dl>
  </BlockDocSection>
);
