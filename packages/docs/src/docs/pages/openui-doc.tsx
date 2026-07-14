import { KamodOpenUIRenderer } from "@kamod-ch/openui";
import {
  CONTACT_FORM_LANG,
  EMPTY_STATE_LANG,
  SETTINGS_UI_LANG,
  STATUS_CARD_LANG,
} from "@kamod-ch/openui/examples";
import { createKamodOpenUISystemPrompt } from "@kamod-ch/openui/prompts";
import { Button } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { OpenUIPlayground } from "../components/OpenUIPlayground";
import type { DocPageModule } from "../types";

const QUICK_START_CODE = `import {
  KamodOpenUIRenderer,
  kamodOpenUILibrary,
} from "@kamod-ch/openui";

export function GeneratedInterface({ content }: { content: string }) {
  return (
    <KamodOpenUIRenderer
      content={content}
      library={kamodOpenUILibrary}
      onAction={(action) => {
        console.log(action);
      }}
    />
  );
}`;

const PREACT_ALIAS_CODE = `// vite.config.ts / preactpress config
resolve: {
  alias: [
    { find: "react", replacement: "preact/compat" },
    { find: "react-dom", replacement: "preact/compat" },
    { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
  ],
  dedupe: ["preact", "preact/hooks", "preact/compat"],
}`;

const BLOCKED_NAVIGATE_LANG = `root = Button("Go", "default", "md", false, { type: "navigate", target: "https://evil.example" })`;

const SYSTEM_PROMPT = createKamodOpenUISystemPrompt({ includeExamples: true });

const API_ROWS = [
  { prop: "content", type: "string | null", defaultValue: "(required)" },
  { prop: "library", type: "Library | KamodOpenUILibrary", defaultValue: "kamodOpenUILibrary" },
  { prop: "isStreaming", type: "boolean", defaultValue: "false" },
  { prop: "onAction", type: "(action, event) => void", defaultValue: "—" },
  { prop: "onSubmit", type: "({ formName, formState, event }) => void", defaultValue: "—" },
  { prop: "onStateUpdate", type: "(state) => void", defaultValue: "—" },
  { prop: "initialState", type: "Record<string, unknown>", defaultValue: "—" },
  { prop: "onError", type: "(errors) => void", defaultValue: "—" },
  { prop: "errorMode", type: '"fallback" | "partial" | "throw"', defaultValue: '"fallback"' },
  { prop: "fallback", type: "ComponentChildren", defaultValue: "muted message" },
  { prop: "navigation", type: "NavigationPolicy", defaultValue: "allowExternal: false" },
] as const;

function CopyPromptButton() {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => {
        void navigator.clipboard.writeText(SYSTEM_PROMPT).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? "Copied" : "Copy system prompt"}
    </Button>
  );
}

function LangPreviewBlock({ lang, preview }: { lang: string; preview: ComponentChildren }) {
  return (
    <div class="openui-fixture-block">
      <div class="openui-fixture-preview">{preview}</div>
      <CodeBlock code={lang} language="text" className="docs-tab-code" />
    </div>
  );
}

function renderSectionBody(sectionId: string): ComponentChildren {
  switch (sectionId) {
    case "installation":
      return (
        <div class="mt-4 grid gap-3">
          <h3 class="text-base font-medium">Preact / preact/compat</h3>
          <p class="docs-copy">
            OpenUI&apos;s React peer must be aliased to Preact. Do not bundle a second React runtime
            beside Preact.
          </p>
          <CodeBlock code={PREACT_ALIAS_CODE} language="tsx" className="docs-tab-code" />
        </div>
      );
    case "playground":
      return <OpenUIPlayground />;
    case "status-card":
      return (
        <LangPreviewBlock
          lang={STATUS_CARD_LANG}
          preview={<KamodOpenUIRenderer content={STATUS_CARD_LANG} />}
        />
      );
    case "contact-form":
      return (
        <LangPreviewBlock
          lang={CONTACT_FORM_LANG}
          preview={<KamodOpenUIRenderer content={CONTACT_FORM_LANG} />}
        />
      );
    case "settings-tabs":
      return (
        <LangPreviewBlock
          lang={SETTINGS_UI_LANG}
          preview={<KamodOpenUIRenderer content={SETTINGS_UI_LANG} />}
        />
      );
    case "empty-state":
      return (
        <LangPreviewBlock
          lang={EMPTY_STATE_LANG}
          preview={<KamodOpenUIRenderer content={EMPTY_STATE_LANG} />}
        />
      );
    case "actions":
      return (
        <div class="grid gap-4">
          <CodeBlock
            code={`onAction={(action) => {\n  // Host-controlled execution\n}}\nonSubmit={({ formName, formState }) => {\n  // Validate and process form data\n}}`}
            language="tsx"
            className="docs-tab-code"
          />
          <p class="docs-copy">
            External navigate targets are blocked by default. Click Go below — the host should not
            receive onAction and onError reports the blocked navigation.
          </p>
          <KamodOpenUIRenderer content={BLOCKED_NAVIGATE_LANG} />
          <CodeBlock code={BLOCKED_NAVIGATE_LANG} language="text" className="docs-tab-code" />
        </div>
      );
    case "system-prompts":
      return (
        <div class="grid gap-3">
          <CopyPromptButton />
          <CodeBlock
            code={`import { createKamodOpenUISystemPrompt } from "@kamod-ch/openui/prompts";\n\nconst systemPrompt = createKamodOpenUISystemPrompt({\n  includeExamples: true,\n});`}
            language="tsx"
            className="docs-tab-code"
          />
          <CodeBlock code={SYSTEM_PROMPT} language="text" className="docs-tab-code" />
        </div>
      );
    case "api-reference":
      return (
        <ApiReference
          sections={[
            {
              title: "KamodOpenUIRenderer",
              description: "Thin Kamod wrapper around the official OpenUI Renderer.",
              rows: API_ROWS,
            },
          ]}
        />
      );
    default:
      return null;
  }
}

