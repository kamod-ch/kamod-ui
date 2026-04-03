import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

const p = "hcdoc";

const SIDES = ["left", "top", "bottom", "right"] as const;

export const hoverCardDocPage = createGenericDocPage({
  slug: "hover-card",
  title: "Hover Card",
  previewCode: `import { Button } from "@/components/kamod-ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/kamod-ui/hover-card";

export const Example = () => (
  <HoverCard openDelay={10} closeDelay={100}>
    <HoverCardTrigger asChild>
      <Button variant="link">Hover Here</Button>
    </HoverCardTrigger>
    <HoverCardContent class="flex w-64 flex-col gap-0.5">
      <div class="font-semibold">@nextjs</div>
      <div>The React Framework – created and maintained by @vercel.</div>
      <div class="text-muted-foreground mt-1 text-xs">Joined December 2021</div>
    </HoverCardContent>
  </HoverCard>
);`,
  usageLabel:
    "Rich preview on hover or focus — delays, asChild trigger, side/align positioning, shadcn-aligned examples.",
  installationText: "Import HoverCard, HoverCardTrigger and HoverCardContent from `@/components/kamod-ui/hover-card`.",
  usageText:
    "Wrap a trigger and content. Use openDelay and closeDelay on HoverCard to avoid accidental opens. Use HoverCardTrigger asChild to use a Button or link. Position content with side and align on HoverCardContent.",
  exampleSections: [
    {
      id: "hover-demo",
      title: "Demo",
      text: "Link-style Button trigger and structured body (shadcn HoverCardDemo).",
      code: `import { Button } from "@/components/kamod-ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/kamod-ui/hover-card";

export const Example = () => (
  <HoverCard openDelay={10} closeDelay={100}>
    <HoverCardTrigger asChild>
      <Button variant="link">Hover Here</Button>
    </HoverCardTrigger>
    <HoverCardContent class="flex w-64 flex-col gap-0.5">
      <div class="font-semibold">@nextjs</div>
      <div>The React Framework – created and maintained by @vercel.</div>
      <div class="text-muted-foreground mt-1 text-xs">Joined December 2021</div>
    </HoverCardContent>
  </HoverCard>
);`,
      renderPreview: () => (
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="link">Hover Here</Button>
          </HoverCardTrigger>
          <HoverCardContent class="flex w-64 flex-col gap-0.5">
            <div class="font-semibold">@nextjs</div>
            <div>The React Framework – created and maintained by @vercel.</div>
            <div class="text-muted-foreground mt-1 text-xs">Joined December 2021</div>
          </HoverCardContent>
        </HoverCard>
      )
    },
    {
      id: "hover-usage",
      title: "Usage",
      text: "Minimal unstyled trigger (default button chrome).",
      code: `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/kamod-ui/hover-card";

export const Example = () => (
  <HoverCard>
    <HoverCardTrigger>Hover</HoverCardTrigger>
    <HoverCardContent class="w-64">The React Framework – created and maintained by @vercel.</HoverCardContent>
  </HoverCard>
);`,
      renderPreview: () => (
        <HoverCard>
          <HoverCardTrigger>Hover</HoverCardTrigger>
          <HoverCardContent class="w-64">
            The React Framework – created and maintained by @vercel.
          </HoverCardContent>
        </HoverCard>
      )
    },
    {
      id: "hover-delays",
      title: "Trigger delays",
      text: "openDelay and closeDelay on HoverCard (shadcn Trigger Delays).",
      code: `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/kamod-ui/hover-card";

export const Example = () => (
  <HoverCard openDelay={100} closeDelay={200}>
    <HoverCardTrigger>Hover</HoverCardTrigger>
    <HoverCardContent>Content</HoverCardContent>
  </HoverCard>
);`,
      renderPreview: () => (
        <HoverCard openDelay={100} closeDelay={200}>
          <HoverCardTrigger>Hover</HoverCardTrigger>
          <HoverCardContent class="w-56">Content opens after 100ms and closes 200ms after leave.</HoverCardContent>
        </HoverCard>
      )
    },
    {
      id: "hover-positioning",
      title: "Positioning",
      text: "side and align on HoverCardContent (shadcn Positioning).",
      code: `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/kamod-ui/hover-card";

export const Example = () => (
  <HoverCard openDelay={80} closeDelay={80}>
    <HoverCardTrigger>Hover</HoverCardTrigger>
    <HoverCardContent side="top" align="start" class="w-56">
      Top / start aligned
    </HoverCardContent>
  </HoverCard>
);`,
      renderPreview: () => (
        <HoverCard openDelay={80} closeDelay={80}>
          <HoverCardTrigger>Hover (top, start)</HoverCardTrigger>
          <HoverCardContent side="top" align="start" class="w-56">
            Top / start aligned
          </HoverCardContent>
        </HoverCard>
      )
    },
    {
      id: "hover-sides",
      title: "Sides",
      text: "All four sides (shadcn Sides).",
      code: `import { Button } from "@/components/kamod-ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/kamod-ui/hover-card";

const SIDES = ["left", "top", "bottom", "right"] as const;

export const Example = () => (
  <div class="flex flex-wrap justify-center gap-2">
    {SIDES.map((side) => (
      <HoverCard key={side} openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="outline" class="capitalize">
            {side}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side={side} class="w-56">
          <div class="flex flex-col gap-1">
            <h4 class="font-medium">Hover Card</h4>
            <p class="text-sm">This hover card appears on the {side} side of the trigger.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ))}
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-wrap justify-center gap-2">
          {SIDES.map((side) => (
            <HoverCard key={`${p}-${side}`} openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button variant="outline" class="capitalize">
                  {side}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side={side} class="w-56">
                <div class="flex flex-col gap-1">
                  <h4 class="font-medium">Hover Card</h4>
                  <p class="text-sm">This hover card appears on the {side} side of the trigger.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )
    },
    {
      id: "hover-rtl",
      title: "RTL",
      text: "dir=\"rtl\" on content for mirrored layout (shadcn RTL).",
      code: `import { Button } from "@/components/kamod-ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/kamod-ui/hover-card";

export const Example = () => (
  <div class="flex flex-wrap justify-center gap-2" dir="rtl">
    {(["left", "top", "bottom", "right"] as const).map((side) => (
      <HoverCard key={side} openDelay={10} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="outline">{side === "left" ? "يسار" : side === "top" ? "أعلى" : side === "bottom" ? "أسفل" : "يمين"}</Button>
        </HoverCardTrigger>
        <HoverCardContent side={side} dir="rtl" class="flex w-64 flex-col gap-1">
          <div class="font-semibold">سماعات لاسلكية</div>
          <div class="text-muted-foreground text-sm">٩٩.٩٩ $</div>
        </HoverCardContent>
      </HoverCard>
    ))}
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-wrap justify-center gap-2" dir="rtl">
          {(["left", "top", "bottom", "right"] as const).map((side) => (
            <HoverCard key={`${p}-rtl-${side}`} openDelay={10} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button variant="outline">
                  {side === "left" ? "يسار" : side === "top" ? "أعلى" : side === "bottom" ? "أسفل" : "يمين"}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side={side} dir="rtl" class="flex w-64 flex-col gap-1">
                <div class="font-semibold">سماعات لاسلكية</div>
                <div class="text-muted-foreground text-sm">٩٩.٩٩ $</div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "openDelay", type: "number", defaultValue: "700" },
    { prop: "closeDelay", type: "number", defaultValue: "300" },
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    { prop: "side", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"bottom"' },
    { prop: "align", type: '"start" | "center" | "end"', defaultValue: '"center"' },
    { prop: "sideOffset", type: "number", defaultValue: "8" },
    { prop: "asChild", type: "boolean", defaultValue: "false" }
  ],
  accessibilityText:
    "Content is keyboard-dismissible with Escape. Triggers open on focus with the same delay as hover. Ensure critical actions are not only available inside the hover surface; provide redundant paths where needed."
});
