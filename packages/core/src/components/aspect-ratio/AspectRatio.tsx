import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type AspectRatioProps = JSX.HTMLAttributes<HTMLDivElement> & {
  /** Width ÷ height (e.g. `16 / 9`, `1`, `9 / 16`). Applied as CSS `aspect-ratio`. */
  ratio: number;
  children?: ComponentChildren;
};

/** Fixed-ratio box for media (CSS `aspect-ratio`; no Radix dependency). Children should use `h-full w-full object-cover` to fill. */
export const AspectRatio = ({ ratio, class: className, style, children, ...rest }: AspectRatioProps) => {
  const styleObject = typeof style === "object" && style !== null && !Array.isArray(style) ? style : undefined;

  return (
    <div
      data-slot="aspect-ratio"
      class={cn("relative w-full min-h-0 overflow-hidden", className)}
      style={{
        ...styleObject,
        aspectRatio: ratio
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

