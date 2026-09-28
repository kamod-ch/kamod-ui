import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  ComponentIcon,
  LayersIcon,
  PackageIcon,
  TextCursorInputIcon,
} from "@kamod-ch/icons/lucide";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, SheetClose } from "@kamod-ch/ui";
import { useId } from "preact/hooks";
import { withBasePath } from "../../base-path";
import { isNavigationCurrent, type NavigationGroup, type NavigationLink } from "./navigation-data";

const groupIcons = {
  components: ComponentIcon,
  blocks: LayersIcon,
  forms: TextCursorInputIcon,
  packages: PackageIcon,
};

function DirectoryLink({
  link,
  pathname,
  overview = false,
}: {
  link: NavigationLink;
  pathname: string;
  overview?: boolean;
}) {
  return (
    <SheetClose asChild>
      <a
        href={link.href}
        class="site-navigation-link"
        aria-current={isNavigationCurrent(pathname, link.href) ? "page" : undefined}
      >
        <span>{link.label}</span>
        {overview && <ArrowUpRightIcon size={14} aria-hidden="true" />}
      </a>
    </SheetClose>
  );
}

function DirectoryGroup({
  group,
  pathname,
  searching,
}: {
  group: NavigationGroup;
  pathname: string;
  searching: boolean;
}) {
  const id = useId();
  const Icon = groupIcons[group.kind];
  const current = [group.overview, ...group.links].some((link) =>
    isNavigationCurrent(pathname, link.href),
  );
  return (
    <Collapsible class="site-navigation-group" defaultOpen={searching || current}>
      <CollapsibleTrigger class="site-navigation-group-trigger" aria-controls={id}>
        <span class="site-navigation-group-icon">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span>
          {group.label}
          <small>{group.kind === "blocks" ? "Layout collection" : "Documentation"}</small>
        </span>
        <span class="site-navigation-count" aria-label={`${group.links.length} pages`}>
          {group.links.length}
        </span>
        <ChevronDownIcon class="site-navigation-chevron" size={16} aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent id={id} duration="180ms">
        <ul class="site-navigation-links">
          <li>
            <DirectoryLink link={group.overview} pathname={pathname} overview />
          </li>
          {group.links.map((link) => (
            <li key={link.href}>
              <DirectoryLink link={link} pathname={pathname} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function NavigationDirectory({
  groups,
  pathname,
  searching,
}: {
  groups: NavigationGroup[];
  pathname: string;
  searching: boolean;
}) {
  return (
    <nav aria-label="Browse all pages" class="site-navigation-directory">
      {!searching && (
        <DirectoryLink
          link={{ label: "Blocks overview", href: withBasePath("/blocks") }}
          pathname={pathname}
          overview
        />
      )}
      {groups.map((group) => (
        <DirectoryGroup
          key={`${group.id}-${searching}`}
          group={group}
          pathname={pathname}
          searching={searching}
        />
      ))}
    </nav>
  );
}
