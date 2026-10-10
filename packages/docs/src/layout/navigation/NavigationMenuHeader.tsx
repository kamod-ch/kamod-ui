import { XIcon } from "@kamod-ch/icons/lucide";
import { SheetClose, SheetTitle } from "@kamod-ch/ui";
import { KamodUiBrandLogo } from "../KamodUiBrandLogo";

/** Quiet mobile masthead; the close action stays first in the keyboard focus order. */
export function NavigationMenuHeader() {
  return (
    <header class="site-navigation-head">
      <SheetClose
        class="docs-icon-button site-navigation-close"
        aria-label="Close navigation menu"
        data-tooltip="Close navigation"
      >
        <XIcon size={16} aria-hidden="true" />
      </SheetClose>
      <div class="site-navigation-brand">
        <KamodUiBrandLogo />
        <SheetTitle>Explore Kamod</SheetTitle>
      </div>
    </header>
  );
}
