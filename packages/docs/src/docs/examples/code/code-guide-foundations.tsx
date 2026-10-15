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

const source = 'const greeting = "Hello";';

export function GettingStartedExample() {
  return (
    <Code
      code={source}
      language="typescript"
      showToolbar={false}
      showWrapControl={false}
    />
  );
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
          typography and syntax colors are included in the shared theme stylesheet. Keep your
          overrides after these imports so the same design decisions apply to{" "}
          <a href={withBasePath("/docs/button/installation")}>Button</a>,{" "}
          <a href={withBasePath("/docs/switch/installation")}>Switch</a> and the rest of your
          interface.
        </p>
        <CodeBlock
          code={'@import "tailwindcss";\n@import "@kamod-ch/ui/theme.css";'}
          filePath="src/styles.css"
        />
        <p>
          If your application already uses the full <code>@kamod-ch/themes/theme.css</code>{" "}
          foundation, keep it and add the component-only <code>@kamod-ch/ui/code/styles.css</code>{" "}
          entry instead of importing a second set of token defaults. This includes Code's layout,
          syntax palettes and CopyButton feedback. The UI theme above already includes those styles.
        </p>
        <CodeBlock
          language="css"
          code={
            '/* Alternative: your existing full theme foundation. */\n@import "tailwindcss";\n@import "@kamod-ch/themes/theme.css";\n@import "@kamod-ch/ui/code/styles.css";'
          }
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
          before the highlighter loads. Choose a language when you know it; the example below keeps
          the presentation plain so it can sit beside a paragraph, response value or small demo.
        </p>
        <CodeBlock code={firstExample} filePath="src/GettingStartedExample.tsx" />
      </Topic>
    </>
  );
}

export function CodeUsageGuide() {
  return (
    <>
      <Topic id="code-reading-model" title="Display the string your application supplies">
        <p>
          The <code>code</code> string is the source of truth. Syntax colors help a reader recognize
          tokens; spaces, indentation and newlines come from your string. A snippet can be a short
          expression, a configuration value or a complete function.{" "}
          <strong>Code displays it; it does not execute or format it.</strong> Prepare an object's
          JSON or an excerpt from a log before passing it to the component.
        </p>
        <p>
          Start with the source and its language. The early examples use a plain presentation:
          <code>{"showToolbar={false}"}</code> removes the optional top bar, and{" "}
          <code>{"showWrapControl={false}"}</code> keeps long lines in the native horizontal scroll
          area. The later <a href="#source-file">Optional File Header</a> and{" "}
          <a href="#reading-behavior">Reading Preferences</a> sections explain when extra context
          and interactive tools become useful.
        </p>
        <DocsCallout title="A code surface that fits your interface" icon={<InfoIcon />}>
          <p>
            <strong>Your application provides the source and its purpose.</strong> Use Code beside
            an API response, in a help article or beneath a working example. Its surface and syntax
            colors follow the same shared stylesheet as the rest of your interface. Add a short
            explanation outside the snippet so readers know what they are looking at.
          </p>
        </DocsCallout>
      </Topic>
      <Topic id="code-choose-language" title="Prefer the information you already have">
        <p>
          Use <code>language="typescript"</code> for typed source, <code>language="json"</code> for
          serialized values and <code>language="bash"</code> for commands. For generated output that
          should remain literal, pair <code>language="text"</code> with{" "}
          <code>{"inferLanguage={false}"}</code>.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code code={source} language="typescript" showToolbar={false} showWrapControl={false} />\n<Code code={response} language="json" showToolbar={false} showWrapControl={false} />\n<Code code={report} language="text" inferLanguage={false} showToolbar={false} />'
          }
        />
        <p>
          These are alternative render expressions; <code>source</code>, <code>response</code> and{" "}
          <code>report</code> are strings supplied by your app. Choose the matching grammar, then
          use the <a href="#language-detection">Language Selection Guide</a> when the source arrives
          without metadata.
        </p>
      </Topic>
    </>
  );
}
