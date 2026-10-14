/** Shared theme and repository controls for documentation and block detail pages. */
import { SiteColorSchemeMenu } from "../theme/SiteColorSchemeMenu";
import { ThemePresetPicker } from "../theme/ThemePresetPicker";
import { GithubRepoLink } from "./GithubRepoLink";

export function DocsTopbarActions() {
  return (
    <>
      <span class="docs-desktop-theme-picker">
        <ThemePresetPicker showLabel />
      </span>
      <SiteColorSchemeMenu />
      <span class="docs-desktop-github">
        <GithubRepoLink />
      </span>
      <span class="docs-mobile-theme-picker">
        <ThemePresetPicker />
      </span>
    </>
  );
}
