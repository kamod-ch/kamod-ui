import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useTabs } from "./Tabs";

export type TabsTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  children?: ComponentChildren;
};

export const TabsTrigger = ({ value, class: className, children, onClick, onKeyDown, ...rest }: TabsTriggerProps) => {
  const tabs = useTabs();
  const active = tabs.value.value === value;

  return (
    <button
      type="button"
      role="tab"
      class={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-sm border border-transparent px-3 py-1.5 text-sm font-medium whitespace-nowrap text-foreground/70 transition-[color,box-shadow,background-color]",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground",
        "group-data-[variant=default]/tabs-list:data-[state=active]:bg-background group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm",
        "group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:px-0 group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground",
        "dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "dark:group-data-[variant=default]/tabs-list:data-[state=active]:bg-input/30 dark:group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity",
        "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5",
        "group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5",
        "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className
      )}
      data-slot="tabs-trigger"
      data-state={active ? "active" : "inactive"}
      data-active={active ? "true" : undefined}
      data-value={value}
      data-orientation={tabs.orientation}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={(event) => {
        tabs.setValue(value);
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;

        const tabList = event.currentTarget.closest('[role="tablist"]');
        if (!tabList) return;

        const triggers = Array.from(tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
        const currentIndex = triggers.indexOf(event.currentTarget);
        if (currentIndex === -1 || triggers.length === 0) return;

        const horizontal = tabs.orientation === "horizontal";
        let nextIndex = currentIndex;

        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = triggers.length - 1;
        if (event.key === "ArrowRight" && horizontal) nextIndex = (currentIndex + 1) % triggers.length;
        if (event.key === "ArrowLeft" && horizontal) nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        if (event.key === "ArrowDown" && !horizontal) nextIndex = (currentIndex + 1) % triggers.length;
        if (event.key === "ArrowUp" && !horizontal) nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;

        if (nextIndex === currentIndex) return;
        event.preventDefault();
        const next = triggers[nextIndex];
        next.focus();
        const nextValue = next.getAttribute("data-value");
        if (nextValue) tabs.setValue(nextValue);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

