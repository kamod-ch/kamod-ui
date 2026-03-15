import type { ComponentChildren } from "preact";
import { Badge, Button, DirectionProvider, Spinner } from "@kamod-ui/core";
import { ArrowUpRight, BadgeCheck, Bookmark } from "lucide-preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    label: string;
    badge: string;
    secondary: string;
    destructive: string;
    outline: string;
    verified: string;
    bookmark: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    badge: "Badge",
    secondary: "Secondary",
    destructive: "Destructive",
    outline: "Outline",
    verified: "Verified",
    bookmark: "Bookmark"
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    badge: "شارة",
    secondary: "ثانوي",
    destructive: "مدمر",
    outline: "مخطط",
    verified: "متحقق",
    bookmark: "إشارة مرجعية"
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    badge: "תג",
    secondary: "משני",
    destructive: "הרסני",
    outline: "קווי מתאר",
    verified: "מאומת",
    bookmark: "סימנייה"
  }
};

function BadgeRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-2xl flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} variant={lang === key ? "default" : "outline"} size="sm" type="button" onClick={() => setLang(key)}>
            {rtlCopy[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir}>
        <div class="flex w-full flex-wrap justify-center gap-2" dir={t.dir}>
          <Badge>{t.badge}</Badge>
          <Badge variant="secondary">{t.secondary}</Badge>
          <Badge variant="destructive">{t.destructive}</Badge>
          <Badge variant="outline">{t.outline}</Badge>
          <Badge variant="secondary">
            <BadgeCheck data-icon="inline-start" />
            {t.verified}
          </Badge>
          <Badge variant="outline">
            {t.bookmark}
            <Bookmark data-icon="inline-end" />
          </Badge>
        </div>
      </DirectionProvider>
    </div>
  );
}

const heroCode = `import { Badge } from "@kamod-ui/core";

export const Example = () => (
  <div class="flex w-full flex-wrap justify-center gap-2">
    <Badge>Badge</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
);`;

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  variants: {
    preview: () => (
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
        </div>
        <p class="text-muted-foreground max-w-xl text-sm">
          Kamod also ships semantic variants for dashboards and status chips: primary, info, success, warning, and error.
        </p>
        <div class="flex flex-wrap gap-2">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      </div>
    ),
    code: `import { Badge } from "@kamod-ui/core";

export const Example = () => (
  <>
    <div class="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
    <div class="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  </>
);`
  },
  "with-icon": {
    preview: () => (
      <div class="flex flex-wrap gap-2">
        <Badge variant="secondary">
          <BadgeCheck data-icon="inline-start" />
          Verified
        </Badge>
        <Badge variant="outline">
          Bookmark
          <Bookmark data-icon="inline-end" />
        </Badge>
      </div>
    ),
    code: `import { Badge } from "@kamod-ui/core";
import { BadgeCheck, Bookmark } from "lucide-preact";

export const Example = () => (
  <div class="flex flex-wrap gap-2">
    <Badge variant="secondary">
      <BadgeCheck data-icon="inline-start" />
      Verified
    </Badge>
    <Badge variant="outline">
      Bookmark
      <Bookmark data-icon="inline-end" />
    </Badge>
  </div>
);`
  },
  "with-spinner": {
    preview: () => (
      <div class="flex flex-wrap gap-2">
        <Badge variant="destructive">
          <Spinner data-icon="inline-start" size="sm" tone="muted" />
          Deleting
        </Badge>
        <Badge variant="secondary">
          Generating
          <Spinner data-icon="inline-end" size="sm" tone="muted" />
        </Badge>
      </div>
    ),
    code: `import { Badge, Spinner } from "@kamod-ui/core";

export const Example = () => (
  <div class="flex flex-wrap gap-2">
    <Badge variant="destructive">
      <Spinner data-icon="inline-start" size="sm" tone="muted" />
      Deleting
    </Badge>
    <Badge variant="secondary">
      Generating
      <Spinner data-icon="inline-end" size="sm" tone="muted" />
    </Badge>
  </div>
);`
  },
  link: {
    preview: () => (
      <Badge asChild>
        <a href="#link">
          Open link <ArrowUpRight data-icon="inline-end" />
        </a>
      </Badge>
    ),
    code: `import { Badge } from "@kamod-ui/core";
import { ArrowUpRight } from "lucide-preact";

export const Example = () => (
  <Badge asChild>
    <a href="#link">
      Open link <ArrowUpRight data-icon="inline-end" />
    </a>
  </Badge>
);`
  },
  "custom-colors": {
    preview: () => (
      <div class="flex flex-wrap gap-2">
        <Badge class="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Blue</Badge>
        <Badge class="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Green</Badge>
        <Badge class="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Sky</Badge>
        <Badge class="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Purple</Badge>
        <Badge class="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Red</Badge>
      </div>
    ),
    code: `import { Badge } from "@kamod-ui/core";

export const Example = () => (
  <div class="flex flex-wrap gap-2">
    <Badge class="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Blue</Badge>
    <Badge class="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Green</Badge>
    <Badge class="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Sky</Badge>
    <Badge class="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Purple</Badge>
    <Badge class="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Red</Badge>
  </div>
);`
  },
  sizes: {
    preview: () => (
      <div class="flex flex-wrap items-center gap-2">
        <Badge size="xxs">Extra extra small</Badge>
        <Badge size="xs">Extra small</Badge>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    ),
    code: `import { Badge } from "@kamod-ui/core";

export const Example = () => (
  <div class="flex flex-wrap gap-2">
    <Badge size="xxs">Extra extra small</Badge>
    <Badge size="xs">Extra small</Badge>
    <Badge size="sm">Small</Badge>
    <Badge size="md">Medium</Badge>
    <Badge size="lg">Large</Badge>
  </div>
);`
  },
  rtl: {
    preview: () => <BadgeRtlDemo />,
    code: `import { Badge, DirectionProvider } from "@kamod-ui/core";
import { BadgeCheck, Bookmark } from "lucide-preact";
// Wrap row with DirectionProvider and dir on the flex container.`
  }
};

