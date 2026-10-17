import { Button } from "@kamod-ch/ui/button";
import {
  type CodeLanguage,
  type CodeSyntaxTheme,
  codeLanguages,
  codeSyntaxThemes,
  resolveCodeLanguage,
} from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";
import { ReferenceCode as Code } from "../../../references/ReferenceCode";

import { syntaxThemeLabels } from "./code-syntax-catalog";

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
        source stays the same.
      </p>
      <Code
        readingControls="overflow"
        code={playgroundSource}
        filePath="src/Welcome.tsx"
        language={language === "auto" ? undefined : language}
        inferLanguage={language === "auto"}
        showToolbar={false}
        showImportControl={false}
        showWrapControl={false}
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
        readingControls="overflow"
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
        readingControls="overflow"
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
  const [syntaxTheme, setSyntaxTheme] = useState<CodeSyntaxTheme>("okaidia");
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
                {syntaxThemeLabels[theme]}
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
        readingControls="overflow"
        code={playgroundSource}
        filePath="src/Welcome.tsx"
        syntaxTheme={syntaxTheme}
        variant={variant}
        showImportControl={false}
        showWrapControl={false}
        defaultWrapped
        style={roomier ? "--kamod-code-font-size: 0.9375rem; --kamod-code-line-height: 1.9;" : ""}
      />
    </div>
  );
}
