/** Shared theme and repository controls for documentation and block detail pages. */
import { SunMoonIcon } from "@kamod-ch/icons/lucide";
import { ThemeToggle } from "@kamod-ch/ui";
import { ThemePresetPicker } from "../theme/ThemePresetPicker";
import { GithubRepoLink } from "./GithubRepoLink";

export function DocsTopbarActions() {
  return (
    <>
      <span class="docs-desktop-theme-picker">
        <ThemePresetPicker showLabel />
      </span>
      <ThemeToggle
        class="docs-icon-button docs-topbar-theme-toggle site-icon-button"
        aria-label="Toggle color scheme"
      >
        <SunMoonIcon strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </ThemeToggle>
      <span class="docs-desktop-github">
        <GithubRepoLink />
      </span>
      <span class="docs-mobile-theme-picker">
        <ThemePresetPicker />
      </span>
    </>
  );
}
