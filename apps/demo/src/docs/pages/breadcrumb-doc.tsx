import type { ComponentChildren } from "preact";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DirectionProvider,
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownTrigger,
} from "@kamod-ui/core";
import { ChevronDown, Dot } from "lucide-preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

const breadcrumbDropdownTriggerClass =
  "text-muted-foreground hover:text-foreground hover:bg-muted/60 -mx-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm transition-[color,background-color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const breadcrumbEllipsisTriggerClass =
  "rounded-md border-0 focus-visible:border-transparent bg-background shadow-none hover:bg-muted/70 aria-expanded:bg-muted dark:bg-background dark:hover:bg-muted/50";

function BreadcrumbHeroDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#">Home</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Dropdown>
            <DropdownTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                class={breadcrumbEllipsisTriggerClass}
                aria-label="Toggle menu"
              >
                <BreadcrumbEllipsis class="flex size-7 items-center justify-center [&_svg]:size-3.5" />
              </Button>
            </DropdownTrigger>
            <DropdownContent align="start">
              <DropdownGroup>
                <DropdownItem>Documentation</DropdownItem>
                <DropdownItem>Themes</DropdownItem>
                <DropdownItem>GitHub</DropdownItem>
              </DropdownGroup>
            </DropdownContent>
          </Dropdown>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#">Components</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    label: string;
    home: string;
    components: string;
    documentation: string;
    themes: string;
    github: string;
    breadcrumb: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    home: "Home",
    components: "Components",
    documentation: "Documentation",
    themes: "Themes",
    github: "GitHub",
    breadcrumb: "Breadcrumb",
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    home: "الرئيسية",
    components: "المكونات",
    documentation: "التوثيق",
    themes: "السمات",
    github: "جيت هاب",
    breadcrumb: "مسار التنقل",
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    home: "בית",
    components: "רכיבים",
    documentation: "תיעוד",
    themes: "ערכות נושא",
    github: "גיטהאב",
    breadcrumb: "פירורי לחם",
  },
};

function BreadcrumbRtlDemo() {
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
        <Breadcrumb dir={t.dir}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="#">{t.home}</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Dot />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <Dropdown>
                <DropdownTrigger asChild>
                  <button type="button" class={breadcrumbDropdownTriggerClass}>
                    {t.components}
                    <ChevronDown class="size-3.5 shrink-0 opacity-70" />
                  </button>
                </DropdownTrigger>
                <DropdownContent align="start">
                  <DropdownGroup>
                    <DropdownItem>{t.documentation}</DropdownItem>
                    <DropdownItem>{t.themes}</DropdownItem>
                    <DropdownItem>{t.github}</DropdownItem>
                  </DropdownGroup>
                </DropdownContent>
              </Dropdown>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Dot />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{t.breadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DirectionProvider>
    </div>
  );
}

