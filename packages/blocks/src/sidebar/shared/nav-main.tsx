import { ChevronRightIcon } from "@kamod-ch/icons/lucide";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@kamod-ch/ui";
import type { NavigationLink } from "./navigation";
import { stopNavigation } from "./navigation";
import { iconMap } from "./navigation-icons";
import type { NavigationItem } from "./navigation-types";

function NavigationSubmenu({ items }: { items: NavigationLink[] }) {
  return (
    <SidebarMenuSub>
      {items.map((sub) => (
        <SidebarMenuSubItem key={sub.title}>
          <SidebarMenuSubButton href={sub.url} onClick={stopNavigation}>
            <span>{sub.title}</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );
}

export const NavMain = ({ items, collapsible = true }: NavMainProps) => (
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        if (!collapsible || !item.items?.length) {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <a
                  href={item.url}
                  onClick={stopNavigation}
                  aria-current={item.isActive ? "page" : undefined}
                >
                  <Icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? <NavigationSubmenu items={item.items} /> : null}
            </SidebarMenuItem>
          );
        }
        return (
          <Collapsible
            key={item.title}
            defaultOpen={Boolean(item.isActive)}
            class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                  <Icon />
                  <span>{item.title}</span>
                  <ChevronRightIcon class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <NavigationSubmenu items={item.items} />
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  </SidebarGroup>
);

/** Inputs supplied by the containing page; demo fixtures are kept separately. */
export type NavMainProps = {
  items: NavigationItem[];
  collapsible?: boolean;
};
