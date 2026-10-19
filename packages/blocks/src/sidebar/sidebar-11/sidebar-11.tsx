import { ChevronDownIcon, FileIcon, FolderIcon } from "@kamod-ch/icons/lucide";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { KamodIcon } from "../../shared/branding/kamod-icon";
import { filesTree } from "../data/file-tree-data";
import { DashboardShell } from "../shared/dashboard-shell";
import { stopNavigation } from "../shared/navigation";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar11 = () => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ app: true });
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <KamodIcon class="size-4" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-medium">Kamod UI</span>
                  <span class="text-xs">Source workspace</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explorer</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filesTree.map((folder) => (
                  <Collapsible
                    key={folder.name}
                    open={Boolean(openFolders[folder.name])}
                    onOpenChange={(next) =>
                      setOpenFolders((current) => ({ ...current, [folder.name]: next }))
                    }
                    class="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <FolderIcon />
                          <span>{folder.name}</span>
                          <ChevronDownIcon class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {folder.items.map((file) => (
                            <SidebarMenuSubItem key={file}>
                              <SidebarMenuSubButton href="#" onClick={stopNavigation}>
                                <FileIcon />
                                <span>{file}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <DashboardShell
        breadcrumbs={[
          { label: "components", href: "#", hiddenOnMobile: true },
          { label: "ui", href: "#", hiddenOnMobile: true },
          { label: "button.tsx" },
        ]}
      />
    </SidebarProvider>
  );
};
