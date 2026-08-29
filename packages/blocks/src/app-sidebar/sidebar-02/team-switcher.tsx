import { CheckIcon, ChevronsUpDownIcon } from "@kamod-ch/icons/lucide";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  SidebarMenu,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import type { AppTeam } from "../shared/types";

export type TeamSwitcherProps = {
  teams: AppTeam[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
};

export const TeamSwitcher = ({ teams, value, defaultValue, onValueChange }: TeamSwitcherProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? teams[0]?.id);
  const activeId = value ?? uncontrolled;
  const active = teams.find((team) => team.id === activeId) ?? teams[0];
  if (!active) return null;

  const select = (id: string) => {
    if (value === undefined) setUncontrolled(id);
    onValueChange?.(id);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown>
          <DropdownTrigger
            class="h-auto w-full justify-start gap-2 px-2 py-1.5"
            aria-label="Switch team"
          >
            <span class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
              {active.initials}
            </span>
            <span class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="truncate font-medium">{active.name}</span>
              <span class="truncate text-xs">{active.plan}</span>
            </span>
            <ChevronsUpDownIcon class="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownTrigger>
          <DropdownContent class="min-w-56" align="start">
            {teams.map((team) => (
              <DropdownItem key={team.id} onClick={() => select(team.id)}>
                <span class="flex size-6 items-center justify-center rounded-sm border text-xs">
                  {team.initials}
                </span>
                {team.name}
                {team.id === active.id ? <CheckIcon class="ml-auto size-4" /> : null}
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
