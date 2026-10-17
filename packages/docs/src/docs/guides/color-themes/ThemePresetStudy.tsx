import { ArrowUpRightIcon, CheckIcon, PaletteIcon } from "@kamod-ch/icons/lucide";
import { Button, Card } from "@kamod-ch/ui";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { StateIcon } from "../../components/StateIcon";
import { presetDesignNotes } from "./preset-design-notes";
import { presetExercises } from "./preset-exercises";
import { type presetStudies, presetStudyId } from "./preset-studies";
import { ThemePalettePreview } from "./ThemePalettePreview";
import { ThemePresetSignature } from "./ThemePresetSignature";
import { ThemeStudyDetails, ThemeStudyRecipe } from "./ThemeStudyDetails";
import { ThemeStudyNotes } from "./ThemeStudyNotes";

type Study = (typeof presetStudies)[number];

/** A visual-first study; preset colors remain local and longer guidance is opt-in. */
export function ThemePresetStudy({
  study,
  index,
  selected,
  onApply,
}: {
  study: Study;
  index: number;
  selected: boolean;
  onApply: () => void;
}) {
  const { id, label, character } = study;
  const notes = presetDesignNotes[id];
  const exercise = presetExercises[id];
  const file = id === "kamod" ? "tokens.css" : `brands/${id}.css`;
  return (
    <Card size="sm" class="theme-study" role="group" aria-labelledby={presetStudyId(id)}>
      <div class="theme-study-header">
        <div>
          <p class="theme-study-character">
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {character}
          </p>
          <h3 id={presetStudyId(id)} tabIndex={-1}>
            <BlockHeadingLink id={presetStudyId(id)}>{label}</BlockHeadingLink>
            <code>{id}</code>
          </h3>
        </div>
        <div class="theme-study-header-actions">
          <ThemePresetSignature preset={id} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="theme-study-use"
            aria-label={`Use ${label} theme on this page`}
            aria-pressed={selected}
            onClick={onApply}
          >
            <StateIcon active={selected ? 1 : 0}>
              {[<PaletteIcon size={14} />, <CheckIcon size={14} />]}
            </StateIcon>
            {selected ? "In use" : "Use theme"}
          </Button>
        </div>
      </div>
      <div class="theme-study-introduction">
        <p class="theme-study-direction">{notes.direction}</p>
        <ul class="theme-study-fits" aria-label={`Suggested uses for ${label}`}>
          {exercise.fits.map((fit) => (
            <li key={fit}>
              <CheckIcon size={11} aria-hidden="true" />
              {fit}
            </li>
          ))}
        </ul>
      </div>
      <section class="theme-study-color-section" aria-label={`${label} color system`}>
        <div class="theme-study-section-heading">
          <div>
            <h4>
              <PaletteIcon size={14} aria-hidden="true" />
              Color system
            </h4>
            <p>Eight core roles. The same compositions, in both appearances.</p>
          </div>
          <a href={withBasePath("/docs/theming/token-overrides#what-a-theme-token-actually-is")}>
            Token guide <ArrowUpRightIcon size={12} aria-hidden="true" />
          </a>
        </div>
        <div class="theme-study-comparison">
          <ThemePalettePreview preset={id} scheme="light" />
          <ThemePalettePreview preset={id} scheme="dark" />
        </div>
      </section>
      <ThemeStudyDetails notes={notes} />
      <ThemeStudyNotes study={study} />
      <ThemeStudyRecipe id={id} label={label} example={notes.example} />
      <footer class="theme-study-footer">
        <span>2 appearances · 6 compositions · Live theme tokens</span>
        <a href={`https://github.com/kamod-ch/kamod-ui/blob/main/packages/themes/src/${file}`}>
          Read preset CSS <ArrowUpRightIcon size={13} aria-hidden="true" />
        </a>
      </footer>
    </Card>
  );
}
