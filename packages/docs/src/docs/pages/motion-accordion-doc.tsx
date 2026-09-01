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
      text: "Single collapsible accordion with slide-up enter/exit on each panel.",
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
