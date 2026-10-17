import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import type { ThemePresetId } from "@kamod-ch/themes";
import { presetDesignNotes } from "./preset-design-notes";
import { presetStudyId } from "./preset-studies";

/** CSS selects the page appearance; local scopes keep every preset independent and SSR-stable. */
export function ThemePresetPill({ id, label }: { id: ThemePresetId; label: string }) {
  // The docs normalize global font tokens; this small specimen opts into the declared family.
  const family = presetDesignNotes[id].type.family;
  const fallback = "var(--docs-font-sans, system-ui, sans-serif)";
  return (
    <a class="theme-preset-pill" href={`#${presetStudyId(id)}`} aria-label={label}>
      {(["light", "dark"] as const).map((scheme) => (
        <span
          key={scheme}
          class={`theme-preset-pill-paint theme-preset-pill-${scheme} ${scheme}`}
          data-theme-scope=""
          data-theme={id}
          style={{ fontFamily: family ? `${family}, ${fallback}` : fallback }}
          aria-hidden="true"
        >
          <span class="theme-preset-pill-colors">
            {["primary", "secondary", "accent"].map((role) => (
              <i key={role} style={{ background: `var(--${role})` }} />
            ))}
          </span>
          <span class="theme-preset-pill-label">{label}</span>
          <ArrowUpRightIcon class="theme-preset-pill-arrow" size={13} />
        </span>
      ))}
    </a>
  );
}
