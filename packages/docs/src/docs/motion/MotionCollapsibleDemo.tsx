import { Button } from "@kamod-ch/ui/button";
import { Collapsible, CollapsibleTrigger } from "@kamod-ch/ui/collapsible";
import { MotionCollapsibleContent } from "@kamod-ch/ui-motion/collapsible";
import { ChevronsUpDown } from "lucide-preact";
import { useState } from "preact/hooks";

export function MotionCollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      class="flex w-full max-w-[350px] flex-col gap-2"
    >
      <div class="flex items-center justify-between gap-4 px-4">
        <h4 class="text-sm font-semibold">Order #4189</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" class="size-8 shrink-0">
            <ChevronsUpDown class="size-4" />
            <span class="sr-only">Toggle details</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
        <span class="text-muted-foreground">Status</span>
        <span class="font-medium">Shipped</span>
      </div>
      <MotionCollapsibleContent class="flex flex-col gap-2">
        <div class="rounded-md border px-4 py-2 text-sm">
          <p class="font-medium">Shipping address</p>
          <p class="text-muted-foreground">100 Market St, San Francisco</p>
        </div>
      </MotionCollapsibleContent>
    </Collapsible>
  );
}
