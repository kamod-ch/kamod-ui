/** @file Typed navigation, router callbacks and desktop-state integration examples. */
import { Badge } from "@kamod-ch/ui";
import { CodeBlock } from "../docs/components/CodeBlock";
import type { ShellTypeDefinitions } from "./ApplicationShellTypeDefinition";
import { RequiredIndicator } from "./RequiredIndicator";
import { ShellHeadingLink } from "./ShellHeadingLink";

const navigationExample = `import { FolderIcon } from "@kamod-ch/icons/lucide";
import type { ApplicationShellNavigationGroup } from "./components/application-shell-1";

export const navigationGroups = [{
  id: "workspace",
  label: "Workspace",
  items: [{
    id: "projects",
    label: "Projects",
    href: "/projects",
    icon: FolderIcon,
    items: [
      { id: "recent", label: "Recent projects", href: "/projects/recent" },
      { id: "archive", label: "Archive", href: "/projects/archive", disabled: true },
    ],
  }],
}] satisfies readonly ApplicationShellNavigationGroup[];`;

const routerExample = `import type { ApplicationShellNavigate } from "./components/application-shell-1";

// Supply your router's navigation function when creating this handler.
export const createNavigateHandler = (
  navigate: (href: string) => void,
): ApplicationShellNavigate => (destination, event) => {
  if (
    event.defaultPrevented || event.button !== 0 ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
  ) return;

  const { href } = destination;
  // This example intercepts only app-local, root-relative URLs.
  if (!href?.startsWith("/") || href.startsWith("//")) return;

  event.preventDefault();
  navigate(href);
};`;

const stateExample = `import { useState } from "preact/hooks";
import {
  ApplicationShell1,
  type ApplicationShell1Props,
} from "./components/application-shell-1";

type AppFrameProps = Omit<
  ApplicationShell1Props,
  "open" | "defaultOpen" | "onOpenChange"
>;

export const AppFrame = (props: AppFrameProps) => {
  const [open, setOpen] = useState(true);

  return (
    <ApplicationShell1 {...props} open={open} onOpenChange={setOpen} />
  );
};`;

const persistedStateExample = `import { useEffect, useState } from "preact/hooks";

const storageKey = "app-sidebar-desktop-open";

export function useDesktopSidebarPreference() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "true" || saved === "false") {
        setOpen(saved === "true");
      }
    } catch {
      // Keep the default if browser storage is unavailable.
    }
  }, []);

  const setDesktopOpen = (next: boolean) => {
    setOpen(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      // The toggle still works when the preference cannot be saved.
    }
  };

  return [open, setDesktopOpen] as const;
}`;

/** Navigation data remains independent of the app's router. */
export const ShellNavigationData = ({
  renderTypeLink,
}: Pick<ShellTypeDefinitions, "renderTypeLink">) => (
  <section class="blocks-api-section" aria-labelledby="application-shell-navigation-data">
    <h3 id="application-shell-navigation-data" tabIndex={-1}>
      <ShellHeadingLink id="application-shell-navigation-data">
        Type your navigation data
      </ShellHeadingLink>
    </h3>
    <div role="paragraph">
      Use stable IDs{" "}
      <RequiredIndicator label="Required navigation IDs" tooltip="Required stable navigation IDs" />{" "}
      and keep child destinations to one level. Group IDs must be unique among groups, and item IDs
      among siblings. This example gives Projects its own page and an expandable submenu. Pass the
      resulting array to <code>navigationGroups</code> and set{" "}
      <code>currentPath="/projects/recent"</code> to mark Recent projects as current. The{" "}
      <code>satisfies</code> operator checks the shape without replacing the inferred type.
    </div>
    <CodeBlock code={navigationExample} language="tsx" />
    <dl class="blocks-doc-callouts">
      <div>
        <dt>One tree, three types</dt>
        <dd>
          {renderTypeLink("ApplicationShellNavigationGroup", "Group")} →{" "}
          {renderTypeLink("ApplicationShellNavigationItem", "item")} →{" "}
          {renderTypeLink("ApplicationShellNavigationLink", "child link")}. A child is a leaf, so it
          cannot contain another submenu.
        </dd>
      </div>
      <div>
        <dt>Keep selection explicit</dt>
        <dd>
          Matching is exact: <code>/projects</code> and <code>/projects/</code> differ. Use{" "}
          <code>active</code> when your app needs its own matching rules.
        </dd>
      </div>
    </dl>
  </section>
);