const badgeApiRows: Array<{ prop: string; type: string; defaultValue: string }> = [
  {
    prop: "variant",
    type: '"default" | "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "info" | "success" | "warning" | "error"',
    defaultValue: '"default"'
  },
  { prop: "size", type: '"xxs" | "xs" | "sm" | "md" | "lg"', defaultValue: '"md"' },
  { prop: "asChild", type: "boolean", defaultValue: "false" },
  { prop: "href", type: "string", defaultValue: "-" },
  { prop: "class", type: "string", defaultValue: "-" }
];

export const badgeDocPage: DocPageModule = {
  slug: "badge",
  title: "Badge",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Compact labels with shadcn-aligned variants (destructive, ghost, outline), optional asChild link, icons via data-icon, Spinner states, and extra semantic variants.",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Badge from @kamod-ui/core."
    },
    {
      id: "usage",
      title: "Usage",
      text: "Pick a variant for emphasis; default renders a filled neutral chip. Use BreadcrumbPage or Button for navigation—Badge is for status and metadata."
    },
    {
      id: "variants",
      title: "Variants",
      text: "Shadcn-compatible set plus additional semantic colors for product UI."
    },
    {
      id: "with-icon",
      title: "With icon",
      text: "Set data-icon=\"inline-start\" or data-icon=\"inline-end\" on the icon so padding stays balanced."
    },
    {
      id: "with-spinner",
      title: "With spinner",
      text: "Short-lived states: pair Spinner with the same data-icon attributes."
    },
    {
      id: "link",
      title: "Link",
      text: "Use asChild so an anchor (or router Link) receives badge styling. You can still pass href without asChild to render a native anchor."
    },
    {
      id: "custom-colors",
      title: "Custom colors",
      text: "Override with utility classes for brand-specific chips (including dark mode pairs)."
    },
    {
      id: "sizes",
      title: "Sizes",
      text: "Kamod-specific density scale from xxs through lg."
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Wrap with DirectionProvider and set dir on the row; icons follow inline start/end."
    },
    {
      id: "api-reference",
      title: "API Reference",
      text: "Badge props and accepted values."
    }
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return (
          <ApiReference
            sections={[
              {
                title: "Badge",
                description: "Renders as span by default; href renders anchor; asChild merges onto a single child.",
                rows: badgeApiRows
              }
            ]}
          />
        );
      }
      if (sectionId === "installation") {
        return <CodeBlock code={`import { Badge } from "@kamod-ui/core";`} language="tsx" />;
      }
      if (sectionId === "usage") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <div class="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          ),
          codeSnippet: `import { Badge } from "@kamod-ui/core";

export const Example = () => (
  <Badge variant="outline">Badge</Badge>
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
          preview: (
            <div class="flex w-full flex-wrap justify-center gap-2">
              <Badge>Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          ),
          codeSnippet: heroCode
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
