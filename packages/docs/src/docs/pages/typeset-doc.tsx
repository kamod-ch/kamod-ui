import { generateTypesetPreset } from "@kamod-ch/typeset/generator";
import { typesetPresets } from "@kamod-ch/typeset/presets";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  NativeSelect,
  NativeSelectOption,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useMemo, useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule, DocRenderMainContext, DocSection } from "../types";

const installCss = `@import "tailwindcss";
@import "@kamod-ch/typeset/typeset.css";`;

const articleUsage = `import type { ComponentChildren } from "preact";

export function Article({ children }: { children: ComponentChildren }) {
  return <article class="typeset typeset-reading">{children}</article>;
}`;

const containerMarkup = `<article class="typeset typeset-docs">
  ...
</article>`;

const rhythmCss = `.typeset {
  --typeset-size: 1em;
  --typeset-leading: 1.75;
  --typeset-flow: 1.25em;
}`;

const cssVariablesReference = `/* Core rhythm */
--typeset-size
--typeset-leading
--typeset-flow

/* Optional layout and typography */
--typeset-measure
--typeset-body-font
--typeset-heading-font
--typeset-mono-font
--typeset-code-size
--typeset-list-indent
--typeset-border
--typeset-radius`;

const ownPresetSnippet = `import { generateTypesetPreset } from "@kamod-ch/typeset/generator";

generateTypesetPreset({
  name: "product-docs",
  size: "15px",
  leading: 1.75,
  flow: "1.5em",
  measure: "72ch",
});`;

const responsiveTablesSnippet = `<div class="typeset-scroll">
  <table>...</table>
</div>`;

const optOutSnippet = `<div class="not-typeset">...</div>
<div data-not-typeset>...</div>`;

const typesetFixtureSource = `<article class="typeset typeset-docs">
  <h1>Kamod Typeset demo</h1>
  <p>
    Typeset formats <strong>plain HTML</strong> and <em>rendered Markdown</em>
    with Kamod theme tokens.
  </p>
  <h2>Headings</h2>
  <h3>Third level</h3>
  <blockquote><p>“Good typography is invisible until it is missing.”</p></blockquote>
  <h2>Lists</h2>
  <ul><li>Unordered item</li></ul>
  <ol><li>Install the package</li></ol>
  <h2>Code</h2>
  <pre><code>generateTypesetPreset({ name: "product-docs" })</code></pre>
  <h2>Tables</h2>
  <table>
    <caption>Preset overview</caption>
    <thead><tr><th>Preset</th><th>Use</th></tr></thead>
    <tbody><tr><td>Docs</td><td>Technical documentation</td></tr></tbody>
  </table>
  <details>
    <summary>Details and summary</summary>
    <p>Disclosure content follows the same flow.</p>
  </details>
</article>`;

const normalizePresetName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-");

const COMPACT_SECTIONS = new Set([
  "installation",
  "usage",
  "rhythm",
  "css-variables",
  "presets",
  "own-presets",
  "theme-integration",
  "dark-mode",
  "responsive-tables",
  "overrides",
  "opt-out",
  "accessibility",
  "streaming",
  "tailwind-typography",
  "api-reference",
]);

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => navigator.clipboard?.writeText(value)}
    >
      {label}
    </Button>
  );
}

