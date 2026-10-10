import { BookOpenIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../base-path";
import { InlineCodeLink } from "../../docs/components/InlineCodeLink";
import { ReferenceHelpHeader } from "./ReferenceHelp";

const groups = {
  "getting-started": {
    title: "Getting Started",
    lead: "One small setup. A useful first screen.",
    description:
      "New to Kamod? Begin with the installation guide, connect your styles, then try a single component before assembling a whole page.",
    explore:
      "Follow the setup steps in order. Check the package requirements and load the shared stylesheet at your app’s entry point so every component receives the same foundation.",
    next: "Copy a small example, replace its demo content and try it with a keyboard. Once it works, choose a theme and add only the pieces your screen needs.",
    note: "Keep the component’s API reference nearby: preview code shows the composition, while the reference explains the supported props and events.",
    href: "/docs/getting-started",
    unit: "",
    links: [
      ["CSS Setup", "/docs/theming/css-setup"],
      ["Button", "/docs/button/installation"],
    ],
  },
  ecosystem: {
    title: "Kamod Ecosystem",
    lead: "A toolkit, not a shopping list.",
    description:
      "Kamod’s companion projects cover icons, reusable behavior, state, translations and more. Open this group to visit their source repositories; you can use just the tools your app needs.",
    explore:
      "Start with the package guides for setup and focused examples. Each repository has its own README, exports and release history—check those against the version you install.",
    next: "Choose by responsibility: hooks for reusable behavior, signals or state for changing data, and i18n for language support. Add one capability, then connect it to your existing components.",
    note: "Repository links open GitHub in a new tab, keeping your place in these docs. The Packages overview helps you compare the documented integrations before choosing.",
    href: "/docs/packages",
    unit: "",
    links: [
      ["Kamod Hooks", "/docs/hooks-package/installation"],
      ["Kamod i18n", "/docs/i18n-package/installation"],
    ],
  },
  components: {
    title: "Components",
    lead: "Start with one piece.",
    description:
      "Reusable controls for the details people click, type into and navigate every day.",
    explore: "Compare variants, keyboard behavior and supported props.",
    next: "Try the preview, then adapt the example to your app.",
    href: "/docs/components",
    unit: "components",
    links: [
      ["Button", "/docs/button/installation"],
      ["Input", "/docs/input/installation"],
    ],
  },
  blocks: {
    title: "Blocks",
    lead: "Give the pieces a home.",
    description:
      "Complete compositions with their supporting files, ready to become a useful screen.",
    explore: "Compare layouts and inspect the source file by file.",
    next: "Follow the setup guide, then connect your own data and routes.",
    href: "/blocks",
    unit: "collections · includes planned",
    links: [
      ["Application Shell", "/blocks/application-shell"],
      ["Sidebar", "/blocks/sidebar"],
    ],
  },
  forms: {
    title: "Forms",
    lead: "Turn inputs into a flow.",
    description:
      "Bring fields, useful feedback and submission together without making users guess what happens next.",
    explore: "Follow validation, error messages and pending states.",
    next: "Replace the demo submit handler with your own service.",
    href: "/docs/forms",
    unit: "guides",
    links: [
      ["Formisch", "/docs/formisch/installation"],
      ["Field", "/docs/field/installation"],
    ],
  },
  packages: {
    title: "Packages",
    lead: "Add one focused capability.",
    description:
      "Companion tools for behavior, shared state, icons and language support beyond the interface itself.",
    explore: "Compare responsibilities, setup and small working examples.",
    next: "Check imports and dependencies before adding a package.",
    href: "/docs/packages",
    unit: "package guides",
    links: [
      ["Kamod Hooks", "/docs/hooks-package/installation"],
      ["Kamod Signals", "/docs/signals-package/installation"],
    ],
  },
} as const;

export type NavigationHint = {
  title: string;
  group: keyof typeof groups;
  detail?: string;
};

/** Read only the intentional hover/focus target; no per-link listeners or DOM scans. */
export function navigationHelp(target: HTMLElement): NavigationHint | undefined {
  const key = target.dataset.navigationHelp ?? target.dataset.navigationGroup;
  if (key && Object.hasOwn(groups, key)) {
    const group = key as keyof typeof groups;
    const count = target.dataset.navigationCount;
    return {
      title: groups[group].title,
      group,
      detail: count ? `${count} ${groups[group].unit}` : undefined,
    };
  }
}

/** All sidebar help shares one lazy surface and keyboard-reachable references. */
export function NavigationTooltipContent({ hint }: { hint: NavigationHint }) {
  const group = groups[hint.group];
  return (
    <>
      <ReferenceHelpHeader
        title={hint.title}
        reference={{ label: group.href }}
        actions={[{ label: `Open ${group.title}`, href: group.href }]}
      />
      {hint.detail && <p class="reference-help-meta">{hint.detail}</p>}
      <p>
        <strong>{group.lead}</strong> {group.description}
      </p>
      <dl class="navigation-hint-steps">
        <div>
          <dt>Explore</dt>
          <dd>{group.explore}</dd>
        </div>
        <div>
          <dt>Make it yours</dt>
          <dd>{group.next}</dd>
        </div>
      </dl>
      {"note" in group && <p>{group.note}</p>}
      <div class="navigation-hint-references" aria-label="Useful starting points">
        {group.links.map(([label, href]) => (
          <InlineCodeLink key={href} href={href}>
            {label}
          </InlineCodeLink>
        ))}
      </div>
      <a class="navigation-hint-overview" href={withBasePath(group.href)}>
        <BookOpenIcon size={14} aria-hidden="true" />{" "}
        {hint.group === "ecosystem"
          ? "Compare the packages"
          : hint.group === "getting-started"
            ? "Open the setup guide"
            : `Browse ${group.title.toLowerCase()}`}
      </a>
    </>
  );
}
