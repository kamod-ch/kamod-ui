import { Badge, Spinner } from "@kamod-ch/ui";
import { ArrowUpRight, BadgeCheck, Bookmark } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import type { DocPageModule } from "../types";

const heroCode = `import { Badge } from "@/components/kamod-ui/badge";

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
          Kamod also ships semantic variants for dashboards and status chips: primary, info,
          success, warning, and error.
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
    code: `import { Badge } from "@/components/kamod-ui/badge";

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
);`,
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
        <Badge variant="destructive">
          <Spinner data-icon="inline-start" size="sm" tone="muted" />
          Deleting
        </Badge>
      </div>
    ),
    code: `import { Badge } from "@/components/kamod-ui/badge";
import { Spinner } from "@/components/kamod-ui/spinner";
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
    <Badge variant="destructive">
      <Spinner data-icon="inline-start" size="sm" tone="muted" />
      Deleting
    </Badge>
  </div>
);`,
  },
  link: {
    preview: () => (
      <Badge asChild>
        <a href="#link">
          Open Link <ArrowUpRight data-icon="inline-end" />
        </a>
      </Badge>
    ),
    code: `import { Badge } from "@/components/kamod-ui/badge";
import { ArrowUpRight } from "lucide-preact";

export const Example = () => (
  <Badge asChild>
    <a href="#link">
      Open link <ArrowUpRight data-icon="inline-end" />
    </a>
  </Badge>
);`,
  },
  sizes: {
    preview: () => (
      <div class="flex flex-wrap items-center gap-2">
        <Badge size="xxs">Extra Extra Small</Badge>
        <Badge size="xs">Extra Small</Badge>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    ),
    code: `import { Badge } from "@/components/kamod-ui/badge";

export const Example = () => (
  <div class="flex flex-wrap gap-2">
    <Badge size="xxs">Extra extra small</Badge>
    <Badge size="xs">Extra small</Badge>
    <Badge size="sm">Small</Badge>
    <Badge size="md">Medium</Badge>
    <Badge size="lg">Large</Badge>
  </div>
);`,
  },
};

const badgeApiRows: Array<{ prop: string; type: string; defaultValue: string }> = [
  {
    prop: "variant",
    type: '"default" | "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "info" | "success" | "warning" | "error"',
    defaultValue: '"default"',
  },
  { prop: "size", type: '"xxs" | "xs" | "sm" | "md" | "lg"', defaultValue: '"md"' },
  { prop: "asChild", type: "boolean", defaultValue: "false" },
  { prop: "href", type: "string", defaultValue: "-" },
  { prop: "class", type: "string", defaultValue: "-" },
];

export const badgeDocPage: DocPageModule = {
  slug: "badge",
  title: "Badge",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Compact labels with shadcn-aligned variants (destructive, ghost, outline), optional asChild link, icons via data-icon, Spinner states, and extra semantic variants.",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Badge from `@/components/kamod-ui/badge`.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Pick a variant for status. Use a link or button when the badge should navigate or act.",
    },
    {
      id: "variants",
      title: "Variants",
      text: "Choose `variant` for the status. Use [Link](#link) when the badge should navigate.",
    },
    {
      id: "with-icon",
      title: "Icon and spinner",
      text: 'Mark an icon or Spinner with `data-icon="inline-start"` or `data-icon="inline-end"`.',
    },
    {
      id: "link",
      title: "Link",
      text: "Use `asChild` or `href` when the badge is a destination. Use a button when it only changes local state.",
    },
    {
      id: "sizes",
      title: "Sizes",
      text: "Set `size` from `xxs` to `lg` to match the surrounding metadata.",
    },
    {
      id: "api-reference",
      title: "API Reference",
      text: "Badge props and accepted values.",
    },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return (
          <ApiReference
            component="badge"
            sections={[
              {
                title: "Badge",
                description:
                  "Renders as span by default; href renders anchor; asChild merges onto a single child.",
                rows: badgeApiRows,
              },
            ]}
          />
        );
      }
      if (sectionId === "installation") {
        return (
          <CodeBlock code={`import { Badge } from "@/components/kamod-ui/badge";`} language="tsx" />
        );
      }
      if (sectionId === "usage") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <div class="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          ),
          codeSnippet: `import { Badge } from "@/components/kamod-ui/badge";

export const Example = () => (
  <Badge variant="outline">Badge</Badge>
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
          preview: (
            <div class="flex w-full flex-wrap justify-center gap-2">
              <Badge>Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          ),
          codeSnippet: heroCode,
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