function TypesetDemo({
  className = "typeset typeset-docs",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "compact";
}) {
  return (
    <article class={className}>
      <h1 id="demo-title">
        Kamod Typeset demo{" "}
        <a class="heading-anchor" href="#demo-title">
          #
        </a>
      </h1>
      <p>
        Typeset formats <strong>plain HTML</strong> and <em>rendered Markdown</em> with Kamod theme
        tokens. It supports{" "}
        <a href="https://ui.shadcn.com/docs/typeset" target="_blank" rel="noreferrer">
          external links
        </a>
        , long URLs, <code>inlineCode()</code>, <mark>marks</mark>,{" "}
        <abbr title="Application Programming Interface">API</abbr>, H<sub>2</sub>O and x<sup>2</sup>
        .
      </p>
      <h2>Headings</h2>
      <h3>Third level</h3>
      <h4>Fourth level</h4>
      <h5>Fifth level</h5>
      <h6>Sixth level</h6>
      <p>
        <small>Small text</small>, <del>deleted</del>, <ins>inserted</ins> and <s>struck</s> content
        keep the rhythm.
      </p>
      <blockquote>
        <p>“Good typography is invisible until it is missing.”</p>
        <cite>Kamod Docs</cite>
      </blockquote>
      <h2>Lists</h2>
      <ul>
        <li>Unordered item</li>
        <li>
          Nested list
          <ul>
            <li>Nested item</li>
            <li>Another nested item</li>
          </ul>
        </li>
      </ul>
      <ol>
        <li>Install the package</li>
        <li>Import the CSS</li>
        <li>
          Wrap content in <code>.typeset</code>
        </li>
      </ol>
      {variant === "full" ? (
        <ul class="contains-task-list">
          <li class="task-list-item">
            <input type="checkbox" checked readOnly /> Ship CSS package
          </li>
          <li class="task-list-item">
            <input type="checkbox" readOnly /> Add registry entry later
          </li>
        </ul>
      ) : null}
      <dl>
        <dt>Measure</dt>
        <dd>
          Optional max inline size controlled by <code>--typeset-measure</code>.
        </dd>
        <dt>Flow</dt>
        <dd>One-way vertical spacing for streaming-safe content.</dd>
      </dl>
      <h2>Code</h2>
      <p>
        Press <kbd>⌘</kbd> + <kbd>K</kbd> and paste a preset.
      </p>
      <pre tabIndex={0}>
        <code>{`generateTypesetPreset({\n  name: "product-docs",\n  size: "15px",\n  leading: 1.75,\n  flow: "1.5em",\n  measure: "72ch",\n})`}</code>
      </pre>
      <h2>Tables</h2>
      <table>
        <caption>Preset overview</caption>
        <thead>
          <tr>
            <th>Preset</th>
            <th>Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Docs</td>
            <td>Technical documentation</td>
          </tr>
          <tr>
            <td>Reading</td>
            <td>Long articles</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Semantic table markup stays intact.</td>
          </tr>
        </tfoot>
      </table>
      {variant === "full" ? (
        <>
          <div class="typeset-scroll" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th>Column A</th>
                  <th>Column B</th>
                  <th>Column C</th>
                  <th>Column D</th>
                  <th>Column E</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Long value</td>
                  <td>Long value</td>
                  <td>Long value</td>
                  <td>Long value</td>
                  <td>Long value</td>
                </tr>
              </tbody>
            </table>
          </div>
          <figure>
            <img
              alt="Abstract gradient placeholder"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='280'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1'%3E%3Cstop stop-color='%23ddd6fe'/%3E%3Cstop offset='1' stop-color='%2399f6e4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='900' height='280' rx='24' fill='url(%23g)'/%3E%3C/svg%3E"
            />
            <figcaption>Responsive media and captions.</figcaption>
          </figure>
          <details>
            <summary>Details and summary</summary>
            <p>Disclosure content follows the same flow.</p>
          </details>
          <hr />
          <section class="footnotes">
            <ol>
              <li id="fn-1">
                A footnote example with a backlink. <a href="#demo-title">↩</a>
              </li>
            </ol>
          </section>
          <Card class="not-typeset">
            <CardHeader>
              <CardTitle>Embedded Kamod UI Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This card uses <code>not-typeset</code>, so component styling stays isolated.
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </article>
  );
}

function TypesetPreviewFrame({
  children,
  dark = false,
  label,
}: {
  children: ComponentChildren;
  dark?: boolean;
  label?: string;
}) {
  return (
    <div
      class={["docs-typeset-frame", dark ? "dark bg-background text-foreground" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? <p class="docs-typeset-frame-label">{label}</p> : null}
      {children}
    </div>
  );
}

function TypesetDemoPlayground() {
  const [presetId, setPresetId] = useState("docs");
  const [dark, setDark] = useState(false);
  const preset = typesetPresets.find((item) => item.id === presetId) ?? typesetPresets[1];

  return (
    <div class="grid gap-4">
      <div class="docs-typeset-toolbar">
        <ToggleGroup
          type="single"
          value={presetId}
          variant="outline"
          class="docs-typeset-preset-toggle"
          onValueChange={(next) => {
            if (typeof next === "string" && next) setPresetId(next);
          }}
        >
          {typesetPresets.map((item) => (
            <ToggleGroupItem key={item.id} value={item.id}>
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div class="docs-typeset-toolbar-theme">
          <Label for="typeset-demo-dark" class="text-sm">
            Dark preview
          </Label>
          <Switch
            id="typeset-demo-dark"
            checked={dark}
            onCheckedChange={setDark}
            aria-label="Dark preview"
          />
        </div>
      </div>
      <Tabs defaultValue="preview" class="docs-tabs">
        <TabsList class="docs-tabs-list" variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="fixture">Fixture</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <TypesetPreviewFrame dark={dark} label={`${preset.label} · ${preset.className}`}>
            <TypesetDemo variant="full" className={preset.className} />
          </TypesetPreviewFrame>
        </TabsContent>
        <TabsContent value="fixture">
          <CodeBlock
            code={typesetFixtureSource.replace("typeset typeset-docs", preset.className)}
            language="text"
            className="docs-tab-code"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TypesetBuilder() {
  const [presetId, setPresetId] = useState("docs");
  const base = typesetPresets.find((preset) => preset.id === presetId) ?? typesetPresets[1];
  const [name, setName] = useState("product-docs");
  const [size, setSize] = useState<string>(base.values.size);
  const [leading, setLeading] = useState<number>(base.values.leading);
  const [flow, setFlow] = useState<string>(base.values.flow);
  const [measure, setMeasure] = useState<string>(base.values.measure ?? "72ch");
  const [dark, setDark] = useState(false);

  const generatedCss = useMemo(() => {
    try {
      return generateTypesetPreset({ name, size, leading, flow, measure });
    } catch (error) {
      return `/* ${(error as Error).message} */\n`;
    }
  }, [name, size, leading, flow, measure]);

  const presetSlug = normalizePresetName(name) || "product-docs";
  const previewClass = `typeset typeset-${presetSlug}`;
  const wrapper = `<article class="${previewClass}">\n  ...\n</article>`;

  const applyBasePreset = (nextPresetId: string) => {
    const preset = typesetPresets.find((item) => item.id === nextPresetId);
    setPresetId(nextPresetId);
    if (preset) {
      setSize(preset.values.size);
      setLeading(preset.values.leading);
      setFlow(preset.values.flow);
      setMeasure(preset.values.measure ?? "none");
    }
  };

  const resetBuilder = () => {
    setName("product-docs");
    setSize(base.values.size);
    setLeading(base.values.leading);
    setFlow(base.values.flow);
    setMeasure(base.values.measure ?? "72ch");
  };

  return (
    <div class="docs-typeset-builder">
      <div class="docs-typeset-builder-controls">
        <div class="docs-typeset-builder-group">
          <p class="docs-typeset-builder-group-label">Base</p>
          <div class="grid gap-3">
            <div class="grid gap-1.5">
              <Label for="typeset-builder-preset">Preset</Label>
              <NativeSelect
                id="typeset-builder-preset"
                class="w-full"
                value={presetId}
                onInput={(event) => applyBasePreset(event.currentTarget.value)}
              >
                {typesetPresets.map((preset) => (
                  <NativeSelectOption key={preset.id} value={preset.id}>
                    {preset.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div class="grid gap-1.5">
              <Label for="typeset-builder-name">Name</Label>
              <Input
                id="typeset-builder-name"
                value={name}
                onInput={(event) => setName(event.currentTarget.value)}
              />
            </div>
          </div>
        </div>
        <div class="docs-typeset-builder-group">
          <p class="docs-typeset-builder-group-label">Rhythm</p>
          <div class="grid gap-3">
            <div class="grid gap-1.5">
              <Label for="typeset-builder-size">Base size</Label>
              <Input
                id="typeset-builder-size"
                value={size}
                onInput={(event) => setSize(event.currentTarget.value)}
              />
            </div>
            <div class="grid gap-1.5">
              <div class="flex items-center justify-between gap-2">
                <Label for="typeset-builder-leading">Line height</Label>
                <span class="text-xs text-muted-foreground">{leading.toFixed(2)}</span>
              </div>
              <Slider
                id="typeset-builder-leading"
                min={1.2}
                max={2.2}
                step={0.05}
                value={[leading]}
                onValueChange={(value) => setLeading(value[0] ?? leading)}
              />
            </div>
            <div class="grid gap-1.5">
              <Label for="typeset-builder-flow">Flow</Label>
              <Input
                id="typeset-builder-flow"
                value={flow}
                onInput={(event) => setFlow(event.currentTarget.value)}
              />
            </div>
            <div class="grid gap-1.5">
              <Label for="typeset-builder-measure">Measure</Label>
              <Input
                id="typeset-builder-measure"
                value={measure}
                onInput={(event) => setMeasure(event.currentTarget.value)}
              />
            </div>
          </div>
        </div>
        <div class="docs-typeset-builder-group">
          <p class="docs-typeset-builder-group-label">Preview</p>
          <div class="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
            <div class="space-y-0.5">
              <Label for="typeset-builder-dark" class="text-sm">
                Dark mode
              </Label>
              <p class="text-xs text-muted-foreground">Preview against dark theme tokens.</p>
            </div>
            <Switch
              id="typeset-builder-dark"
              checked={dark}
              onCheckedChange={setDark}
              aria-label="Dark mode preview"
            />
          </div>
        </div>
        <ButtonGroup class="docs-typeset-builder-actions">
          <Button type="button" variant="outline" onClick={resetBuilder}>
            Reset
          </Button>
          <CopyButton value={generatedCss} label="Copy CSS" />
          <CopyButton value={wrapper} label="Copy markup" />
        </ButtonGroup>
      </div>
      <div class="docs-typeset-builder-output min-w-0">
        <Tabs defaultValue="preview" class="docs-tabs">
          <TabsList class="docs-tabs-list" variant="line">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="markup">Markup</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <TypesetPreviewFrame dark={dark} label={previewClass}>
              <style>{generatedCss}</style>
              <TypesetDemo variant="compact" className={previewClass} />
            </TypesetPreviewFrame>
          </TabsContent>
          <TabsContent value="css">
            <CodeBlock code={generatedCss} language="css" className="docs-tab-code" />
            <p class="docs-copy mt-3 text-sm">
              Generated preset CSS only. Import <code>@kamod-ch/typeset/typeset.css</code> for the
              base stylesheet.
            </p>
          </TabsContent>
          <TabsContent value="markup">
            <CodeBlock code={wrapper} language="tsx" className="docs-tab-code" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SectionNav({
  sections,
  activeSectionId,
  getSectionHref,
}: {
  sections: DocSection[];
  activeSectionId: string;
  getSectionHref: (sectionId: string) => string;
}) {
  const index = sections.findIndex((item) => item.id === activeSectionId);
  const prev = index > 0 ? sections[index - 1] : null;
  const next = index >= 0 && index < sections.length - 1 ? sections[index + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav class="docs-section-nav" aria-label="Section navigation">
      {prev ? (
        <a class="docs-section-nav-link docs-section-nav-prev" href={getSectionHref(prev.id)}>
          ← {prev.title}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a class="docs-section-nav-link docs-section-nav-next" href={getSectionHref(next.id)}>
          {next.title} →
        </a>
      ) : null}
    </nav>
  );
}

function renderSectionBody(sectionId: string, context: DocRenderMainContext): ComponentChildren {
  switch (sectionId) {
    case "installation":
      return (
        <div class="docs-steps">
          <div class="docs-step">
            <h3 class="docs-step-title">
              <span class="docs-step-number">1</span>
              Install the package
            </h3>
            {context.renderSectionExtraContent("installation")}
          </div>
          <div class="docs-step">
            <h3 class="docs-step-title">
              <span class="docs-step-number">2</span>
              Import the CSS
            </h3>
            <CodeBlock code={installCss} language="css" className="docs-tab-code" />
          </div>
          <div class="docs-step">
            <h3 class="docs-step-title">
              <span class="docs-step-number">3</span>
              Apply the container class
            </h3>
            <CodeBlock code={containerMarkup} language="tsx" className="docs-tab-code" />
          </div>
          <p class="docs-copy">
            Package mode needs no JavaScript runtime. A future registry/CLI can copy the same CSS
            for code-you-own mode.
          </p>
        </div>
      );
    case "usage":
      return (
        <div class="grid gap-3">
          <CodeBlock code={containerMarkup} language="tsx" className="docs-tab-code" />
          <CodeBlock code={articleUsage} language="tsx" className="docs-tab-code" />
          <p class="docs-copy">
            All element styling is scoped to the container and uses low-specificity{" "}
            <code>:where()</code> selectors.
          </p>
        </div>
      );
    case "rhythm":
      return (
        <div class="grid gap-3">
          <p class="docs-copy">
            The core rhythm is controlled by <code>--typeset-size</code>,{" "}
            <code>--typeset-leading</code> and <code>--typeset-flow</code>.
          </p>
          <CodeBlock code={rhythmCss} language="css" className="docs-tab-code" />
        </div>
      );
    case "css-variables":
      return <CodeBlock code={cssVariablesReference} language="css" className="docs-tab-code" />;
    case "presets":
      return (
        <div class="docs-preset-grid">
          {typesetPresets.map((preset) => (
            <Card key={preset.id}>
              <CardHeader class="gap-2 pb-2">
                <div class="flex items-center justify-between gap-2">
                  <CardTitle class="text-base">{preset.label}</CardTitle>
                  <Badge variant="outline">{preset.id}</Badge>
                </div>
                <CardDescription class="text-sm leading-snug">{preset.description}</CardDescription>
              </CardHeader>
              <CardContent class="pt-0">
                <code class="text-sm">{preset.className}</code>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    case "own-presets":
      return (
        <div class="grid gap-3">
          <p class="docs-copy">
            Generate deterministic preset CSS with the package generator and ship it alongside your
            theme.
          </p>
          <CodeBlock code={ownPresetSnippet} language="tsx" className="docs-tab-code" />
        </div>
      );
    case "theme-integration":
      return (
        <p class="docs-copy">
          Typeset consumes Kamod tokens such as <code>--foreground</code>, <code>--muted</code>,{" "}
          <code>--primary</code>, <code>--border</code>, <code>--card</code>, <code>--ring</code>{" "}
          and <code>--radius</code> with sensible fallbacks when a token is missing.
        </p>
      );
    case "dark-mode":
      return (
        <p class="docs-copy">
          Typeset does not ship a separate dark palette. Dark mode follows the Kamod theme tokens
          already present on a <code>.dark</code> ancestor.
        </p>
      );
    case "responsive-tables":
      return (
        <div class="grid gap-3">
          <p class="docs-copy">
            Wrap wide tables in <code>.typeset-scroll</code> to keep horizontal scrolling
            keyboard-accessible.
          </p>
          <CodeBlock code={responsiveTablesSnippet} language="tsx" className="docs-tab-code" />
        </div>
      );
    case "overrides":
      return (
        <p class="docs-copy">
          Low-specificity <code>:where()</code> selectors keep Kamod utilities and component styles
          in control without <code>!important</code>.
        </p>
      );
    case "opt-out":
      return (
        <div class="grid gap-3">
          <p class="docs-copy">
            Exclude embedded Kamod UI components from typeset styling with <code>not-typeset</code>{" "}
            or <code>data-not-typeset</code>.
          </p>
          <CodeBlock code={optOutSnippet} language="tsx" className="docs-tab-code" />
        </div>
      );
    case "accessibility":
      return (
        <p class="docs-copy">
          Links and focus states stay visible, tables remain semantic, code areas are
          keyboard-scrollable and spacing only uses forward margins.
        </p>
      );
    case "streaming":
      return (
        <p class="docs-copy">
          Forward-only spacing keeps appended streaming content stable. Typeset avoids layout
          selectors such as <code>:last-child</code>, <code>:has()</code> or <code>:empty</code>.
        </p>
      );
    case "tailwind-typography":
      return (
        <p class="docs-copy">
          Tailwind Typography is excellent for Tailwind projects. Kamod Typeset focuses on
          container-relative variables, Kamod theme tokens, copy/ownership CSS, context presets,
          streaming stability and no plugin runtime.
        </p>
      );
    case "api-reference":
      return (
        <ApiReference
          sections={[
            {
              title: "CSS variables",
              description: "Core rhythm and optional custom properties on .typeset containers.",
              rows: [
                { prop: "--typeset-size", type: "length", defaultValue: "1em" },
                { prop: "--typeset-leading", type: "number", defaultValue: "1.75" },
                { prop: "--typeset-flow", type: "length", defaultValue: "1.25em" },
                { prop: "--typeset-measure", type: "length | none", defaultValue: "none" },
              ],
            },
            {
              title: "Package exports",
              description: "Named exports from @kamod-ch/typeset.",
              rows: [
                { prop: "typesetPresets", type: "TypesetPreset[]", defaultValue: "—" },
                { prop: "generateTypesetPreset", type: "function", defaultValue: "—" },
                { prop: "generateTypesetPresetsCss", type: "function", defaultValue: "—" },
              ],
            },
          ]}
        />
      );
    case "demo":
      return <TypesetDemoPlayground />;
    case "builder":
      return <TypesetBuilder />;
    default:
      return null;
  }
}

function renderActiveSection(docSection: DocSection, context: DocRenderMainContext) {
  const isCompact = COMPACT_SECTIONS.has(docSection.id);
  const showSectionNav = isCompact || docSection.id === "demo" || docSection.id === "builder";

  return (
    <section key={docSection.id} id={docSection.id} class="docs-section">
      <h2>{docSection.title}</h2>
      <p class="docs-copy">{docSection.text}</p>
      {docSection.id !== "installation" ? context.renderSectionExtraContent(docSection.id) : null}
      {renderSectionBody(docSection.id, context)}
      {showSectionNav ? (
        <SectionNav
          sections={context.sections}
          activeSectionId={docSection.id}
          getSectionHref={context.getSectionHref}
        />
      ) : null}
    </section>
  );
}

function resolveActiveSection(context: DocRenderMainContext): DocSection {
  const { sections, activeSectionId } = context;
  return (
    sections.find((item) => item.id === activeSectionId) ??
    sections.find((item) => item.id === "installation") ??
    sections[0]
  );
}

export const typesetDocPage: DocPageModule = {
  slug: "typeset",
  title: "Typeset",
  navGroup: "packages",
  packagePath: "@kamod-ch/typeset",
  command: "pnpm add @kamod-ch/typeset",
  usageLabel: "Kamod Typeset styles plain HTML and rendered Markdown with a scoped CSS container.",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import the package CSS after Tailwind and Kamod theme tokens.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Wrap content in .typeset and add an optional preset class.",
    },
    { id: "rhythm", title: "Rhythm", text: "Three variables control most spacing and sizing." },
    { id: "css-variables", title: "CSS Variables", text: "Core and optional custom properties." },
    { id: "presets", title: "Presets", text: "Default, docs, reading, chat, compact and large." },
    { id: "own-presets", title: "Own Presets", text: "Generate deterministic preset CSS." },
    {
      id: "theme-integration",
      title: "Theme Integration",
      text: "Kamod semantic tokens with fallbacks.",
    },
    { id: "dark-mode", title: "Dark Mode", text: "Dark mode follows existing tokens." },
    {
      id: "responsive-tables",
      title: "Responsive Tables",
      text: "Use .typeset-scroll for wide content.",
    },
    { id: "overrides", title: "Overrides", text: "Low specificity keeps utilities in control." },
    { id: "opt-out", title: "Opt-out", text: "Exclude embedded components." },
    {
      id: "accessibility",
      title: "Accessibility",
      text: "Semantic and keyboard-friendly content.",
    },
    { id: "streaming", title: "Streaming", text: "Forward-only spacing for appended content." },
    { id: "tailwind-typography", title: "Tailwind Typography", text: "Neutral comparison." },
    { id: "api-reference", title: "API Reference", text: "CSS variables, exports and presets." },
    { id: "demo", title: "Demo", text: "Complete HTML and Markdown fixture." },
    {
      id: "builder",
      title: "Builder",
      text: "Generate custom preset CSS using the package generator.",
    },
  ],
  renderMain: (context) => {
    const activeSection = resolveActiveSection(context);

    return (
      <>
        {context.renderTitleRow()}
        {renderActiveSection(activeSection, context)}
      </>
    );
  },
};
