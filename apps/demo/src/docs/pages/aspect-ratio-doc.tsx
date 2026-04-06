import type { ComponentChildren } from "preact";
import { AspectRatio, DirectionProvider, Image } from "@kamod-ui/core";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
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
  command: "pnpm add @kamod-ui/core",
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
      text: "Default widescreen frame with muted background and rounded corners.",
    },
    {
      id: "square",
      title: "Square",
      text: "Use ratio={1 / 1} for square thumbnails or avatars.",
    },
    {
      id: "portrait",
      title: "Portrait",
      text: "Use ratio={9 / 16} for vertical media.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Aspect ratio is direction-agnostic; wrap copy and DirectionProvider for RTL layouts like shadcn’s RTL guide.",
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
          <section key={docSection.id} id={docSection.id} class="docs-section">
            <h2>{docSection.title}</h2>
            <p class="docs-copy">{docSection.text}</p>
            {context.renderSectionExtraContent(docSection.id)}
            {renderSectionBody(docSection.id)}
          </section>
        ))}
      </>
    );
  },
};
