import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { DropdownSubProvider, useMemoDropdownSub } from "./dropdown-sub-context";

export type DropdownSubProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const DropdownSub = ({ class: className, children, ...rest }: DropdownSubProps) => {
  const ctx = useMemoDropdownSub();

  return (
    <DropdownSubProvider value={ctx}>
      <div
        data-slot="dropdown-sub"
        class={cn("relative", className)}
        onPointerLeave={() => {
          ctx.setOpen(false);
        }}
        {...rest}
      >
        {children}
      </div>
    </DropdownSubProvider>
  );
};
