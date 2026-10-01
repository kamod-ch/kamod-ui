import { Button, Label, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { withBasePath } from "../../base-path";
import { CodeBlock } from "./CodeBlock";

const examples = [
  {
    value: "actions",
    label: "Actions",
    title: "Let variants establish the hierarchy",
    description:
      "Use one primary action and a quieter alternative. This pair receives callbacks from its parent, keeping routing and service calls in your application.",
    path: "src/components/EditorActions.tsx",
    code: `import { Button } from "@kamod-ch/ui";

type Props = { onSave: () => void; onCancel: () => void };

export function EditorActions({ onSave, onCancel }: Props) {
  return (
    <div class="flex flex-wrap gap-2">
      <Button type="button" onClick={onSave}>Save changes</Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}`,
    check:
      'Use type="submit" inside a form when the action should submit it. For an asynchronous save, keep pending and error state in the parent and prevent duplicate submissions.',
    reference: "button",
  },
  {
    value: "state",
    label: "State",
    title: "Keep the value and its label together",
    description:
      "A controlled switch receives its value and reports changes. The example keeps state in Preact and connects the label by ID. The live switch below is a local demo; it does not save an account preference.",
    path: "src/components/NotificationPreference.tsx",
    code: `import { Label, Switch } from "@kamod-ch/ui";
import { useState } from "preact/hooks";

export function NotificationPreference() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div class="flex items-center gap-3">
      <Switch id="notifications" checked={enabled}
        onCheckedChange={setEnabled} />
      <Label htmlFor="notifications">Email notifications</Label>
    </div>
  );
}`,
    check:
      "Give repeated instances unique IDs. Persist the preference through your own service when needed, and show a recoverable error if that request fails.",
    reference: "switch",
  },
  {
    value: "layout",
    label: "Layout",
    title: "Give the composition room to adapt",
    description:
      "Use a small wrapper to own spacing and width. Its children can be controls, a form or a table. Keep wide content inside its own scrolling region instead of allowing it to widen the whole page.",
    path: "src/components/SettingsSection.tsx",
    code: `import type { ComponentChildren } from "preact";

export function SettingsSection({ children }: {
  children: ComponentChildren;
}) {
  return (
    <section class="min-w-0 space-y-4 rounded-lg border
      bg-card p-4 text-card-foreground sm:p-6">
      {children}
    </section>
  );
}`,
    check:
      "Try long labels, enlarged text and both color modes. Let the wrapper handle layout; use the components’ own props for their size and interaction states.",
    reference: "card",
  },
];

/** Small examples use the real core tabs and a local, explicitly unsaved preference. */
export function ComponentOverviewExamples() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Tabs defaultValue="actions" class="guide-next-exercises">
      <TabsList variant="line" aria-label="Component examples" class="guide-next-tabs">
        {examples.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {examples.map((example) => (
        <TabsContent key={example.value} value={example.value}>
          <div class="guide-next-example-intro">
            <strong>{example.title}</strong>
            <p>{example.description}</p>
          </div>
          {example.value === "state" && (
            <div class="component-guide-preview">
              <div>
                <Switch
                  id="overview-notifications"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
                <Label htmlFor="overview-notifications">Email notifications</Label>
              </div>
              <span role="status">Demo preference: {enabled ? "on" : "off"}</span>
            </div>
          )}
          <CodeBlock code={example.code} language="tsx" filePath={example.path} />
          <div class="guide-next-check">
            <div>
              <strong>Check the result</strong>
              <p>{example.check}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            href={withBasePath(`/docs/${example.reference}/api-reference`)}
          >
            Open {example.reference} API reference
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  );
}
