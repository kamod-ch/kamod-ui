import {
  ArrowUpRightIcon,
  CheckIcon,
  ListChecksIcon,
  MousePointerClickIcon,
  PaletteIcon,
} from "@kamod-ch/icons/lucide";
import { Button, Card } from "@kamod-ch/ui";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { StateIcon } from "../../components/StateIcon";
import { presetDesignNotes } from "./preset-design-notes";
import { presetExercises } from "./preset-exercises";
import { type presetStudies, presetStudyId } from "./preset-studies";
import { ThemePalettePreview } from "./ThemePalettePreview";
import { ThemePresetSignature } from "./ThemePresetSignature";
import { ThemeStudyDetails, ThemeStudyRecipe } from "./ThemeStudyDetails";

type Study = (typeof presetStudies)[number];

/** A compact study with local palette washes and four independent composition sketches. */
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
  const { id, label, character, palette, schemes, application, review } = study;
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
      <div class="theme-study-overview">
        <div class="theme-study-introduction">
          <p class="theme-study-direction">{notes.direction}</p>
          <p class="theme-study-intro">{palette}</p>
          <ul class="theme-study-fits" aria-label={`Suggested uses for ${label}`}>
            {exercise.fits.map((fit) => (
              <li key={fit}>{fit}</li>
            ))}
          </ul>
        </div>
        <div class="theme-study-comparison">
          <ThemePalettePreview preset={id} scheme="light" />
          <ThemePalettePreview preset={id} scheme="dark" />
        </div>
      </div>
      <div class="theme-study-guidance">
        <div class="theme-study-observations">
          <section>
            <h4>In light &amp; dark</h4>
            <p>{schemes}</p>
          </section>
          <section>
            <h4>Put it to work</h4>
            <p>{application}</p>
          </section>
        </div>
      </div>
      <section class="theme-study-principles">
        <h4>Small choices, big difference</h4>
        <ol>
          {notes.principles.map(({ title, text, roles }, position) => (
            <li key={title}>
              <span class="theme-study-note-number" aria-hidden="true">
                {position + 1}
              </span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
                <div class="theme-study-note-roles">
                  {roles.map((role) => (
                    <code key={role}>{role}</code>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <ThemeStudyDetails notes={notes} />
      <section class="theme-study-practice">
        <div>
          <h4>
            <MousePointerClickIcon size={14} aria-hidden="true" />
            Try a real task
          </h4>
          <strong>{exercise.title}</strong>
        </div>
        <p>{exercise.task}</p>
        <p class="theme-study-practice-check">
          <CheckIcon size={13} aria-hidden="true" />
          <span>{exercise.check}</span>
        </p>
      </section>
      <div class="theme-study-review">
        <strong>
          <ListChecksIcon size={14} aria-hidden="true" />
          Before you ship
        </strong>
        <p>{review}</p>
      </div>
      <ThemeStudyRecipe id={id} label={label} example={notes.example} />
      <footer class="theme-study-footer">
        <span>2 appearances · 4 compositions · Shared semantic roles</span>
        <a href={`https://github.com/kamod-ch/kamod-ui/blob/main/packages/themes/src/${file}`}>
          Read preset CSS <ArrowUpRightIcon size={13} aria-hidden="true" />
        </a>
      </footer>
    </Card>
  );
}
