import {
  ChevronDownIcon,
  ComponentIcon,
  LayersIcon,
  PackageIcon,
  TextCursorInputIcon,
} from "@kamod-ch/icons/lucide";
import {
  ComponentsIcon,
  CubeUnfoldedIcon,
  FormsIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  RocketIcon,
  WandIcon,
} from "@kamod-ch/icons/tabler/outline";
import {
  Badge,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SheetClose,
} from "@kamod-ch/ui";
import { useId } from "preact/hooks";
import { useNavigationGroup } from "./NavigationScrollArea";
import { isNavigationCurrent, type NavigationGroup, type NavigationLink } from "./navigation-data";

const groupIcons = {
  components: ComponentIcon,
  blocks: LayersIcon,
  forms: TextCursorInputIcon,
  packages: PackageIcon,
};

const specialLinkIcons = {
  components: ComponentsIcon,
  blocks: LayoutDashboardIcon,
  forms: FormsIcon,
  packages: CubeUnfoldedIcon,
  "getting-started": RocketIcon,
  styles: WandIcon,
  theming: PaletteIcon,
};

function DirectoryLink({
  link,
  pathname,
  overview = false,
  guide = false,
  closeOnNavigate,
}: {
  link: NavigationLink;
  pathname: string;
  overview?: boolean;
  guide?: boolean;
  closeOnNavigate: boolean;
}) {
  const status = link.planned ? "Planned" : link.updated ? "Updated" : undefined;
  const SpecialIcon = link.icon ? specialLinkIcons[link.icon] : undefined;
  const showCount = link.variantCount !== undefined && !(link.planned && link.variantCount === 0);
  const description =
    link.variantCount === undefined
      ? status
      : `${link.variantCount} ${link.variantCount === 1 ? "variant" : "variants"}${link.planned ? " · Planned collection — page not available yet" : ""}`;
  const anchor = (
    <a
      href={link.href}
      class={`site-navigation-link${overview || guide ? " site-navigation-link-overview" : ""}`}
      data-block-placeholder={link.planned ? "" : undefined}
      aria-label={link.variantCount !== undefined ? link.label : undefined}
      title={description}
      aria-current={
        isNavigationCurrent(pathname, link.href)
          ? "page"
          : isNavigationCurrent(pathname, link.href, link.matchDescendants)
            ? "location"
            : undefined
      }
    >
      <span>{link.label}</span>
      {(status || showCount || SpecialIcon) && (
        <span class="site-navigation-link-meta" aria-hidden="true">
          {status && (
            <Badge
              variant="primary"
              size="xxs"
              class="site-navigation-status"
              data-status={link.planned ? "planned" : "updated"}
            >
              <span class="site-navigation-status-dot" aria-hidden="true" />
              {status}
            </Badge>
          )}
          {showCount && <span class="site-navigation-variant-count">{link.variantCount}</span>}
          {SpecialIcon && (
            <SpecialIcon
              class="site-navigation-special-icon"
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          )}
        </span>
      )}
    </a>
  );
  return closeOnNavigate ? <SheetClose asChild>{anchor}</SheetClose> : anchor;
}

function DirectoryGroup({
  group,
  pathname,
  closeOnNavigate,
}: {
  group: NavigationGroup;
  pathname: string;
  closeOnNavigate: boolean;
}) {
  const id = useId();
  const Icon = groupIcons[group.kind];
  const current = [group.overview, ...(group.guides ?? []), ...group.links].some((link) =>
    isNavigationCurrent(pathname, link.href, link.matchDescendants),
  );
  const disclosure = useNavigationGroup(group.id, current);
  return (
    <Collapsible class="site-navigation-group" {...disclosure}>
      <CollapsibleTrigger
        class="site-navigation-group-trigger"
        aria-controls={id}
        data-navigation-group={group.id}
        data-current={current || undefined}
        data-tooltip={`${(disclosure.open ?? disclosure.defaultOpen) ? "Collapse" : "Expand"} ${group.label}`}
      >
        <span class="site-navigation-group-icon">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span>
          {group.label}
          <small>{group.kind === "blocks" ? "Layout collections" : "Documentation"}</small>
        </span>
        <span
          class="site-navigation-count"
          aria-label={`${group.links.length} ${group.kind === "blocks" ? "collections" : "pages"}`}
        >
          {group.links.length}
        </span>
        <ChevronDownIcon class="site-navigation-chevron" size={16} aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent id={id} duration="180ms">
        <ul class="site-navigation-links">
          <li class={!group.guides?.length ? "site-navigation-intro-end" : undefined}>
            <DirectoryLink
              link={group.overview}
              pathname={pathname}
              overview
              closeOnNavigate={closeOnNavigate}
            />
          </li>
          {group.guides?.map((link, index, guides) => (
            <li
              key={link.href}
              class={index === guides.length - 1 ? "site-navigation-intro-end" : undefined}
            >
              <DirectoryLink
                link={link}
                pathname={pathname}
                guide
                closeOnNavigate={closeOnNavigate}
              />
            </li>
          ))}
          {group.links.map((link) => (
            <li key={link.href}>
              <DirectoryLink link={link} pathname={pathname} closeOnNavigate={closeOnNavigate} />
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
  closeOnNavigate = false,
}: {
  groups: NavigationGroup[];
  pathname: string;
  closeOnNavigate?: boolean;
}) {
  return (
    <nav aria-label="Browse all pages" class="site-navigation-directory">
      {groups.map((group) => (
        <DirectoryGroup
          key={`${group.id}:${pathname}`}
          group={group}
          pathname={pathname}
          closeOnNavigate={closeOnNavigate}
        />
      ))}
    </nav>
  );
}
