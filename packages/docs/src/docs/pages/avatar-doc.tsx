import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Button,
  DirectionProvider,
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@kamod-ch/ui";
import { Plus } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import {
  SMART_AVATAR_ANIMATED_FALLBACK_CODE,
  SMART_AVATAR_GENERATED_FALLBACK_CODE,
  SmartAvatarAnimatedFallbackPreview,
  SmartAvatarGeneratedFallbackPreview,
} from "../examples/avatar";
import type { DocPageModule } from "../types";

function AvatarHeroDemo() {
  return (
    <div class="flex flex-row flex-wrap items-center justify-center gap-6 md:gap-12">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge class="bg-green-600 dark:bg-green-800" />
      </Avatar>
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}

const heroCode = `import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <div class="flex flex-row flex-wrap items-center gap-6 md:gap-12">
    <Avatar>…</Avatar>
    <Avatar>…<AvatarBadge class="bg-green-600 dark:bg-green-800" /></Avatar>
    <AvatarGroup class="grayscale">…<AvatarGroupCount>+3</AvatarGroupCount></AvatarGroup>
  </div>
);`;

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<Lang, { dir: "ltr" | "rtl"; label: string; moreUsers: string }> = {
  en: { dir: "ltr", label: "English (LTR)", moreUsers: "+3" },
  ar: { dir: "rtl", label: "العربية (RTL)", moreUsers: "+٣" },
  he: { dir: "rtl", label: "עברית (RTL)", moreUsers: "+3" },
};

function AvatarRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-3xl flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button
            key={key}
            variant={lang === key ? "default" : "outline"}
            size="sm"
            type="button"
            onClick={() => setLang(key)}
          >
            {rtlCopy[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir}>
        <div class="flex flex-row flex-wrap items-center gap-6 md:gap-12" dir={t.dir}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>ER</AvatarFallback>
            <AvatarBadge class="bg-green-600 dark:bg-green-800" />
          </Avatar>
          <AvatarGroup class="grayscale">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>{t.moreUsers}</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </DirectionProvider>
    </div>
  );
}

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  basic: {
    preview: () => (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);`,
  },
  "generated-fallback": {
    preview: () => <SmartAvatarGeneratedFallbackPreview />,
    code: SMART_AVATAR_GENERATED_FALLBACK_CODE,
  },
  "animated-fallback": {
    preview: () => <SmartAvatarAnimatedFallbackPreview />,
    code: SMART_AVATAR_ANIMATED_FALLBACK_CODE,
  },
  badge: {
    preview: () => (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge class="bg-green-600 dark:bg-green-800" />
      </Avatar>
    ),
    code: `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
    <AvatarBadge class="bg-green-600 dark:bg-green-800" />
  </Avatar>
);`,
  },
  "badge-icon": {
    preview: () => (
      <Avatar class="grayscale">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge>
          <Plus />
        </AvatarBadge>
      </Avatar>
    ),
    code: `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";
import { Plus } from "lucide-preact";

export const Example = () => (
  <Avatar class="grayscale">
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
    <AvatarBadge>
      <Plus />
    </AvatarBadge>
  </Avatar>
);`,
  },
  group: {
    preview: () => (
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    ),
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <AvatarGroup class="grayscale">
    <Avatar>…</Avatar>
    <Avatar>…</Avatar>
    <Avatar>…</Avatar>
  </AvatarGroup>
);`,
  },
  "group-count": {
    preview: () => (
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    ),
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <AvatarGroup class="grayscale">
    …
    <AvatarGroupCount>+3</AvatarGroupCount>
  </AvatarGroup>
);`,
  },
  "group-count-icon": {
    preview: () => (
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <Plus />
        </AvatarGroupCount>
      </AvatarGroup>
    ),
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/kamod-ui/avatar";
import { Plus } from "lucide-preact";

export const Example = () => (
  <AvatarGroup class="grayscale">
    …
    <AvatarGroupCount>
      <Plus />
    </AvatarGroupCount>
  </AvatarGroup>
);`,
  },
  sizes: {
    preview: () => (
      <div class="flex flex-wrap items-center gap-2 grayscale">
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    ),
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <div class="flex flex-wrap gap-2 grayscale">
    <Avatar size="sm">…</Avatar>
    <Avatar>…</Avatar>
    <Avatar size="lg">…</Avatar>
  </div>
);`,
  },
  dropdown: {
    preview: () => (
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant="ghost" size="icon" class="rounded-full" aria-label="Account menu">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownTrigger>
        <DropdownContent class="w-40">
          <DropdownGroup>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Billing</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
          </DropdownGroup>
          <DropdownSeparator />
          <DropdownGroup>
            <DropdownItem variant="destructive">Log out</DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>
    ),
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar"
import { Button } from "@/components/kamod-ui/button"
import { Dropdown, DropdownContent, DropdownGroup, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger asChild>
      <Button variant="ghost" size="icon" class="rounded-full" aria-label="Account menu">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownTrigger>
    <DropdownContent class="w-40">…</DropdownContent>
  </Dropdown>
);`,
  },
  rtl: {
    preview: () => <AvatarRtlDemo />,
    code: `import { Avatar, AvatarGroup, AvatarGroupCount } from "@/components/kamod-ui/avatar"
import { DirectionProvider } from "@/components/kamod-ui/direction";
// Set dir on the flex row; localize AvatarGroupCount (e.g. +٣).`,
  },
};

