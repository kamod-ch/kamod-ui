import { MotionTabsDemo } from "../motion/MotionTabsDemo";
import { createMotionDocPage } from "./create-motion-doc-page";

export const motionTabsDocPage = createMotionDocPage({
  slug: "motion-tabs",
  title: "Motion Tabs",
  navLabel: "Tabs",
  coreSlug: "tabs",
  coreTitle: "Tabs",
  replaces: "— (adds MotionTabsIndicator)",
  packagePath: "@kamod-ch/ui-motion/tabs",
  usageImportSnippet: `import { MotionTabsIndicator } from "@kamod-ch/ui-motion/tabs";`,
  usageLabel: "Animated sliding highlight for the active tab.",
  usageText:
    "Place MotionTabsIndicator inside a relatively positioned TabsList. It complements TabsContent — it does not replace panel mounting.",
  exampleSections: [
    {
      id: "basic",
      title: "Basic",
      text: "**Keep Motion Separate from the Interaction Contract.** Use the motion tabs composition when a moving indicator helps readers follow the active trigger. The selected value still determines the displayed panel; the indicator visually reinforces that relationship rather than owning separate selection state.\n\nTest repeated activation and reduced-motion preferences, keep the underlying controlled state in one place and avoid making application logic depend on a decorative transition finishing.",
      code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui/tabs";
import { MotionTabsIndicator } from "@kamod-ch/ui-motion/tabs";

<Tabs defaultValue="account">
  <TabsList variant="line" class="relative">
    <MotionTabsIndicator class="rounded-none border-b-2 border-foreground bg-transparent shadow-none ring-0" />
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
  <TabsContent value="password">…</TabsContent>
</Tabs>`,
      renderPreview: () => <MotionTabsDemo />,
    },
  ],
  apiRows: [{ prop: "MotionTabsIndicator", type: "component", defaultValue: "—" }],
});
