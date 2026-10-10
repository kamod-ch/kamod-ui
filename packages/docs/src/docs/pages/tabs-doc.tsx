import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { ApiReference } from "../components/ApiReference";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import { InsetTabsExample, insetTabsCode } from "../examples/tabs/InsetTabsExample";
import type { DocPageModule, DocRenderMainContext } from "../types";

const TabsSectionType = {
  INSTALLATION: "installation",
  INSET: "inset-tabs",
  SYNCED_TABS: "synced-tabs",
  DISABLED_TRIGGERS: "disabled-triggers",
  NESTED_TABS: "nested-tabs",
  API_REFERENCE: "api-reference",
} as const;

type TabsSectionId = (typeof TabsSectionType)[keyof typeof TabsSectionType];

const tabsExamplePreviewBySectionId: Record<TabsSectionId, () => ComponentChildren> = {
  [TabsSectionType.INSTALLATION]: () => null,
  [TabsSectionType.INSET]: () => <InsetTabsExample />,
  [TabsSectionType.SYNCED_TABS]: () => (
    <div class="grid w-full max-w-xl gap-4">
      <Tabs defaultValue="react" syncKey="frameworks" class="w-full">
        <TabsList variant="line" class="w-full justify-start">
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="vue">Vue</TabsTrigger>
          <TabsTrigger value="svelte">Svelte</TabsTrigger>
        </TabsList>
        <TabsContent value="react" class="docs-tabs-panel">
          React is ideal for complex product UIs and large component ecosystems.
        </TabsContent>
        <TabsContent value="vue" class="docs-tabs-panel">
          Vue offers an approachable API and smooth progressive adoption.
        </TabsContent>
        <TabsContent value="svelte" class="docs-tabs-panel">
          Svelte compiles away framework overhead and keeps bundles lean.
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="react" syncKey="frameworks" class="w-full">
        <TabsList variant="line" class="w-full justify-start">
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="vue">Vue</TabsTrigger>
          <TabsTrigger value="svelte">Svelte</TabsTrigger>
        </TabsList>
        <TabsContent value="react" class="docs-tabs-panel">
          Rich libraries, broad hiring pool, and excellent long-term maintainability.
        </TabsContent>
        <TabsContent value="vue" class="docs-tabs-panel">
          Great DX with first-party tools and strong defaults for teams.
        </TabsContent>
        <TabsContent value="svelte" class="docs-tabs-panel">
          Fast startup and simple mental model for highly interactive views.
        </TabsContent>
      </Tabs>
    </div>
  ),
  [TabsSectionType.DISABLED_TRIGGERS]: () => (
    <Tabs defaultValue="active" class="w-full max-w-xl">
      <TabsList variant="line" class="w-full justify-start">
        <TabsTrigger value="active">Overview</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Billing (Soon)
        </TabsTrigger>
        <TabsTrigger value="pending">Usage</TabsTrigger>
      </TabsList>
      <TabsContent value="active" class="docs-tabs-panel">
        Your workspace is active and all automations are healthy.
      </TabsContent>
      <TabsContent value="disabled" class="docs-tabs-panel">
        Billing tab content
      </TabsContent>
      <TabsContent value="pending" class="docs-tabs-panel">
        68% of this month's API quota has been consumed.
      </TabsContent>
    </Tabs>
  ),
  [TabsSectionType.NESTED_TABS]: () => (
    <Tabs defaultValue="outer-1" class="w-full max-w-xl">
      <TabsList variant="line">
        <TabsTrigger value="outer-1">Profile</TabsTrigger>
        <TabsTrigger value="outer-2">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="outer-1" class="docs-tabs-panel">
        Keep your public profile and company details in sync across products.
      </TabsContent>
      <TabsContent value="outer-2">
        <div class="space-y-3 rounded-lg border bg-card p-4">
          <p class="text-sm text-muted-foreground">Choose how we notify your team:</p>
          <Tabs defaultValue="inner-a" class="w-full">
            <TabsList variant="line">
              <TabsTrigger value="inner-a">Email</TabsTrigger>
              <TabsTrigger value="inner-b">In-App</TabsTrigger>
            </TabsList>
            <TabsContent value="inner-a" class="text-sm text-muted-foreground">
              Receive digests and alerts directly in your inbox.
            </TabsContent>
            <TabsContent value="inner-b" class="text-sm text-muted-foreground">
              Show notifications in your team dashboard and activity feed.
            </TabsContent>
          </Tabs>
        </div>
      </TabsContent>
    </Tabs>
  ),
  [TabsSectionType.API_REFERENCE]: () => null,
};

