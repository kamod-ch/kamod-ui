import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

function ListItem({ title, children, href }: { title: string; children: string; href: string }) {
  return (
    <li class="list-none">
      <NavigationMenuLink href={href}>
        <div class="flex flex-col gap-1 text-sm">
          <div class="leading-none font-medium">{title}</div>
          <div class="line-clamp-2 text-muted-foreground">{children}</div>
        </div>
      </NavigationMenuLink>
    </li>
  );
}

function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-96 gap-1 p-0">
              <ListItem href="/docs" title="Introduction">
                Re-usable components built with Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem class="hidden md:flex">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-2 p-0 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((c) => (
                <ListItem key={c.title} title={c.title} href={c.href}>
                  {c.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink class={navigationMenuTriggerStyle()} href="/docs">
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export const navigationMenuDocPage = createGenericDocPage({
  slug: "navigation-menu",
  title: "Navigation Menu",
  usageLabel:
    "Hierarchical top-level navigation with hover and click, aligned with shadcn/ui patterns.",
  installationText:
    "Import NavigationMenu primitives and optional `navigationMenuTriggerStyle` from `@/components/kamod-ui/navigation-menu`.",
  usageText:
    "Wrap each branch in NavigationMenuItem. Pair NavigationMenuTrigger with NavigationMenuContent for flyouts; use NavigationMenuLink with `navigationMenuTriggerStyle()` for a top-level link that matches trigger styling. Submenus share one open panel with delay and skip-delay behavior similar to Radix.",
  exampleSections: [
    {
      id: "demo",
      title: "Demo",
      text: "Full example from the shadcn/ui docs: Getting started list, responsive Components grid, and a trigger-styled Docs link.",
      code: `// See shadcn NavigationMenuDemo — ListItem helper + components grid + navigationMenuTriggerStyle on Docs link`,
      renderPreview: () => (
        <div class="flex w-full justify-center py-2">
          <NavigationMenuDemo />
        </div>
      ),
    },
    {
      id: "basic",
      title: "Basic",
      text: "Minimal trigger and content pair inside a list.",
      code: `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/kamod-ui/navigation-menu";

export const Example = () => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Item one</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="#">Link</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item one</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="#">Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ),
    },
    {
      id: "link-as-trigger-style",
      title: "Link with trigger style",
      text: "Use `navigationMenuTriggerStyle()` on NavigationMenuLink so a plain anchor matches submenu triggers (shadcn Link composition pattern).",
      code: `import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/kamod-ui/navigation-menu";

export const Example = () => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink class={navigationMenuTriggerStyle()} href="/docs">
          Documentation
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink class={navigationMenuTriggerStyle()} href="#">
                  Documentation
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ),
    },
    {
      id: "rtl",
      title: "RTL",
      text: 'Set `dir="rtl"` on NavigationMenu for right-to-left layouts; chevron rotation follows logical start/end.',
      code: `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/kamod-ui/navigation-menu";

export const Example = () => (
  <NavigationMenu dir="rtl">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>البدء</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="w-72 p-0">
            <li class="list-none">
              <NavigationMenuLink href="#">مقدمة</NavigationMenuLink>
            </li>
            <li class="list-none">
              <NavigationMenuLink href="#">التثبيت</NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink class={navigationMenuTriggerStyle()} href="#">
          الوثائق
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <NavigationMenu dir="rtl">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>البدء</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul class="w-72 p-0">
                    <li class="list-none">
                      <NavigationMenuLink href="#">مقدمة</NavigationMenuLink>
                    </li>
                    <li class="list-none">
                      <NavigationMenuLink href="#">التثبيت</NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink class={navigationMenuTriggerStyle()} href="#">
                  الوثائق
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ),
    },
    {
      id: "delays",
      title: "Delay tuning",
      text: "Adjust hover open delay and rapid-switch skip window (defaults 200ms / 300ms, Radix-like).",
      code: `import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/kamod-ui/navigation-menu";

export const Example = () => (
  <NavigationMenu delayDuration={400} skipDelayDuration={500}>
    <NavigationMenuList>
      <NavigationMenuItem value="a">
        <NavigationMenuTrigger>Slower open</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="#">A</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="b">
        <NavigationMenuTrigger>Second</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="#">B</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <NavigationMenu delayDuration={400} skipDelayDuration={500}>
            <NavigationMenuList>
              <NavigationMenuItem value="a">
                <NavigationMenuTrigger>Slower open</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="#">A</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem value="b">
                <NavigationMenuTrigger>Second</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="#">B</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "delayDuration", type: "number", defaultValue: "200" },
    { prop: "skipDelayDuration", type: "number", defaultValue: "300" },
    { prop: "dir", type: '"ltr" | "rtl"', defaultValue: "—" },
    { prop: "value (Item)", type: "string", defaultValue: "auto id" },
    { prop: "asChild (Link)", type: "boolean", defaultValue: "false" },
    { prop: "active (Link)", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    "Triggers are buttons with aria-expanded; Escape and outside click close the menu. Keep link text descriptive; ensure focus order remains logical when mixing triggers and links.",
});
