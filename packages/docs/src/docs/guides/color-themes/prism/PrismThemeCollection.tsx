import {
  ArrowUpRightIcon,
  BookOpenIcon,
  CodeIcon,
  FileTextIcon,
  InfoIcon,
  ShieldCheckIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { AlertCallout, Button, Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../../../base-path";
import { BlockHeadingLink } from "../../../../blocks/BlockHeadingLink";
import { CodeBlock } from "../../../components/CodeBlock";
import { PrismThemeGallery } from "./PrismThemeGallery";
import { prismThemes } from "./prism-theme-catalog";
import { PRISM_COMMUNITY_REVISION, prismSourceRepositories } from "./prism-theme-sources";
import "./prism-theme-collection.css";

const coreSource = prismSourceRepositories.core.url;
const collectionSource = prismSourceRepositories.community.url;
const coreLicense = prismSourceRepositories.core.licenseUrl;
const collectionLicense = prismSourceRepositories.community.licenseUrl;

function SourceAction({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ComponentChildren;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          href={href}
          variant="ghost"
          size="icon-sm"
          class="prism-source-action"
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Keep provenance close to the comparison, with a fuller adaptation path after the studies. */
export function PrismThemeCollection() {
  return (
    <section class="prism-theme-collection" aria-labelledby="prism-color-themes">
      <header class="prism-theme-collection-heading">
        <div>
          <p class="prism-theme-collection-kicker">
            A different layer of color <span aria-hidden="true">·</span> {prismThemes.length} saved
            palettes
          </p>
          <h3 id="prism-color-themes" tabIndex={-1}>
            <BlockHeadingLink id="prism-color-themes">Prism syntax themes</BlockHeadingLink>
          </h3>
        </div>
        <a href="#prism-theme-index">
          Choose a palette <ArrowUpRightIcon size={13} aria-hidden="true" />
        </a>
      </header>
      <p class="prism-theme-collection-lead">
        Give your source its own reading atmosphere. Compare the same TSX, CSS and JSON in every
        palette, inspect the actual token colors, then copy a scoped recipe.{" "}
        <strong>Your application theme stays yours.</strong>
      </p>
      <AlertCallout
        class="prism-source-note"
        title="Made by the Prism community"
        icon={<InfoIcon size={16} />}
        headingLevel={4}
        meta={
          <div class="prism-source-actions">
            <SourceAction
              href={coreSource}
              label="Browse the eight original Prism 1.30 theme stylesheets"
            >
              <BrandGithubIcon size={15} aria-hidden="true" />
            </SourceAction>
            <SourceAction
              href={collectionSource}
              label="Browse the pinned Prism Themes community stylesheets"
            >
              <CodeIcon size={15} aria-hidden="true" />
            </SourceAction>
          </div>
        }
        footer={
          <>
            <a href="#prism-theme-resources">Credits &amp; adaptation notes</a>
            <a href={coreLicense}>Prism license</a>
            <a href={collectionLicense}>Collection license</a>
          </>
        }
      >
        <p>
          These studies credit <a href={coreSource}>Prism’s original themes</a> and the{" "}
          <a href={collectionSource}>Prism Themes collection</a>. Each chapter names its author or
          port and links the exact source. The preview keeps upstream source colors; Kamod owns the
          reader’s spacing, controls and typography. Source files and MIT notices are saved with
          this guide—there is no live theme download.
        </p>
      </AlertCallout>
      <PrismThemeGallery />
      <PrismThemeResources />
    </section>
  );
}

function PrismThemeResources() {
  return (
    <section class="prism-theme-resources" aria-labelledby="prism-theme-resources">
      <header class="prism-theme-resource-heading">
        <div>
          <span class="prism-theme-resource-kicker">Keep the credit. Own the integration.</span>
          <h4 id="prism-theme-resources" tabIndex={-1}>
            <BlockHeadingLink id="prism-theme-resources">
              Sources, credits &amp; your next palette
            </BlockHeadingLink>
          </h4>
        </div>
        <div class="prism-source-actions">
          <SourceAction href="https://prismjs.com/" label="Open Prism’s project documentation">
            <BookOpenIcon size={15} aria-hidden="true" />
          </SourceAction>
          <SourceAction
            href="https://github.com/PrismJS/prism-themes"
            label="Explore the complete Prism Themes repository and its contributors"
          >
            <BrandGithubIcon size={15} aria-hidden="true" />
          </SourceAction>
        </div>
      </header>
      <p class="prism-theme-resource-intro">
        A palette is more than a handful of attractive HEX values. Keep its canvas, token
        distinctions and provenance together, then test it with the source your readers actually
        use.
      </p>
      <AlertCallout
        class="prism-source-note prism-source-record"
        title="A small source record that travels with the colors"
        headingLevel={5}
        icon={<FileTextIcon size={16} />}
      >
        <div class="prism-theme-source-records">
          <section>
            <h6>
              Original Prism themes <span>8 studies</span>
            </h6>
            <p>
              Prism <strong>1.30.0</strong>. The saved files retain their original notices,
              including named authors and the palettes that inspired individual ports.
            </p>
            <div>
              <a href={coreSource}>Pinned stylesheets ↗</a>
              <a href={coreLicense}>MIT notice ↗</a>
            </div>
          </section>
          <section>
            <h6>
              Community Prism Themes <span>16 studies</span>
            </h6>
            <p>
              Saved at revision <code>{PRISM_COMMUNITY_REVISION.slice(0, 8)}</code>. Theme chapters
              identify the port author as well as the original palette author when upstream provides
              both.
            </p>
            <div>
              <a href={collectionSource}>Pinned stylesheets ↗</a>
              <a href={collectionLicense}>MIT notice ↗</a>
            </div>
          </section>
        </div>
        <p class="prism-theme-source-footnote">
          Downloads include the applicable MIT notice. Keep that notice with distributed copies or
          substantial adaptations. The original stylesheet is available separately from the scoped
          Kamod recipe, so you can inspect exactly what changed.
        </p>
      </AlertCallout>
      <div class="prism-theme-resource-grid">
        <section>
          <h5>
            <CodeIcon size={15} aria-hidden="true" />
            Choose your integration
          </h5>
          <p>
            <strong>Already bundled?</strong> Okaidia, Tomorrow, Twilight and Solarized Light have
            supported <code>syntaxTheme</code> values. Those reader adaptations strengthen some
            small-text colors; the exact upstream studies above remain useful for comparison.
          </p>
          <p>
            <strong>Another palette?</strong> Copy its scoped CSS and the matching TSX example. Its{" "}
            <code>data-prism-theme</code> wrapper keeps the colors around the intended reader.
            Community names are not additional built-in IDs. The{" "}
            <a href={withBasePath("/docs/code/installation#code-prism-stylesheet-ports")}>
              stylesheet port guide
            </a>{" "}
            explains token exceptions, source ownership and the cascade.
          </p>
          <CodeBlock
            language="tsx"
            filePath="src/SourceReader.tsx"
            code={
              'import { Code } from "@kamod-ch/ui/code";\n\n// A bundled adaptation; no additional palette CSS.\nexport function SourceReader({ source }: { source: string }) {\n  return <Code code={source} language="tsx" syntaxTheme="tomorrow" />;\n}'
            }
          />
        </section>
        <section>
          <h5>
            <ShieldCheckIcon size={15} aria-hidden="true" />
            Review the whole reading surface
          </h5>
          <p>
            Try comments, plain text, JSX attributes, CSS values and JSON properties at your real
            text size. Some historical source palettes have quiet comments or punctuation; copying
            an exact color is not an accessibility endorsement.
          </p>
          <ul class="prism-theme-review-list">
            <li>
              <strong>Canvas + ink</strong>
              <span>
                Keep the source background with its intended foreground. Check selected text and
                unclassified source too.
              </span>
            </li>
            <li>
              <strong>Color + meaning</strong>
              <span>
                Keep names, punctuation, focus and source links readable without depending on hue
                alone.
              </span>
            </li>
            <li>
              <strong>One reader at a time</strong>
              <span>
                Scope every token rule. Importing several unscoped theme files lets them overwrite
                neighboring readers.
              </span>
            </li>
          </ul>
          <div class="prism-theme-resource-links">
            <a href={withBasePath("/docs/code/installation#code-palette-verification")}>
              Run the palette review ↗
            </a>
            <a href={withBasePath("/docs/theming/accessibility#finish-with-a-theme-review")}>
              Review the application too ↗
            </a>
          </div>
        </section>
      </div>
      <nav class="prism-theme-resource-paths" aria-label="Continue from the Prism theme collection">
        <a href="#prism-theme-index">Compare another palette</a>
        <a href={withBasePath("/docs/code/installation#code-theme-tokens")}>
          Derive syntax from your app
        </a>
        <a href={withBasePath("/docs/theming/token-overrides#work-with-semantic-token-pairs")}>
          Keep semantic colors paired
        </a>
        <a href="#themes-on-this-page">Apply an application theme</a>
      </nav>
    </section>
  );
}
