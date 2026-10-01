import { ChevronRightIcon } from "@kamod-ch/icons/lucide";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import type { NavigationLink } from "./navigation";
import { stopNavigation } from "./navigation";

export type DocumentationGroup = {
  title: string;
  items: NavigationLink[];
};

function DocumentationLinks({ items }: { items: NavigationLink[] }) {
  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={Boolean(item.isActive)}>
              <a
                href={item.url}
                onClick={stopNavigation}
                aria-current={item.isActive ? "page" : undefined}
              >
                {item.title}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}

/** Documentation groups optionally disclose their links; the active group starts open. */
export const NavDocs = ({ groups, collapsibleSections = false }: NavDocsProps) => (
  <>
    {groups.map((group) => {
      const hasActiveItem = group.items.some((item) => item.isActive);

      if (!collapsibleSections) {
        return (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <DocumentationLinks items={group.items} />
          </SidebarGroup>
        );
      }

      return (
        <Collapsible key={group.title} defaultOpen={hasActiveItem} class="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              class="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                {group.title}
                <ChevronRightIcon class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <DocumentationLinks items={group.items} />
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      );
    })}
  </>
);

/** Inputs supplied by the containing page; demo fixtures are kept separately. */
export type NavDocsProps = {
  groups: DocumentationGroup[];
  collapsibleSections?: boolean;
};
