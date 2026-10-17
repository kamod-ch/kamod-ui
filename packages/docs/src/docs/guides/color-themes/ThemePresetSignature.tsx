import type { ThemePresetId } from "@kamod-ch/themes";

/** Real preset tokens supply both the color signature and the faint wash behind the study. */
export function ThemePresetSignature({ preset }: { preset: ThemePresetId }) {
  return (
    <span class="theme-study-signatures" aria-hidden="true">
      {(["light", "dark"] as const).map((scheme) => (
        <span
          key={scheme}
          class={`theme-study-signature theme-study-signature-${scheme} ${scheme}`}
          data-theme-scope=""
          data-theme={preset}
        >
          <i class="theme-study-wash" />
          {["primary", "secondary", "accent"].map((role) => (
            <i key={role} style={{ background: `var(--${role})` }} />
          ))}
        </span>
      ))}
    </span>
  );
}
