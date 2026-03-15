import { tv } from "tailwind-variants";

/** Matches shadcn `navigationMenuTriggerStyle()` for use on `NavigationMenuLink` with `asChild`. */
export const navigationMenuTriggerStyle = tv({
  base: [
    "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-md bg-background px-4 py-2 text-sm font-medium outline-none",
    "transition-[color,box-shadow] hover:bg-accent hover:text-accent-foreground",
    "focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-outline/50 focus-visible:outline-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
  ]
});
