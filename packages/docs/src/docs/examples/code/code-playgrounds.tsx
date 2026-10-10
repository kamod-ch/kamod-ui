import { Button } from "@kamod-ch/ui/button";
import {
  Code,
  type CodeLanguage,
  type CodeSyntaxTheme,
  codeLanguages,
  codeSyntaxThemes,
  resolveCodeLanguage,
} from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";

const selectClass =
  "min-h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const choiceClass = "flex min-h-10 cursor-pointer items-center gap-2 text-sm";
const checkboxClass = "size-4 shrink-0 accent-primary";

export const playgroundSource = `import { Button } from "@kamod-ch/ui/button";
import type { ComponentChildren } from "preact";

type WelcomeProps = { name: string; children?: ComponentChildren };

// Keep a clear next step within reach.
export function Welcome({ name, children }: WelcomeProps) {
  return <Button aria-label={\`Open the shared workspace for \${name} and review the latest updates\`}>{children ?? "Open workspace"}</Button>;
}`;

export function CodeLanguagePlayground() {
  const [language, setLanguage] = useState<CodeLanguage | "auto">("tsx");
  const resolved =
    language === "auto"
      ? resolveCodeLanguage(playgroundSource, undefined, "src/Welcome.tsx")
      : language;
  return (
    <div class="my-5 min-w-0 space-y-4" data-code-demo="language">
      <label class="grid max-w-sm gap-2 text-sm font-medium">
        Highlighting language
        <select
          class={selectClass}
          value={language}
          onChange={(event) => setLanguage(event.currentTarget.value as CodeLanguage | "auto")}
        >
          <option value="auto">Automatic (file metadata, then source)</option>
          {codeLanguages.map((value) => (
            <option key={value} value={value}>
              {value === "text" ? "text (plain source)" : value}
            </option>
          ))}
        </select>
      </label>
      <p class="text-sm text-muted-foreground" aria-live="polite">
        Selected grammar: <strong class="font-medium text-foreground">{resolved}</strong>. The
        source and copied text stay the same.
      </p>
      <Code
        code={playgroundSource}
        filePath="src/Welcome.tsx"
        language={language === "auto" ? undefined : language}
        inferLanguage={language === "auto"}
        defaultWrapped
      />
    </div>
  );
}

const partLabels = {
  toolbar: "Header",
  file: "File label",
  copy: "Copy action",
  imports: "Import folding",
  wrap: "Wrap control",
  highlight: "Syntax colors",
  notes: "Context before and after source",
} as const;

export function CodePartsPlayground() {
  const [parts, setParts] = useState({
    toolbar: true,
    file: true,
    copy: true,
    imports: true,
    wrap: true,
    highlight: true,
    notes: false,
  });
  return (
    <div class="my-5 min-w-0 space-y-4" data-code-demo="parts">
      <fieldset class="rounded-lg border border-border px-4 pb-3">
        <legend class="px-1 text-sm font-medium">Visible parts</legend>
        <div class="grid gap-x-5 sm:grid-cols-2">
          {(Object.keys(partLabels) as (keyof typeof partLabels)[]).map((part) => (
            <label key={part} class={choiceClass}>
              <input
                class={checkboxClass}
                type="checkbox"
                checked={parts[part]}
                onChange={(event) => {
                  const checked = event.currentTarget.checked;
                  setParts((current) => ({ ...current, [part]: checked }));
                }}
              />
              {partLabels[part]}
            </label>
          ))}
        </div>
      </fieldset>
      <Code
        code={playgroundSource}
        language="tsx"
        filePath={parts.file ? "src/Welcome.tsx" : undefined}
        showToolbar={parts.toolbar}
        showCopy={parts.copy}
        showImportControl={parts.imports}
        showWrapControl={parts.wrap}
        highlight={parts.highlight}
        defaultWrapped
        defaultImportsCollapsed
        beforeCode={
          parts.notes && (
            <p class="m-0 border-b border-border px-4 py-3 text-sm text-muted-foreground">
              A reusable action for the workspace header.
            </p>
          )
        }
        afterCode={
          parts.notes && (
            <p class="m-0 border-t border-border px-4 py-3 text-sm text-muted-foreground">
              Copy includes every import. These notes stay on the page.
            </p>
          )
        }
      />
    </div>
  );
}