/** Callback contracts and a router adapter that preserves native browser actions. */
export const ShellCallbacks = ({
  renderDefinition,
}: Pick<ShellTypeDefinitions, "renderDefinition">) => (
  <section class="blocks-api-section" aria-labelledby="application-shell-callbacks">
    <h3 id="application-shell-callbacks" tabIndex={-1}>
      <ShellHeadingLink id="application-shell-callbacks">Navigation and callbacks</ShellHeadingLink>
    </h3>
    <div role="paragraph">
      Native links need no callback. For client routing{" "}
      <RequiredIndicator label="Client routing requirement" tooltip="Cancel handled navigation" />,
      supply <code>onNavigate</code> and cancel only the clicks your router handles. Keep{" "}
      <code>currentPath</code> and breadcrumbs in sync with your router; the shell does not infer
      either.
    </div>
    {renderDefinition({
      name: "ApplicationShellNavigate",
      title: "Navigation handler",
      description:
        "Receives a destination and the Preact click event from its link or action button.",
      note: (
        <>
          Only <code>label</code> and optional <code>href</code> are guaranteed on the destination.
          A leaf without a URL calls this handler as an action button; a branch without a URL only
          toggles its submenu.
        </>
      ),
    })}
    <p class="blocks-api-example-intro">
      This adapter preserves modified clicks and leaves external, hash-only and other
      non-root-relative URLs to the browser. Connect it to your router's navigation function and
      pass the returned handler to <code>onNavigate</code>.
    </p>
    <CodeBlock code={routerExample} language="tsx" />
    <p class="blocks-doc-note">
      <strong>Mobile navigation:</strong> ordinary brand and navigation selections close the mobile
      sheet after the callback runs, including when it calls <code>preventDefault()</code>. Modified
      clicks leave the sheet open. Disabled destinations do not call the handler.
    </p>
    {renderDefinition({
      name: "ApplicationShellUserAction",
      title: "Account menu actions",
      description: "The exact action identifiers passed to onUserAction, without a click event.",
      note: (
        <>
          Map <code>account</code>, <code>billing</code> and <code>notifications</code> to your
          app's screens, and <code>logout</code> to your authentication flow. Selecting an item
          dismisses the account menu even without a callback; it does not sign out, navigate or
          close the mobile sheet by itself.
        </>
      ),
    })}
  </section>
);

/** Controlled/uncontrolled desktop state and optional persistence, separate from mobile. */
export const ShellSidebarState = () => (
  <section class="blocks-api-section" aria-labelledby="application-shell-state">
    <h3 id="application-shell-state" tabIndex={-1}>
      <ShellHeadingLink id="application-shell-state">Sidebar state</ShellHeadingLink>
    </h3>
    <dl class="blocks-api-state-options">
      <div>
        <dt>
          Uncontrolled{" "}
          <Badge variant="secondary" size="sm">
            Default
          </Badge>
        </dt>
        <dd>
          Omit <code>open</code>. The desktop sidebar starts expanded; use{" "}
          <code>defaultOpen={"{false}"}</code> to start with icons. <code>onOpenChange</code> can
          observe changes without owning state.
        </dd>
      </div>
      <div>
        <dt>
          Controlled{" "}
          <RequiredIndicator
            label="Controlled state requirement"
            tooltip="Update open in onOpenChange"
          />
        </dt>
        <dd>
          Supply <code>open</code>. To let the built-in toggles change it, update this value in{" "}
          <code>onOpenChange</code>; otherwise the sidebar keeps the supplied state. Your app owns
          desktop expansion in this mode.
        </dd>
      </div>
    </dl>
    <CodeBlock code={stateExample} language="tsx" />
    <p class="blocks-doc-note">
      <strong>Desktop and mobile are separate.</strong> Below 768px the sidebar uses an
      independently managed sheet that starts closed when the shell mounts. The toggle opens that
      sheet instead of changing desktop expansion, so mobile toggles do not call{" "}
      <code>onOpenChange</code>. Setting <code>open</code> or <code>defaultOpen</code> does not open
      the mobile sheet; your desktop preference still applies when returning to a wider screen.
    </p>
    <p class="blocks-api-example-intro">
      <strong>Remember the desktop preference.</strong> In <code>AppFrame</code> above, replace{" "}
      <code>useState(true)</code> with <code>useDesktopSidebarPreference()</code> and keep the same{" "}
      <code>open</code>/<code>onOpenChange</code> wiring. Add this hook in the same file, or import
      it from a local module. It restores the saved value after mounting and saves new values only
      when the desktop toggle changes them.
    </p>
    <CodeBlock code={persistedStateExample} language="tsx" />
    <dl class="blocks-doc-callouts">
      <div>
        <dt>What is remembered</dt>
        <dd>
          Only desktop expansion is saved in this browser for this site. A missing or invalid value
          falls back to expanded; blocked storage leaves the toggle usable without persistence. The
          mobile sheet and navigation submenu states are not saved.
        </dd>
      </div>
      <div>
        <dt>First render</dt>
        <dd>
          Reading storage in <code>useEffect</code> keeps server rendering safe. The sidebar may
          briefly appear expanded before a saved collapsed preference is restored. To avoid that
          shift, your server can read the core sidebar's <code>sidebar_state</code> cookie and pass
          its parsed boolean as <code>defaultOpen</code> on the first render, or initialize
          controlled state with it. The core writes this cookie but does not restore it
          automatically.
        </dd>
      </div>
    </dl>
  </section>
);
