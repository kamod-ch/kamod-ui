import {
  dialogExample,
  mapUiMotionExamples,
  reducedMotionExample,
  uiMotionExamples,
} from "../examples/ui-motion";
import { createGenericDocPage } from "./create-generic-doc-page";

export const UI_MOTION_COMMAND =
  "pnpm add @kamod-ch/ui-motion @kamod-ch/motion @kamod-ch/ui preact motion @preact/signals";

/** Section ids referenced by generate-docs-route-manifest.mjs (keep in sync with uiMotionExamples). */
const UI_MOTION_EXAMPLE_SECTION_IDS = [
  { id: "dialog" },
  { id: "alert-dialog" },
  { id: "sheet" },
  { id: "accordion" },
  { id: "collapsible" },
  { id: "reduced-motion" },
] as const;
void UI_MOTION_EXAMPLE_SECTION_IDS;

const basePage = createGenericDocPage({
  slug: "ui-motion",
  title: "UI Motion",
  usageLabel:
    "Optional motion wrappers for Kamod UI — Presence-managed exit animations without changing @kamod-ch/ui.",
  previewCode: dialogExample.code,
  installationText:
    "Install @kamod-ch/ui-motion with its peers. @kamod-ch/ui stays motion-free — add these packages only when you need animated enter/exit. A separate CSS import (for example @kamod-ch/motion/presets/tokens.css) is not required for the JS presets used by ui-motion adapters. Do not install motion/react.",
  usageText:
    "Replace content components (DialogContent, SheetContent, …) with the matching @kamod-ch/ui-motion export. Keep Dialog, triggers, titles, and actions from @kamod-ch/ui. Compose portal + overlay + content for dialogs; do not mix tw-animate classes on the same nodes as motion presets.",
  exampleSections: mapUiMotionExamples(uiMotionExamples),
  apiRows: [
    { prop: "MotionDialogPortal", type: "component", defaultValue: "@kamod-ch/ui-motion/dialog" },
    { prop: "MotionDialogOverlay", type: "component", defaultValue: "fade preset" },
    { prop: "MotionDialogContent", type: "component", defaultValue: "scale preset" },
    {
      prop: "MotionAlertDialogContent",
      type: "component",
      defaultValue: "@kamod-ch/ui-motion/alert-dialog",
    },
    { prop: "MotionSheetContent", type: "component", defaultValue: "@kamod-ch/ui-motion/sheet" },
    {
      prop: "MotionAccordionContent",
      type: "component",
      defaultValue: "@kamod-ch/ui-motion/accordion",
    },
    {
      prop: "MotionCollapsibleContent",
      type: "component",
      defaultValue: "@kamod-ch/ui-motion/collapsible",
    },
    { prop: "MotionComponentProps", type: "type", defaultValue: "optional motion overrides" },
  ],
  accessibilityText:
    "Motion wrappers preserve focus traps, aria-modal, Escape dismiss, and focus return from @kamod-ch/ui. Spatial presets honor prefers-reduced-motion via @kamod-ch/motion — pass reducedMotion on Motion or rely on preset reduced fallbacks.",
});

export const uiMotionDocPage = {
  ...basePage,
  command: UI_MOTION_COMMAND,
  packagePath: "@kamod-ch/ui-motion",
  usageImportSnippet: `import {
  MotionDialogPortal,
  MotionDialogOverlay,
  MotionDialogContent,
} from "@kamod-ch/ui-motion/dialog";`,
  usageExampleSnippet: reducedMotionExample.code,
};
