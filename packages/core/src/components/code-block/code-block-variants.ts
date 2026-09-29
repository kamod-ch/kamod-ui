import { tv } from "tailwind-variants";

export const codeBlockRoot = tv({
  base: "border-border bg-muted/40 relative min-w-0 max-w-full overflow-hidden rounded-lg border",
});

export const codeBlockHeader = tv({
  base: "border-border flex items-center justify-between gap-2 border-b px-3 py-2 text-xs",
});

export const codeBlockPre = tv({
  base: "min-w-0 max-w-full overflow-x-auto p-3 font-mono text-sm leading-relaxed",
  variants: {
    wrap: {
      true: "[&_code]:whitespace-pre-wrap [&_code]:break-all",
      false: "[&_code]:whitespace-pre",
    },
  },
  defaultVariants: {
    wrap: false,
  },
});
