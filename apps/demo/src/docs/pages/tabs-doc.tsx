import type { ComponentChildren } from "preact";
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
} from "@kamod-ui/core";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

const TabsSectionType = {
  INSTALLATION: "installation",
  SYNCED_TABS: "synced-tabs",
  DISABLED_TRIGGERS: "disabled-triggers",
  NESTED_TABS: "nested-tabs",
  API_REFERENCE: "api-reference",
} as const;

type TabsSectionId = (typeof TabsSectionType)[keyof typeof TabsSectionType];

const renderTabsExampleTabs = (previewContent: ComponentChildren, code: string) => (
  <div class="docs-button-example">
    <Tabs defaultValue="preview" class="docs-tabs">
      <TabsList class="docs-tabs-list" variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div class="preview relative flex min-h-40 w-full justify-center p-3 sm:min-h-56 sm:p-6 lg:h-72 lg:p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start data-[chromeless=true]:h-auto data-[chromeless=true]:p-0">
          {previewContent}
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock code={code} language="tsx" />
      </TabsContent>
    </Tabs>
  </div>
);

const tabsExamplePreviewBySectionId: Record<TabsSectionId, () => ComponentChildren> = {
  [TabsSectionType.INSTALLATION]: () => null,
  [TabsSectionType.SYNCED_TABS]: () => (
    <div class="grid w-full max-w-xl gap-4">
      <Tabs defaultValue="react" syncKey="frameworks" class="w-full">
        <TabsList class="w-full justify-start">
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
        <TabsList class="w-full justify-start">
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
      <TabsList variant="line" class="w-full justify-start gap-6 border-b">
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
      <TabsList>
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
            <TabsList>
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
      <TabsList class="w-full justify-start">
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
      <TabsList class="w-full justify-start">
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
    <TabsList variant="line" class="w-full justify-start gap-6 border-b">
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
    <TabsList>
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
          <TabsList>
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
    <TabsList>
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

const tabsExampleBySectionId: Record<TabsSectionId, () => ComponentChildren> = {
  [TabsSectionType.INSTALLATION]: () => null,
  [TabsSectionType.SYNCED_TABS]: () =>
    renderTabsExampleTabs(
      tabsExamplePreviewBySectionId[TabsSectionType.SYNCED_TABS](),
      tabsCodeBySectionId[TabsSectionType.SYNCED_TABS](),
    ),
  [TabsSectionType.DISABLED_TRIGGERS]: () =>
    renderTabsExampleTabs(
      tabsExamplePreviewBySectionId[TabsSectionType.DISABLED_TRIGGERS](),
      tabsCodeBySectionId[TabsSectionType.DISABLED_TRIGGERS](),
    ),
  [TabsSectionType.NESTED_TABS]: () =>
    renderTabsExampleTabs(
      tabsExamplePreviewBySectionId[TabsSectionType.NESTED_TABS](),
      tabsCodeBySectionId[TabsSectionType.NESTED_TABS](),
    ),
  [TabsSectionType.API_REFERENCE]: () =>
    renderTabsExampleTabs(
      tabsExamplePreviewBySectionId[TabsSectionType.API_REFERENCE](),
      tabsCodeBySectionId[TabsSectionType.API_REFERENCE](),
    ),
};

const tabsApiRows = {
  Tabs: [
    { prop: "defaultValue", type: "string", defaultValue: "-" },
    { prop: "syncKey", type: "string", defaultValue: "-" },
    { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
  ],
  TabsList: [{ prop: "variant", type: '"default" | "line"', defaultValue: '"default"' }],
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

const renderTabsExample = (sectionId: string) =>
  tabsExampleBySectionId[sectionId as TabsSectionId]?.() ?? null;

const renderTabsSection = (sectionId: string) => (
  <>
    {renderTabsExample(sectionId)}
    {tabsSectionOutroById[sectionId]?.() ?? null}
  </>
);

export const tabsDocPage: DocPageModule = {
  slug: "tabs",
  title: "Tabs",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Tabs organize content into focusable views and support synchronized groups via the `syncKey` prop.",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Install the package and import Tabs, TabsList, TabsTrigger and TabsContent from `@/components/kamod-ui/tabs`.",
    },
    {
      id: "synced-tabs",
      title: "Synced Tabs",
      text: "Use the syncKey prop to synchronize multiple groups with one shared state.",
    },
    {
      id: "disabled-triggers",
      title: "Disabled Triggers",
      text: "Use the disabled prop on TabsTrigger to prevent a tab from being selected.",
    },
    {
      id: "nested-tabs",
      title: "Nested Tabs",
      text: "Nest tabs inside content panels for layered, app-like navigation patterns.",
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
            <TabsList>
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
    <TabsList>
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
        <section key={docSection.id} id={docSection.id} class="docs-section">
          <h2>{docSection.title}</h2>
          <p class="docs-copy">{docSection.text}</p>
          {context.renderSectionExtraContent(docSection.id)}
          {renderTabsSection(docSection.id)}
        </section>
      ))}
    </>
  ),
};
