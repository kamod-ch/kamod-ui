import { MotionDialogDemo } from "../motion/MotionDialogDemo";
import { createMotionDocPage } from "./create-motion-doc-page";

export const motionDialogDocPage = createMotionDocPage({
  slug: "motion-dialog",
  title: "Motion Dialog",
  navLabel: "Dialog",
  coreSlug: "dialog",
  coreTitle: "Dialog",
  replaces: "DialogContent (+ portal overlay stack)",
  packagePath: "@kamod-ch/ui-motion/dialog",
  usageImportSnippet: `import {
  MotionDialogPortal,
  MotionDialogOverlay,
  MotionDialogContent,
} from "@kamod-ch/ui-motion/dialog";`,
  usageLabel: "Presence-managed dialog overlay and content.",
  usageText:
    "Use MotionDialogPortal, MotionDialogOverlay, and MotionDialogContent instead of a single DialogContent. Dialog, DialogTrigger, DialogTitle, and dismiss parts stay from @kamod-ch/ui.",
  exampleSections: [
    {
      id: "basic",
      title: "Basic",
      text: "Open a dialog with enter/exit animations. Focus trap and dismiss behavior come from the underlying Dialog primitive.",
      code: `import {
  MotionDialogPortal,
  MotionDialogOverlay,
  MotionDialogContent,
} from "@kamod-ch/ui-motion/dialog";
import { Dialog, DialogTitle, DialogTrigger } from "@kamod-ch/ui/dialog";
import { Button } from "@kamod-ch/ui/button";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open</Button>
  </DialogTrigger>
  <MotionDialogPortal>
    <MotionDialogOverlay />
    <MotionDialogContent>
      <DialogTitle>Settings</DialogTitle>
    </MotionDialogContent>
  </MotionDialogPortal>
</Dialog>`,
      renderPreview: () => <MotionDialogDemo />,
    },
  ],
  apiRows: [
    { prop: "MotionDialogPortal", type: "component", defaultValue: "—" },
    { prop: "MotionDialogOverlay", type: "component", defaultValue: "—" },
    { prop: "MotionDialogContent", type: "component", defaultValue: "—" },
  ],
});
