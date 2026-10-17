import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";

const panels = [
  { value: "overview", label: "Overview", text: "Start with the essentials for your workspace." },
  {
    value: "activity",
    label: "Activity",
    text: "See what changed and pick up where you left off.",
  },
  { value: "settings", label: "Settings", text: "Make this workspace feel like yours." },
];

/** The same visual treatment supports either orientation without additional state. */
export function InsetTabsExample() {
  return (
    <div class="grid w-full max-w-xl gap-6">
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <Tabs
          key={orientation}
          defaultValue="overview"
          orientation={orientation}
          class={orientation === "vertical" ? "flex gap-4" : ""}
        >
          <TabsList
            variant="inset"
            aria-label={`${orientation} workspace example`}
            class={orientation === "horizontal" ? "w-full" : "shrink-0"}
          >
            {panels.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div class="min-w-0 text-sm text-muted-foreground">
            {panels.map(({ value, text }) => (
              <TabsContent key={value} value={value}>
                {text}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      ))}
    </div>
  );
}

export const insetTabsCode = `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";

export function WorkspaceTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList variant="inset" aria-label="Workspace">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Workspace essentials.</TabsContent>
      <TabsContent value="activity">Recent changes.</TabsContent>
      <TabsContent value="settings">Your preferences.</TabsContent>
    </Tabs>
  );
}`;
