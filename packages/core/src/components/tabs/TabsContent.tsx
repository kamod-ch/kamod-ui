import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
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
  id: idProp,
  ...rest
}: TabsContentProps) => {
  const tabs = useTabs();
  const active = tabs.value === value;
  const id = idProp ?? tabs.contentId(value);
  const labelledBy = tabs.triggerId(value);

  if (!active && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      aria-hidden={!active || undefined}
      data-slot="tabs-content"
      data-state={active ? "active" : "inactive"}
      class={cn(
        "mt-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      tabIndex={0}
      hidden={!active && forceMount ? true : undefined}
      {...rest}
    >
      {children}
    </div>
  );
};
