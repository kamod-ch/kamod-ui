/**
 * @file Data-driven sidebar navigation with one level of child destinations.
 * Expanded branches use Collapsible; desktop icon mode exposes their links in Dropdown menus.
 */
import { ChevronRightIcon, CircleIcon } from "@kamod-ch/icons/lucide";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dropdown,
  DropdownLabel,
  DropdownSeparator,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@kamod-ch/ui";
import { useId } from "preact/hooks";
import { MenuContent, MenuItem, MenuTrigger } from "./menu";
import type {
  ApplicationShell1Props,
  ApplicationShellNavigate,
  ApplicationShellNavigationItem,
  ApplicationShellNavigationLink,
} from "./types";

/** Navigation-only slice of the public shell props, shared by the group renderer. */
type NavProps = Pick<ApplicationShell1Props, "navigationGroups" | "currentPath" | "onNavigate">;

/** Resolves explicit active state first; otherwise requires an exact, defined URL match. */
const isActive = (item: ApplicationShellNavigationLink, path?: string) =>
  item.active ?? (item.href !== undefined && item.href === path);

/**
 * Renders a native link or callback-only button with active and disabled semantics.
 * Top-level links receive a fallback icon and an icon-mode tooltip; child links do not.
 *
 * @param props - Destination and navigation context; `sub` selects the child-link wrapper.
 */
const NavLink = ({
  item,
  currentPath,
  onNavigate,
  sub = false,
}: {
  item: ApplicationShellNavigationLink;
  currentPath?: string;
  onNavigate?: ApplicationShellNavigate;
  sub?: boolean;
}) => {
  const { state, isMobile } = useSidebar();
  const Icon = item.icon ?? (sub ? undefined : CircleIcon);
  const content = (
    <>
      {Icon && (
        <Icon strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" />
      )}
      <span>{item.label}</span>
    </>
  );
  const active = isActive(item, currentPath);
  // Disabled anchors lose both href and tab access; aria-disabled alone cannot prevent navigation.
  const element = item.href ? (
    <a
      href={item.disabled ? undefined : item.href}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      aria-disabled={item.disabled || undefined}
      tabIndex={item.disabled ? -1 : undefined}
      onClick={(event) => {
        if (item.disabled) event.preventDefault();
        else onNavigate?.(item, event);
      }}
    >
      {content}
    </a>
  ) : (
    <button
      type="button"
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      disabled={item.disabled}
      onClick={(event) => onNavigate?.(item, event)}
    >
      {content}
    </button>
  );
  return sub ? (
    <SidebarMenuSubButton asChild isActive={active}>
      {element}
    </SidebarMenuSubButton>
  ) : (
    <SidebarMenuButton
      asChild
      isActive={active}
      tooltip={state === "collapsed" && !isMobile ? item.label : undefined}
    >
      {element}
    </SidebarMenuButton>
  );
};

/**
 * Exposes a parent and its children as an expanded disclosure or an icon-mode menu.
 * An active parent or child initially opens the disclosure. Later route changes update
 * highlighting without resetting the user's expanded/collapsed choice.
 *
 * @param props - A non-empty branch and the shell's current path and navigation callback.
 */
const NavBranch = ({
  item,
  currentPath,
  onNavigate,
}: {
  item: ApplicationShellNavigationItem;
  currentPath?: string;
  onNavigate?: ApplicationShellNavigate;
}) => {
  const { state, isMobile } = useSidebar();
  const contentId = useId();
  const Icon = item.icon ?? CircleIcon;
  const active =
    isActive(item, currentPath) || item.items?.some((child) => isActive(child, currentPath));

  // SidebarMenuSub is hidden in icon mode; keep its destinations reachable via a menu.
  if (state === "collapsed" && !isMobile) {
    return (
      <Dropdown
        class="w-full"
        onKeyDown={(event) => {
          if (event.key === "Escape" && event.defaultPrevented) event.stopPropagation();
        }}
      >
        <SidebarMenuButton asChild isActive={active}>
          <MenuTrigger
            disabled={item.disabled}
            aria-label={item.label}
            class="justify-start border-0 bg-transparent shadow-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Icon strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" />
            <span>{item.label}</span>
          </MenuTrigger>
        </SidebarMenuButton>
        <MenuContent side="right" align="start" class="w-56 bg-popover motion-reduce:animate-none">
          <DropdownLabel>{item.label}</DropdownLabel>
          <DropdownSeparator />
          {(item.href ? [item, ...(item.items ?? [])] : (item.items ?? [])).map((child) => (
            <MenuItem
              key={child.id}
              href={item.disabled || child.disabled ? undefined : child.href}
              disabled={item.disabled || child.disabled}
              aria-disabled={item.disabled || child.disabled || undefined}
              aria-current={isActive(child, currentPath) ? "page" : undefined}
              class="px-2 py-1.5"
              onClick={(event: Parameters<ApplicationShellNavigate>[1]) =>
                onNavigate?.(child, event)
              }
            >
              <span class="truncate">{child.label}</span>
            </MenuItem>
          ))}
        </MenuContent>
      </Dropdown>
    );
  }

  return (
    <Collapsible defaultOpen={active} class="group/nav-branch">
      {item.href ? (
        <>
          <NavLink item={item} currentPath={currentPath} onNavigate={onNavigate} />
          <CollapsibleTrigger asChild aria-controls={contentId}>
            <SidebarMenuAction aria-label={`Toggle ${item.label}`} disabled={item.disabled}>
              <ChevronRightIcon
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                class="transition-transform group-data-[state=open]/nav-branch:rotate-90 motion-reduce:transition-none"
              />
            </SidebarMenuAction>
          </CollapsibleTrigger>
        </>
      ) : (
        <CollapsibleTrigger asChild aria-controls={contentId}>
          <SidebarMenuButton isActive={active} disabled={item.disabled} aria-label={item.label}>
            <Icon strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" />
            <span class="min-w-0 flex-1 truncate">{item.label}</span>
            <ChevronRightIcon
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              class="ml-auto transition-transform group-data-[state=open]/nav-branch:rotate-90 motion-reduce:transition-none"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
      )}
      <CollapsibleContent id={contentId}>
        <SidebarMenuSub>
          {item.items?.map((child) => (
            <SidebarMenuSubItem key={child.id}>
              <NavLink
                item={{ ...child, disabled: item.disabled || child.disabled }}
                sub
                currentPath={currentPath}
                onNavigate={onNavigate}
              />
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

/**
 * Renders ordered groups inside the main navigation landmark, omitting absent group labels.
 * Must share SidebarProvider with the shell so branches can respond to desktop icon mode.
 *
 * @param props - Groups, optional exact-match path and optional activation handler.
 */
export const NavMain = ({ navigationGroups, currentPath, onNavigate }: NavProps) => (
  <nav aria-label="Main navigation">
    {navigationGroups.map((group) => (
      <SidebarGroup key={group.id}>
        {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.id}>
                {item.items?.length ? (
                  <NavBranch item={item} currentPath={currentPath} onNavigate={onNavigate} />
                ) : (
                  <NavLink item={item} currentPath={currentPath} onNavigate={onNavigate} />
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ))}
  </nav>
);
