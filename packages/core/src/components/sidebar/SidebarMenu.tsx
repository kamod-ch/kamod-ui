import type { ComponentChildren, JSX } from "preact";
import { useMemo } from "preact/hooks";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { Skeleton } from "../skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { useSidebar } from "./SidebarProvider";
import { Slot } from "./slot";

export type SidebarMenuProps = JSX.HTMLAttributes<HTMLUListElement> & {
  children?: ComponentChildren;
};

export const SidebarMenu = ({ class: className, children, ...rest }: SidebarMenuProps) => (
  <ul
    data-slot="sidebar-menu"
    data-sidebar="menu"
    class={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...rest}
  >
    {children}
  </ul>
);

export type SidebarMenuItemProps = JSX.HTMLAttributes<HTMLLIElement> & {
  children?: ComponentChildren;
};

export const SidebarMenuItem = ({ class: className, children, ...rest }: SidebarMenuItemProps) => (
  <li
    data-slot="sidebar-menu-item"
    data-sidebar="menu-item"
    class={cn("group/menu-item relative", className)}
    {...rest}
  >
    {children}
  </li>
);

export const sidebarMenuButton = tv({
  base: [
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding]",
    "group-has-data-[sidebar=menu-action]/menu-item:pr-8",
    "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
    "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
    "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  ],
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline:
        "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type SidebarMenuButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof sidebarMenuButton> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | JSX.HTMLAttributes<HTMLDivElement>;
    children?: ComponentChildren;
  };

export const SidebarMenuButton = ({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  class: className,
  children,
  ...rest
}: SidebarMenuButtonProps) => {
  const { isMobile, state } = useSidebar();
  const classes = cn(sidebarMenuButton({ variant, size }), className);

  const button = asChild ? (
    <Slot
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      class={classes}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Slot>
  ) : (
    <button
      type="button"
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      class={classes}
      {...rest}
    >
      {children}
    </button>
  );

  if (!tooltip) return button;

  const tooltipProps =
    typeof tooltip === "string"
      ? { children: tooltip }
      : (tooltip as JSX.HTMLAttributes<HTMLDivElement>);

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltipProps}
      />
    </Tooltip>
  );
};

export type SidebarMenuActionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  showOnHover?: boolean;
  children?: ComponentChildren;
};

export const SidebarMenuAction = ({
  class: className,
  asChild = false,
  showOnHover = false,
  children,
  ...rest
}: SidebarMenuActionProps) => {
  const classes = cn(
    "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    "after:absolute after:-inset-2 md:after:hidden",
    "peer-data-[size=sm]/menu-button:top-1",
    "peer-data-[size=default]/menu-button:top-1.5",
    "peer-data-[size=lg]/menu-button:top-2.5",
    "group-data-[collapsible=icon]:hidden",
    showOnHover &&
      "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0",
    className as string | undefined,
  );
  if (asChild) {
    return (
      <Slot
        data-slot="sidebar-menu-action"
        data-sidebar="menu-action"
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
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      class={classes}
      {...rest}
    >
      {children}
    </button>
  );
};

export type SidebarMenuBadgeProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const SidebarMenuBadge = ({
  class: className,
  children,
  ...rest
}: SidebarMenuBadgeProps) => (
  <div
    data-slot="sidebar-menu-badge"
    data-sidebar="menu-badge"
    class={cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);

export type SidebarMenuSkeletonProps = JSX.HTMLAttributes<HTMLDivElement> & {
  showIcon?: boolean;
};

export const SidebarMenuSkeleton = ({
  class: className,
  showIcon = false,
  ...rest
}: SidebarMenuSkeletonProps) => {
  const width = useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      class={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...rest}
    >
      {showIcon ? <Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" /> : null}
      <Skeleton
        class="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ ["--skeleton-width" as string]: width }}
      />
    </div>
  );
};

export type SidebarMenuSubProps = JSX.HTMLAttributes<HTMLUListElement> & {
  children?: ComponentChildren;
};

export const SidebarMenuSub = ({ class: className, children, ...rest }: SidebarMenuSubProps) => (
  <ul
    data-slot="sidebar-menu-sub"
    data-sidebar="menu-sub"
    class={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className,
    )}
    {...rest}
  >
    {children}
  </ul>
);

export type SidebarMenuSubItemProps = JSX.HTMLAttributes<HTMLLIElement> & {
  children?: ComponentChildren;
};

export const SidebarMenuSubItem = ({
  class: className,
  children,
  ...rest
}: SidebarMenuSubItemProps) => (
  <li
    data-slot="sidebar-menu-sub-item"
    data-sidebar="menu-sub-item"
    class={cn("group/menu-sub-item relative", className)}
    {...rest}
  >
    {children}
  </li>
);

export type SidebarMenuSubButtonProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
  children?: ComponentChildren;
};

export const SidebarMenuSubButton = ({
  asChild = false,
  size = "md",
  isActive = false,
  class: className,
  children,
  ...rest
}: SidebarMenuSubButtonProps) => {
  const classes = cn(
    "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
    "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
    size === "sm" && "text-xs",
    size === "md" && "text-sm",
    "group-data-[collapsible=icon]:hidden",
    className as string | undefined,
  );
  if (asChild) {
    return (
      <Slot
        data-slot="sidebar-menu-sub-button"
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        class={classes}
        {...(rest as Record<string, unknown>)}
      >
        {children}
      </Slot>
    );
  }
  return (
    <a
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      class={classes}
      {...rest}
    >
      {children}
    </a>
  );
};