export function CodePreferencesPlayground() {
  const [wrapped, setWrapped] = useState(true);
  const [importsCollapsed, setImportsCollapsed] = useState(false);
  return (
    <div class="my-5 min-w-0 space-y-4" data-code-demo="preferences">
      <fieldset class="rounded-lg border border-border px-4 pb-3">
        <legend class="px-1 text-sm font-medium">Shared reading preferences</legend>
        <div class="flex flex-wrap gap-x-6">
          <label class={choiceClass}>
            <input
              class={checkboxClass}
              type="checkbox"
              checked={wrapped}
              onChange={(event) => setWrapped(event.currentTarget.checked)}
            />
            Wrap source lines
          </label>
          <label class={choiceClass}>
            <input
              class={checkboxClass}
              type="checkbox"
              checked={importsCollapsed}
              onChange={(event) => setImportsCollapsed(event.currentTarget.checked)}
            />
            Collapse imports
          </label>
        </div>
      </fieldset>
      <Code
        code={playgroundSource}
        filePath="src/Welcome.tsx"
        wrapped={wrapped}
        onWrappedChange={setWrapped}
        importsCollapsed={importsCollapsed}
        onImportsCollapsedChange={setImportsCollapsed}
      />
    </div>
  );
}

export function CodeControlSlotsPlayground() {
  return (
    <div class="my-5 min-w-0" data-code-demo="controls">
      <Code
        code={playgroundSource}
        filePath="src/Welcome.tsx"
        defaultWrapped
        renderImportControl={({ codeId, collapsed, count, onCollapsedChange }) => (
          <Button
            type="button"
            variant="ghost"
            aria-controls={codeId}
            aria-expanded={!collapsed}
            onClick={() => onCollapsedChange(!collapsed)}
          >
            {collapsed ? "Show" : "Hide"} {count} imports
          </Button>
        )}
        renderWrapControl={({ codeId, wrapped, onWrappedChange }) => (
          <Button
            type="button"
            variant="outline"
            aria-controls={codeId}
            aria-pressed={wrapped}
            onClick={() => onWrappedChange(!wrapped)}
          >
            Wrap {wrapped ? "on" : "off"}
          </Button>
        )}
        renderCopyAction={({ defaultControl }) => (
          <span class="inline-flex" title="Copy the complete source, including folded imports">
            {defaultControl}
          </span>
        )}
      />
    </div>
  );
}

export function CodeThemePlayground() {
  const [syntaxTheme, setSyntaxTheme] = useState<CodeSyntaxTheme>("default");
  const [variant, setVariant] = useState<"default" | "subtle" | "outline">("default");
  const [roomier, setRoomier] = useState(false);
  return (
    <div class="my-5 min-w-0 space-y-4" data-code-demo="theme">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="grid gap-2 text-sm font-medium">
          Syntax palette
          <select
            class={selectClass}
            value={syntaxTheme}
            onChange={(event) => setSyntaxTheme(event.currentTarget.value as CodeSyntaxTheme)}
          >
            {codeSyntaxThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>
        <label class="grid gap-2 text-sm font-medium">
          Code surface
          <select
            class={selectClass}
            value={variant}
            onChange={(event) =>
              setVariant(event.currentTarget.value as "default" | "subtle" | "outline")
            }
          >
            <option value="default">default</option>
            <option value="subtle">subtle</option>
            <option value="outline">outline</option>
          </select>
        </label>
      </div>
      <label class={choiceClass}>
        <input
          class={checkboxClass}
          type="checkbox"
          checked={roomier}
          onChange={(event) => setRoomier(event.currentTarget.checked)}
        />
        Roomier source typography
      </label>
      <Code
        code={playgroundSource}
        filePath="src/Welcome.tsx"
        syntaxTheme={syntaxTheme}
        variant={variant}
        defaultWrapped
        style={roomier ? "--kamod-code-font-size: 0.9375rem; --kamod-code-line-height: 1.9;" : ""}
      />
    </div>
  );
}
