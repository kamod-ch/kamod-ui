import { Button } from "@kamod-ch/ui/button";
import { Sheet, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@kamod-ch/ui/sheet";
import { MotionSheetContent } from "@kamod-ch/ui-motion/sheet";

export function MotionSheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open motion sheet</Button>
      </SheetTrigger>
      <MotionSheetContent side="right" class="max-w-md">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Motion enter/exit via @kamod-ch/motion presets — overlay and panel animate together.
          </SheetDescription>
        </SheetHeader>
      </MotionSheetContent>
    </Sheet>
  );
}
