import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { PanelLeftIcon } from "./PanelLeftIcon";
import { useSidebar } from "./SidebarProvider";

export type SidebarTriggerProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
  class?: string;
};

export const SidebarTrigger = ({ class: className, onClick, ...rest }: SidebarTriggerProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      type="button"
      class={cn("size-7", className)}
      aria-label="Toggle Sidebar"
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
    >
      <PanelLeftIcon />
      <span class="sr-only">Toggle Sidebar</span>
    </Button>
  );
};
