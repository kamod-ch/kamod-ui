import { CheckIcon, ChevronsUpDownIcon, GalleryVerticalEndIcon } from "@kamod-ch/icons/lucide";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";

export const VersionSwitcher = ({
  versions,
  defaultVersion,
}: {
  versions: string[];
  defaultVersion: string;
}) => {
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown>
          <DropdownTrigger asChild>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEndIcon class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-medium">Documentation</span>
                <span>v{selectedVersion}</span>
              </div>
              <ChevronsUpDownIcon class="ml-auto" />
            </SidebarMenuButton>
          </DropdownTrigger>
          <DropdownContent class="w-56" align="start">
            {versions.map((version) => (
              <DropdownItem key={version} onClick={() => setSelectedVersion(version)}>
                v{version}
                {version === selectedVersion ? <CheckIcon class="ml-auto" /> : null}
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
