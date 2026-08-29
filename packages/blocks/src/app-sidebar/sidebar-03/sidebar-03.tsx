import { CheckIcon, ChevronsUpDownIcon } from "@kamod-ch/icons/lucide";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { renderBlockLink } from "../../shared";
import { isNavItemActive, stopDemoNavigation } from "../shared/active";
import { docsNavGroups, docsVersions } from "../shared/data";
import { AppSearchField } from "../shared/search-field";
import type { AppNavGroup, AppSidebarLinkProps } from "../shared/types";

export type AppSidebar03Props = AppSidebarLinkProps & {
  versions?: string[];
  version?: string;
  defaultVersion?: string;
  onVersionChange?: (version: string) => void;
  groups?: AppNavGroup[];
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  collapsible?: "offcanvas" | "icon" | "none";
};

export const AppSidebar03 = ({
  versions = docsVersions,
  version,
  defaultVersion,
  onVersionChange,
  groups = docsNavGroups,
  searchValue,
  defaultSearchValue = "",
  onSearchChange,
  collapsible = "offcanvas",
  ...link
}: AppSidebar03Props) => {
  const [uncontrolledVersion, setUncontrolledVersion] = useState(defaultVersion ?? versions[0]);
  const [uncontrolledSearch, setUncontrolledSearch] = useState(defaultSearchValue);
  const selectedVersion = version ?? uncontrolledVersion;
  const query = searchValue ?? uncontrolledSearch;
  const normalized = query.trim().toLowerCase();

  const selectVersion = (next: string) => {
    if (version === undefined) setUncontrolledVersion(next);
    onVersionChange?.(next);
  };

  const setQuery = (next: string) => {
    if (searchValue === undefined) setUncontrolledSearch(next);
    onSearchChange?.(next);
  };

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: normalized
        ? group.items.filter((item) => item.label.toLowerCase().includes(normalized))
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible={collapsible} data-slot="block-app-sidebar-03">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dropdown>
              <DropdownTrigger
                class="h-auto w-full justify-start gap-2 px-2 py-1.5"
                aria-label="Switch documentation version"
              >
                <span class="grid flex-1 text-left text-sm leading-tight">
                  <span class="font-medium">Documentation</span>
                  <span class="text-xs">v{selectedVersion}</span>
                </span>
                <ChevronsUpDownIcon class="ml-auto size-4" />
              </DropdownTrigger>
              <DropdownContent class="min-w-56" align="start">
                {versions.map((item) => (
                  <DropdownItem key={item} onClick={() => selectVersion(item)}>
                    v{item}
                    {item === selectedVersion ? <CheckIcon class="ml-auto size-4" /> : null}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </SidebarMenuItem>
        </SidebarMenu>
        <AppSearchField
          id="app-sidebar-03-search"
          value={query}
          onInput={(event) => setQuery((event.currentTarget as HTMLInputElement).value)}
        />
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((group) => {
          const hasActive = group.items.some((item) => isNavItemActive(item, link));
          return (
            <Collapsible
              key={group.id}
              defaultOpen={hasActive || Boolean(normalized)}
              class="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger class="w-full">
                    {group.label}
                    <ChevronsUpDownIcon class="ml-auto size-4" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const isActive = isNavItemActive(item, link);
                        return (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                              {renderBlockLink(link.linkComponent, {
                                href: item.href,
                                "aria-current": isActive ? "page" : undefined,
                                onClick: (event) => {
                                  stopDemoNavigation(event, item.href);
                                  link.onNavigate?.(item);
                                },
                                children: <span>{item.label}</span>,
                              })}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