const tabsCodeBySectionId: Record<TabsSectionId, () => string> = {
  [TabsSectionType.INSET]: () => insetTabsCode,
  [TabsSectionType.INSTALLATION]: TabsCodeInstallation,
  [TabsSectionType.SYNCED_TABS]: TabsCodeSyncedTabs,
  [TabsSectionType.DISABLED_TRIGGERS]: TabsCodeDisabledTriggers,
  [TabsSectionType.NESTED_TABS]: TabsCodeNestedTabs,
  [TabsSectionType.API_REFERENCE]: TabsCodeApiReference,
};

function TabsCodeInstallation(): string {
  return `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/kamod-ui/tabs";`;
}

function TabsCodeSyncedTabs(): string {
  return `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/kamod-ui/tabs";

export const Example = () => (
  <div class="grid w-full max-w-xl gap-4">
    <Tabs defaultValue="react" syncKey="frameworks" class="w-full">
      <TabsList variant="line" class="w-full justify-start">
        <TabsTrigger value="react">React</TabsTrigger>
        <TabsTrigger value="vue">Vue</TabsTrigger>
        <TabsTrigger value="svelte">Svelte</TabsTrigger>
      </TabsList>
      <TabsContent value="react" class="docs-tabs-panel">
        React is ideal for complex product UIs and large component ecosystems.
      </TabsContent>
      <TabsContent value="vue" class="docs-tabs-panel">
        Vue offers an approachable API and smooth progressive adoption.
      </TabsContent>
      <TabsContent value="svelte" class="docs-tabs-panel">
        Svelte compiles away framework overhead and keeps bundles lean.
      </TabsContent>
    </Tabs>
    <Tabs defaultValue="react" syncKey="frameworks" class="w-full">
      <TabsList variant="line" class="w-full justify-start">
        <TabsTrigger value="react">React</TabsTrigger>
        <TabsTrigger value="vue">Vue</TabsTrigger>
        <TabsTrigger value="svelte">Svelte</TabsTrigger>
      </TabsList>
      <TabsContent value="react" class="docs-tabs-panel">
        Rich libraries, broad hiring pool, and excellent long-term maintainability.
      </TabsContent>
      <TabsContent value="vue" class="docs-tabs-panel">
        Great DX with first-party tools and strong defaults for teams.
      </TabsContent>
      <TabsContent value="svelte" class="docs-tabs-panel">
        Fast startup and simple mental model for highly interactive views.
      </TabsContent>
    </Tabs>
  </div>
);`;
}

function TabsCodeDisabledTriggers(): string {
  return `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/kamod-ui/tabs";

export const Example = () => (
  <Tabs defaultValue="active" class="w-full max-w-xl">
    <TabsList variant="line" class="w-full justify-start">
      <TabsTrigger value="active">Overview</TabsTrigger>
      <TabsTrigger value="disabled" disabled>
        Billing (Soon)
      </TabsTrigger>
      <TabsTrigger value="pending">Usage</TabsTrigger>
    </TabsList>
    <TabsContent value="active" class="docs-tabs-panel">
      Your workspace is active and all automations are healthy.
    </TabsContent>
    <TabsContent value="disabled" class="docs-tabs-panel">
      Billing tab content
    </TabsContent>
    <TabsContent value="pending" class="docs-tabs-panel">
      68% of this month's API quota has been consumed.
    </TabsContent>
  </Tabs>
);`;
}

