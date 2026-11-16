import { CopyButton } from "@kamod-ch/ui/copy-button";
import { createGenericDocPage } from "./create-generic-doc-page";

export const copyButtonDocPage = createGenericDocPage({
  slug: "copy-button",
  generatedApi: true,
  title: "Copy Button",
  usageLabel: "Copy Button copies an exact string and reports the result beside the control.",
  installationText: "Import Copy Button from `@kamod-ch/ui/copy-button`.",
  usageText:
    "Pass the exact value to copy. Keep a visible label, and use the status text when the action succeeds or can be retried.",
  exampleSections: [
    {
      id: "copy-command",
      title: "Copy a command",
      text: "**Copy the Exact Text the Reader Should Use.** Place `CopyButton` next to a command or identifier and pass that string as `value`. The control reports success or a retry without changing the source text.\n\nKeep the label specific to what is copied, and leave the original text visible so people can still select it.",
      code: `import { CopyButton } from "@kamod-ch/ui/copy-button";

export const Example = () => (
  <CopyButton value="pnpm add @kamod-ch/ui" label="Copy command" subject="install command" />
);`,
      renderPreview: () => (
        <CopyButton value="pnpm add @kamod-ch/ui" label="Copy command" subject="install command" />
      ),
    },
  ],
  apiRows: [
    { prop: "value", type: "string", defaultValue: "required" },
    { prop: "label", type: "string", defaultValue: '"Copy"' },
    { prop: "subject", type: "string", defaultValue: '"text"' },
  ],
  accessibilityText:
    "Name the copied subject, keep the source text available, and expose the copied or failed status to assistive technology.",
});
