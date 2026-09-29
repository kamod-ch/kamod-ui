import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderFooter,
  PageHeaderHeading,
  PageHeaderTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

const USAGE_SNIPPET = `import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from "@/components/kamod-ui/page-header";

export const Example = () => (
  <PageHeader>
    <PageHeaderHeading>
      <PageHeaderTitle>Projects</PageHeaderTitle>
      <PageHeaderDescription>Manage workspace projects and members.</PageHeaderDescription>
    </PageHeaderHeading>
  </PageHeader>
);`;

const SimplePreview = () => (
  <PageHeader class="w-full max-w-3xl">
    <PageHeaderHeading>
      <PageHeaderTitle>Projects</PageHeaderTitle>
      <PageHeaderDescription>Manage workspace projects and members.</PageHeaderDescription>
    </PageHeaderHeading>
  </PageHeader>
);

const SIMPLE_CODE = USAGE_SNIPPET;

const BreadcrumbsActionsPreview = () => (
  <PageHeader class="w-full max-w-3xl">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#">Home</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#">Workspace</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Projects</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <PageHeaderHeading>
      <PageHeaderTitle>Projects</PageHeaderTitle>
      <PageHeaderDescription>Create, archive, and share project settings.</PageHeaderDescription>
    </PageHeaderHeading>
    <PageHeaderActions>
      <Button variant="outline" size="sm">
        Export
      </Button>
      <Button size="sm">New project</Button>
    </PageHeaderActions>
  </PageHeader>
);

const BREADCRUMBS_ACTIONS_CODE = `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from "@/components/kamod-ui";

export const Example = () => (
  <PageHeader>
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#">Home</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Projects</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <PageHeaderHeading>
      <PageHeaderTitle>Projects</PageHeaderTitle>
      <PageHeaderDescription>Create, archive, and share project settings.</PageHeaderDescription>
    </PageHeaderHeading>
    <PageHeaderActions>
      <Button variant="outline" size="sm">Export</Button>
      <Button size="sm">New project</Button>
    </PageHeaderActions>
  </PageHeader>
);`;

const DetailPreview = () => (
  <PageHeader class="w-full max-w-3xl">
    <PageHeaderHeading>
      <div class="flex min-w-0 flex-wrap items-center gap-2">
        <PageHeaderTitle as="h1">Order #10482</PageHeaderTitle>
        <Badge variant="success">Shipped</Badge>
      </div>
      <PageHeaderDescription>
        Placed 12 Aug 2026 · Updated 2 hours ago · Customer ID 8f2a
      </PageHeaderDescription>
    </PageHeaderHeading>
    <PageHeaderActions>
      <Button variant="outline" size="sm">
        Refund
      </Button>
      <Button size="sm">Print label</Button>
    </PageHeaderActions>
    <PageHeaderFooter>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p class="text-muted-foreground pt-3 text-sm">Tab panels are composed by the consumer.</p>
        </TabsContent>
      </Tabs>
      <Separator class="mt-4" />
    </PageHeaderFooter>
  </PageHeader>
);

const DETAIL_CODE = `import {
  Badge,
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderFooter,
  PageHeaderHeading,
  PageHeaderTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/kamod-ui";

export const Example = () => (
  <PageHeader>
    <PageHeaderHeading>
      <div class="flex min-w-0 flex-wrap items-center gap-2">
        <PageHeaderTitle>Order #10482</PageHeaderTitle>
        <Badge variant="success">Shipped</Badge>
      </div>
      <PageHeaderDescription>Placed 12 Aug 2026 · Customer ID 8f2a</PageHeaderDescription>
    </PageHeaderHeading>
    <PageHeaderActions>
      <Button variant="outline" size="sm">Refund</Button>
      <Button size="sm">Print label</Button>
    </PageHeaderActions>
    <PageHeaderFooter>
      <Tabs defaultValue="overview">{/* TabsList / TabsContent */}</Tabs>
      <Separator class="mt-4" />
    </PageHeaderFooter>
  </PageHeader>
);`;

const LONG_TITLE_COPY = {
  title: "Quarterly operational efficiency review for the EMEA logistics program",
  description: "Summary metrics and export controls for regional stakeholders.",
};

const LongTitleActions = () => (
  <>
    <Button variant="outline" size="sm">
      Share
    </Button>
    <Button size="sm">Download</Button>
  </>
);

