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
import {
  flattenNavigationLinks,
  isNavigationCurrent,
  type NavigationGroup,
  type NavigationLink,
} from "./navigation-data";

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

/** A collection remains a normal link; its separate toggle reveals individual variants. */
function DirectoryEntry({ link, pathname }: { link: NavigationLink; pathname: string }) {
  const id = useId();
  if (!link.children?.length) return <DirectoryLink link={link} pathname={pathname} />;
  const current = flattenNavigationLinks([link]).some((entry) =>
    isNavigationCurrent(pathname, entry.href),
  );
  return (
    <Collapsible class="site-navigation-collection" defaultOpen={current}>
      <div class="site-navigation-collection-row">
        <DirectoryLink link={link} pathname={pathname} />
        <CollapsibleTrigger
          class="site-navigation-collection-toggle"
          aria-controls={id}
          aria-label={`Toggle ${link.label} variants`}
        >
          <span>{link.children.length}</span>
          <ChevronDownIcon size={14} aria-hidden="true" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent id={id} duration="180ms">
        <ul class="site-navigation-links site-navigation-variant-links">
          {link.children.map((child) => (
            <li key={child.href}>
              <DirectoryLink link={child} pathname={pathname} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DirectoryGroup({ group, pathname }: { group: NavigationGroup; pathname: string }) {
  const id = useId();
  const Icon = groupIcons[group.kind];
  const current = [group.overview, ...flattenNavigationLinks(group.links)].some((link) =>
    isNavigationCurrent(pathname, link.href),
  );
  return (
    <Collapsible class="site-navigation-group" defaultOpen={current}>
      <CollapsibleTrigger class="site-navigation-group-trigger" aria-controls={id}>
        <span class="site-navigation-group-icon">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span>
          {group.label}
          <small>{group.kind === "blocks" ? "Layout collections" : "Documentation"}</small>
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
              <DirectoryEntry link={link} pathname={pathname} />
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
}: {
  groups: NavigationGroup[];
  pathname: string;
}) {
  return (
    <nav aria-label="Browse all pages" class="site-navigation-directory">
      {groups.map((group) => (
        <DirectoryGroup key={group.id} group={group} pathname={pathname} />
      ))}
    </nav>
  );
}
