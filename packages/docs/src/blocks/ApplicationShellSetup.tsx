/** Copy-and-adapt setup instructions and a minimal Preact integration. */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { RequiredIndicator } from "./RequiredIndicator";
import { ShellHeadingLink } from "./ShellHeadingLink";

const shellImport = `import { ApplicationShell1 } from "./components/application-shell-1";`;
const shellDependencies = "@kamod-ch/ui @kamod-ch/icons @kamod-ch/themes @preact/signals";
const dependencyCommands = {
  pnpm: `pnpm add ${shellDependencies}`,
  npm: `npm install ${shellDependencies}`,
  yarn: `yarn add ${shellDependencies}`,
};

/**
 * Explains copying the block, installing missing dependencies and enabling its styles.
 * The blocks package is private, so the example imports from the reader's local components.
 * The compatibility note identifies the public dropdown hook and portal support used by the menus.
 */
export const ShellSetup = () => (
  <section class="blocks-doc-section" aria-labelledby="application-shell-installation">
    <header class="blocks-doc-section-header">
      <p class="blocks-doc-eyebrow">Getting started</p>
      <h2 id="application-shell-installation" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-installation">Add this block</ShellHeadingLink>
      </h2>
      <p>
        Add a complete navigation layout to an existing Preact app in three steps. Copy the source,
        connect the Kamod dependencies and bring your own pages. The files live in your project, so
        you can adapt the sidebar, header and account menu as your application grows.
      </p>
    </header>
    <ol class="blocks-doc-steps" role="list">
      <li>
        <h3 id="application-shell-copy" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-copy">Copy the block</ShellHeadingLink>
        </h3>
        <p>
          Copy the Code-tab files into <code>src/components/application-shell-1</code>. Skip{" "}
          <code>preview.tsx</code>, <code>demo-data.tsx</code> and{" "}
          <code>assets/kamod-ui-logo.svg</code> unless you want the demo. To keep the demo branding,
          copy the SVG into the same <code>assets</code> subfolder.
        </p>
        <p>
          <strong>Keep the reusable files together:</strong> <code>application-shell-1.tsx</code>,{" "}
          <code>app-sidebar.tsx</code>, <code>nav-main.tsx</code>, <code>nav-user.tsx</code>,{" "}
          <code>menu.tsx</code>, <code>types.ts</code> and <code>index.ts</code>. Their relative
          imports work within this folder; the entrypoint exports the component and its public
          types.
        </p>
      </li>
      <li>
        <h3 id="application-shell-dependencies" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-dependencies">
            Install missing dependencies
          </ShellHeadingLink>
        </h3>
        <p>
          Install the packages your app does not already have. Kamod UI supplies the interactive
          components, Icons supplies the SVG icons, and Themes and Preact Signals support the shared
          styling and state setup. Use your project's existing package manager.
        </p>
        <Tabs defaultValue="pnpm" class="docs-tabs">
          <TabsList class="docs-tabs-list" variant="line" aria-label="Package manager">
            {Object.keys(dependencyCommands).map((manager) => (
              <TabsTrigger key={manager} value={manager}>
                {manager}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(dependencyCommands).map(([manager, command]) => (
            <TabsContent key={manager} value={manager}>
              <CodeBlock code={command} language="bash" className="docs-tab-code" />
            </TabsContent>
          ))}
        </Tabs>
        <div role="paragraph" class="blocks-doc-note">
          <strong>Compatibility:</strong>{" "}
          <RequiredIndicator label="Required UI compatibility" tooltip="Required Kamod UI APIs" />{" "}
          <code>@kamod-ch/ui</code> must export <code>useDropdown</code> and support the{" "}
          <code>portal</code> prop on <code>DropdownContent</code>. The shell's menu adapters use
          these APIs to manage keyboard navigation and keep menus outside the sidebar's scroll
          container. Use a UI release that includes both APIs before integrating the block.
        </div>
      </li>
      <li>
        <h3 id="application-shell-styles" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-styles">
            Set up styles and import
          </ShellHeadingLink>
        </h3>
        <div role="paragraph">
          Follow the{" "}
          <a class="underline" href={withBasePath("/docs/theming/css-setup")}>
            theme and Tailwind setup
          </a>{" "}
          <RequiredIndicator label="Required styling setup" tooltip="Required CSS setup" /> in your
          app's global stylesheet, then ensure Tailwind scans the copied files as well as the Kamod
          components. An app that already uses Kamod can keep its existing theme setup. Import the
          shell from your new local folder:
        </div>
        <CodeBlock code={shellImport} language="tsx" />
        <p class="blocks-doc-note">
          <strong>Check the first render:</strong> the sidebar, borders and page background should
          follow your app's theme. If the layout appears unstyled, check the global CSS import and
          Tailwind source detection before changing the block's classes.
        </p>
      </li>
    </ol>
  </section>
);

const usage = `${shellImport}

export const App = () => (
  <ApplicationShell1
    brand={{ name: "Acme Inc", description: "Enterprise", href: "/" }}
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
  <section class="blocks-doc-section" aria-labelledby="application-shell-usage">
    <header class="blocks-doc-section-header">
      <p class="blocks-doc-eyebrow">Integration</p>
      <h2 id="application-shell-usage" tabIndex={-1}>
        <ShellHeadingLink id="application-shell-usage">Usage</ShellHeadingLink>
      </h2>
      <div role="paragraph">
        Pass your brand, navigation, user and breadcrumbs{" "}
        <RequiredIndicator label="Required usage data" tooltip="Four required data props" />, then
        place your page content inside the shell. Mount it in your app's shared layout so pages can
        reuse the same navigation. The example below starts with one destination and lets the shell
        manage its own sidebar state.
      </div>
    </header>
    <CodeBlock code={usage} language="tsx" />
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
  </section>
);
