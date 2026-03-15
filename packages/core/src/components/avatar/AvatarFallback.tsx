import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useAvatarContext } from "./context";

export type AvatarFallbackProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const AvatarFallback = ({ class: className, children, ...rest }: AvatarFallbackProps) => {
  const { showFallback } = useAvatarContext();

  return (
    <span
      data-slot="avatar-fallback"
      class={cn(
        "bg-muted text-muted-foreground absolute inset-0 z-0 inline-flex size-full items-center justify-center font-medium",
        "text-sm group-data-[size=sm]/avatar:text-xs group-data-[size=lg]/avatar:text-base",
        !showFallback && "hidden",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};
