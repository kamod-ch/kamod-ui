import { Code } from "@kamod-ch/ui/code";
import type { ComponentChildren } from "preact";

export const welcomeSource = `import { Button } from "@kamod-ch/ui/button";

export function WelcomeAction() {
  return (
    <Button href="/workspace">
      Open your workspace
    </Button>
  );
}`;

const importsSource = `/** Keep your page content beside the action that opens it. */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@kamod-ch/ui/card";
import { Button } from "@kamod-ch/ui/button";

export function WorkspaceCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Your workspace</CardTitle></CardHeader>
      <CardContent>
        <Button href="/workspace">Continue building</Button>
      </CardContent>
    </Card>
  );
}`;

const wrappedSource = `export const welcomeMessage = "Your workspace is ready. Invite a teammate, connect your first project, and make something worth sharing.";

export function WorkspaceSummary() {
  return (
    <section aria-label="Workspace summary" class="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground">
      <p>{welcomeMessage}</p>
    </section>
  );
}`;

const dataSource = `{
  "name": "Design workspace",
  "visibility": "private",
  "notifications": {
    "productUpdates": true,
    "weeklyDigest": false
  },
  "members": ["alex", "sam"]
}`;

const stylesSource = `.workspace-panel {
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.workspace-panel:focus-within {
  outline: 2px solid var(--ring);
  outline-offset: 3px;
}`;

const markdownSource = `# A workspace worth sharing

Start with **one useful screen** and keep the first action clear.

1. Name the workspace.
2. Choose who can join.
3. Save the preferences.

Keep the integration small: connect \`onSubmit\` when your app is ready.`;

const literalSource = `Build report
-----------
Output: <WorkspaceCard />
Result: 3 checks passed
Next: connect the submit handler`;