export const openuiDocPage: DocPageModule = {
  slug: "openui",
  title: "OpenUI",
  navGroup: "packages",
  command:
    "pnpm add @kamod-ch/openui @kamod-ch/ui @openuidev/react-lang zod preact @preact/signals",
  packagePath: "@kamod-ch/openui",
  usageLabel:
    "Render LLM-generated interfaces through OpenUI Lang, @openuidev/react-lang, and Kamod UI components.",
  usageImportSnippet: `import { KamodOpenUIRenderer, kamodOpenUILibrary } from "@kamod-ch/openui";`,
  usageExampleSnippet: `<KamodOpenUIRenderer content={lang} onAction={(action) => console.log(action)} />`,
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Install @kamod-ch/openui with its peer dependencies. Alias React to preact/compat so @openuidev/react-lang renders with Preact.",
    },
    {
      id: "usage",
      title: "Quick start",
      text: "Pass OpenUI Lang strings to KamodOpenUIRenderer. The host app executes actions through onAction and onSubmit callbacks.",
    },
    {
      id: "playground",
      title: "Playground",
      text: "Edit OpenUI Lang, switch fixtures, simulate streaming, and inspect host callbacks in the event log.",
    },
    {
      id: "status-card",
      title: "Status card",
      text: "A deployment status card with badge, progress, and a declarative refresh action.",
    },
    {
      id: "contact-form",
      title: "Contact form",
      text: "Named form fields with Input, Textarea, Checkbox, and SubmitButton. Handle submission in onSubmit.",
    },
    {
      id: "settings-tabs",
      title: "Settings UI",
      text: "Multi-tab settings with Alert, Switch, and save action — composed only from registered components.",
    },
    {
      id: "empty-state",
      title: "Empty state",
      text: "Empty, Tooltip, and Avatar — Phase 1 content/feedback adapters for generative lists and status views.",
    },
    {
      id: "actions",
      title: "Actions & navigation",
      text: "Models emit declarative actions only (event, submit, navigate). External navigation is blocked by default. Dropzone and Direction are intentionally not registered.",
    },
    {
      id: "system-prompts",
      title: "System prompts",
      text: "Generate a system prompt from kamodOpenUILibrary so the model knows which components and rules apply.",
    },
    {
      id: "api-reference",
      title: "API Reference",
      text: "KamodOpenUIRenderer props and host callbacks.",
    },
    {
      id: "accessibility",
      title: "Security notes",
      text: "Only registered components are allowed. Props are Zod-validated with semantic tokens instead of free CSS. Tree depth, children-per-node, and total node limits apply. Actions are declarative — the host executes them via onAction and onSubmit. Media URLs use validateMediaUrl; Dropzone (file upload) and Direction are excluded from the adapter.",
    },
  ],
  renderMain: (context) => (
    <>
      {context.renderTitleRow()}
      <p class="docs-copy docs-openui-intro">
        LLM → OpenUI Lang → @openuidev/react-lang → @kamod-ch/openui → @kamod-ch/ui → Preact
      </p>
      {context.renderPreviewAndCodeTabs({
        preview: <OpenUIPlayground />,
        codeSnippet: QUICK_START_CODE,
        previewClass: "data-[chromeless=true]:h-auto data-[align=start]:items-start",
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
  ),
};
