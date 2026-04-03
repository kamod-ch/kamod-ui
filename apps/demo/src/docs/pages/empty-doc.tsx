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
  Kbd
} from "@kamod-ui/core";
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
      text: "Icon, title, description, actions, and footer link (shadcn EmptyDemo).",
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
      )
    },
    {
      id: "empty-usage",
      title: "Usage",
      text: "Minimal structure.",
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
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>No data found</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Add data</Button>
          </EmptyContent>
        </Empty>
      )
    },
    {
      id: "empty-legacy",
      title: "Legacy props",
      text: "title + description + children (dashed border) for quick screens.",
      code: `import { Empty } from "@/components/kamod-ui/empty";

export const Example = () => (
  <Empty title="No projects yet" description="Create your first project to get started." />
);`,
      renderPreview: () => (
        <Empty title="No projects yet" description="Create your first project to get started." />
      )
    },
    {
      id: "empty-legacy-action",
      title: "Legacy + action",
      text: "Children render below description.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Empty } from "@/components/kamod-ui/empty";

export const Example = () => (
  <Empty title="No invoices" description="Create an invoice to start billing customers.">
    <Button>Create invoice</Button>
  </Empty>
);`,
      renderPreview: () => (
        <Empty title="No invoices" description="Create an invoice to start billing customers.">
          <Button>Create invoice</Button>
        </Empty>
      )
    },
    {
      id: "empty-outline",
      title: "Outline",
      text: "border border-dashed on Empty (shadcn Outline).",
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
            <EmptyDescription>Upload files to your cloud storage to access them anywhere.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Upload Files
            </Button>
          </EmptyContent>
        </Empty>
      )
    },
    {
      id: "empty-background",
      title: "Background",
      text: "Muted panel height (shadcn Background).",
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
      )
    },
    {
      id: "empty-avatar",
      title: "Avatar",
      text: "EmptyMedia variant default for larger media (shadcn Avatar).",
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
      )
    },
    {
      id: "empty-avatar-group",
      title: "Avatar group",
      text: "Stacked avatars in EmptyMedia (shadcn Avatar Group).",
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
      )
    },
    {
      id: "empty-input-group",
      title: "Input group",
      text: "Search UI inside EmptyContent (shadcn InputGroup).",
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
              Need help? <a href="#empty-support" class="text-primary underline">
                Contact support
              </a>
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      )
    },
    {
      id: "empty-rtl",
      title: "RTL",
      text: "dir=\"rtl\" on Empty for mirrored layout.",
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
            <EmptyDescription>لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent class="flex-row flex-wrap justify-center gap-2">
            <Button>إنشاء مشروع</Button>
            <Button variant="outline">استيراد مشروع</Button>
          </EmptyContent>
          <Button variant="link" asChild class="text-muted-foreground" size="sm">
            <a href="#empty-rtl-more">
              تعرف على المزيد <ArrowUpRight class="size-4 rtl:rotate-270" aria-hidden data-icon="inline-end" />
            </a>
          </Button>
        </Empty>
      )
    }
  ],
  apiRows: [
    { prop: "title / description", type: "ComponentChildren", defaultValue: "legacy only" },
    { prop: "EmptyMedia variant", type: '"default" | "icon"', defaultValue: '"default"' },
    { prop: "class", type: "string", defaultValue: "outline/background via utilities" }
  ],
  accessibilityText:
    "Use EmptyTitle as a heading; keep actions labeled. For icon-only media, set aria-hidden on decorative SVGs and provide meaningful title/description text."
});
