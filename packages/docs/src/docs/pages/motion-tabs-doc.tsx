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
      text: "Tabs with a motion-driven indicator that follows the active trigger.",
      code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui/tabs";
import { MotionTabsIndicator } from "@kamod-ch/ui-motion/tabs";

<Tabs defaultValue="account">
  <TabsList class="relative">
    <MotionTabsIndicator />
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