function TabsCodeNestedTabs(): string {
  return `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/kamod-ui/tabs";

export const Example = () => (
  <Tabs defaultValue="outer-1" class="w-full max-w-xl">
    <TabsList variant="line">
      <TabsTrigger value="outer-1">Profile</TabsTrigger>
      <TabsTrigger value="outer-2">Notifications</TabsTrigger>
    </TabsList>
    <TabsContent value="outer-1" class="docs-tabs-panel">
      Keep your public profile and company details in sync across products.
    </TabsContent>
    <TabsContent value="outer-2">
      <div class="space-y-3 rounded-lg border bg-card p-4">
        <p class="text-sm text-muted-foreground">Choose how we notify your team:</p>
        <Tabs defaultValue="inner-a" class="w-full">
          <TabsList variant="line">
            <TabsTrigger value="inner-a">Email</TabsTrigger>
            <TabsTrigger value="inner-b">In-App</TabsTrigger>
          </TabsList>
          <TabsContent value="inner-a" class="text-sm text-muted-foreground">
            Receive digests and alerts directly in your inbox.
          </TabsContent>
          <TabsContent value="inner-b" class="text-sm text-muted-foreground">
            Show notifications in your team dashboard and activity feed.
          </TabsContent>
        </Tabs>
      </div>
    </TabsContent>
  </Tabs>
);`;
}

function TabsCodeApiReference(): string {
  return `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/kamod-ui/tabs";

export const Example = () => (
  <Tabs defaultValue="account" class="w-full max-w-xl">
    <TabsList variant="line">
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Make changes to your account here.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input id="name" defaultValue="Pedro Duarte" />
          </div>
          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input id="username" defaultValue="@peduarte" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </TabsContent>
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password here.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="current">Current password</Label>
            <Input id="current" type="password" />
          </div>
          <div class="space-y-2">
            <Label for="new">New password</Label>
            <Input id="new" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update password</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
);`;
}

