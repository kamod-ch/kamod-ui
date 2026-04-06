import type { ComponentChildren } from "preact";
import { ArrowRight, ArrowUp, ArrowUpRight, GitBranch, Plus } from "lucide-preact";
import { Button, ButtonGroup, DirectionProvider, Spinner } from "@kamod-ui/core";
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
    button: string;
    submit: string;
    delete: string;
    loading: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    button: "Button",
    submit: "Submit",
    delete: "Delete",
    loading: "Loading",
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    button: "زر",
    submit: "إرسال",
    delete: "حذف",
    loading: "جاري التحميل",
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    button: "כפתור",
    submit: "שלח",
    delete: "מחק",
    loading: "טוען",
  },
};

function ButtonRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-2xl flex-col gap-3">
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
        <div class="flex flex-wrap items-center gap-2 md:flex-row" dir={t.dir}>
          <Button variant="outline">{t.button}</Button>
          <Button variant="destructive">{t.delete}</Button>
          <Button variant="outline">
            {t.submit}{" "}
            <ArrowRight class={t.dir === "rtl" ? "rotate-180" : ""} data-icon="inline-end" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Add">
            <Plus />
          </Button>
          <Button variant="secondary" disabled>
            <Spinner data-icon="inline-start" size="sm" tone="muted" />
            {t.loading}
          </Button>
        </div>
      </DirectionProvider>
    </div>
  );
}

const cursorCssSnippet = `@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}`;

const heroCode = `import { ArrowUp } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <div class="flex flex-wrap items-center gap-2 md:flex-row">
    <Button variant="outline">Button</Button>
    <Button variant="outline" size="icon" aria-label="Submit">
      <ArrowUp />
    </Button>
  </div>
);`;

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  size: {
    preview: () => (
      <div class="flex flex-col items-start gap-8 sm:flex-row">
        <div class="flex items-start gap-2">
          <Button size="xs" variant="outline">
            Extra Small
          </Button>
          <Button size="icon-xs" aria-label="Submit" variant="outline">
            <ArrowUpRight />
          </Button>
        </div>
        <div class="flex items-start gap-2">
          <Button size="sm" variant="outline">
            Small
          </Button>
          <Button size="icon-sm" aria-label="Submit" variant="outline">
            <ArrowUpRight />
          </Button>
        </div>
        <div class="flex items-start gap-2">
          <Button variant="outline">Default</Button>
          <Button size="icon" aria-label="Submit" variant="outline">
            <ArrowUpRight />
          </Button>
        </div>
        <div class="flex items-start gap-2">
          <Button variant="outline" size="lg">
            Large
          </Button>
          <Button size="icon-lg" aria-label="Submit" variant="outline">
            <ArrowUpRight />
          </Button>
        </div>
      </div>
    ),
    code: `import { ArrowUpRight } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <div class="flex flex-col items-start gap-8 sm:flex-row">
    <div class="flex items-start gap-2">
      <Button size="xs" variant="outline">Extra Small</Button>
      <Button size="icon-xs" aria-label="Submit" variant="outline"><ArrowUpRight /></Button>
    </div>
    <div class="flex items-start gap-2">
      <Button size="sm" variant="outline">Small</Button>
      <Button size="icon-sm" aria-label="Submit" variant="outline"><ArrowUpRight /></Button>
    </div>
    <div class="flex items-start gap-2">
      <Button variant="outline">Default</Button>
      <Button size="icon" aria-label="Submit" variant="outline"><ArrowUpRight /></Button>
    </div>
    <div class="flex items-start gap-2">
      <Button variant="outline" size="lg">Large</Button>
      <Button size="icon-lg" aria-label="Submit" variant="outline"><ArrowUpRight /></Button>
    </div>
  </div>
);`,
  },
  default: {
    preview: () => <Button>Button</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button>Button</Button>;`,
  },
  outline: {
    preview: () => <Button variant="outline">Outline</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="outline">Outline</Button>;`,
  },
  secondary: {
    preview: () => <Button variant="secondary">Secondary</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="secondary">Secondary</Button>;`,
  },
  inverse: {
    preview: () => <Button variant="inverse">Inverse</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="inverse">Inverse</Button>;`,
  },
  ghost: {
    preview: () => <Button variant="ghost">Ghost</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="ghost">Ghost</Button>;`,
  },
  destructive: {
    preview: () => <Button variant="destructive">Destructive</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="destructive">Destructive</Button>;`,
  },
  link: {
    preview: () => <Button variant="link">Link</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="link">Link</Button>;`,
  },
  icon: {
    preview: () => (
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUp />
      </Button>
    ),
    code: `import { ArrowUp } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <Button variant="outline" size="icon" aria-label="Submit">
    <ArrowUp />
  </Button>
);`,
  },
  "with-icon": {
    preview: () => (
      <Button variant="outline" size="sm">
        <GitBranch data-icon="inline-start" />
        New branch
      </Button>
    ),
    code: `import { GitBranch } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <Button variant="outline" size="sm">
    <GitBranch data-icon="inline-start" />
    New branch
  </Button>
);`,
  },
  rounded: {
    preview: () => (
      <div class="flex flex-col gap-8">
        <Button variant="outline" size="icon" class="rounded-full" aria-label="Submit">
          <ArrowUp />
        </Button>
      </div>
    ),
    code: `import { ArrowUp } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <Button variant="outline" size="icon" class="rounded-full" aria-label="Submit">
    <ArrowUp />
  </Button>
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
  <div class="flex gap-2">
    <Button variant="outline" disabled>
      <Spinner data-icon="inline-start" size="sm" tone="muted" />
      Generating
    </Button>
    <Button variant="secondary" disabled>
      Downloading
      <Spinner data-icon="inline-end" size="sm" tone="muted" />
    </Button>
  </div>
);`,
  },
  "button-group": {
    preview: () => (
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
        <Button variant="outline">Snooze</Button>
      </ButtonGroup>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group";

export const Example = () => (
  <ButtonGroup>
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
    <Button variant="outline">Snooze</Button>
  </ButtonGroup>
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
  rtl: {
    preview: () => <ButtonRtlDemo />,
    code: `import { ArrowRight, Plus } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";
