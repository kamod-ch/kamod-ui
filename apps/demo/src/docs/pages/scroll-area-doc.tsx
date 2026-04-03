import { ScrollArea, ScrollAreaCorner, ScrollBar } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const scrollAreaDocPage = createGenericDocPage({
  slug: "scroll-area",
  title: "Scroll Area",
  usageLabel: "Scroll Area adds a modern, subtle scrollbar track with a dynamic thumb for long content regions.",
  installationText:
    "Import `ScrollArea`, `ScrollBar`, and optionally `ScrollAreaCorner` from `@/components/kamod-ui/scroll-area`.",
  usageText:
    "The root gets your size and border classes; scrolling happens in an inner viewport with native scrollbars hidden. Add `ScrollBar` for a draggable thumb (vertical default or `orientation=\"horizontal\"`). When both axes scroll, add `ScrollAreaCorner` after the bars to mask the junction. The viewport exposes `data-has-overflow-*`, `data-overflow-*-start|end`, `data-scrolling`, and CSS variables such as `--scroll-area-overflow-y-start` for edge fades (set `inherit` on pseudo-elements if needed, per Base UI).",
  exampleSections: [
    {
      id: "vertical-feed",
      title: "Vertical Feed",
      text: "A modern release feed with soft surface styling and a synced vertical thumb.",
      code: `import { ScrollBar } from "lucide-preact"
import { ScrollArea } from "@/components/kamod-ui/scroll-area";

export const Example = () => (
  <ScrollArea class="h-56 rounded-xl border bg-card p-4">
    <div class="space-y-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} class="rounded-lg border bg-background p-3">
          <p class="text-sm font-medium">Release update #{index + 1}</p>
          <p class="text-muted-foreground text-sm">
            Scrollable content block with consistent spacing and modern card treatment.
          </p>
        </div>
      ))}
    </div>
    <ScrollBar />
  </ScrollArea>
);`,
      renderPreview: () => (
        <ScrollArea class="h-56 w-full rounded-xl border bg-card p-4">
          <div class="space-y-3 pr-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} class="rounded-lg border bg-background p-3">
                <p class="text-sm font-medium">Release update #{index + 1}</p>
                <p class="text-muted-foreground text-sm">
                  Scrollable content block with consistent spacing and modern card treatment.
                </p>
              </div>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      )
    },
    {
      id: "horizontal-gallery",
      title: "Horizontal Gallery",
      text: "A shadcn-like horizontal strip with visual cards and explicit horizontal scrollbar.",
      code: `import { ScrollBar } from "lucide-preact"
import { ScrollArea } from "@/components/kamod-ui/scroll-area";

const items = [
  { title: "Aurora", accent: "from-cyan-500/25 to-sky-500/10" },
  { title: "Cinder", accent: "from-orange-500/25 to-rose-500/10" },
  { title: "Forest", accent: "from-emerald-500/25 to-lime-500/10" },
  { title: "Midnight", accent: "from-indigo-500/25 to-violet-500/10" }
];

export const Example = () => (
  <ScrollArea class="w-full max-w-[28rem] whitespace-nowrap rounded-xl border bg-card p-4">
    <div class="flex w-max gap-3 pb-3">
      {items.map((item) => (
        <article
          key={item.title}
          class={\`h-28 w-44 rounded-lg border bg-gradient-to-br \${item.accent} p-3\`}
        >
          <p class="text-sm font-medium">{item.title}</p>
          <p class="text-muted-foreground mt-1 text-xs">Preview panel</p>
        </article>
      ))}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);`,
      renderPreview: () => {
        const items = [
          { title: "Aurora", accent: "from-cyan-500/25 to-sky-500/10" },
          { title: "Cinder", accent: "from-orange-500/25 to-rose-500/10" },
          { title: "Forest", accent: "from-emerald-500/25 to-lime-500/10" },
          { title: "Midnight", accent: "from-indigo-500/25 to-violet-500/10" },
          { title: "Ash", accent: "from-slate-500/25 to-zinc-500/10" }
        ];

        return (
          <ScrollArea class="w-full max-w-[28rem] whitespace-nowrap rounded-xl border bg-card p-4">
            <div class="flex w-max gap-3 pb-3">
              {items.map((item) => (
                <article
                  key={item.title}
                  class={`h-28 w-44 rounded-lg border bg-gradient-to-br ${item.accent} p-3`}
                >
                  <p class="text-sm font-medium">{item.title}</p>
                  <p class="text-muted-foreground mt-1 text-xs">Preview panel</p>
                </article>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        );
      }
    },
    {
      id: "reading-container",
      title: "Reading Container",
      text: "Use ScrollArea for dense documentation snippets while keeping the layout compact.",
      code: `import { ScrollBar } from "lucide-preact"
import { ScrollArea } from "@/components/kamod-ui/scroll-area";

export const Example = () => (
  <ScrollArea class="h-44 rounded-xl border bg-muted/30 p-4">
    <div class="space-y-3 pr-3 text-sm leading-6 text-muted-foreground">
      {Array.from({ length: 8 }).map((_, index) => (
        <p key={index}>
          Scroll areas are useful for constrained panels where content length can vary significantly.
        </p>
      ))}
    </div>
    <ScrollBar />
  </ScrollArea>
);`,
      renderPreview: () => (
        <ScrollArea class="h-44 w-full rounded-xl border bg-muted/30 p-4">
          <div class="space-y-3 pr-3 text-sm leading-6 text-muted-foreground">
            {Array.from({ length: 8 }).map((_, index) => (
              <p key={index}>
                Scroll areas are useful for constrained panels where content length can vary significantly.
              </p>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      )
    },
    {
      id: "compact-chips",
      title: "Compact Chips",
      text: "Horizontal chips and tags stay tidy with an explicit bottom scrollbar.",
      code: `import { ScrollBar } from "lucide-preact"
import { ScrollArea } from "@/components/kamod-ui/scroll-area";

const tags = [
  "Design System",
  "Accessibility",
  "Performance",
  "Composable API",
  "Theme Tokens",
  "Keyboard UX",
  "Docs"
];

export const Example = () => (
  <ScrollArea class="w-80 whitespace-nowrap rounded-xl border p-4">
    <div class="flex w-max gap-2 pb-3">
      {tags.map((tag) => (
        <span key={tag} class="rounded-full border bg-muted px-3 py-1 text-xs">
          {tag}
        </span>
      ))}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);`,
      renderPreview: () => (
        <ScrollArea class="w-80 whitespace-nowrap rounded-xl border p-4">
          <div class="flex w-max gap-2 pb-3">
            {[
              "Design System",
              "Accessibility",
              "Performance",
              "Composable API",
              "Theme Tokens",
              "Keyboard UX",
              "Docs"
            ].map((tag) => (
              <span key={tag} class="rounded-full border bg-muted px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )
    },
    {
      id: "both-axes",
      title: "Vertical, horizontal, and corner",
      text: "Use two scrollbars plus `ScrollAreaCorner` when content overflows on both axes (shadcn / Base UI pattern).",
      code: `import { ScrollArea, ScrollAreaCorner, ScrollBar } from "@/components/kamod-ui/scroll-area";

export const Example = () => (
  <ScrollArea class="h-48 w-64 rounded-xl border bg-card">
    <div class="min-h-[120%] min-w-[140%] space-y-3 p-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <p key={i} class="text-sm text-muted-foreground">
          Line {i + 1} — wide and tall content so both scrollbars appear.
        </p>
      ))}
    </div>
    <ScrollBar />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaCorner />
  </ScrollArea>
);`,
      renderPreview: () => (
        <ScrollArea class="h-48 w-full max-w-xs rounded-xl border bg-card sm:max-w-sm">
          <div class="min-h-[120%] min-w-[140%] space-y-3 p-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <p key={i} class="text-sm text-muted-foreground">
                Line {i + 1} — wide and tall content so both scrollbars appear.
              </p>
            ))}
          </div>
          <ScrollBar />
          <ScrollBar orientation="horizontal" />
          <ScrollAreaCorner />
        </ScrollArea>
      )
    }
  ],
  apiRows: [
    { prop: "class (ScrollArea)", type: "string", defaultValue: "undefined" },
    { prop: "orientation (ScrollBar)", type: '"vertical" | "horizontal"', defaultValue: '"vertical"' },
    { prop: "class (ScrollAreaCorner)", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText:
    "Keep focusable controls reachable in scrollable panels and ensure scroll regions have enough contrast and size for touch + pointer input."
});
