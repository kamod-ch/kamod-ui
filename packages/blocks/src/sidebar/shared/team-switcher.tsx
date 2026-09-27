import { CheckIcon, ChevronsUpDownIcon } from "@kamod-ch/icons/lucide";
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
import { KamodIconFrame } from "../../shared/branding/kamod-icon-frame";

export const TeamSwitcher = ({ teams }: TeamSwitcherProps) => {
  const [activeName, setActiveName] = useState(teams[0]?.name);
  const activeTeam = teams.find((team) => team.name === activeName) ?? teams[0];
  const renderTeamLogo = (logo: string, size: "sm" | "md" = "md") => {
    if (logo === "kamod") {
      return (
        <KamodIconFrame
          size={size}
          frameClass={size === "sm" ? "size-6 rounded-sm" : "aspect-square size-8 rounded-lg"}
        />
      );
    }
    return logo;
  };
  if (!activeTeam) return null;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown>
          <DropdownTrigger asChild>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {activeTeam.logo === "kamod" ? (
                renderTeamLogo(activeTeam.logo)
              ) : (
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                  {renderTeamLogo(activeTeam.logo)}
                </div>
              )}
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{activeTeam.name}</span>
                <span class="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDownIcon class="ml-auto" />
            </SidebarMenuButton>
          </DropdownTrigger>
          <DropdownContent class="w-(--radix-dropdown-menu-trigger-width) min-w-56" align="start">
            {teams.map((team) => (
              <DropdownItem key={team.name} onClick={() => setActiveName(team.name)}>
                {team.logo === "kamod" ? (
                  renderTeamLogo(team.logo, "sm")
                ) : (
                  <div class="flex size-6 items-center justify-center rounded-sm border">
                    {renderTeamLogo(team.logo, "sm")}
                  </div>
                )}
                {team.name}
                {team.name === activeTeam.name ? <CheckIcon class="ml-auto size-4" /> : null}
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export type Team = {
  name: string;
  logo: string;
  plan: string;
};

export type TeamSwitcherProps = {
  teams: Team[];
};
