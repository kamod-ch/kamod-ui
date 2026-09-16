import { tv } from "tailwind-variants";

export const saveStatusRoot = tv({
  base: "inline-flex min-w-0 max-w-full items-center gap-2 text-sm",
  variants: {
    size: {
      default: "text-sm",
      compact: "text-xs",
    },
    status: {
      pristine: "text-muted-foreground",
      dirty: "text-foreground",
      saving: "text-muted-foreground",
      saved: "text-muted-foreground",
      error: "text-destructive",
      offline: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "default",
    status: "pristine",
  },
});

export const saveStatusLabel = tv({
  base: "min-w-0 truncate",
  variants: {
    size: {
      default: "",
      compact: "max-w-[12rem]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