const LongTitlePreview = () => (
  <div class="flex w-full max-w-3xl flex-col gap-10">
    <div class="space-y-3">
      <p class="text-muted-foreground m-0 text-xs font-semibold tracking-wide uppercase">
        Wide container · title and actions align on one row
      </p>
      <div class="bg-muted/20 rounded-2xl border border-border p-2">
        <div class="bg-background rounded-xl px-5 py-6 sm:px-8 sm:py-7">
          <PageHeader>
            <PageHeaderHeading>
              <PageHeaderTitle>{LONG_TITLE_COPY.title}</PageHeaderTitle>
              <PageHeaderDescription>{LONG_TITLE_COPY.description}</PageHeaderDescription>
            </PageHeaderHeading>
            <PageHeaderActions>
              <LongTitleActions />
            </PageHeaderActions>
          </PageHeader>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <p class="text-muted-foreground m-0 text-xs font-semibold tracking-wide uppercase">
        320px container · copy wraps, actions stack full width
      </p>
      <div class="mx-auto w-full max-w-[20rem]">
        <div class="bg-muted/30 rounded-[1.75rem] border border-border p-2 shadow-sm">
          <div class="bg-background rounded-[1.25rem] px-4 py-5">
            <PageHeader>
              <PageHeaderHeading>
                <PageHeaderTitle>{LONG_TITLE_COPY.title}</PageHeaderTitle>
                <PageHeaderDescription>{LONG_TITLE_COPY.description}</PageHeaderDescription>
              </PageHeaderHeading>
              <PageHeaderActions>
                <LongTitleActions />
              </PageHeaderActions>
            </PageHeader>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LONG_TITLE_CODE = `import { Button, PageHeader, PageHeaderActions, PageHeaderDescription, PageHeaderHeading, PageHeaderTitle } from "@/components/kamod-ui/page-header";

export const Example = () => (
  <div class="max-w-[20rem]">
    <PageHeader>
      <PageHeaderHeading>
        <PageHeaderTitle>
          Quarterly operational efficiency review for the EMEA logistics program
        </PageHeaderTitle>
        <PageHeaderDescription>
          Summary metrics and export controls for regional stakeholders.
        </PageHeaderDescription>
      </PageHeaderHeading>
      <PageHeaderActions>
        <Button variant="outline" size="sm">Share</Button>
        <Button size="sm">Download</Button>
      </PageHeaderActions>
    </PageHeader>
  </div>
);`;

export const pageHeaderDocPage = createGenericDocPage({
  slug: "page-header",
  title: "Page Header",
  usageLabel: "Page Header",
  previewChromeClass: "justify-start",
  previewCode: SIMPLE_CODE,
  installationText:
    "Import from `@kamod-ch/ui/page-header` or the package root. Compose breadcrumbs, badges, and tabs from existing components — Page Header only provides layout slots.",
  installationExample: {
    code: USAGE_SNIPPET,
    renderPreview: SimplePreview,
  },
  usageText:
    "Page Header is a semantic `<header>` for list, dashboard, and detail views. Place `PageHeaderHeading` (title + description) and optional `PageHeaderActions` as direct children; from `sm` breakpoints they align in a row. Add `Breadcrumb`, `Badge`, or `Tabs` as siblings — no navigation or back behavior is built in.",
  exampleSections: [
    {
      id: "simple",
      title: "Simple title",
      text: "Title and description only. `PageHeaderTitle` renders `h1` by default.",
      code: SIMPLE_CODE,
      renderPreview: SimplePreview,
    },
    {
      id: "breadcrumbs-actions",
      title: "Breadcrumbs and actions",
      text: "Breadcrumbs span the full width above the heading/actions row. Primary and secondary buttons wrap on narrow screens.",
      code: BREADCRUMBS_ACTIONS_CODE,
      renderPreview: BreadcrumbsActionsPreview,
    },
    {
      id: "detail-metadata",
      title: "Detail page with badge and tabs",
      text: "Badges and metadata are composed inline. `PageHeaderFooter` holds tabs or other secondary chrome without tab logic.",
      code: DETAIL_CODE,
      renderPreview: DetailPreview,
    },
    {
      id: "long-title",
      title: "Long title on a narrow screen",
      text: "Layout responds to the header container, not the viewport: from 32rem wide, title and actions share a row; below that, actions stack as full-width buttons. Titles use `text-balance` and wrap safely for long copy.",
      code: LONG_TITLE_CODE,
      renderPreview: LongTitlePreview,
    },
  ],
  apiRows: [
    { prop: "PageHeader", type: "HTMLElement props", defaultValue: "—" },
    { prop: "PageHeaderHeading", type: "HTMLDivElement props", defaultValue: "—" },
    {
      prop: "PageHeaderTitle.as",
      type: '"h1" | "h2" | "h3"',
      defaultValue: '"h1"',
    },
    {
      prop: "PageHeaderTitle.size",
      type: '"default" | "sm" | "lg"',
      defaultValue: '"default"',
    },
    { prop: "PageHeaderDescription", type: "HTMLParagraphElement props", defaultValue: "—" },
    { prop: "PageHeaderActions", type: "HTMLDivElement props", defaultValue: "—" },
    { prop: "PageHeaderFooter", type: "HTMLDivElement props", defaultValue: "—" },
  ],
  accessibilityText:
    'Use a single `h1` per view when `PageHeaderTitle` uses the default level. For nested sections, set `as="h2"` or `as="h3"`. Breadcrumbs should keep their `nav` label from the Breadcrumb component. Actions are plain buttons or links supplied by the consumer — wire keyboard focus order and visible labels explicitly.',
});
