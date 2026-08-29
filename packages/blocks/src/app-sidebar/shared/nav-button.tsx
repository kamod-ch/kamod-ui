import { SidebarMenuButton } from "@kamod-ch/ui";
import { renderBlockLink } from "../../shared";
import { isNavItemActive, stopDemoNavigation } from "./active";
import type { AppNavItem, AppSidebarLinkProps } from "./types";

export const AppNavButton = ({
  item,
  link,
  size,
}: {
  item: AppNavItem;
  link: AppSidebarLinkProps;
  size?: "sm" | "lg" | "default";
}) => {
  const Icon = item.icon;
  const isActive = isNavItemActive(item, link);

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label} size={size}>
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
            {item.badge ? (
              <span class="ml-auto text-muted-foreground text-xs tabular-nums">{item.badge}</span>
            ) : null}
          </>
        ),
      })}
    </SidebarMenuButton>
  );
};
