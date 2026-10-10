import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Kbd,
} from "@kamod-ch/ui";
import { ArrowUpRight, Bell, Cloud, Folder, Plus, RefreshCw, Search } from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

export const emptyDocPage = createGenericDocPage({
  slug: "empty",
  title: "Empty",
  previewCode: `import { Button } from "@/components/kamod-ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/kamod-ui/empty";
import { ArrowUpRight, Folder } from "lucide-preact";

export const Example = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Folder aria-hidden />
      </EmptyMedia>
      <EmptyTitle>No Projects Yet</EmptyTitle>
      <EmptyDescription>
        You haven't created any projects yet. Get started by creating your first project.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent class="flex-row flex-wrap justify-center gap-2">
      <Button>Create Project</Button>
      <Button variant="outline">Import Project</Button>
    </EmptyContent>
    <Button variant="link" asChild class="text-muted-foreground" size="sm">
      <a href="#empty-doc">
        Learn More <ArrowUpRight class="size-4" aria-hidden />
      </a>
    </Button>
  </Empty>
);`,
  usageLabel:
    "Empty states for no data — composable EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent (shadcn-aligned). Legacy title/description props still work.",
  installationText:
    "Import Empty and subcomponents from `@/components/kamod-ui/empty` (EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent).",
  usageText:
    "Compose media, title, and description in EmptyHeader; primary actions in EmptyContent. Add border or background via class on Empty. Legacy API: pass title and description props for quick dashed cards.",
  exampleSections: [
    {
      id: "empty-demo",
      title: "Demo",
      text: "**Explain the Absence and Offer a Useful Next Step.** Compose `EmptyMedia`, a title, a description and a useful action to explain why a region has no content yet. The footer link can offer secondary guidance without competing with the main step toward creating or finding content.\n\nUse one clear primary action and keep the footer link secondary; an empty state should reduce uncertainty rather than simply fill unused space.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/kamod-ui/empty";
import { ArrowUpRight, Folder } from "lucide-preact";

export const Example = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Folder aria-hidden />
      </EmptyMedia>
      <EmptyTitle>No Projects Yet</EmptyTitle>
      <EmptyDescription>
        You haven't created any projects yet. Get started by creating your first project.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent class="flex-row flex-wrap justify-center gap-2">
      <Button>Create Project</Button>
      <Button variant="outline">Import Project</Button>
    </EmptyContent>
    <Button variant="link" asChild class="text-muted-foreground" size="sm">
      <a href="#">
        Learn More <ArrowUpRight class="size-4" aria-hidden />
      </a>
    </Button>
  </Empty>
);`,
      renderPreview: () => (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Folder aria-hidden />
            </EmptyMedia>
            <EmptyTitle>No Projects Yet</EmptyTitle>
            <EmptyDescription>
              You haven't created any projects yet. Get started by creating your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent class="flex-row flex-wrap justify-center gap-2">
            <Button>Create Project</Button>
            <Button variant="outline">Import Project</Button>
          </EmptyContent>
          <Button variant="link" asChild class="text-muted-foreground" size="sm">
            <a href="#empty-doc-learn">
              Learn More <ArrowUpRight class="size-4" aria-hidden />
            </a>
          </Button>
        </Empty>
      ),
    },
    {
      id: "empty-usage",
      title: "Usage",
      text: "**Start with the Message before Adding Decoration.** Start with the empty-state title and description before adding decoration or controls. This establishes what is missing and why, giving the surrounding screen a useful explanation even when no records are available.\n\nDistinguish a genuinely empty collection from loading or failure, and add media only when it reinforces the purpose rather than delaying the first useful instruction.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/kamod-ui/empty";

export const Example = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">…</EmptyMedia>
      <EmptyTitle>No data</EmptyTitle>
      <EmptyDescription>No data found</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button>Add data</Button>
    </EmptyContent>
  </Empty>
);`,
      renderPreview: () => (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <span aria-hidden>◇</span>
            </EmptyMedia>
            <EmptyTitle>No Data</EmptyTitle>
            <EmptyDescription>No data found</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Add data</Button>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      id: "empty-legacy",
      title: "Legacy Props",
      text: "**Use the Shorthand for Straightforward Messages.** Use the legacy `title` and `description` props when a compact empty-state composition is sufficient. The dashed surface groups the explanation, and any children can supply the next step beneath that message.\n\nChoose the compound structure when the layout needs richer media or multiple regions, and avoid mixing both approaches without checking where content renders.",
      code: `import { Empty } from "@/components/kamod-ui/empty";

export const Example = () => (
  <Empty title="No projects yet" description="Create your first project to get started." />
);`,
      renderPreview: () => (
        <Empty title="No Projects Yet" description="Create your first project to get started." />
      ),
    },
    {
      id: "empty-legacy-action",
      title: "Legacy + Action",
      text: "**Place the Recovery Action after Its Explanation.** Add a meaningful action as children of the legacy empty-state composition. It renders after the description, so the reader first learns what happened and then encounters the control that can change the situation.\n\nMake the action specific to the state, such as creating the first item or clearing a filter, rather than using an unexplained generic “Continue”.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Empty } from "@/components/kamod-ui/empty";

export const Example = () => (
  <Empty title="No invoices" description="Create an invoice to start billing customers.">
    <Button>Create invoice</Button>
  </Empty>
);`,
      renderPreview: () => (
        <Empty title="No Invoices" description="Create an invoice to start billing customers.">
          <Button>Create invoice</Button>
        </Empty>
      ),
    },
    {
      id: "empty-outline",
      title: "Outline",
      text: "**Mark the Boundary of a Missing Collection.** Add `border border-dashed` to `Empty` when the missing content needs a clearly defined region. The outline gives the placeholder a boundary while leaving the message and recovery action responsible for explaining its purpose.\n\nKeep the surface secondary and the instruction readable; the border alone should not imply that users can drag files into it unless that behavior exists.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/kamod-ui/empty";
import { Cloud } from "lucide-preact";

export const Example = () => (
  <Empty class="rounded-lg border border-dashed p-8">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Cloud aria-hidden />
      </EmptyMedia>
      <EmptyTitle>Cloud Storage Empty</EmptyTitle>
      <EmptyDescription>Upload files to your cloud storage to access them anywhere.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline" size="sm">
        Upload Files
      </Button>
    </EmptyContent>
  </Empty>
);`,
      renderPreview: () => (
        <Empty class="rounded-lg border border-dashed p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Cloud aria-hidden />
            </EmptyMedia>
            <EmptyTitle>Cloud Storage Empty</EmptyTitle>
            <EmptyDescription>
              Upload files to your cloud storage to access them anywhere.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Upload Files
            </Button>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      id: "empty-background",
      title: "Background",
      text: "**Separate the Message from the Surrounding Page.** Use a muted background and a deliberate panel height to reserve space for an empty region. This keeps the layout recognizable before data arrives without presenting an empty surface as if it were a loading skeleton.\n\nAvoid fixing an excessive height merely to fill space, and check that the message still feels connected to the controls that produced the empty result.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/kamod-ui/empty";
import { Bell, RefreshCw } from "lucide-preact";

export const Example = () => (
  <Empty class="min-h-48 rounded-lg bg-muted/30 p-8">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Bell aria-hidden />
      </EmptyMedia>
      <EmptyTitle>No Notifications</EmptyTitle>
      <EmptyDescription class="max-w-xs text-pretty">
        You're all caught up. New notifications will appear here.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline">
        <RefreshCw class="size-4" aria-hidden />
        Refresh
      </Button>
    </EmptyContent>
  </Empty>
);`,
      renderPreview: () => (
        <Empty class="min-h-48 rounded-lg bg-muted/30 p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell aria-hidden />
            </EmptyMedia>
            <EmptyTitle>No Notifications</EmptyTitle>
            <EmptyDescription class="max-w-xs text-pretty">
              You're all caught up. New notifications will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline">
              <RefreshCw class="size-4" aria-hidden />
              Refresh
            </Button>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      id: "empty-avatar",
      title: "Avatar",
      text: "**Add a Human Cue Where It Fits the Task.** Place an `Avatar` inside the default `EmptyMedia` treatment when the message concerns a person or account. The larger media region identifies the context while the title explains the missing connection or content.\n\nKeep identity text available and avoid using an unexplained portrait as the only indication of who the empty state concerns.",
      code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar"
import { Button } from "@/components/kamod-ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/kamod-ui/empty";

export const Example = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia>
        <Avatar class="size-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="" class="grayscale" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </EmptyMedia>
      <EmptyTitle>User Offline</EmptyTitle>
      <EmptyDescription>This user is currently offline. Try again later.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm">Leave Message</Button>
    </EmptyContent>
  </Empty>
);`,
      renderPreview: () => (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Avatar class="size-12">
                <AvatarImage src="https://github.com/shadcn.png" alt="" class="grayscale" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </EmptyMedia>
            <EmptyTitle>User Offline</EmptyTitle>
            <EmptyDescription>This user is currently offline. Try again later.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Leave Message</Button>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      id: "empty-avatar-group",
      title: "Avatar Group",
      text: "**Suggest Collaboration without Implying Real Membership.** Compose an avatar group inside `EmptyMedia` when the empty state concerns collaboration or membership. The people-related visual establishes context, while the description should still explain why the actual list or activity is absent.\n\nKeep the message and invitation action primary, and make additional counts or identities accurate when using live data.",
      code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar"
import { Button } from "@/components/kamod-ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/kamod-ui/empty";
import { Plus } from "lucide-preact";

export const Example = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia>
        <div class="flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/maxleiter.png" alt="" />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>
      </EmptyMedia>
      <EmptyTitle>No Team Members</EmptyTitle>
      <EmptyDescription>Invite your team to collaborate on this project.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm">
        <Plus class="size-4" aria-hidden />
        Invite Members
      </Button>
    </EmptyContent>
  </Empty>
);`,
      renderPreview: () => (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <div class="flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://github.com/maxleiter.png" alt="" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://github.com/evilrabbit.png" alt="" />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </div>
            </EmptyMedia>
            <EmptyTitle>No Team Members</EmptyTitle>
            <EmptyDescription>Invite your team to collaborate on this project.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">
              <Plus class="size-4" aria-hidden />
              Invite Members
            </Button>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      id: "empty-input-group",
      title: "Input Group",
      text: "**Offer a Direct Way to Recover Results.** Put a search control inside `EmptyContent` when changing the query is a useful recovery path. [Input Group](/docs/input-group/installation) keeps the field and its action together without replacing the explanation of the empty result.\n\nKeep the field labeled, preserve the current search text, and distinguish no matches from an empty dataset that searching cannot fix.",
      code: `import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/kamod-ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/kamod-ui/input-group"
import { Kbd } from "@/components/kamod-ui/kbd";
import { Search } from "lucide-preact";

export const Example = () => (
  <Empty>
    <EmptyHeader>
      <EmptyTitle>404 - Not Found</EmptyTitle>
      <EmptyDescription>The page you're looking for doesn't exist. Try searching below.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <InputGroup class="w-full max-w-md sm:w-3/4">
        <InputGroupInput placeholder="Try searching for pages..." />
        <InputGroupAddon>
          <Search class="size-4" aria-hidden />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <EmptyDescription>
        Need help? <a href="#empty-support" class="text-primary underline">Contact support</a>
      </EmptyDescription>
    </EmptyContent>
  </Empty>
);`,
      renderPreview: () => (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>404 - Not Found</EmptyTitle>
            <EmptyDescription>
              The page you're looking for doesn't exist. Try searching below.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <InputGroup class="w-full max-w-md sm:w-3/4">
              <InputGroupInput placeholder="Try searching for pages..." />
              <InputGroupAddon>
                <Search class="size-4" aria-hidden />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>/</Kbd>
              </InputGroupAddon>
            </InputGroup>
            <EmptyDescription>
              Need help?{" "}
              <a href="#empty-support" class="text-primary underline">
                Contact support
              </a>
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      id: "empty-rtl",
      title: "RTL",
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` on `Empty` for translated right-to-left content. Keep the media, explanation and next action in the same conceptual order while text alignment and logical spacing follow the language.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
      code: `import { Button } from "@/components/kamod-ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/kamod-ui/empty";
import { ArrowUpRight, Folder } from "lucide-preact";

export const Example = () => (
  <Empty dir="rtl">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Folder aria-hidden />
      </EmptyMedia>
      <EmptyTitle>لا توجد مشاريع بعد</EmptyTitle>
      <EmptyDescription>لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent class="flex-row flex-wrap justify-center gap-2">
      <Button>إنشاء مشروع</Button>
      <Button variant="outline">استيراد مشروع</Button>
    </EmptyContent>
    <Button variant="link" asChild class="text-muted-foreground" size="sm">
      <a href="#">
        تعرف على المزيد <ArrowUpRight class="size-4 rtl:rotate-270" aria-hidden data-icon="inline-end" />
      </a>
    </Button>
  </Empty>
);`,
      renderPreview: () => (
        <Empty dir="rtl">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Folder aria-hidden />
            </EmptyMedia>
            <EmptyTitle>لا توجد مشاريع بعد</EmptyTitle>
            <EmptyDescription>
              لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent class="flex-row flex-wrap justify-center gap-2">
            <Button>إنشاء مشروع</Button>
            <Button variant="outline">استيراد مشروع</Button>
          </EmptyContent>
          <Button variant="link" asChild class="text-muted-foreground" size="sm">
            <a href="#empty-rtl-more">
              تعرف على المزيد{" "}
              <ArrowUpRight class="size-4 rtl:rotate-270" aria-hidden data-icon="inline-end" />
            </a>
          </Button>
        </Empty>
      ),
    },
  ],
  apiRows: [
    { prop: "title / description", type: "ComponentChildren", defaultValue: "legacy only" },
    { prop: "EmptyMedia variant", type: '"default" | "icon"', defaultValue: '"default"' },
    { prop: "class", type: "string", defaultValue: "outline/background via utilities" },
  ],
  accessibilityText:
    "Use EmptyTitle as a heading; keep actions labeled. For icon-only media, set aria-hidden on decorative SVGs and provide meaningful title/description text.",
});
