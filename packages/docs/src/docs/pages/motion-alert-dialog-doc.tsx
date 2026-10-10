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
      text: "**Keep Motion Separate from the Interaction Contract.** Combine a panel scale transition with an overlay fade around a destructive confirmation. The motion illustrates the temporary dialog appearing and leaving; the title, consequence and cancel/confirm actions still define the actual decision.\n\nTest repeated activation and reduced-motion preferences, keep the underlying controlled state in one place and avoid making application logic depend on a decorative transition finishing.",
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
