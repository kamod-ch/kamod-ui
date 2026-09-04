import { SearchIcon } from "@kamod-ch/icons/lucide";
import { cn, Kbd, Label, SidebarInput } from "@kamod-ch/ui";
import type { JSX, Ref } from "preact";

export type AppSearchFieldProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  shortcutHint?: string;
  ref?: Ref<HTMLInputElement>;
};

export const AppSearchField = ({
  id = "app-sidebar-search",
  label = "Search",
  shortcutHint,
  class: className,
  ref,
  ...rest
}: AppSearchFieldProps) => (
  <div class="relative px-2">
    <Label for={id} class="sr-only">
      {label}
    </Label>
    <SearchIcon
      size={14}
      class="pointer-events-none absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
    <SidebarInput
      id={id}
      ref={ref}
      placeholder="Search..."
      class={cn("pl-8", className)}
      {...rest}
    />
    {shortcutHint ? (
      <Kbd class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[10px]">
        {shortcutHint}
      </Kbd>
    ) : null}
  </div>
);
