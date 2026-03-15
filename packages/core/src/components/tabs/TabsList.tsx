import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { useTabs } from "./Tabs";

const tabsList = tv({
  base: [
    "group/tabs-list inline-flex w-fit items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
    "group-data-[orientation=horizontal]/tabs:h-8 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col"
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

