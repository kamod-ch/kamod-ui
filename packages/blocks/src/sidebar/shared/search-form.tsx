import { SearchIcon } from "@kamod-ch/icons/lucide";
import { Label, SidebarGroup, SidebarGroupContent, SidebarInput } from "@kamod-ch/ui";
import type { JSX } from "preact";

export type SearchFormProps = JSX.HTMLAttributes<HTMLFormElement>;

export const SearchForm = (props: SearchFormProps) => (
  <form {...props}>
    <SidebarGroup class="py-0">
      <SidebarGroupContent class="relative">
        <Label htmlFor="sidebar-search" class="sr-only">
          Search
        </Label>
        <SidebarInput id="sidebar-search" placeholder="Search the docs..." class="pl-8" />
        <SearchIcon class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </SidebarGroupContent>
    </SidebarGroup>
  </form>
);
