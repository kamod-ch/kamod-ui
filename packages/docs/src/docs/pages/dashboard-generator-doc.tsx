import { DashboardGeneratorCore } from "@kamod-ch/openui/demo";
import type { ComponentChildren } from "preact";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

const QUICK_START_CODE = `import { DashboardGeneratorCore } from "@kamod-ch/openui/demo";

export function Demo() {
  return <DashboardGeneratorCore />;
}`;

function renderSectionBody(sectionId: string): ComponentChildren {
  switch (sectionId) {
    case "byok":
      return (
        <div class="mt-4 grid gap-3">
          <p class="docs-copy">
            Live generation calls an OpenAI-compatible Chat Completions endpoint from the browser.
            Your API key stays in <code>sessionStorage</code> for this tab only. Prefer demo mode
            unless you intentionally want live LLM output.
          </p>
          <CodeBlock
            code={`{
  "model": "gpt-4o-mini",
  "baseUrl": "https://api.openai.com/v1",
  "demoMode": true
}`}
            language="text"
            className="docs-tab-code"
          />
        </div>
      );
    case "generator":
      return (
        <div class="mt-4">
          <DashboardGeneratorCore />
        </div>
      );
    default:
      return null;
  }
}

export const dashboardGeneratorDocPage: DocPageModule = {
  slug: "dashboard-generator",
  title: "Dashboard Generator",
  navGroup: "packages",
  command:
    "pnpm add @kamod-ch/openui @kamod-ch/ui @openuidev/react-lang zod preact @preact/signals",
  packagePath: "@kamod-ch/openui",
  usageLabel:
    "Generate dashboard UIs from natural language via OpenUI Lang, the dashboard preset, and KamodOpenUIRenderer.",
  usageImportSnippet: `import { DashboardGeneratorCore } from "@kamod-ch/openui/demo";`,
  usageExampleSnippet: `<DashboardGeneratorCore />`,
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Install @kamod-ch/openui with its peers and alias React to preact/compat. The generator UI lives under the @kamod-ch/openui/demo export.",
    },
    {
      id: "usage",
      title: "Quick start",
      text: "Embed DashboardGeneratorCore in any Preact host. Demo mode streams local fixtures; live mode needs an OpenAI-compatible API key.",
    },
    {
      id: "generator",
      title: "Generator",
      text: "Describe a dashboard, pick a quick prompt, or edit the OpenUI Lang tab. Preview uses the dashboard preset (forms disabled).",
    },
    {
      id: "byok",
      title: "BYOK & demo mode",
      text: "Bring your own key for live generation, or stay in demo mode for offline fixtures. Keys never leave your browser session.",
    },
    {
      id: "accessibility",
      title: "Security notes",
      text: "Only registered OpenUI components are allowed. External navigation is blocked by default. Prefer disposable API keys for demos.",
    },
  ],
  renderMain: (context) => (
    <>
      {context.renderTitleRow()}
      <p class="docs-copy docs-openui-intro">
        Natural language → OpenUI Lang → dashboardPreset → Kamod UI
      </p>
      {context.renderPreviewAndCodeTabs({
        preview: <DashboardGeneratorCore />,
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
