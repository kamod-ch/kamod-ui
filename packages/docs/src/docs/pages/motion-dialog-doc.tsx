import { MOTION_DIALOG_EXAMPLE_CODE, MotionDialogDemo } from "../motion/MotionDialogDemo";
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
      text: "**Keep Motion Separate from the Interaction Contract.** Add entry and exit transitions to a dialog while keeping its underlying focus and dismissal behavior. The motion wrapper controls visual presence; the core dialog remains responsible for the interaction within the temporary panel.\n\nTest repeated activation and reduced-motion preferences, keep the underlying controlled state in one place and avoid making application logic depend on a decorative transition finishing.",
      code: MOTION_DIALOG_EXAMPLE_CODE,
      renderPreview: () => <MotionDialogDemo />,
    },
  ],
  apiRows: [
    { prop: "MotionDialogPortal", type: "component", defaultValue: "—" },
    { prop: "MotionDialogOverlay", type: "component", defaultValue: "—" },
    { prop: "MotionDialogContent", type: "component", defaultValue: "—" },
  ],
});
