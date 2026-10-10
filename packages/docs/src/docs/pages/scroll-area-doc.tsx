import { ScrollArea, ScrollAreaCorner, ScrollBar } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const scrollAreaDocPage = createGenericDocPage({
  slug: "scroll-area",
  title: "Scroll Area",
  usageLabel:
    "Scroll Area adds a modern, subtle scrollbar track with a dynamic thumb for long content regions.",
  installationText:
    "Import `ScrollArea`, `ScrollBar`, and optionally `ScrollAreaCorner` from `@/components/kamod-ui/scroll-area`.",
  usageText:
    'The root gets your size and border classes; scrolling happens in an inner viewport with native scrollbars hidden. Add `ScrollBar` for a draggable thumb (vertical default or `orientation="horizontal"`). When both axes scroll, add `ScrollAreaCorner` after the bars to mask the junction. The viewport exposes `data-has-overflow-*`, `Data-Overflow-*-start|end`, `data-scrolling`, and CSS variables such as `--scroll-area-overflow-y-start` for edge fades (set `inherit` on pseudo-elements if needed, per Base UI).',
  exampleSections: [
    {
      id: "vertical-feed",
      title: "Vertical Feed",
      text: "**Bound the Feed without Losing Its Context.** Place a release feed inside a constrained `ScrollArea` so the surrounding screen can retain a compact layout. The vertical scrollbar makes the additional entries discoverable while each release remains part of one continuous list.\n\nMake the area reachable and understandable for keyboard users, preserve sensible wheel and touch behavior, and avoid placing another vertical scroller inside each feed item.",
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
                <p class="text-sm font-medium">Release Update #{index + 1}</p>
                <p class="text-muted-foreground text-sm">
                  Scrollable content block with consistent spacing and modern card treatment.
                </p>
              </div>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      ),
    },
    {
      id: "horizontal-gallery",
      title: "Horizontal Gallery",
      text: "**Make Overflow Discoverable without Requiring a Drag Gesture.** Use a horizontal `ScrollArea` for a sequence of visual cards that should stay in one row. An explicit horizontal scrollbar communicates that more items extend beyond the current view without depending on a swipe gesture alone.\n\nKeep card labels readable, provide usable link targets, and test trackpad, keyboard and touch movement before relying on this pattern for important navigation.",
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
          { title: "Ash", accent: "from-slate-500/25 to-zinc-500/10" },
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
      },
    },
    {
      id: "reading-container",
      title: "Reading Container",
      text: "**Use a Scroll Region for a Deliberate Content Boundary.** Constrain a documentation excerpt inside `ScrollArea` when it must share limited space with other content. Preserve readable text and an accessible scrolling region so the compact presentation does not make the explanation unreachable.\n\nChoose a practical height, retain keyboard access and consider whether a full-height section would be simpler for the amount of content shown.",
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
                Scroll areas are useful for constrained panels where content length can vary
                significantly.
              </p>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      ),
    },
    {
      id: "compact-chips",
      title: "Compact Chips",
      text: "**Keep a Long Tag Collection in One Compact Strip.** Place a chip collection in a horizontal scroll region when keeping one row is useful. The bottom scrollbar indicates additional values, while the individual chips should remain readable and reachable through the intended input methods.\n\nKeep chip targets usable and make selected or focused items visible; do not hide essential filtering options beyond an undiscoverable edge.",
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
              "Docs",
            ].map((tag) => (
              <span key={tag} class="rounded-full border bg-muted px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ),
    },
    {
      id: "both-axes",
      title: "Vertical, Horizontal, and Corner",
      text: "**Reserve Two-Dimensional Scrolling for Content that Needs It.** Render horizontal and vertical scrollbars with `ScrollAreaCorner` when content can exceed both dimensions. The corner fills their intersection, keeping the two scrolling directions visually coherent within one bounded viewport.\n\nInclude the corner treatment, keep each scrollbar reachable, and check that nested scroll regions do not make it difficult to return to ordinary page scrolling.",
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
      ),
    },
  ],
  apiRows: [
    { prop: "class (ScrollArea)", type: "string", defaultValue: "undefined" },
    {
      prop: "orientation (ScrollBar)",
      type: '"vertical" | "horizontal"',
      defaultValue: '"vertical"',
    },
    { prop: "class (ScrollAreaCorner)", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Keep focusable controls reachable in scrollable panels and ensure scroll regions have enough contrast and size for touch + pointer input.",
});
