import type { ComponentChildren } from "preact";
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
  DropdownTrigger
} from "@kamod-ui/core";
import { Plus } from "lucide-preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
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

const heroCode = `import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@kamod-ui/core";

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
  he: { dir: "rtl", label: "עברית (RTL)", moreUsers: "+3" }
};

function AvatarRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-3xl flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} variant={lang === key ? "default" : "outline"} size="sm" type="button" onClick={() => setLang(key)}>
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
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@kamod-ui/core";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);`
  },
  badge: {
    preview: () => (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge class="bg-green-600 dark:bg-green-800" />
      </Avatar>
    ),
    code: `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@kamod-ui/core";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
    <AvatarBadge class="bg-green-600 dark:bg-green-800" />
  </Avatar>
);`
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
    code: `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@kamod-ui/core";
import { Plus } from "lucide-preact";

export const Example = () => (
  <Avatar class="grayscale">
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
    <AvatarBadge>
      <Plus />
    </AvatarBadge>
  </Avatar>
);`
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
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@kamod-ui/core";

export const Example = () => (
  <AvatarGroup class="grayscale">
    <Avatar>…</Avatar>
    <Avatar>…</Avatar>
    <Avatar>…</Avatar>
  </AvatarGroup>
);`
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
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@kamod-ui/core";

export const Example = () => (
  <AvatarGroup class="grayscale">
    …
    <AvatarGroupCount>+3</AvatarGroupCount>
  </AvatarGroup>
);`
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
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@kamod-ui/core";
import { Plus } from "lucide-preact";

export const Example = () => (
  <AvatarGroup class="grayscale">
    …
    <AvatarGroupCount>
      <Plus />
    </AvatarGroupCount>
  </AvatarGroup>
);`
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
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@kamod-ui/core";

export const Example = () => (
  <div class="flex flex-wrap gap-2 grayscale">
    <Avatar size="sm">…</Avatar>
    <Avatar>…</Avatar>
    <Avatar size="lg">…</Avatar>
  </div>
);`
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
    code: `import { Avatar, AvatarFallback, AvatarImage, Button, Dropdown, DropdownContent, DropdownGroup, DropdownItem, DropdownSeparator, DropdownTrigger } from "@kamod-ui/core";

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
);`
  },
  rtl: {
    preview: () => <AvatarRtlDemo />,
    code: `import { Avatar, AvatarGroup, AvatarGroupCount, DirectionProvider } from "@kamod-ui/core";
// Set dir on the flex row; translate AvatarGroupCount for locale (e.g. +٣).`
  }
};

const apiSections = [
  {
    title: "Avatar",
    description: "Root container; size maps to data-size for badge scaling.",
    rows: [
      { prop: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"' },
      { prop: "class", type: "string", defaultValue: "-" }
    ]
  },
  {
    title: "AvatarImage",
    rows: [
      { prop: "src", type: "string", defaultValue: "-" },
      { prop: "alt", type: "string", defaultValue: '""' },
      { prop: "class", type: "string", defaultValue: "-" }
    ]
  },
  {
    title: "AvatarFallback",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AvatarBadge",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AvatarGroup",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AvatarGroupCount",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  }
] as const;

export const avatarDocPage: DocPageModule = {
  slug: "avatar",
  title: "Avatar",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Profile image with initials fallback, status badge, overlapping groups, count chip, sizes, and dropdown trigger (shadcn Avatar pattern; no Radix dependency).",
  sections: [
    { id: "installation", title: "Installation", text: "Import Avatar primitives from @kamod-ui/core." },
    {
      id: "usage",
      title: "Usage",
      text: "Place AvatarImage and AvatarFallback inside Avatar. The fallback stays visible until the image fires load; on error it shows again."
    },
    { id: "basic", title: "Basic", text: "Image plus fallback initials." },
    { id: "badge", title: "Badge", text: "AvatarBadge sits at the bottom-inline-end corner (logical end)." },
    { id: "badge-icon", title: "Badge with icon", text: "Put an icon inside the badge; small avatars hide inner SVG to save space." },
    { id: "group", title: "Avatar group", text: "Overlap avatars with ring separation using AvatarGroup." },
    { id: "group-count", title: "Avatar group count", text: "Append AvatarGroupCount for overflow (+N)." },
    { id: "group-count-icon", title: "Group count with icon", text: "Use an icon inside the count bubble (e.g. plus)." },
    { id: "sizes", title: "Sizes", text: "Use the size prop on Avatar (sm, default, lg)." },
    { id: "dropdown", title: "Dropdown", text: "Use a ghost icon button as the dropdown trigger wrapping Avatar." },
    { id: "rtl", title: "RTL", text: "Set dir on the row; badge position uses logical end/bottom." },
    { id: "api-reference", title: "API Reference", text: "Component overview." }
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference sections={apiSections} />;
      }
      if (sectionId === "installation") {
        return (
          <CodeBlock
            code={`import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@kamod-ui/core";`}
            language="tsx"
          />
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
          codeSnippet: `import { Avatar, AvatarFallback, AvatarImage } from "@kamod-ui/core";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);`
        });
      }
      const block = sectionBlocks[sectionId];
      if (!block) {
        return null;
      }
      return context.renderPreviewAndCodeTabs({
        preview: block.preview(),
        codeSnippet: block.code
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <AvatarHeroDemo />,
          codeSnippet: heroCode,
          previewClass: "overflow-x-auto"
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
  }
};
