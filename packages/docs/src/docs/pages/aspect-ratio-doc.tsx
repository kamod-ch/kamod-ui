import { AspectRatio, DirectionProvider, Image } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import type { DocPageModule } from "../types";

const demoSrc = "https://avatar.vercel.sh/shadcn1";

function AspectHero() {
  return (
    <div class="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} class="rounded-lg bg-muted">
        <Image
          src={demoSrc}
          alt="Photo"
          class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
        />
      </AspectRatio>
    </div>
  );
}

const heroCode = `import { AspectRatio } from "@/components/kamod-ui/aspect-ratio"
import { Image } from "@/components/kamod-ui/image";

export const Example = () => (
  <div class="w-full max-w-sm">
    <AspectRatio ratio={16 / 9} class="rounded-lg bg-muted">
      <Image
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
      />
    </AspectRatio>
  </div>
);`;

const sectionBlocks: Record<
  string,
  {
    preview: () => ComponentChildren;
    code: string;
  }
> = {
  demo: {
    preview: () => (
      <div class="w-full max-w-sm">
        <AspectRatio ratio={16 / 9} class="rounded-lg bg-muted">
          <Image
            src={demoSrc}
            alt="Photo"
            class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
          />
        </AspectRatio>
      </div>
    ),
    code: `import { AspectRatio } from "@/components/kamod-ui/aspect-ratio"
import { Image } from "@/components/kamod-ui/image";

export const Example = () => (
  <div class="w-full max-w-sm">
    <AspectRatio ratio={16 / 9} class="rounded-lg bg-muted">
      <Image
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
      />
    </AspectRatio>
  </div>
);`,
  },
  square: {
    preview: () => (
      <div class="w-full max-w-48">
        <AspectRatio ratio={1 / 1} class="rounded-lg bg-muted">
          <Image
            src={demoSrc}
            alt="Photo"
            class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
          />
        </AspectRatio>
      </div>
    ),
    code: `import { AspectRatio } from "@/components/kamod-ui/aspect-ratio"
import { Image } from "@/components/kamod-ui/image";

export const Example = () => (
  <div class="w-full max-w-48">
    <AspectRatio ratio={1 / 1} class="rounded-lg bg-muted">
      <Image
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
      />
    </AspectRatio>
  </div>
);`,
  },
  portrait: {
    preview: () => (
      <div class="w-full max-w-40">
        <AspectRatio ratio={9 / 16} class="rounded-lg bg-muted">
          <Image
            src={demoSrc}
            alt="Photo"
            class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
          />
        </AspectRatio>
      </div>
    ),
    code: `import { AspectRatio } from "@/components/kamod-ui/aspect-ratio"
import { Image } from "@/components/kamod-ui/image";

export const Example = () => (
  <div class="w-full max-w-40">
    <AspectRatio ratio={9 / 16} class="rounded-lg bg-muted">
      <Image
        src="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
      />
    </AspectRatio>
  </div>
);`,
  },
  rtl: {
    preview: () => <AspectRatioRtlDemo />,
    code: `import { AspectRatio } from "@/components/kamod-ui/aspect-ratio"
import { DirectionProvider } from "@/components/kamod-ui/direction"
import { Image } from "@/components/kamod-ui/image";

const captions = { en: "Beautiful landscape", ar: "منظر طبيعي جميل", he: "נוף יפה" };

export const Example = () => (
  <DirectionProvider direction="rtl">
    <figure class="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} class="rounded-lg bg-muted">
        <Image src="…" alt="Photo" class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]" />
      </AspectRatio>
      <figcaption class="mt-2 text-center text-sm text-muted-foreground">{captions.ar}</figcaption>
    </figure>
  </DirectionProvider>
);`,
  },
};

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<Lang, { dir: "ltr" | "rtl"; label: string; caption: string }> = {
  en: { dir: "ltr", label: "English (LTR)", caption: "Beautiful landscape" },
  ar: { dir: "rtl", label: "العربية (RTL)", caption: "منظر طبيعي جميل" },
  he: { dir: "rtl", label: "עברית (RTL)", caption: "נוף יפה" },
};

function AspectRatioRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const { dir, caption } = rtlCopy[lang];

  return (
    <div class="flex flex-col items-center gap-4">
      <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Language">
        {(Object.keys(rtlCopy) as Lang[]).map((key) => (
          <button
            key={key}
            type="button"
            class={
              lang === key
                ? "rounded-md border border-primary bg-primary/10 px-3 py-1 text-sm font-medium"
                : "rounded-md border border-border bg-background px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
            }
            onClick={() => setLang(key)}
          >
            {rtlCopy[key].label}
          </button>
        ))}
      </div>
      <DirectionProvider direction={dir}>
        <figure class="w-full max-w-sm" dir={dir}>
          <AspectRatio ratio={16 / 9} class="rounded-lg bg-muted">
            <Image
              src={demoSrc}
              alt="Photo"
              class="h-full w-full rounded-lg object-cover grayscale dark:brightness-[0.2]"
            />
          </AspectRatio>
          <figcaption class="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>
        </figure>
      </DirectionProvider>
    </div>
  );
}

const apiSections = [
  {
    title: "AspectRatio",
    description:
      "Wrapper with CSS aspect-ratio; clip overflow. Child media should fill with h-full w-full object-cover.",
    rows: [
      { prop: "ratio", type: "number", defaultValue: "(required)" },
      { prop: "class", type: "string", defaultValue: "-" },
      { prop: "children", type: "ComponentChildren", defaultValue: "-" },
    ],
  },
] as const;

export const aspectRatioDocPage: DocPageModule = {
  slug: "aspect-ratio",
  title: "Aspect Ratio",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Keeps embedded media in a fixed width-to-height ratio using CSS aspect-ratio (shadcn-style API; no Radix dependency).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import AspectRatio from `@/components/kamod-ui/aspect-ratio`.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Pass ratio as a number (e.g. 16/9). Put the image (or video) inside and size it with h-full w-full object-cover so it fills the box.",
    },
    {
      id: "demo",
      title: "Demo",
      text: "**Reserve the Media Space before It Loads.** Use `AspectRatio` to reserve a widescreen frame before the image loads. A muted background and rounded corners define the media area; the ratio determines its height from the available width.\n\nChoose whether the image should crop with `object-cover` or remain fully visible with `object-contain`; the ratio controls the frame, not which content may safely be cropped.",
    },
    {
      id: "square",
      title: "Square",
      text: "**Use a Predictable Thumbnail Rhythm.** Set `ratio={1 / 1}` to keep the media frame square as its container grows or shrinks. Use this for consistent thumbnails, then choose how the image should fit inside that reserved space.\n\nCheck the focal point before cropping, provide useful alternative text, and avoid treating a decorative thumbnail as the only label for its destination.",
    },
    {
      id: "portrait",
      title: "Portrait",
      text: "**Make Room for Vertical Content.** Set `ratio={9 / 16}` for portrait media such as a vertical video preview. The frame remains proportional to its width, so the surrounding layout can reserve room without hard-coding a height.\n\nSet a sensible surrounding width and inspect the crop with real media; use [Video](/docs/video/installation) when the content also needs playback controls.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** `AspectRatio` controls dimensions independently of reading direction. Apply `DirectionProvider` to the surrounding labels and actions, keeping their translated order separate from the media's width-to-height relationship.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
    },
    { id: "api-reference", title: "API Reference", text: "Component overview." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference sections={apiSections} />;
      }
      if (sectionId === "installation") {
        return (
          <CodeBlock
            code={`import { AspectRatio } from "@/components/kamod-ui/aspect-ratio"
import { Image } from "@/components/kamod-ui/image";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "usage") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <div class="w-full max-w-xs">
              <AspectRatio ratio={16 / 9} class="rounded-md border bg-muted">
                <Image src={demoSrc} alt="Example" class="h-full w-full rounded-md object-cover" />
              </AspectRatio>
            </div>
          ),
          codeSnippet: `import { AspectRatio } from "@/components/kamod-ui/aspect-ratio"
import { Image } from "@/components/kamod-ui/image";

export const Example = () => (
  <AspectRatio ratio={16 / 9}>
    <Image src="…" alt="Image" class="rounded-md object-cover h-full w-full" />
  </AspectRatio>
);`,
        });
      }
      const block = sectionBlocks[sectionId];
      if (!block) {
        return null;
      }
      return context.renderPreviewAndCodeTabs({
        preview: block.preview(),
        codeSnippet: block.code,
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <AspectHero />,
          codeSnippet: heroCode,
          previewClass: "overflow-x-auto",
        })}
        {context.sections.map((docSection) => (
          <ComponentDocSection key={docSection.id} section={docSection}>
            {context.renderSectionExtraContent(docSection.id)}
            {renderSectionBody(docSection.id)}
          </ComponentDocSection>
        ))}
      </>
    );
  },
};
