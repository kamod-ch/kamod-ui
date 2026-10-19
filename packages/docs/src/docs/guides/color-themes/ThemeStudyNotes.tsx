import {
  CheckIcon,
  ChevronDownIcon,
  ListChecksIcon,
  MousePointerClickIcon,
} from "@kamod-ch/icons/lucide";
import { presetDesignNotes } from "./preset-design-notes";
import { presetExercises } from "./preset-exercises";
import type { presetStudies } from "./preset-studies";

/** Preserve the practical guidance without making every visual comparison a long read. */
export function ThemeStudyNotes({ study }: { study: (typeof presetStudies)[number] }) {
  const notes = presetDesignNotes[study.id];
  const exercise = presetExercises[study.id];
  return (
    <details class="theme-study-notes">
      <summary>
        <span>
          <ListChecksIcon size={14} aria-hidden="true" />
          Design notes &amp; practical checks
        </span>
        <ChevronDownIcon size={14} aria-hidden="true" />
      </summary>
      <div class="theme-study-notes-content">
        <p class="theme-study-intro">{study.palette}</p>
        <div class="theme-study-observations">
          <section>
            <h4>In light &amp; dark</h4>
            <p>{study.schemes}</p>
          </section>
          <section>
            <h4>Put it to work</h4>
            <p>{study.application}</p>
          </section>
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
          <p>{study.review}</p>
        </div>
      </div>
    </details>
  );
}