/** Source strings are escaped for copyable TSX without changing the example's contents. */
function exampleSource(source: string, props = "") {
  const literal = source.replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${");
  return `import { Code } from "@kamod-ch/ui/code";\n\nconst source = \`${literal}\`;\n\nexport function Example() {\n  return (\n    <Code\n      code={source}${props ? `\n${props}` : ""}\n    />\n  );\n}`;
}

const surfaceSource = `const label = "A small, useful example";`;
const toolbarSource = `export const workspace = {
  name: "Design workspace",
  visibility: "private",
} as const;`;

export const codeHeroSnippet = exampleSource(
  welcomeSource,
  '      filePath="src/WelcomeAction.tsx"',
);

export function CodeHero() {
  return <Code class="w-full" code={welcomeSource} filePath="src/WelcomeAction.tsx" />;
}

type CodeExample = { preview: () => ComponentChildren; code: string };

/** Each demo has one source of truth for its preview text and copyable consumer example. */
export const codeExamples: Record<string, CodeExample> = {
  "source-file": {
    preview: () => (
      <Code class="w-full" code={welcomeSource} filePath="src/actions/WelcomeAction.tsx" />
    ),
    code: exampleSource(welcomeSource, '      filePath="src/actions/WelcomeAction.tsx"'),
  },
  imports: {
    preview: () => (
      <Code
        class="w-full"
        code={importsSource}
        filePath="src/WorkspaceCard.tsx"
        defaultImportsCollapsed
      />
    ),
    code: exampleSource(
      importsSource,
      '      filePath="src/WorkspaceCard.tsx"\n      defaultImportsCollapsed',
    ),
  },
  wrapping: {
    preview: () => <Code class="w-full" code={wrappedSource} language="tsx" defaultWrapped />,
    code: exampleSource(wrappedSource, '      language="tsx"\n      defaultWrapped'),
  },
  terminal: {
    preview: () => (
      <Code
        class="w-full"
        code="pnpm add @kamod-ch/ui preact @preact/signals @kamod-ch/themes"
        language="bash"
        defaultWrapped
      />
    ),
    code: exampleSource(
      "pnpm add @kamod-ch/ui preact @preact/signals @kamod-ch/themes",
      '      language="bash"\n      defaultWrapped',
    ),
  },
  data: {
    preview: () => <Code class="w-full" code={dataSource} filePath="workspace.json" />,
    code: exampleSource(dataSource, '      filePath="workspace.json"'),
  },
  styles: {
    preview: () => <Code class="w-full" code={stylesSource} filePath="src/workspace.css" />,
    code: exampleSource(stylesSource, '      filePath="src/workspace.css"'),
  },
  appearance: {
    preview: () => (
      <div class="grid w-full gap-4">
        {(["default", "subtle", "outline"] as const).map((variant) => (
          <Code
            key={variant}
            code={surfaceSource}
            language="typescript"
            variant={variant}
            toolbarContent={<span class="text-sm font-medium capitalize">{variant}</span>}
            showWrapControl={false}
          />
        ))}
      </div>
    ),
    code: `import { Code } from "@kamod-ch/ui/code";

const source = 'const label = "A small, useful example";';

export function CodeSurfaces() {
  return (
    <div class="grid gap-4">
      {(["default", "subtle", "outline"] as const).map((variant) => (
        <Code
          key={variant}
          code={source}
          language="typescript"
          variant={variant}
          toolbarContent={<span class="text-sm font-medium capitalize">{variant}</span>}
          showWrapControl={false}
        />
      ))}
    </div>
  );
}`,
  },
  toolbar: {
    preview: () => (
      <Code
        class="w-full"
        code={toolbarSource}
        language="typescript"
        showWrapControl={false}
        renderToolbar={(actions) => (
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div class="flex min-w-0 items-center gap-2 text-sm">
              <strong class="font-semibold">Workspace defaults</strong>
              <span class="text-muted-foreground" aria-hidden="true">
                ·
              </span>
              <span class="text-muted-foreground">Start here</span>
            </div>
            {actions}
          </div>
        )}
      />
    ),
    code: `import { Code } from "@kamod-ch/ui/code";

const source = ${JSON.stringify(toolbarSource)};

export function WorkspaceDefaults() {
  return (
    <Code
      code={source}
      language="typescript"
      showWrapControl={false}
      renderToolbar={(actions) => (
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div class="flex min-w-0 items-center gap-2 text-sm">
            <strong class="font-semibold">Workspace defaults</strong>
            <span class="text-muted-foreground" aria-hidden="true">·</span>
            <span class="text-muted-foreground">Start here</span>
          </div>
          {actions}
        </div>
      )}
    />
  );
}`,
  },
  document: {
    preview: () => (
      <Code
        class="w-full"
        code={markdownSource}
        filePath="workspace-brief.md"
        renderedContent={
          <article class="space-y-3 p-5 text-sm leading-relaxed">
            <h3 class="text-lg font-semibold">A workspace worth sharing</h3>
            <p>
              Start with <strong>one useful screen</strong> and keep the first action clear.
            </p>
            <ol class="list-decimal space-y-1 pl-5">
              <li>Name the workspace.</li>
              <li>Choose who can join.</li>
              <li>Save the preferences.</li>
            </ol>
            <p>
              Keep the integration small: connect <code>onSubmit</code> when your app is ready.
            </p>
          </article>
        }
      />
    ),
    code: `import { Code } from "@kamod-ch/ui/code";

const source = ${JSON.stringify(markdownSource)};

export function WorkspaceBrief() {
  return (
    <Code
      code={source}
      filePath="workspace-brief.md"
      renderedContent={
        <article class="space-y-3 p-5 text-sm leading-relaxed">
          <h3 class="text-lg font-semibold">A workspace worth sharing</h3>
          <p>Start with <strong>one useful screen</strong> and keep the first action clear.</p>
          <ol class="list-decimal space-y-1 pl-5">
            <li>Name the workspace.</li>
            <li>Choose who can join.</li>
            <li>Save the preferences.</li>
          </ol>
          <p>Keep the integration small: connect <code>onSubmit</code> when your app is ready.</p>
        </article>
      }
    />
  );
}`,
  },
  literal: {
    preview: () => (
      <Code
        class="w-full"
        code={literalSource}
        language="text"
        inferLanguage={false}
        toolbarContent={<span class="text-sm font-medium">Build report</span>}
      />
    ),
    code: exampleSource(
      literalSource,
      '      language="text"\n      inferLanguage={false}\n      toolbarContent={<span class="text-sm font-medium">Build report</span>}',
    ),
  },
};
