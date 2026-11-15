import { Button, Spinner } from "@kamod-ch/ui";
import { ArrowUp, ArrowUpRight, GitBranch } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import { ButtonHeroExample } from "../examples/button-hero";
import buttonHeroSource from "../examples/button-hero.tsx?raw";
import type { DocPageModule } from "../types";

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  variants: {
    preview: () => (
      <div class="flex flex-col items-start gap-6">
        <div class="flex flex-wrap items-center gap-2">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="inverse">Inverse</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button size="xs" variant="outline">
            Extra small
          </Button>
          <Button size="sm" variant="outline">
            Small
          </Button>
          <Button variant="outline">Default</Button>
          <Button size="lg" variant="outline">
            Large
          </Button>
        </div>
      </div>
    ),
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <div class="flex flex-wrap gap-2">
    <Button>Default</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
    <Button size="sm" variant="outline">Small</Button>
    <Button size="lg" variant="outline">Large</Button>
  </div>
);`,
  },
  "with-icon": {
    preview: () => (
      <div class="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          <GitBranch data-icon="inline-start" />
          New branch
        </Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <ArrowUp />
        </Button>
        <Button size="icon-sm" aria-label="Open" variant="outline">
          <ArrowUpRight />
        </Button>
      </div>
    ),
    code: `import { ArrowUp, GitBranch } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <div class="flex gap-2">
    <Button variant="outline" size="sm">
      <GitBranch data-icon="inline-start" />
      New branch
    </Button>
    <Button variant="outline" size="icon" aria-label="Submit">
      <ArrowUp />
    </Button>
  </div>
);`,
  },
  spinner: {
    preview: () => (
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" size="sm" tone="muted" />
          Generating
        </Button>
        <Button variant="secondary" disabled>
          Downloading
          <Spinner data-icon="inline-end" size="sm" tone="muted" />
        </Button>
      </div>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { Spinner } from "@/components/kamod-ui/spinner";

export const Example = () => (
  <Button variant="outline" disabled>
    <Spinner data-icon="inline-start" size="sm" tone="muted" />
    Generating
  </Button>
);`,
  },
  "as-child": {
    preview: () => (
      <Button asChild>
        <a href="#login">Login</a>
      </Button>
    ),
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <Button asChild>
    <a href="/login">Login</a>
  </Button>
);`,
  },
};

export const buttonDocPage: DocPageModule = {
  slug: "button",
  title: "Button",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Primary actions with variants and sizes; icons via data-icon; asChild for links; pairs with ButtonGroup and Spinner.",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Button from `@/components/kamod-ui/button`. Use `variant` and `size`; use `asChild` to style a child element such as an anchor.",
    },
    {
      id: "variants",
      title: "Variants",
      text: "Set `variant` for emphasis and `size` for density. Confirm a destructive action with [Alert Dialog](/docs/alert-dialog/installation), and group related actions with [Button Group](/docs/button-group/installation).",
    },
    {
      id: "with-icon",
      title: "With Icon",
      text: 'Place an icon with `data-icon="inline-start"` or `data-icon="inline-end"`, and give an icon-only button an `aria-label`.',
    },
    {
      id: "spinner",
      title: "Spinner",
      text: "Show Spinner beside a loading label and disable the button while the action is pending.",
    },
    {
      id: "as-child",
      title: "As Child",
      text: "Use `asChild` to style a link without wrapping it in another button.",
    },
    { id: "api-reference", title: "API Reference", text: "Button props and accepted values." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference component="button" />;
      }
      if (sectionId === "installation") {
        return (
          <div class="grid gap-3">
            <CodeBlock
              code={`import { Button } from "@/components/kamod-ui/button";`}
              language="tsx"
            />
            <CodeBlock code={`<Button variant="outline">Button</Button>`} language="tsx" />
          </div>
        );
      }
      const block = sectionBlocks[sectionId];
      if (!block) return null;
      return context.renderPreviewAndCodeTabs({
        preview: block.preview(),
        codeSnippet: block.code,
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <ButtonHeroExample />,
          codeSnippet: buttonHeroSource,
          filePath: "src/docs/examples/button-hero.tsx",
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
