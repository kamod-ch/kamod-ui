import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type AlertDialogMediaProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

/** Optional icon or image slot above the title (shadcn AlertDialogMedia pattern). */
export const AlertDialogMedia = ({ class: className, children, ...rest }: AlertDialogMediaProps) => (
  <div
    data-slot="alert-dialog-media"
    class={cn(
      "mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);
