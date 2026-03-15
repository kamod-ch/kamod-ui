import { cn } from "../../lib/utils";
import type { ComponentChildren, JSX } from "preact";
import { useTabs } from "./Tabs";

export type TabsContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value: string;
  forceMount?: boolean;
  children?: ComponentChildren;
};

export const TabsContent = ({
  value,
  forceMount = false,
  class: className,
  children,
  ...rest
}: TabsContentProps) => {
  const tabs = useTabs();
  const active = tabs.value.value === value;
  if (!active && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      data-slot="tabs-content"
      data-state={active ? "active" : "inactive"}
      class={cn("mt-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
      tabIndex={0}
      {...rest}
    >
      {children}
    </div>
  );
};

