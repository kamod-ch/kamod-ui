import { CheckIcon, PaletteIcon } from "@kamod-ch/icons/lucide";
import { setThemePreset } from "@kamod-ch/themes";
import { Button, Card } from "@kamod-ch/ui";
import { useLayoutEffect, useState } from "preact/hooks";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { useSiteThemePreset } from "../../../theme/useSiteThemePreset";
import { CodeBlock } from "../../components/CodeBlock";
import { StateIcon } from "../../components/StateIcon";
import { presetStudies, presetStudyId } from "./preset-studies";
import { ThemePalettePreview } from "./ThemePalettePreview";
import "./color-themes.css";

const scopedPaletteExample = `<section data-theme-scope="" data-theme="ocean" class="dark">
  <div class="rounded-lg bg-card p-4 text-card-foreground">
    A local Ocean card, independent of the page’s color tokens.
  </div>
</section>`;

/** Compare the shipped palettes without changing the page until a reader chooses one. */
export function ColorThemeGallery() {
  const current = useSiteThemePreset();
  const [ready, setReady] = useState(false);
  // Keep the initial client attributes identical to SSR; resolve saved selection before paint.
  useLayoutEffect(() => setReady(true), []);
  return (
    <div class="theme-studies">
      {presetStudies.map(({ id, label, character, palette, schemes, application, review }) => {
        const selected = ready && id === current;
        return (
          <Card
            key={id}
            size="sm"
            class="theme-study"
            role="group"
            aria-labelledby={presetStudyId(id)}
          >
            <div class="theme-study-header">
              <div>
                <p class="theme-study-character">{character}</p>
                <h3 id={presetStudyId(id)} tabIndex={-1}>
                  <BlockHeadingLink id={presetStudyId(id)}>{label}</BlockHeadingLink>
                  <code>{id}</code>
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="theme-study-use"
                aria-label={`Use ${label} theme on this page`}
                aria-pressed={selected}
                onClick={() => setThemePreset(id)}
              >
                <StateIcon active={selected ? 1 : 0}>
                  {[<PaletteIcon size={14} />, <CheckIcon size={14} />]}
                </StateIcon>
                {selected ? "In use" : "Use theme"}
              </Button>
            </div>
            <p class="theme-study-intro">{palette}</p>
            <div class="theme-study-comparison">
              <ThemePalettePreview preset={id} scheme="light" />
              <ThemePalettePreview preset={id} scheme="dark" />
            </div>
            <dl class="theme-study-guidance">
              <div>
                <dt>Light → dark</dt>
                <dd>{schemes}</dd>
              </div>
              <div>
                <dt>Put it to work</dt>
                <dd>{application}</dd>
              </div>
              <div>
                <dt>What to check</dt>
                <dd>{review}</dd>
              </div>
            </dl>
          </Card>
        );
      })}
      <div class="block-guide-prose theme-study-page-guide">
        <h3 id="themes-on-this-page" tabIndex={-1}>
          <BlockHeadingLink id="themes-on-this-page">How Themes Work on This Page</BlockHeadingLink>
        </h3>
        <p>
          <strong>One preset, two appearances.</strong> The navbar picker and each “Use theme”
          button change the documentation’s preset. They keep your current Light, Dark or System
          preference; choosing Ocean does not force dark mode. The preset is saved as{" "}
          <code>theme-preset</code>, while a manual scheme uses <code>theme</code>. System follows
          the device rather than saving a fixed light/dark value. See the{" "}
          <a href={withBasePath("/docs/theming/api-reference#storage-and-initial-appearance")}>
            Storage and Initial Appearance Reference
          </a>{" "}
          for the full contract.
        </p>
        <p>
          <strong>These studies stay fixed.</strong> Each pair uses the real preset CSS in a local{" "}
          <code>data-theme-scope</code>, with an explicit light or dark class. Changing the page
          does not recolor the comparison. The same miniature layout and neutral type keep the
          comparison focused on surface, action and feedback roles. The six labeled swatches show
          actual role values, not a list of every color in the preset; a swatch may blend into a
          neighboring surface by design.
        </p>
        <CodeBlock
          code={scopedPaletteExample}
          language="tsx"
          filePath="src/components/PaletteStudy.tsx"
        />
        <p>
          The full theme stylesheet resets inherited color roles at this explicit scope. It does not
          create another saved preference or isolate every CSS rule: typography, ancestor-based dark
          utilities and overlays mounted outside the wrapper need their own consideration. This
          example uses semantic surface tokens directly. See{" "}
          <a href={withBasePath("/docs/theming/api-reference#choose-the-theme-target")}>
            Choose the Theme Target
          </a>{" "}
          before connecting runtime controls to a custom wrapper.
        </p>
        <p>
          <strong>Live examples have their own controls.</strong> A showcase’s preview picker
          applies to its preview, not to the documentation or your saved page preference. Resetting
          a preview restores that example’s state. This gallery’s buttons explicitly apply to the
          page. See{" "}
          <a href={withBasePath("/blocks/theming#distinguish-preview-settings-from-app-settings")}>
            Preview Settings and App Settings
          </a>{" "}
          before carrying a preview’s local appearance into an application.
        </p>
        <p>
          <strong>The preset is a starting point.</strong> Some presets declare font stacks or a
          radius as well as colors. Font names do not download font files, and any application
          override can change the result. This documentation uses built-in system fonts across
          palettes to keep text visible and stable without font downloads. These examples show the
          shipped color tokens, not a contrast certification for every combination. Compare real
          text, focus, disabled and error states, then follow{" "}
          <a href={withBasePath("/docs/theming/token-overrides#customize-a-preset-with-tokens")}>
            Customize a Preset
          </a>{" "}
          and the{" "}
          <a href={withBasePath("/docs/theming/accessibility#finish-with-a-theme-review")}>
            Theme Review
          </a>{" "}
          rather than duplicating the setup here.
        </p>
      </div>
    </div>
  );
}
