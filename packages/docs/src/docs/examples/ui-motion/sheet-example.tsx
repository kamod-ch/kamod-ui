import { Button } from "@kamod-ch/ui/button";
import { Sheet, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@kamod-ch/ui/sheet";
import { MotionSheetContent } from "@kamod-ch/ui-motion/sheet";
import type { UiMotionDocExample } from "./types.js";

const sides = ["top", "right", "bottom", "left"] as const;

export const MOTION_SHEET_EXAMPLE_CODE = `import { Button } from "@kamod-ch/ui/button";
import { Sheet, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@kamod-ch/ui/sheet";
import { MotionSheetContent } from "@kamod-ch/ui-motion/sheet";

const sides = ["top", "right", "bottom", "left"] as const;

export function MotionSheetSides() {
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
                Slides from the {side} edge with safe-area padding on top and bottom sheets.
              </SheetDescription>
            </SheetHeader>
          </MotionSheetContent>
        </Sheet>
      ))}
    </div>
  );
}`;

export function MotionSheetSidesPreview() {
  return (
    <div class="flex flex-wrap justify-center gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" data-testid={`ui-motion-sheet-trigger-${side}`}>
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
                Slides from the {side} edge with safe-area padding on top and bottom sheets.
              </SheetDescription>
            </SheetHeader>
          </MotionSheetContent>
        </Sheet>
      ))}
    </div>
  );
}

export const sheetExample: UiMotionDocExample = {
  id: "sheet",
  title: "Sheet",
  text: "One demo opens sheets from every side — motion direction follows side, left/right use max-w-sm, top/bottom span full width with safe-area padding. Close button, Escape, and focus return stay on the core Sheet stack.",
  code: MOTION_SHEET_EXAMPLE_CODE,
  renderPreview: () => <MotionSheetSidesPreview />,
  previewClass: "data-[chromeless=true]:overflow-visible",
};

export { sides as motionSheetSides };
