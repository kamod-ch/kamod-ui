import { InfoIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../../base-path";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsCallout } from "../../components/DocsCallout";
import { InlineCode } from "../../components/PathDisplay";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";

const componentImport = `import { Code } from "@kamod-ch/ui/code";

// The root export is available too:
// import { Code } from "@kamod-ch/ui";`;

const firstExample = `import { Code } from "@kamod-ch/ui/code";

const source = 'const greeting = "Hello, workspace";';

export function GettingStartedExample() {
  return <Code code={source} language="typescript" />;
}`;

export function CodeInstallationGuide() {
  return (
    <>
      <Topic id="code-install-package" title="1. Add the UI package">
        <p>
          Use the same <strong>Preact and theme foundation</strong> as your other Kamod components.
          In a new project, install the UI package and its peers together. In an existing app, add
          only the packages that are missing; the{" "}
          <a href={withBasePath("/docs/getting-started")}>Getting Started Guide</a> walks through
          the complete application setup.
        </p>
        <CodeBlock
          code="pnpm add @kamod-ch/ui preact @preact/signals @kamod-ch/themes"
          language="bash"
        />
        <p>
          The syntax highlighter is an implementation dependency of{" "}
          <InlineCode>@kamod-ch/ui</InlineCode>. You do not need to install or configure Prism
          separately to use the built-in languages. Use the focused{" "}
          <InlineCode>@kamod-ch/ui/code</InlineCode> entrypoint when your file only needs this
          component.
        </p>
        <CodeBlock code={componentImport} language="typescript" />
      </Topic>
      <Topic id="code-install-styles" title="2. Connect the shared stylesheet">
        <p>
          Import the theme <strong>once, at the application entry</strong>. Code’s surfaces, source
          typography, syntax colors and compact controls are included in the shared theme
          stylesheet. Keep your overrides after these imports so the same design decisions apply to{" "}
          <a href={withBasePath("/docs/button/installation")}>Button</a>,{" "}
          <a href={withBasePath("/docs/switch/installation")}>Switch</a> and the rest of your
          interface.
        </p>
        <CodeBlock
          code={'@import "tailwindcss";\n@import "@kamod-ch/ui/theme.css";'}
          filePath="src/styles.css"
        />
        <p>
          Use your existing Tailwind CSS v4 integration. If utility classes are missing in a
          production build, check{" "}
          <a href={withBasePath("/docs/theming/installation#css-setup")}>
            Source Detection and CSS Setup
          </a>
          ; adding more language labels will not fix missing styles.
        </p>
      </Topic>
      <Topic id="code-first-render" title="3. Render one useful example">
        <p>
          Pass the source as a string through <code>code</code>. It remains selectable and readable
          before the optional highlighter loads. Use an explicit language when you know it; add a{" "}
          <code>filePath</code> when the reader needs to know where the snippet belongs.
        </p>
        <CodeBlock code={firstExample} filePath="src/GettingStartedExample.tsx" />
      </Topic>
    </>
  );
}

export function CodeUsageGuide() {
  return (
    <>
      <Topic id="code-reading-model" title="Source first, reading preferences second">
        <p>
          The <code>code</code> string is the source of truth. Syntax colors help a reader recognize
          tokens, the import control can hide introductory declarations, and wrapping keeps long
          lines inside a narrow panel. <strong>None of those choices rewrites the source.</strong>{" "}
          Copy uses the complete original string, including imports, indentation and line endings.
        </p>
        <p>
          A normal code panel has a file or purpose label, a copy action, and the relevant reading
          controls. The import control appears only when there are supported leading declarations
          and remaining content worth showing. Actual files and recognized coding languages can show
          the wrap switch; commands and unfiled prose or Markdown prompts omit it. Without a
          separate import row, an eligible wrap switch sits with the header actions. In a{" "}
          <a href="#document">Rendered Document</a>, code-only controls disappear.
        </p>
        <DocsCallout title="One component, three responsibilities" icon={<InfoIcon />}>
          <p>
            <strong>Your application provides the source.</strong> Code provides the reading surface
            and clipboard action. Your surrounding page provides the explanation, file selection and
            integration context. Keep those boundaries clear when composing a larger{" "}
            <a href={withBasePath("/blocks")}>Block Showcase</a> or a documentation page.
          </p>
        </DocsCallout>
      </Topic>
      <Topic id="code-choose-language" title="Prefer the information you already have">
        <p>
          For a known file, <code>filePath="src/WelcomeAction.tsx"</code> supplies both its label
          and a useful language hint. For a command with no meaningful filename, use{" "}
          <code>language="bash"</code>. For generated output that should remain literal, pair{" "}
          <code>language="text"</code> with <code>{"inferLanguage={false}"}</code>.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code code={source} filePath="src/WelcomeAction.tsx" />\n<Code code="pnpm build" language="bash" />\n<Code code={report} language="text" inferLanguage={false} />'
          }
        />
        <p>
          These are three alternative render expressions; <code>source</code> and{" "}
          <code>report</code> are strings supplied by your app. Choose the least surprising label
          for the reader, then use the <a href="#language-detection">Language Selection Guide</a>{" "}
          when the source arrives without metadata.
        </p>
      </Topic>
    </>
  );
}
