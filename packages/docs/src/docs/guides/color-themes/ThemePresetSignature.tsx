import type { ThemePresetId } from "@kamod-ch/themes";

/** A small signature uses the actual preset without painting a card behind the page chapter. */
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
          {["primary", "secondary", "accent"].map((role) => (
            <i key={role} style={{ background: `var(--${role})` }} />
          ))}
        </span>
      ))}
    </span>
  );
}
