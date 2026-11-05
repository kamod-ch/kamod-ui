import type { ComponentChildren, HTMLAttributes } from "preact";
import { useMenuSubDismissableLayer } from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { DropdownSubProvider, useMemoDropdownSub } from "./dropdown-sub-context";

export type DropdownSubProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const DropdownSub = ({ class: className, children, ...rest }: DropdownSubProps) => {
  const ctx = useMemoDropdownSub();
  const rootRef = useMenuSubDismissableLayer(ctx);

  return (
    <DropdownSubProvider value={ctx}>
      <div
        ref={rootRef}
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
