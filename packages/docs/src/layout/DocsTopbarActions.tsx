/** Shared theme and repository controls for documentation and block detail pages. */
import { SunMoonIcon } from "@kamod-ch/icons/lucide";
import { ThemeToggle } from "@kamod-ch/ui";
import { ThemePresetSelect } from "../theme/ThemePresetSelect";
import { GithubRepoLink } from "./GithubRepoLink";

export function DocsTopbarActions() {
  return (
    <>
      <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
      <GithubRepoLink />
      <ThemeToggle class="docs-topbar-theme-toggle" aria-label="Toggle color scheme">
        <SunMoonIcon strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </ThemeToggle>
    </>
  );
}
