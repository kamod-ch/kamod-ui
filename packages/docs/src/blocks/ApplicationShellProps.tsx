/**
 * @file Guided API reference for Application Shell 1.
 * The overview explains runtime behavior; expandable definitions use the block's
 * types.ts via raw source imports. The component signature omits comments; data and
 * callback definitions retain their field JSDoc.
 */
import type { ApplicationShell1Props } from "@kamod-ch/blocks/application-shell";
import { ChevronDownIcon, CodeIcon } from "@kamod-ch/icons/lucide";
import { Badge, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { CodeBlock } from "../docs/components/CodeBlock";
import {
  type ApplicationShellTypeName,
  applicationShellPropsSignature,
  applicationShellTypeSources,
} from "./application-shell-type-source";
import { RequiredIndicator } from "./RequiredIndicator";
import { ShellHeadingLink } from "./ShellHeadingLink";

/** A prop's public type, required status and optional destination in the type reference. */
type PropReference = {
  name: keyof ApplicationShell1Props;
  type: string;
  description: string;
  required?: boolean;
  definition?: ApplicationShellTypeName;
};

const propRows = [
  {
    name: "brand",
    type: "ApplicationShellBrand",
    description: "Sidebar identity, an optional logo and an optional home or workspace link.",
    required: true,
    definition: "ApplicationShellBrand",
  },
  {
    name: "navigationGroups",
    type: "readonly ApplicationShellNavigationGroup[]",
    description: "Ordered groups of destinations, with at most one level of child links.",
    required: true,
    definition: "ApplicationShellNavigationGroup",
  },
  {
    name: "user",
    type: "ApplicationShellUser",
    description:
      "Account name and email, with an optional avatar or custom initials. No session is inferred.",
    required: true,
    definition: "ApplicationShellUser",
  },
  {
    name: "breadcrumbs",
    type: "readonly ApplicationShellDestination[]",
    description:
      "An independent, ordered trail. The last entry is never a link; earlier entries hide below 768px.",
    required: true,
    definition: "ApplicationShellDestination",
  },
  {
    name: "children",
    type: "ComponentChildren",
    description:
      "Page content inside the existing main landmark and padded content area. No placeholder content is inserted.",
  },
  {
    name: "currentPath",
    type: "string",
    description:
      "Exact URL used to match item href values. An item's explicit active value takes precedence; no router or path normalization is applied.",
  },
  {
    name: "onNavigate",
    type: "ApplicationShellNavigate",
    description:
      "Handles linked brand, breadcrumb and navigation activation, or a leaf action button. Native links still work without it.",
    definition: "ApplicationShellNavigate",
  },
  {
    name: "onUserAction",
    type: "(action: ApplicationShellUserAction) => void",
    description:
      "Receives an account menu selection. Your app implements the resulting navigation or account operation.",
    definition: "ApplicationShellUserAction",
  },
  {
    name: "open",
    type: "boolean",
    description:
      "Controls desktop expansion: true expands, false collapses to icons. Update this value in onOpenChange to respond to the toggle.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    description:
      "Initial uncontrolled desktop state. Ignored when open is supplied; changing it after mount does not reset the sidebar.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    description:
      "Reports requested desktop expansion in either state mode. Mobile visibility does not call this callback.",
  },
  {
    name: "class",
    type: "string",
    description: "Additional classes merged onto the outer SidebarProvider wrapper.",
  },
  {
    name: "className",
    type: "string",
    description: "Alias for class, merged after it when both are supplied.",
  },
] satisfies readonly PropReference[];

/** A short reading guide beside a source-derived type definition. */
type TypeReference = {
  name: ApplicationShellTypeName;
  title: string;
  description: string;
  /** Mandatory fields of this data shape, including fields inherited through intersections. */
  requiredFields?: readonly string[];
  note?: ComponentChildren;
};

const dataTypes: readonly TypeReference[] = [
  {
    name: "ApplicationShellBrand",
    title: "Brand and logo",
    description: "The identity shown at the top of the sidebar, including in icon mode.",
    requiredFields: ["name"],
    note: (
      <>
        Without <code>logo</code>, the first character of <code>name</code> is used. Without{" "}
        <code>href</code>, the brand is display-only. Pass JSX for a custom logo; it is decorative,
        while the name supplies the accessible label.
      </>
    ),
  },
  {
    name: "ApplicationShellUser",
    title: "Account identity",
    description: "Display data for the sidebar footer and account menu.",
    requiredFields: ["name", "email"],
    note: (
      <>
        An unavailable avatar falls back to explicit <code>initials</code>, or uppercase initials
        from the first two words of <code>name</code>. An empty result displays <code>?</code>. The
        email is display text, not a mail action.
      </>
    ),
  },
  {
    name: "ApplicationShellNavigationGroup",
    title: "Navigation groups",
    description: "The outer level of your navigation: an ID, optional heading and ordered items.",
    requiredFields: ["id", "items"],
    note: (
      <>
        Keep group IDs unique and item IDs unique among siblings. Omitting a group label leaves no
        empty heading. Readonly arrays work directly; the shell preserves your order.
      </>
    ),
  },
  {
    name: "ApplicationShellNavigationItem",
    title: "Top-level items and branches",
    description: "A navigation link that can also contain one level of child links.",
    requiredFields: ["id", "label"],
    note: (
      <>
        Inherits all fields from <code>ApplicationShellNavigationLink</code>. Empty or omitted{" "}
        <code>items</code> creates a leaf. A branch with an <code>href</code> has separate
        navigation and disclosure controls; without one, its label only opens the submenu.
      </>
    ),
  },
  {
    name: "ApplicationShellNavigationLink",
    title: "Leaf and child destinations",
    description: "A destination plus its stable ID, optional icon and interaction state.",
    requiredFields: ["id", "label"],
    note: (
      <>
        Inherits <code>label</code> and <code>href</code> from{" "}
        <code>ApplicationShellDestination</code>. Explicit <code>active: false</code> suppresses
        this destination's path match. A disabled branch also disables its children.
      </>
    ),
  },
  {
    name: "ApplicationShellDestination",
    title: "Breadcrumbs and callback destinations",
    description: "The shared label and optional URL used by breadcrumbs and navigation callbacks.",
    requiredFields: ["label"],
    note: (
      <>
        The final breadcrumb always marks the current page, even if it has an <code>href</code>.
        Earlier entries without a URL are plain text. Callbacks guarantee only these two fields, not
        a navigation item's <code>id</code>.
      </>
    ),
  },
  {
    name: "ApplicationShellIcon",
    title: "Navigation icons",
    description: "A Preact component that accepts the shell's SVG styling and accessibility props.",
    note: (
      <>
        Pass a component reference such as <code>icon: FolderIcon</code>, not an element. Top-level
        items without an icon use a circle; child links have no fallback icon. Navigation supplies
        stroke width 2, rounded strokes and decorative semantics.
      </>
    ),
  },
];

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

const typeId = (name: ApplicationShellTypeName) => `application-shell-type-${name}`;

/**
 * An independently expandable, deep-linkable type definition using the core Collapsible.
 * Data and callback definitions include original JSDoc; the component signature
 * stays compact by omitting comments from both its display and copied source.
 * @param props - Reading guide, disclosure state and the parent-owned toggle callback.
 */
const ShellTypeDefinition = ({
  entry,
  open,
  onOpenChange,
}: {
  entry: TypeReference;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const id = typeId(entry.name);
  const isComponentSignature = entry.name === "ApplicationShell1Props";
  const requiredLabel = entry.requiredFields?.length === 1 ? "Required Field" : "Required Fields";
  const requiredProp = propRows.find(
    (prop: PropReference) => prop.required && prop.definition === entry.name,
  );
  const renderRequiredFields = (placement: "description" | "code") =>
    entry.requiredFields && (
      <div
        class="blocks-api-type-fields"
        role="group"
        aria-label={`Required fields of ${entry.name}`}
      >
        {placement === "description" && (
          <span class="blocks-api-required-label">Required fields</span>
        )}
        <RequiredIndicator
          label={`${requiredLabel}: ${entry.requiredFields.join(", ")}`}
          tooltip={requiredLabel}
          align={placement === "code" ? "start" : "center"}
          side={placement === "code" ? "bottom" : "top"}
        />
        <span class="blocks-api-type-field-list">
          {entry.requiredFields.map((field, index, fields) => (
            <span key={field}>
              <code>{field}</code>
              {index < fields.length - 1 && ", "}
            </span>
          ))}
        </span>
      </div>
    );
  return (
    <Collapsible class="blocks-api-type" open={open} onOpenChange={onOpenChange}>
      <div class="blocks-api-type-intro">
        <div class="blocks-api-type-heading">
          <h4 id={id} tabIndex={-1}>
            <ShellHeadingLink id={id}>{entry.title}</ShellHeadingLink>
          </h4>
          {requiredProp && (
            <div class="blocks-api-type-required">
              <span class="blocks-api-required-label">Required type</span>
              <RequiredIndicator
                label={`Required type: ${entry.name}`}
                tooltip={`Used by required prop: ${requiredProp.name}`}
                align="end"
              />
            </div>
          )}
        </div>
        <code class="blocks-api-type-name">{entry.name}</code>
        <p>{entry.description}</p>
        {renderRequiredFields("description")}
      </div>
      <CollapsibleTrigger
        id={`${id}-trigger`}
        class="blocks-api-type-trigger"
        aria-controls={`${id}-content`}
        aria-label={`${open ? "Hide" : "Show"} ${entry.name} definition${isComponentSignature ? "" : " and field documentation"}`}
      >
        <span>
          <CodeIcon
            size={16}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          {open ? "Hide" : "View"} definition{!isComponentSignature && " and field docs"}
        </span>
        <ChevronDownIcon
          size={16}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent id={`${id}-content`} duration="0ms" class="blocks-api-type-content">
        <CodeBlock
          code={
            isComponentSignature
              ? applicationShellPropsSignature
              : applicationShellTypeSources[entry.name]
          }
          language="tsx"
          toolbarContent={renderRequiredFields("code")}
        />
        {entry.note && <p class="blocks-api-type-note">{entry.note}</p>}
      </CollapsibleContent>
    </Collapsible>
  );
};

/**
 * Combines a scannable prop table with source-backed type docs and integration examples.
 * Type links expand their definition, including direct URLs and Back/Forward navigation.
 * Disclosure state is independent for each type so related definitions can be compared.
 */
export const ShellProps = () => {
  const [openTypes, setOpenTypes] = useState<ReadonlySet<ApplicationShellTypeName>>(
    () => new Set(["ApplicationShellNavigationGroup"]),
  );
  const setTypeOpen = (name: ApplicationShellTypeName, open: boolean) => {
    setOpenTypes((current) => {
      const next = new Set(current);
      if (open) next.add(name);
      else next.delete(name);
      return next;
    });
  };

  useEffect(() => {
    let frame = 0;
    const revealType = (event?: HashChangeEvent) => {
      window.cancelAnimationFrame(frame);
      const name = (Object.keys(applicationShellTypeSources) as ApplicationShellTypeName[]).find(
        (key) => window.location.hash === `#${typeId(key)}`,
      );
      if (!name) return;
      setTypeOpen(name, true);
      // PreactPress disables native history scroll restoration. Wait for the
      // disclosure render before restoring direct links and Back/Forward targets.
      frame = window.requestAnimationFrame(() => {
        const heading = document.getElementById(typeId(name));
        heading?.scrollIntoView({ block: "start", behavior: "instant" });
        // Move focus for in-page navigation, while leaving initial document focus to the browser.
        if (event) heading?.focus({ preventScroll: true });
      });
    };
    revealType();
    window.addEventListener("hashchange", revealType);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", revealType);
    };
  }, []);

  const typeLink = (name: ApplicationShellTypeName, label: ComponentChildren = name) => (
    <a href={`#${typeId(name)}`} onClick={() => setTypeOpen(name, true)}>
      {label}
    </a>
  );
  const definition = (entry: TypeReference) => (
    <ShellTypeDefinition
      key={entry.name}
      entry={entry}
      open={openTypes.has(entry.name)}
      onOpenChange={(open) => setTypeOpen(entry.name, open)}
    />
  );

  return (
    <section class="blocks-doc-section blocks-api" aria-labelledby="application-shell-props">
      <header class="blocks-doc-section-header">
        <p class="blocks-doc-eyebrow">API reference</p>
        <h2 id="application-shell-props" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-props">Props and data</ShellHeadingLink>
        </h2>
        <p>
          Supply the identity, destinations and page content; the shell supplies the layout and
          controls. Start with the four required data props, then add callbacks or controlled
          desktop state as your app needs them. All ten public types are exported by your local{" "}
          <code>application-shell-1</code> entrypoint.
        </p>
        <div class="blocks-api-source-note">
          <CodeIcon
            size={18}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          <span>
            Definitions and field comments below come directly from <code>types.ts</code>, keeping
            the reference aligned with the block's public API. Explore the{" "}
            <a href="#application-shell-data-types">Data type reference</a> for complete data
            shapes, required and optional fields, and practical notes on how each type is used.
          </span>
          <Badge variant="secondary" size="sm">
            TypeScript
          </Badge>
        </div>
      </header>

      <section class="blocks-api-section" aria-labelledby="application-shell-prop-reference">
        <h3 id="application-shell-prop-reference" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-prop-reference">Component props</ShellHeadingLink>
        </h3>
        <p>
          Each row lists a prop accepted by <code>ApplicationShell1</code>, its TypeScript type and
          how it affects the shell. Follow a linked type to open its full definition, including
          individual fields and their documentation. Optional props let you supply page content,
          connect navigation and account actions, control desktop expansion or adjust wrapper
          styling.
        </p>
        {/* Core Tooltip renders a div; an ARIA paragraph keeps the inline example valid in SSR. */}
        <div role="paragraph">
          The red asterisk{" "}
          <RequiredIndicator label="Required prop indicator" tooltip="Required component prop" />{" "}
          marks the four required props: <code>brand</code>, <code>navigationGroups</code>,{" "}
          <code>user</code> and <code>breadcrumbs</code>. Supply all four when using the block; the
          two array props may be empty. Props without this marker are optional. Hover, focus or tap
          the icon to see its label.
        </div>
        <div
          class="blocks-doc-table blocks-api-props-table"
          role="region"
          aria-labelledby="application-shell-prop-reference"
          tabIndex={0}
        >
          <table>
            <caption class="sr-only">
              ApplicationShell1 props, types and descriptions; required props are marked
            </caption>
            <thead>
              <tr>
                <th scope="col">Prop / type</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {propRows.map((row: PropReference) => (
                <tr key={row.name}>
                  <th scope="row">
                    <div class="blocks-api-prop-label">
                      <code>{row.name}</code>
                      {row.required && <RequiredIndicator label={`Required prop: ${row.name}`} />}
                    </div>
                    <span class="blocks-api-prop-type">
                      {row.definition ? typeLink(row.definition, row.type) : row.type}
                    </span>
                  </th>
                  <td>
                    {row.description}
                    {row.name === "navigationGroups" && (
                      <>
                        {" "}
                        See{" "}
                        <a href="#application-shell-navigation-data">Type your navigation data</a>.
                      </>
                    )}
                    {row.name === "open" && (
                      <>
                        {" "}
                        See <a href="#application-shell-state">Sidebar state</a>.
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p class="blocks-doc-note">
          <strong>Wrapper styling:</strong> <code>class</code> and <code>className</code> target the
          shell's outer wrapper. Arbitrary HTML attributes and other provider options are not
          forwarded. The shell already renders <code>main</code>; do not add another one inside it.
        </p>
        {definition({
          name: "ApplicationShell1Props",
          title: "Complete component signature",
          description: "All required and optional inputs in one copyable declaration.",
        })}
      </section>

      <section class="blocks-api-section" aria-labelledby="application-shell-navigation-data">
        <h3 id="application-shell-navigation-data" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-navigation-data">
            Type your navigation data
          </ShellHeadingLink>
        </h3>
        <div role="paragraph">
          Use stable IDs{" "}
          <RequiredIndicator
            label="Required navigation IDs"
            tooltip="Required stable navigation IDs"
          />{" "}
          and keep child destinations to one level. Group IDs must be unique among groups, and item
          IDs among siblings. This example gives Projects its own page and an expandable submenu.
          Pass the resulting array to <code>navigationGroups</code> and set{" "}
          <code>currentPath="/projects/recent"</code> to mark Recent projects as current. The{" "}
          <code>satisfies</code> operator checks the shape without replacing the inferred type.
        </div>
        <CodeBlock code={navigationExample} language="tsx" />
        <dl class="blocks-doc-callouts">
          <div>
            <dt>One tree, three types</dt>
            <dd>
              {typeLink("ApplicationShellNavigationGroup", "Group")} →{" "}
              {typeLink("ApplicationShellNavigationItem", "item")} →{" "}
              {typeLink("ApplicationShellNavigationLink", "child link")}. A child is a leaf, so it
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

      <section class="blocks-api-section" aria-labelledby="application-shell-data-types">
        <h3 id="application-shell-data-types" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-data-types">Data type reference</ShellHeadingLink>
        </h3>
        <p>
          Open a definition to inspect its exact fields, optional markers and original JSDoc.
          Multiple definitions can stay open for comparison. Types joined with <code>&amp;</code>{" "}
          inherit the fields of the referenced type. The asterisk identifies each shape's required
          fields, including inherited ones.
        </p>
        <div role="paragraph">
          <strong>Required type</strong>{" "}
          <RequiredIndicator label="Required type indicator" tooltip="Required type" /> marks a type
          used directly by a required shell prop. The prop must be supplied;{" "}
          <code>navigationGroups</code> and <code>breadcrumbs</code> may still be empty arrays.
        </div>
        <p>
          <code>ComponentChildren</code>, <code>ComponentType</code> and <code>JSX</code> in these
          definitions are Preact types. The copied <code>types.ts</code> already imports them.
        </p>
        <div class="blocks-api-types">{dataTypes.map(definition)}</div>
        <p class="blocks-doc-note">
          <strong>Branch selection:</strong> an active child also highlights its parent branch, even
          when the parent's own <code>active</code> is false. An active branch starts expanded;
          later path changes update highlighting without resetting its disclosure while mounted. In
          desktop icon mode, the branch becomes a dropdown containing its destinations.
        </p>
      </section>

      <section class="blocks-api-section" aria-labelledby="application-shell-callbacks">
        <h3 id="application-shell-callbacks" tabIndex={-1}>
          <ShellHeadingLink id="application-shell-callbacks">
            Navigation and callbacks
          </ShellHeadingLink>
        </h3>
        <div role="paragraph">
          Native links need no callback. For client routing{" "}
          <RequiredIndicator
            label="Client routing requirement"
            tooltip="Cancel handled navigation"
          />
          , supply <code>onNavigate</code> and cancel only the clicks your router handles. Keep{" "}
          <code>currentPath</code> and breadcrumbs in sync with your router; the shell does not
          infer either.
        </div>
        {definition({
          name: "ApplicationShellNavigate",
          title: "Navigation handler",
          description:
            "Receives a destination and the Preact click event from its link or action button.",
          note: (
            <>
              Only <code>label</code> and optional <code>href</code> are guaranteed on the
              destination. A leaf without a URL calls this handler as an action button; a branch
              without a URL only toggles its submenu.
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
          <strong>Mobile navigation:</strong> ordinary brand and navigation selections close the
          mobile sheet after the callback runs, including when it calls{" "}
          <code>preventDefault()</code>. Modified clicks leave the sheet open. Disabled destinations
          do not call the handler.
        </p>
        {definition({
          name: "ApplicationShellUserAction",
          title: "Account menu actions",
          description:
            "The exact action identifiers passed to onUserAction, without a click event.",
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
              <code>defaultOpen={"{false}"}</code> to start with icons. <code>onOpenChange</code>{" "}
              can observe changes without owning state.
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
              <code>onOpenChange</code>; otherwise the sidebar keeps the supplied state. Your app
              owns desktop expansion in this mode.
            </dd>
          </div>
        </dl>
        <CodeBlock code={stateExample} language="tsx" />
        <p class="blocks-doc-note">
          <strong>Desktop and mobile are separate.</strong> Below 768px the sidebar uses an
          independently managed sheet that starts closed when the shell mounts. The toggle opens
          that sheet instead of changing desktop expansion, so mobile toggles do not call{" "}
          <code>onOpenChange</code>. Setting <code>open</code> or <code>defaultOpen</code> does not
          open the mobile sheet; your desktop preference still applies when returning to a wider
          screen.
        </p>
        <p class="blocks-api-example-intro">
          <strong>Remember the desktop preference.</strong> In <code>AppFrame</code> above, replace{" "}
          <code>useState(true)</code> with <code>useDesktopSidebarPreference()</code> and keep the
          same <code>open</code>/<code>onOpenChange</code> wiring. Add this hook in the same file,
          or import it from a local module. It restores the saved value after mounting and saves new
          values only when the desktop toggle changes them.
        </p>
        <CodeBlock code={persistedStateExample} language="tsx" />
        <dl class="blocks-doc-callouts">
          <div>
            <dt>What is remembered</dt>
            <dd>
              Only desktop expansion is saved in this browser for this site. A missing or invalid
              value falls back to expanded; blocked storage leaves the toggle usable without
              persistence. The mobile sheet and navigation submenu states are not saved.
            </dd>
          </div>
          <div>
            <dt>First render</dt>
            <dd>
              Reading storage in <code>useEffect</code> keeps server rendering safe. The sidebar may
              briefly appear expanded before a saved collapsed preference is restored. To avoid that
              shift, your server can read the core sidebar's <code>sidebar_state</code> cookie and
              pass its parsed boolean as <code>defaultOpen</code> on the first render, or initialize
              controlled state with it. The core writes this cookie but does not restore it
              automatically.
            </dd>
          </div>
        </dl>
      </section>
    </section>
  );
};