const tabsApiRows = {
  Tabs: [
    { prop: "defaultValue", type: "string", defaultValue: "-" },
    { prop: "syncKey", type: "string", defaultValue: "-" },
    { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
  ],
  TabsList: [{ prop: "variant", type: '"default" | "line" | "inset"', defaultValue: '"default"' }],
  TabsTrigger: [
    { prop: "value", type: "string", defaultValue: "required" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
  ],
  TabsContent: [
    { prop: "value", type: "string", defaultValue: "required" },
    { prop: "forceMount", type: "boolean", defaultValue: "false" },
  ],
} as const;

const tabsSectionOutroById: Record<string, () => ComponentChildren> = {
  [TabsSectionType.API_REFERENCE]: () => (
    <ApiReference
      sections={[
        { title: "Tabs", rows: tabsApiRows.Tabs },
        { title: "Tabs List", rows: tabsApiRows.TabsList },
        { title: "Tabs Trigger", rows: tabsApiRows.TabsTrigger },
        { title: "Tabs Content", rows: tabsApiRows.TabsContent },
      ]}
    />
  ),
};

const renderTabsSection = (sectionId: string, context: DocRenderMainContext) => {
  const id = sectionId as TabsSectionId;
  return (
    <>
      {id !== TabsSectionType.INSTALLATION && tabsExamplePreviewBySectionId[id]
        ? context.renderPreviewAndCodeTabs({
            preview: tabsExamplePreviewBySectionId[id](),
            codeSnippet: tabsCodeBySectionId[id](),
          })
        : null}
      {tabsSectionOutroById[sectionId]?.() ?? null}
    </>
  );
};

export const tabsDocPage: DocPageModule = {
  slug: "tabs",
  title: "Tabs",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Tabs organize content into focusable views and support synchronized groups via the `syncKey` prop.",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Install the package and import Tabs, TabsList, TabsTrigger and TabsContent from `@/components/kamod-ui/tabs`.",
    },
    {
      id: "inset-tabs",
      title: "Inset Tabs",
      text: '**A clear choice, with a little breathing room.** Set `variant="inset"` on `TabsList` to opt into rounded tabs with a stronger selected state. The site’s control groups use `variant="line"` for the familiar underlined treatment. The inset variant’s selected tab uses the foreground color with inverse text, a translucent rim and a thick inset stripe; a small theme-primary dot precedes each label. The spaces between tabs grow gently from 6px to a maximum of 10px.\n\n**The same behavior in either direction.** Use the arrow keys, Home and End to change panels, or set `orientation="vertical"` on `Tabs`. Disabled triggers are skipped. The visual variant does not change selection, synchronization or panel mounting, and nested lists keep their own styling.\n\n**Keep customization local.** Adjust `--tabs-inset-height`, `--tabs-inset-padding` and `--tabs-inset-font-size` on an individual list for compact toolbars. Colors follow the [Theme Tokens](/docs/theming/token-overrides), and corners follow `--radius-md`. The original `default` and `line` variants remain available; omitting `variant` still selects `default` for existing consumers.',
    },
    {
      id: "synced-tabs",
      title: "Synced Tabs",
      text: "**Synchronize Only Groups that Represent the Same Choice.** Give related tab groups the same `syncKey` when they should share an active value. Their trigger values need to describe the same choices, making a selection in one group meaningful in the other synchronized views.\n\nKeep their values compatible and make each group's purpose clear, so changing one panel does not unexpectedly alter a different workflow elsewhere on the page.",
    },
    {
      id: "disabled-triggers",
      title: "Disabled Triggers",
      text: "**Explain Unavailable Panels without Making Them a Dead End.** Set `disabled` on a `TabsTrigger` when its panel is not currently available for selection. Preserve a clear label and explain the prerequisite where necessary, instead of leaving readers to infer the reason from reduced emphasis alone.\n\nKeep the active value on an available tab, place the reason nearby and avoid storing essential instructions only inside the panel users cannot open.",
    },
    {
      id: "nested-tabs",
      title: "Nested Tabs",
      text: "**Keep Each Level's Question Distinct.** Place an independent tabs group inside a panel when the content has a genuine second level of choices. Keep the nested labels and state scoped to that panel so the inner selection does not compete with the outer navigation.\n\nUse clear group names and independent values or sync keys, and check whether headings or separate pages would make the same content easier to navigate.",
    },
    {
      id: "api-reference",
      title: "API Reference",
      text: "Tabs component props and accepted values.",
    },
  ],
  renderMain: (context) => (
    <>
      {context.renderTitleRow()}
      {context.renderPreviewAndCodeTabs({
        preview: (
          <Tabs defaultValue="account" class="w-full max-w-xl">
            <TabsList variant="line">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Make changes to your account here.</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <Label for="preview-name">Name</Label>
                    <Input id="preview-name" defaultValue="Pedro Duarte" />
                  </div>
                  <div class="space-y-2">
                    <Label for="preview-username">Username</Label>
                    <Input id="preview-username" defaultValue="@peduarte" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password here.</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <Label for="preview-current-password">Current password</Label>
                    <Input id="preview-current-password" type="password" />
                  </div>
                  <div class="space-y-2">
                    <Label for="preview-new-password">New password</Label>
                    <Input id="preview-new-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        ),
        codeSnippet: `import { Button } from "@/components/kamod-ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/kamod-ui/card"
import { Input } from "@/components/kamod-ui/input"
import { Label } from "@/components/kamod-ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/kamod-ui/tabs";

export const Example = () => (
  <Tabs defaultValue="account" class="w-full max-w-xl">
    <TabsList variant="line">
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Make changes to your account here.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input id="name" defaultValue="Pedro Duarte" />
          </div>
          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input id="username" defaultValue="@peduarte" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </TabsContent>
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password here.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="current">Current password</Label>
            <Input id="current" type="password" />
          </div>
          <div class="space-y-2">
            <Label for="new">New password</Label>
            <Input id="new" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update password</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
);`,
      })}
      {context.sections.map((docSection) => (
        <ComponentDocSection key={docSection.id} section={docSection}>
          {context.renderSectionExtraContent(docSection.id)}
          {renderTabsSection(docSection.id, context)}
        </ComponentDocSection>
      ))}
    </>
  ),
};
