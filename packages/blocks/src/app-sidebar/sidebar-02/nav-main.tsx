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
import { renderBlockLink } from "../../shared";
import { isNavItemActive, stopDemoNavigation } from "../shared/active";
import type { AppNavItem, AppSidebarLinkProps } from "../shared/types";

export const NavMain = ({ items, link }: { items: AppNavItem[]; link: AppSidebarLinkProps }) => (
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = isNavItemActive(item, link);
        if (!item.items?.length) {
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
                  children: (
                    <>
                      {Icon ? <Icon aria-hidden="true" /> : null}
                      <span>{item.label}</span>
                    </>
                  ),
                })}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }
        return (
          <Collapsible key={item.id} defaultOpen={isActive} class="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isActive} tooltip={item.label}>
                  {Icon ? <Icon aria-hidden="true" /> : null}
                  <span>{item.label}</span>
                  <ChevronRightIcon class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((sub) => {
                    const subActive = isNavItemActive(sub, link);
                    return (
                      <SidebarMenuSubItem key={sub.id}>
                        <SidebarMenuSubButton asChild isActive={subActive}>
                          {renderBlockLink(link.linkComponent, {
                            href: sub.href,
                            "aria-current": subActive ? "page" : undefined,
                            onClick: (event) => {
                              stopDemoNavigation(event, sub.href);
                              link.onNavigate?.(sub);
                            },
                            children: <span>{sub.label}</span>,
                          })}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  </SidebarGroup>
);
