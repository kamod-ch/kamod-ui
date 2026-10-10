import { MotionAccordionDemo } from "../motion/MotionAccordionDemo";
import { createMotionDocPage } from "./create-motion-doc-page";

export const motionAccordionDocPage = createMotionDocPage({
  slug: "motion-accordion",
  title: "Motion Accordion",
  navLabel: "Accordion",
  coreSlug: "accordion",
  coreTitle: "Accordion",
  replaces: "AccordionContent",
  packagePath: "@kamod-ch/ui-motion/accordion",
  usageImportSnippet: `import { MotionAccordionContent } from "@kamod-ch/ui-motion/accordion";`,
  usageLabel: "Drop-in replacement for AccordionContent.",
  usageText:
    "Swap AccordionContent for MotionAccordionContent inside AccordionItem. Do not use both on the same item.",
  exampleSections: [
    {
      id: "basic",
      title: "Basic",
      text: "**Keep Motion Separate from the Interaction Contract.** Use the motion accordion for a single collapsible answer with enter and exit transitions on its panel. The animated reveal helps connect the trigger to its content while the accordion continues to define the expanded state.\n\nTest repeated activation and reduced-motion preferences, keep the underlying controlled state in one place and avoid making application logic depend on a decorative transition finishing.",
      code: `import { Accordion, AccordionItem, AccordionTrigger } from "@kamod-ch/ui/accordion";
import { MotionAccordionContent } from "@kamod-ch/ui-motion/accordion";

<Accordion type="single" collapsible defaultValue="shipping">
  <AccordionItem value="shipping">
    <AccordionTrigger>Shipping options</AccordionTrigger>
    <MotionAccordionContent class="pb-4 text-sm text-muted-foreground">
      Standard, express, and overnight shipping available.
    </MotionAccordionContent>
  </AccordionItem>
</Accordion>`,
      renderPreview: () => <MotionAccordionDemo />,
    },
  ],
  apiRows: [
    { prop: "MotionAccordionContent", type: "component", defaultValue: "—" },
    { prop: "forceMount", type: "boolean", defaultValue: "false" },
  ],
});