const apiSections = [
  {
    title: "Avatar",
    description: "Root container; size maps to data-size for badge scaling.",
    rows: [
      { prop: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"' },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "AvatarImage",
    rows: [
      { prop: "src", type: "string", defaultValue: "-" },
      { prop: "alt", type: "string", defaultValue: '""' },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "AvatarFallback",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "AvatarBadge",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "AvatarGroup",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "AvatarGroupCount",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
] as const;

const smartAvatarRecipeApiSections = [
  {
    title: "SmartAvatar (docs recipe)",
    description:
      "Optional composition in packages/docs/src/docs/examples/avatar/SmartAvatar.tsx. Depends on blobatar and @blobatar/preact — not shipped with @kamod-ch/ui.",
    rows: [
      { prop: "name", type: "string", defaultValue: "required (blobatar seed)" },
      { prop: "src", type: "string | null", defaultValue: "undefined" },
      { prop: "label", type: "string", defaultValue: "undefined" },
      { prop: "badge", type: "ComponentChildren", defaultValue: "undefined" },
      { prop: "blobatar", type: "SmartAvatarBlobatarOptions", defaultValue: "undefined" },
      { prop: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"' },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
] as const;

export const avatarDocPage: DocPageModule = {
  slug: "avatar",
  title: "Avatar",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Profile image with initials fallback, status badge, overlapping groups, count chip, sizes, and dropdown trigger (shadcn Avatar pattern; no Radix dependency).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Avatar primitives from `@/components/kamod-ui/avatar`.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Place AvatarImage and AvatarFallback inside Avatar. The fallback stays visible until the image fires load; on error it shows again.",
    },
    { id: "basic", title: "Basic", text: "Image plus fallback initials." },
    {
      id: "generated-fallback",
      title: "Generated fallback",
      text: "Optional SmartAvatar recipe: deterministic blobatar fallback from a stable user id when no photo is available, when the URL fails, or while a photo loads. Uses Kamod Avatar primitives under the hood; install blobatar separately.",
    },
    {
      id: "animated-fallback",
      title: "Animated fallback",
      text: 'Opt-in hover animation via blobatar.animate="hover". Import blobatar/motion.css in your global stylesheet (this docs site loads it from src/styles/avatar-blobatar-motion.css). Respects prefers-reduced-motion where supported. Static img fallback remains the recipe default.',
    },
    {
      id: "badge",
      title: "Badge",
      text: "AvatarBadge sits at the bottom-inline-end (logical end), overlaps the photo, and uses a thick white ring so the status dot reads clearly—same stacking as typical chat “online” indicators.",
    },
    {
      id: "badge-icon",
      title: "Badge with icon",
      text: "Put an icon inside the badge; small avatars hide inner SVG to save space.",
    },
    {
      id: "group",
      title: "Avatar group",
      text: "Overlap avatars with ring separation using AvatarGroup.",
    },
    {
      id: "group-count",
      title: "Avatar group count",
      text: "Append AvatarGroupCount for overflow (+N).",
    },
    {
      id: "group-count-icon",
      title: "Group count with icon",
      text: "Use an icon inside the count bubble (e.g. plus).",
    },
    { id: "sizes", title: "Sizes", text: "Use the size prop on Avatar (sm, default, lg)." },
    {
      id: "dropdown",
      title: "Dropdown",
      text: "Use a ghost icon button as the dropdown trigger wrapping Avatar.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Set dir on the row; badge position uses logical end/bottom.",
    },
    {
      id: "smartavatar-recipe",
      title: "SmartAvatar recipe (optional)",
      text: "Copy or import the docs recipe when you want blobatar fallbacks without adding blobatar to @kamod-ch/ui. Third-party packages only; Kamod Avatar API above is unchanged.",
    },
    { id: "api-reference", title: "API Reference", text: "@kamod-ch/ui Avatar primitives." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference sections={apiSections} />;
      }
      if (sectionId === "installation") {
        return (
          <CodeBlock
            code={`import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/kamod-ui/avatar";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "smartavatar-recipe") {
        return (
          <>
            <CodeBlock code="pnpm add blobatar @blobatar/preact" language="bash" />
            <ApiReference sections={smartAvatarRecipeApiSections} />
          </>
        );
      }
      if (sectionId === "usage") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ),
          codeSnippet: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
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
        previewClass:
          sectionId === "generated-fallback" || sectionId === "animated-fallback"
            ? "overflow-x-auto"
            : undefined,
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <AvatarHeroDemo />,
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
