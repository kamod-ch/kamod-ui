import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  CodeIcon,
  InfoIcon,
  MoonIcon,
  SunIcon,
} from "@kamod-ch/icons/lucide";
import { CopyButton, Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui";
import { useEffect, useRef, useState } from "preact/hooks";
import { withBasePath } from "../../../../base-path";
import { BlockHeadingLink } from "../../../../blocks/BlockHeadingLink";
import { observeViewportActivity } from "../../../../layout/runtime/viewport-activity";
import { CodeBlock } from "../../../components/CodeBlock";
import { FileDownloadButton } from "../../../components/file-download/FileDownloadButton";
import { prismInkContrast } from "./prism-contrast";
import { type PrismSpecimenLanguage, prismScopeRecipe, prismSpecimens } from "./prism-specimens";
import {
  type PrismColorToken,
  type PrismThemeDefinition,
  prismThemeId,
  prismThemes,
} from "./prism-theme-catalog";
import "./prism-theme-gallery.css";

const languages = Object.keys(prismSpecimens) as PrismSpecimenLanguage[];

/** A literal ink/canvas comparison is useful evidence, not an accessibility certification. */
function TokenContrast({ token, theme }: { token: PrismColorToken; theme: PrismThemeDefinition }) {
  if (token.id === "canvas") return <span>Source canvas</span>;
  const canvas = theme.colors.find((color) => color.id === "canvas")?.value;
  const ratio = canvas && prismInkContrast(token.value, canvas);
  if (typeof ratio !== "number")
    return (
      <span>
        {canvas?.includes("gradient(")
          ? "Gradient canvas · inspect in context"
          : "Contrast needs a resolved solid canvas"}
      </span>
    );
  return (
    <span class="prism-token-contrast" data-low-contrast={ratio < 4.5 || undefined}>
      <strong>{ratio.toFixed(2)}:1</strong> ink / canvas
      {ratio < 4.5 && <span> · Review small text</span>}
    </span>
  );
}

function TokenSwatch({
  token,
  theme,
  selected,
  onSelect,
}: {
  token: PrismColorToken;
  theme: PrismThemeDefinition;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Tooltip class="prism-token-hint">
      <TooltipTrigger asChild>
        <button
          type="button"
          class="prism-token-swatch"
          aria-label={`Inspect ${theme.label} ${token.label.toLowerCase()} color`}
          aria-pressed={selected}
          onClick={onSelect}
        >
          <span class="prism-token-paint" style={{ background: token.value }} aria-hidden="true" />
          <span class="prism-token-name">{token.label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent class="prism-token-tooltip" data-code-help="off" align="center" side="top">
        <strong>{token.label}</strong>
        <code>{token.value}</code>
        <p>{token.description}</p>
        <code class="prism-token-selector">{token.selector}</code>
        {token.inherited && <p>This role inherits the source’s base text color.</p>}
        <TokenContrast token={token} theme={theme} />
        <small>Ink on the saved canvas; token backgrounds and other text effects may differ.</small>
      </TooltipContent>
    </Tooltip>
  );
}

function TokenInspector({ theme }: { theme: PrismThemeDefinition }) {
  const [selected, setSelected] = useState(
    theme.colors.find((token) => token.id === "keyword") ?? theme.colors[0],
  );
  const headingId = `${prismThemeId(theme.id)}-tokens`;
  return (
    <aside class="prism-study-inspector" aria-labelledby={headingId} data-code-help="off">
      <div class="prism-study-row-heading">
        <h5 id={headingId}>
          <BlockHeadingLink id={headingId}>Token palette</BlockHeadingLink>
        </h5>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              class="prism-study-info"
              aria-label={`About ${theme.label} source colors and contrast`}
            >
              <InfoIcon size={13} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent class="prism-token-tooltip" data-code-help="off">
            <strong>Original colors, kept intact</strong>
            <p>
              Values come from the saved upstream stylesheet. Some roles share a rule or inherit the
              text color; the grammar chooses which role appears in each language.
            </p>
            <p>
              Ink / canvas compares sRGB colors. Below 4.5:1 deserves a small-text review;
              backgrounds, opacity and text effects need a separate check in your actual layout.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div class="prism-study-swatches" role="group" aria-label={`${theme.label} source colors`}>
        {theme.colors.map((token) => (
          <TokenSwatch
            key={token.id}
            token={token}
            theme={theme}
            selected={selected.id === token.id}
            onSelect={() => setSelected(token)}
          />
        ))}
      </div>
      <div class="prism-study-token-detail" aria-label={`${theme.label} selected color`}>
        <div class="prism-study-token-value">
          <span
            class="prism-selected-paint"
            style={{ background: selected.value }}
            aria-hidden="true"
          />
          <div>
            <strong>{selected.label}</strong>
            <code>{selected.value}</code>
          </div>
          <CopyButton
            value={selected.value}
            label={`Copy ${theme.label} ${selected.label.toLowerCase()} color`}
            subject={`${selected.label.toLowerCase()} color`}
            iconOnly
          />
        </div>
        <p>{selected.description}</p>
        <code class="prism-token-selector">{selected.selector}</code>
        <div class="prism-study-token-meta">
          <TokenContrast token={selected} theme={theme} />
          {selected.inherited && <span>Inherited text</span>}
        </div>
      </div>
    </aside>
  );
}

/** Keep every destination in the document; highlight only studies the reader approaches. */
export function PrismThemeStudy({ theme, index }: { theme: PrismThemeDefinition; index: number }) {
  const chapter = useRef<HTMLElement>(null);
  const [activated, setActivated] = useState(false);
  const [language, setLanguage] = useState<PrismSpecimenLanguage>("tsx");
  const [showRecipe, setShowRecipe] = useState(false);
  const id = prismThemeId(theme.id);
  const specimen = prismSpecimens[language];
  const recipeId = `${id}-recipe`;
  const sourceId = `${id}-specimen`;
  useEffect(() => {
    if (activated || !chapter.current) return;
    return observeViewportActivity(chapter.current, (active) => {
      if (active) setActivated(true);
    });
  }, [activated]);

  return (
    <section
      ref={chapter}
      class="prism-theme-study"
      aria-labelledby={id}
      data-prism-study={theme.id}
    >
      <header class="prism-study-heading">
        <div>
          <p class="prism-study-eyebrow">
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {theme.mode === "dark" ? (
              <MoonIcon size={11} aria-hidden="true" />
            ) : (
              <SunIcon size={11} aria-hidden="true" />
            )}
            {theme.mode === "dark" ? "Dark canvas" : "Light canvas"}
          </p>
          <h4 id={id} tabIndex={-1}>
            <BlockHeadingLink id={id}>{theme.label}</BlockHeadingLink>
          </h4>
        </div>
        <nav aria-label={`Explore ${theme.label}`}>
          <a href={`#${sourceId}`}>Specimen</a>
          <a href={`#${id}-tokens`}>Colors</a>
          <a href={`#${recipeId}`}>Use palette</a>
        </nav>
      </header>
      <p class="prism-study-direction">{theme.direction}</p>
      <p class="prism-study-usage">{theme.usage}</p>
      <div class="prism-study-workbench">
        <div class="prism-study-preview">
          <div class="prism-study-row-heading">
            <h5 id={sourceId}>
              <BlockHeadingLink id={sourceId}>Read it in context</BlockHeadingLink>
            </h5>
            <div
              class="prism-study-languages"
              role="group"
              aria-label={`${theme.label} specimen language`}
            >
              {languages.map((option) => (
                <button
                  type="button"
                  key={option}
                  aria-pressed={language === option}
                  onClick={() => setLanguage(option)}
                >
                  {prismSpecimens[option].label}
                </button>
              ))}
            </div>
          </div>
          <div data-prism-theme={theme.id} class="prism-study-source">
            <CodeBlock
              class="prism-study-code"
              code={specimen.code}
              language={language}
              filePath={specimen.fileName}
              syntaxTheme="default"
              highlight={activated}
              resolveReference={null}
              readingControls="overflow"
              showImportControl={false}
              defaultWrapped
            />
          </div>
          <p class="prism-study-caption">{specimen.description}</p>
        </div>
        <TokenInspector theme={theme} />
      </div>
      <dl class="prism-study-notes">
        {theme.notes.map((note) => (
          <div key={note.title}>
            <dt>{note.title}</dt>
            <dd>{note.text}</dd>
          </div>
        ))}
      </dl>
      <section class="prism-study-recipe" aria-labelledby={recipeId}>
        <div class="prism-study-row-heading">
          <h5 id={recipeId}>
            <CodeIcon size={13} aria-hidden="true" />
            <BlockHeadingLink id={recipeId}>Use {theme.label}</BlockHeadingLink>
          </h5>
          <a href={withBasePath("/docs/code/code-syntax-presets#code-syntax-presets")}>
            Code guide <ArrowUpRightIcon size={11} aria-hidden="true" />
          </a>
        </div>
        <p>
          Save the scoped CSS beside the example below. Its <code>data-prism-theme</code> boundary
          changes source colors and token effects; Code keeps its layout and controls.
        </p>
        <div class="prism-study-recipe-actions">
          <div class="prism-study-css-actions">
            <CopyButton
              value={theme.css}
              label="Copy scoped CSS"
              subject={`${theme.label} scoped CSS`}
            />
            <FileDownloadButton
              source={theme.css}
              fileName={`prism-${theme.id}.css`}
              mimeType="text/css;charset=utf-8"
              subject={`${theme.label} scoped CSS`}
            />
          </div>
          <button
            type="button"
            class="prism-study-recipe-toggle"
            aria-expanded={showRecipe}
            aria-controls={`${id}-integration`}
            onClick={() => setShowRecipe(!showRecipe)}
          >
            {showRecipe ? "Hide TSX example" : "Show TSX example"}
            <ChevronDownIcon size={13} aria-hidden="true" />
          </button>
        </div>
        <div id={`${id}-integration`} hidden={!showRecipe} class="prism-study-integration">
          {showRecipe && (
            <CodeBlock
              code={prismScopeRecipe(theme.id)}
              language="tsx"
              filePath="ThemedSnippet.tsx"
              highlight={activated}
              resolveReference={null}
              readingControls="overflow"
              showImportControl={false}
              defaultWrapped
            />
          )}
        </div>
        {theme.builtIn && (
          <p class="prism-study-builtin-note">
            Code also includes <code>syntaxTheme="{theme.builtIn}"</code>, a strengthened Kamod
            adaptation. This study and download retain the original upstream colors instead.
          </p>
        )}
      </section>
      <footer class="prism-study-footer">
        <span>
          {theme.author} <span aria-hidden="true">·</span> MIT
        </span>
        <div>
          <a href={theme.source.url}>
            Original CSS <ArrowUpRightIcon size={11} aria-hidden="true" />
          </a>
          <a href="#prism-theme-index">
            All palettes <ArrowUpIcon size={11} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </section>
  );
}

/** All chapters are SSR destinations; only saved source paint is injected, never a live stylesheet. */
export function PrismThemeGallery() {
  return (
    <div class="prism-theme-gallery">
      <style
        dangerouslySetInnerHTML={{ __html: prismThemes.map((theme) => theme.css).join("\n") }}
      />
      {prismThemes.map((theme, index) => (
        <PrismThemeStudy key={theme.id} theme={theme} index={index} />
      ))}
    </div>
  );
}
