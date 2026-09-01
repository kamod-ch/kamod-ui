import { Button } from "@kamod-ch/ui/button";
import { Sheet, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@kamod-ch/ui/sheet";
import { MotionSheetContent } from "@kamod-ch/ui-motion/sheet";

const sides = ["top", "right", "bottom", "left"] as const;

export function MotionSheetSidesDemo() {
  return (
    <div class="flex flex-wrap justify-center gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </SheetTrigger>
          <MotionSheetContent
            side={side}
            class={side === "left" || side === "right" ? "max-w-sm" : undefined}
          >
            <SheetHeader>
              <SheetTitle class="capitalize">{side} sheet</SheetTitle>
              <SheetDescription>
                Motion preset matches <code>side="{side}"</code>.
              </SheetDescription>
            </SheetHeader>
          </MotionSheetContent>
        </Sheet>
      ))}
    </div>
  );
}