const heroCode = `import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/kamod-ui/breadcrumb"
import { Button } from "@/components/kamod-ui/button"
import { Dropdown, DropdownContent, DropdownGroup, DropdownItem, DropdownTrigger } from "@/components/kamod-ui/dropdown";

const ellipsisBtnClass =
  "rounded-md border-0 focus-visible:border-transparent bg-background shadow-none hover:bg-muted/70 aria-expanded:bg-muted dark:bg-background dark:hover:bg-muted/50";

export const Example = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <a href="#">Home</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <Dropdown>
          <DropdownTrigger asChild>
            <Button size="icon-sm" variant="ghost" class={ellipsisBtnClass} aria-label="Toggle menu">
              <BreadcrumbEllipsis class="flex size-7 items-center justify-center [&_svg]:size-3.5" />
            </Button>
          </DropdownTrigger>
          <DropdownContent align="start">
            <DropdownGroup>
              <DropdownItem>Documentation</DropdownItem>
              <DropdownItem>Themes</DropdownItem>
              <DropdownItem>GitHub</DropdownItem>
            </DropdownGroup>
          </DropdownContent>
        </Dropdown>
      </BreadcrumbItem>
      …
    </BreadcrumbList>
  </Breadcrumb>
);`;

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  usage: {
    preview: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/kamod-ui/breadcrumb";

export const Example = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);`,
  },
  "custom-separator": {
    preview: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Home</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Dot />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Components</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Dot />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import { Dot } from "lucide-preact";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/kamod-ui/breadcrumb";

export const Example = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild><a href="#">Home</a></BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator><Dot /></BreadcrumbSeparator>
      …
    </BreadcrumbList>
  </Breadcrumb>
);`,
  },
  dropdown: {
    preview: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Home</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Dot />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <Dropdown>
              <DropdownTrigger asChild>
                <button type="button" class={breadcrumbDropdownTriggerClass}>
                  Components
                  <ChevronDown class="size-3.5 shrink-0 opacity-70" />
                </button>
              </DropdownTrigger>
              <DropdownContent align="start">
                <DropdownGroup>
                  <DropdownItem>Documentation</DropdownItem>
                  <DropdownItem>Themes</DropdownItem>
                  <DropdownItem>GitHub</DropdownItem>
                </DropdownGroup>
              </DropdownContent>
            </Dropdown>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Dot />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import { ChevronDown, Dot } from "lucide-preact";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/kamod-ui/breadcrumb"
import { Dropdown, DropdownContent, DropdownGroup, DropdownItem, DropdownTrigger } from "@/components/kamod-ui/dropdown";

const triggerClass =
  "text-muted-foreground hover:text-foreground hover:bg-muted/60 -mx-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm transition-[color,background-color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export const Example = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild><a href="#">Home</a></BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator><Dot /></BreadcrumbSeparator>
      <BreadcrumbItem>
        <Dropdown>
          <DropdownTrigger asChild>
            <button type="button" class={triggerClass}>
              Components
              <ChevronDown class="size-3.5 shrink-0 opacity-70" />
            </button>
          </DropdownTrigger>
          <DropdownContent align="start">
            <DropdownGroup>
              <DropdownItem>Documentation</DropdownItem>
              <DropdownItem>Themes</DropdownItem>
              <DropdownItem>GitHub</DropdownItem>
            </DropdownGroup>
          </DropdownContent>
        </Dropdown>
      </BreadcrumbItem>
      …
    </BreadcrumbList>
  </Breadcrumb>
);`,
  },
  collapsed: {
    preview: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Home</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Components</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/kamod-ui/breadcrumb";

export const Example = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild><a href="#">Home</a></BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbEllipsis />
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild><a href="#">Components</a></BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);`,
  },
  "link-component": {
    preview: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Home</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#">Components</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/kamod-ui/breadcrumb";

export const Example = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <a href="/">Home</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <a href="/components">Components</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);`,
  },
  rtl: {
    preview: () => <BreadcrumbRtlDemo />,
    code: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, DirectionProvider, Dropdown, … } from "@/components/kamod-ui/breadcrumb";
import { ChevronDown, Dot } from "lucide-preact";
// Set dir on Breadcrumb; use Dot separators and a dropdown trigger row for the middle segment.`,
  },
};

const apiSections = [
  {
    title: "Breadcrumb",
    description: "Root nav landmark; pass dir for RTL.",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "BreadcrumbList",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "BreadcrumbItem",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "BreadcrumbLink",
    description: "Use asChild to wrap your router Link or <a>.",
    rows: [
      { prop: "asChild", type: "boolean", defaultValue: "false" },
      { prop: "href", type: "string", defaultValue: "-" },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "BreadcrumbPage",
    description: "Current page; renders with aria-current and aria-disabled.",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "BreadcrumbSeparator",
    description: "Optional children override the default chevron.",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "BreadcrumbEllipsis",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
] as const;

export const breadcrumbDocPage: DocPageModule = {
  slug: "breadcrumb",
  title: "Breadcrumb",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Hierarchical navigation with links, current page, custom separators, dropdown mid-trail, ellipsis (collapsed), and asChild for router links (shadcn Breadcrumb pattern).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Breadcrumb primitives from `@/components/kamod-ui/breadcrumb`.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Compose BreadcrumbList with BreadcrumbItem cells: BreadcrumbLink for ancestors, BreadcrumbPage for the active segment, BreadcrumbSeparator between items.",
    },
    {
      id: "custom-separator",
      title: "Custom separator",
      text: "Pass any node as children of BreadcrumbSeparator (for example a dot icon).",
    },
    {
      id: "dropdown",
      title: "Dropdown",
      text: "Place a Dropdown in a BreadcrumbItem to expose sibling routes without cluttering the trail.",
    },
    {
      id: "collapsed",
      title: "Collapsed",
      text: "BreadcrumbEllipsis marks omitted intermediate segments; pair with a dropdown on the hero example for an interactive menu.",
    },
    {
      id: "link-component",
      title: "Link component",
      text: "Use BreadcrumbLink asChild so your framework Link or anchor receives breadcrumb styles and data-slot.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Set dir on Breadcrumb (or wrap with DirectionProvider). Default chevron separator flips in RTL; keep icon separators neutral or mirror explicitly if needed.",
    },
    {
      id: "api-reference",
      title: "API Reference",
      text: "Props overview for each part.",
    },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference sections={apiSections} />;
      }
      if (sectionId === "installation") {
        return (
          <div class="grid gap-3">
            <CodeBlock
              code={`import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/kamod-ui/breadcrumb";`}
              language="tsx"
            />
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
          preview: <BreadcrumbHeroDemo />,
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
