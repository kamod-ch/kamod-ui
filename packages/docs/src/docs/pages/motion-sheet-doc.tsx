import { MotionSheetDemo } from "../motion/MotionSheetDemo";
import { MOTION_SHEET_EXAMPLE_CODE, MotionSheetSidesDemo } from "../motion/MotionSheetSidesDemo";
import { createMotionDocPage } from "./create-motion-doc-page";

export const motionSheetDocPage = createMotionDocPage({
  slug: "motion-sheet",
  title: "Motion Sheet",
  navLabel: "Sheet",
  coreSlug: "sheet",
  coreTitle: "Sheet",
  replaces: "SheetContent",
  packagePath: "@kamod-ch/ui-motion/sheet",
  usageImportSnippet: `import { MotionSheetContent } from "@kamod-ch/ui-motion/sheet";`,
  usageLabel: "Animated sheet panel and overlay.",
  usageText:
    "Replace SheetContent with MotionSheetContent. Sheet, SheetTrigger, SheetHeader, and other sheet parts stay from @kamod-ch/ui.",
  exampleSections: [
    {
      id: "basic",
      title: "Basic",
      text: "Open a sheet from the right edge with coordinated overlay fade and panel slide.",
      code: `import { MotionSheetContent } from "@kamod-ch/ui-motion/sheet";
import { Sheet, SheetTitle, SheetTrigger } from "@kamod-ch/ui/sheet";
import { Button } from "@kamod-ch/ui/button";

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open</Button>
  </SheetTrigger>
  <MotionSheetContent side="right" class="max-w-md">
    <SheetTitle>Edit profile</SheetTitle>
  </MotionSheetContent>
</Sheet>`,
      renderPreview: () => <MotionSheetDemo />,
    },
    {
      id: "side",
      title: "Side",
      text: 'Pass side="top" | "right" | "bottom" | "left". Motion presets match the chosen edge.',
      code: MOTION_SHEET_EXAMPLE_CODE,
      renderPreview: () => <MotionSheetSidesDemo />,
    },
  ],
  apiRows: [
    { prop: "MotionSheetPortal", type: "component", defaultValue: "—" },
    { prop: "MotionSheetContent", type: "component", defaultValue: 'side: "right"' },
    { prop: "side", type: '"left" | "right" | "top" | "bottom"', defaultValue: '"right"' },
    { prop: "showCloseButton", type: "boolean", defaultValue: "true" },
  ],
});
