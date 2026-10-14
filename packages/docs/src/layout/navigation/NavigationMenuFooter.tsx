import { HouseIcon } from "@kamod-ch/icons/lucide";
import { SheetClose } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import { SiteColorSchemeMenu } from "../../theme/SiteColorSchemeMenu";
import { ThemePresetPicker } from "../../theme/ThemePresetPicker";
import { GithubRepoLink } from "../GithubRepoLink";

/** Quiet utilities below the unchanged desktop directory and ecosystem entry. */
export function NavigationMenuFooter() {
  return (
    <footer class="site-navigation-footer">
      <div role="group" aria-label="Site appearance" class="site-navigation-footer-actions">
        <SiteColorSchemeMenu />
        <ThemePresetPicker side="top" />
      </div>
      <nav aria-label="Site shortcuts" class="site-navigation-footer-actions">
        <SheetClose asChild>
          <a href={withBasePath("/")} class="docs-icon-button" aria-label="Go to the homepage">
            <HouseIcon size={16} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </SheetClose>
        <GithubRepoLink />
      </nav>
    </footer>
  );
}