import { DirectionProvider } from "@/components/kamod-ui/direction";
import { Spinner } from "@/components/kamod-ui/spinner";
// Wrap row in DirectionProvider; mirror directional icons with rotate-180 in RTL.`,
  },
};

const buttonApiRows: Array<{ prop: string; type: string; defaultValue: string }> = [
  {
    prop: "variant",
    type: '"default" | "outline" | "ghost" | "destructive" | "secondary" | "inverse" | "link"',
    defaultValue: '"default"',
  },
  {
    prop: "size",
    type: '"default" | "xxs" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
    defaultValue: '"default"',
  },
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: "false",
  },
];

export const buttonDocPage: DocPageModule = {
  slug: "button",
  title: "Button",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Primary actions with variants and sizes; icons via data-icon; asChild for links; pairs with ButtonGroup and Spinner (shadcn Button pattern).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Button from `@/components/kamod-ui/button`. Use variant and size props; optional asChild to merge styles onto a child element (for example an anchor).",
    },
    {
      id: "cursor",
      title: "Cursor",
      text: "Tailwind v4 defaults buttons to cursor: default. Kamod Button sets cursor-pointer (and disabled:cursor-not-allowed). If you use native buttons outside this component, you can mirror shadcn’s base layer snippet:",
    },
    {
      id: "size",
      title: "Size",
      text: 'Use the size prop to change height and padding. Icon sizes pair with text sizes (xs → icon-xs, and so on). Kamod also supports size="xxs" for ultra-compact UI (not shown in the grid below).',
    },
    { id: "default", title: "Default", text: "Primary emphasis — default variant." },
    { id: "outline", title: "Outline", text: "Bordered surface; works well in dense toolbars." },
    { id: "secondary", title: "Secondary", text: "Supporting actions with muted fill." },
    {
      id: "inverse",
      title: "Inverse",
      text: "High-contrast filled control using foreground on background (for example Cursor marketing dark CTA in light mode; flips in dark mode).",
    },
    { id: "ghost", title: "Ghost", text: "Minimal chrome until hover." },
    { id: "destructive", title: "Destructive", text: "Dangerous or irreversible actions." },
    { id: "link", title: "Link", text: "Underline-style control while keeping button semantics." },
    { id: "icon", title: "Icon", text: "Icon-only control; always set aria-label." },
    {
      id: "with-icon",
      title: "With icon",
      text: 'Add data-icon="inline-start" or data-icon="inline-end" on the icon so horizontal padding stays balanced.',
    },
    {
      id: "rounded",
      title: "Rounded",
      text: "Use rounded-full (or other radius utilities) for pill or circular buttons.",
    },
    {
      id: "spinner",
      title: "Spinner",
      text: "Show loading state with Spinner plus data-icon placement (start vs end).",
    },
    {
      id: "button-group",
      title: "Button group",
      text: "Group related actions with ButtonGroup for shared borders and spacing. See the Button Group page for nested groups, separators, and dropdown patterns.",
    },
    {
      id: "as-child",
      title: "As child",
      text: "Merge button styles onto another element — common for links that should look like buttons.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Use DirectionProvider for dir; flip directional icons (for example ArrowRight) with rotate-180 in RTL.",
    },
    { id: "api-reference", title: "API Reference", text: "Button props and accepted values." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return (
          <ApiReference
            sections={[
              {
                title: "Button",
                description:
                  "Wrapper around button (or anchor with href) that applies variant and size tokens.",
                rows: buttonApiRows,
              },
            ]}
          />
        );
      }
      if (sectionId === "cursor") {
        return <CodeBlock code={cursorCssSnippet} language="css" />;
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
            <div class="flex flex-wrap items-center gap-2 md:flex-row">
              <Button variant="outline">Button</Button>
              <Button variant="outline" size="icon" aria-label="Submit">
                <ArrowUp />
              </Button>
            </div>
          ),
          codeSnippet: heroCode,
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
