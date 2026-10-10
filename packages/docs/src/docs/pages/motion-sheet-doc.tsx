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
      text: "**Keep Motion Separate from the Interaction Contract.** Open the motion sheet from the right with a coordinated panel slide and backdrop fade. The transition explains where the temporary surface enters, while its content should still provide a clear title and dismissal action.\n\nTest repeated activation and reduced-motion preferences, keep the underlying controlled state in one place and avoid making application logic depend on a decorative transition finishing.",
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
      text: "**Keep Motion Separate from the Interaction Contract.** Choose `side=\"top\"`, `right`, `bottom` or `left` to align the motion preset with the sheet's edge. Compare the same content in each placement to verify both the transition direction and the panel's usable dimensions.\n\nTest repeated activation and reduced-motion preferences, keep the underlying controlled state in one place and avoid making application logic depend on a decorative transition finishing.",
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
