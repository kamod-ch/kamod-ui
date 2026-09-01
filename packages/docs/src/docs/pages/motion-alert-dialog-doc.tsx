import {
  MOTION_ALERT_DIALOG_EXAMPLE_CODE,
  MotionAlertDialogDemo,
} from "../motion/MotionAlertDialogDemo";
import { createMotionDocPage } from "./create-motion-doc-page";

export const motionAlertDialogDocPage = createMotionDocPage({
  slug: "motion-alert-dialog",
  title: "Motion Alert Dialog",
  navLabel: "Alert Dialog",
  coreSlug: "alert-dialog",
  coreTitle: "Alert Dialog",
  replaces: "AlertDialogContent (+ portal stack)",
  packagePath: "@kamod-ch/ui-motion/alert-dialog",
  usageImportSnippet: `import {
  MotionAlertDialogPortal,
  MotionAlertDialogOverlay,
  MotionAlertDialogViewport,
  MotionAlertDialogContent,
} from "@kamod-ch/ui-motion/alert-dialog";`,
  usageLabel: "Animated alert dialog with centered viewport.",
  usageText:
    "Use MotionAlertDialogPortal, MotionAlertDialogOverlay, MotionAlertDialogViewport, and MotionAlertDialogContent. Header, footer, and action components stay from @kamod-ch/ui.",
  exampleSections: [
    {
      id: "basic",
      title: "Basic",
      text: "Destructive confirmation with scale enter/exit on the panel and fade on the overlay.",
      code: MOTION_ALERT_DIALOG_EXAMPLE_CODE,
      renderPreview: () => <MotionAlertDialogDemo />,
    },
  ],
  apiRows: [
    { prop: "MotionAlertDialogPortal", type: "component", defaultValue: "—" },
    { prop: "MotionAlertDialogOverlay", type: "component", defaultValue: "—" },
    { prop: "MotionAlertDialogViewport", type: "component", defaultValue: "—" },
    { prop: "MotionAlertDialogContent", type: "component", defaultValue: 'size: "default"' },
    { prop: "size", type: '"default" | "sm"', defaultValue: '"default"' },
  ],
});
