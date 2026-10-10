import { MotionCollapsibleDemo } from "../motion/MotionCollapsibleDemo";
import { createMotionDocPage } from "./create-motion-doc-page";

export const motionCollapsibleDocPage = createMotionDocPage({
  slug: "motion-collapsible",
  title: "Motion Collapsible",
  navLabel: "Collapsible",
  coreSlug: "collapsible",
  coreTitle: "Collapsible",
  replaces: "CollapsibleContent",
  packagePath: "@kamod-ch/ui-motion/collapsible",
  usageImportSnippet: `import { MotionCollapsibleContent } from "@kamod-ch/ui-motion/collapsible";`,
  usageLabel: "Drop-in replacement for CollapsibleContent.",
  usageText:
    "Replace CollapsibleContent with MotionCollapsibleContent. Collapsible, CollapsibleTrigger, and open state wiring stay from @kamod-ch/ui.",
  exampleSections: [
    {
      id: "basic",
      title: "Basic",
      text: "**Keep Motion Separate from the Interaction Contract.** Use motion-managed content for an expandable detail region when a slide transition fits the interface. The trigger should continue to explain the open state, so the disclosure remains clear without relying on the animated movement.\n\nTest repeated activation and reduced-motion preferences, keep the underlying controlled state in one place and avoid making application logic depend on a decorative transition finishing.",
      code: `import { Collapsible, CollapsibleTrigger } from "@kamod-ch/ui/collapsible";
import { MotionCollapsibleContent } from "@kamod-ch/ui-motion/collapsible";

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
  <MotionCollapsibleContent class="flex flex-col gap-2">
    …
  </MotionCollapsibleContent>
</Collapsible>`,
      renderPreview: () => <MotionCollapsibleDemo />,
    },
  ],
  apiRows: [
    { prop: "MotionCollapsibleContent", type: "component", defaultValue: "—" },
    { prop: "forceMount", type: "boolean", defaultValue: "false" },
  ],
});
