import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Input, type InputProps } from "../input/Input";
import { Separator, type SeparatorProps } from "../separator/Separator";
import { Slot } from "./slot";

export type SidebarInputProps = InputProps;

export const SidebarInput = ({ class: className, ...rest }: SidebarInputProps) => (
  <Input
    data-slot="sidebar-input"
    data-sidebar="input"
    class={cn("h-8 w-full bg-background shadow-none", className)}
    {...rest}
  />
);

export type SidebarSeparatorProps = SeparatorProps;

export const SidebarSeparator = ({ class: className, ...rest }: SidebarSeparatorProps) => (
  <Separator
    data-slot="sidebar-separator"
    data-sidebar="separator"
    class={cn("mx-2 w-auto bg-sidebar-border", className)}
    {...rest}
  />
);

export type SidebarGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const SidebarGroup = ({ class: className, children, ...rest }: SidebarGroupProps) => (
  <div
    data-slot="sidebar-group"
    data-sidebar="group"
    class={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...rest}
  >
    {children}
  </div>
);

export type SidebarGroupLabelProps = JSX.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
};

export const SidebarGroupLabel = ({
  class: className,
  asChild = false,
  children,
  ...rest
}: SidebarGroupLabelProps) => {
  const classes = cn(
    "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
    className as string | undefined,
  );
  if (asChild) {
    return (
      <Slot
        data-slot="sidebar-group-label"
        data-sidebar="group-label"
        class={classes}
        {...(rest as Record<string, unknown>)}
      >
        {children}
      </Slot>
    );
  }
  return (
    <div data-slot="sidebar-group-label" data-sidebar="group-label" class={classes} {...rest}>
      {children}
    </div>
  );
};

export type SidebarGroupActionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
};

export const SidebarGroupAction = ({
  class: className,
  asChild = false,
  children,
  ...rest
}: SidebarGroupActionProps) => {
  const classes = cn(
    "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    "after:absolute after:-inset-2 md:after:hidden",
    "group-data-[collapsible=icon]:hidden",
    className as string | undefined,
  );
  if (asChild) {
    return (
      <Slot
        data-slot="sidebar-group-action"
        data-sidebar="group-action"
        class={classes}
        {...(rest as Record<string, unknown>)}
      >
        {children}
      </Slot>
    );
  }
  return (
    <button
      type="button"
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      class={classes}
      {...rest}
    >
      {children}
    </button>
  );
};

export type SidebarGroupContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const SidebarGroupContent = ({
  class: className,
  children,
  ...rest
}: SidebarGroupContentProps) => (
  <div
    data-slot="sidebar-group-content"
    data-sidebar="group-content"
    class={cn("w-full text-sm", className)}
    {...rest}
  >
    {children}
  </div>
);
