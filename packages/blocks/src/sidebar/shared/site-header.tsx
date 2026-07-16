import { SearchIcon } from "@kamod-ch/icons/lucide";
import { Button, Input, Separator, SidebarTrigger } from "@kamod-ch/ui";
import { stopNavigation } from "./sample-data";

export const SiteHeader = () => (
  <header class="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background px-4">
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
    <strong class="text-sm font-semibold">Acme Inc</strong>
    <nav class="ml-6 hidden gap-4 text-sm text-muted-foreground md:flex">
      <a href="#" onClick={stopNavigation}>
        Docs
      </a>
      <a href="#" onClick={stopNavigation}>
        Components
      </a>
      <a href="#" onClick={stopNavigation}>
        Blocks
      </a>
    </nav>
    <div class="relative ml-auto hidden w-full max-w-xs md:block">
      <SearchIcon class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 opacity-50" />
      <Input placeholder="Search documentation..." class="h-8 pl-8" />
    </div>
    <Button class="ml-auto md:ml-2" size="sm">
      GitHub
    </Button>
  </header>
);
