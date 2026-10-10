import {
  BracesIcon,
  ChevronDownIcon,
  ComponentIcon,
  LayersIcon,
  PackageIcon,
  TextCursorInputIcon,
} from "@kamod-ch/icons/lucide";
import {
  BulbIcon,
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
import { linkTitle } from "../../link-title";
import { useNavigationGroup } from "./NavigationScrollArea";
import { isNavigationCurrent, type NavigationGroup, type NavigationLink } from "./navigation-data";

const groupIcons = {
  components: ComponentIcon,
  blocks: LayersIcon,
  forms: TextCursorInputIcon,
  packages: PackageIcon,
};

const groupDescriptions: Record<NavigationGroup["kind"], string> = {
  components: "UI Building Blocks",
  blocks: "Application Layouts",
  forms: "Inputs & Validation",
  packages: "Tools & Integrations",
};

const specialLinkIcons = {
  components: ComponentsIcon,
  blocks: LayoutDashboardIcon,
  forms: FormsIcon,
  packages: CubeUnfoldedIcon,
  "getting-started": RocketIcon,
  styles: WandIcon,
  theming: PaletteIcon,
  utility: BracesIcon,
};

const navigationStatuses = {
  planned: { label: "Planned", icon: BulbIcon },
  added: { label: "Fresh", icon: RocketIcon },
  updated: { label: "Updated", icon: WandIcon },
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
  const introductory = overview || guide;
  const variantCount = introductory ? undefined : link.variantCount;
  const status = introductory
    ? undefined
    : link.planned
      ? "planned"
      : link.added
        ? "added"
        : link.updated
          ? "updated"
          : undefined;
  const statusDescription =
    status === "added"
      ? "Fresh — newly added to the library"
      : status && navigationStatuses[status].label;
  const StatusIcon = status ? navigationStatuses[status].icon : undefined;
  const SpecialIcon = link.icon ? specialLinkIcons[link.icon] : undefined;
  const showCount = variantCount !== undefined && !(link.planned && variantCount === 0);
  const description =
    variantCount === undefined
      ? statusDescription
      : `${variantCount} ${variantCount === 1 ? "variant" : "variants"}${link.planned ? " · Planned collection — page not available yet" : statusDescription ? ` · ${statusDescription}` : ""}`;
  const anchor = (
    <a
      href={link.href}
      class={`site-navigation-link${introductory ? " site-navigation-link-overview" : ""}`}
      data-block-placeholder={link.planned ? "" : undefined}
      aria-label={variantCount !== undefined ? linkTitle(link.label) : undefined}
      aria-description={description}
      data-tooltip="off"
      aria-current={
        isNavigationCurrent(pathname, link.href)
          ? "page"
          : isNavigationCurrent(pathname, link.href, link.matchDescendants)
            ? "location"
            : undefined
      }
    >
      <span class="site-navigation-link-label">
        <span>{linkTitle(link.label)}</span>
      </span>
      {(status || showCount || SpecialIcon) && (
        <span class="site-navigation-link-meta" aria-hidden="true">
          {status && StatusIcon && (
            <Badge variant="default" size="xxs" class="site-navigation-status" data-status={status}>
              <StatusIcon size={10} strokeWidth={2} aria-hidden="true" />
              <span>{navigationStatuses[status].label}</span>
            </Badge>
          )}
          {status && showCount && <span class="site-navigation-status-separator">·</span>}
          {showCount && <span class="site-navigation-variant-count">{variantCount}</span>}
          {SpecialIcon && (
            <SpecialIcon
              class="site-navigation-special-icon"
              size={20}
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
  const count = group.links.length;
  return (
    <Collapsible class="site-navigation-group" data-kind={group.kind} {...disclosure}>
      <CollapsibleTrigger
        class="site-navigation-group-trigger"
        aria-controls={id}
        data-navigation-group={group.id}
        data-navigation-count={count}
        data-current={current || undefined}
      >
        <span class="site-navigation-group-icon">
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span>
          {group.label}
          <small>{groupDescriptions[group.kind]}</small>
        </span>
        <span
          class="site-navigation-count"
          aria-label={`${count} ${group.kind === "blocks" ? "collections" : "pages"}`}
        >
          {count}
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
              class={
                group.links.length > 0 && index === guides.length - 1
                  ? "site-navigation-intro-end"
                  : undefined
              }
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
