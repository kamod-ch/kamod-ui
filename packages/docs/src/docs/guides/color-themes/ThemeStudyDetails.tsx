import { ChevronDownIcon, CodeIcon, TypeIcon } from "@kamod-ch/icons/lucide";
import type { ThemePresetId } from "@kamod-ch/themes";
import { useState } from "preact/hooks";
import { withBasePath } from "../../../base-path";
import { CodeBlock } from "../../components/CodeBlock";
import type { PresetDesignNotes } from "./preset-design-notes";

/** A small, copyable composition; appearance stays explicit instead of changing the document. */
export const presetScopeSnippet = (
  id: ThemePresetId,
  example: string,
) => `<section data-theme-scope="" data-theme="${id}" class="light">
  <div class="rounded-lg border border-border bg-card p-4 text-card-foreground">
    <h2 class="font-semibold">${example}</h2>
    <p class="mt-2 text-sm text-muted-foreground">
      One shared palette, applied through component roles.
    </p>
  </div>
</section>`;

/** Keep typography declarations and corner guidance separate from the native-font sketches. */
export function ThemeStudyDetails({ notes }: { notes: PresetDesignNotes }) {
  return (
    <div class="theme-study-materials">
      <section>
        <h4>
          <TypeIcon size={14} aria-hidden="true" />
          Type direction
        </h4>
        <dl class="theme-study-fonts">
          {[
            ["Body", notes.type.body],
            ["Display", notes.type.display],
            ["Mono", notes.type.mono],
          ].map(([role, name]) => (
            <div key={role}>
              <dt>{role}</dt>
              <dd>{name}</dd>
            </div>
          ))}
        </dl>
        <details class="theme-study-advice">
          <summary>
            Notes on typography <ChevronDownIcon size={13} aria-hidden="true" />
          </summary>
          <p>{notes.type.advice}</p>
        </details>
      </section>
      <section class="theme-study-shape" style={{ "--study-radius": notes.radius }}>
        <h4>
          Shape &amp; rhythm <code>{notes.radius}</code>
        </h4>
        <div class="theme-study-corners" aria-label={`Radius family based on ${notes.radius}`}>
          <span>sm</span>
          <span>lg</span>
          <span>xl</span>
        </div>
        <details class="theme-study-advice">
          <summary>
            Notes on shape <ChevronDownIcon size={13} aria-hidden="true" />
          </summary>
          <p>{notes.shape}</p>
        </details>
      </section>
    </div>
  );
}

/** Mount a source reader only when requested; closed studies need no highlighting observers. */
export function ThemeStudyRecipe({
  id,
  label,
  example,
}: {
  id: ThemePresetId;
  label: string;
  example: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <details class="theme-study-recipe" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>
        <span>
          <CodeIcon size={14} aria-hidden="true" />
          Try {label} in your app
          <small class="theme-study-recipe-format">TSX</small>
        </span>
        <ChevronDownIcon size={14} aria-hidden="true" />
      </summary>
      {open && (
        <div class="theme-study-recipe-content">
          <p>
            Inside a component’s return, scope this palette to a small region. Keep your{" "}
            <a href={withBasePath("/docs/theming/css-setup#choose-a-theme-entry")}>
              full theme stylesheet
            </a>{" "}
            at the app entry. Change <code>light</code> to <code>dark</code> for the other
            appearance; this wrapper does not save a page preference.
          </p>
          <CodeBlock code={presetScopeSnippet(id, example)} language="tsx" />
        </div>
      )}
    </details>
  );
}
