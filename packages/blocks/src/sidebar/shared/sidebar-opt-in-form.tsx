import { Checkbox, Label, SidebarGroup, SidebarGroupContent } from "@kamod-ch/ui";

export const SidebarOptInForm = () => (
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupContent class="px-2">
      <form class="flex items-start gap-2 rounded-lg border border-sidebar-border p-3">
        <Checkbox id="sidebar-opt-in" defaultChecked />
        <div class="grid gap-1.5 leading-none">
          <Label htmlFor="sidebar-opt-in" class="text-sm font-normal">
            Enable notifications
          </Label>
          <p class="text-xs text-muted-foreground">You can change this in settings.</p>
        </div>
      </form>
    </SidebarGroupContent>
  </SidebarGroup>
);
