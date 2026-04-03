import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { useTabs } from "./Tabs";

const tabsList = tv({
  base: [
    "group/tabs-list inline-flex w-fit items-stretch justify-center gap-0.5 rounded-md bg-muted/80 p-0.5 text-muted-foreground",
    "ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]",
    "group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=horizontal]/tabs:rounded-full",
    "group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:rounded-xl group-data-[orientation=vertical]/tabs:gap-0.5 group-data-[orientation=vertical]/tabs:p-1"
  ],
  variants: {
    variant: {
      default: "",
      line: "rounded-none gap-1 bg-transparent p-0"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export type TabsListProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof tabsList> & {
  children?: ComponentChildren;
};

export const TabsList = ({ variant, class: className, children, ...rest }: TabsListProps) => {
  const tabs = useTabs();

  return (
    <div
      role="tablist"
      aria-orientation={tabs.orientation}
      class={cn(tabsList({ variant }), className)}
      data-slot="tabs-list"
      data-variant={variant ?? "default"}
      data-orientation={tabs.orientation}
      {...rest}
    >
      {children}
    </div>
  );
};

