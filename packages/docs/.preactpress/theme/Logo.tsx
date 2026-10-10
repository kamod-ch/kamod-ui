import { KamodIcon } from "@kamod-ch/brand";
import type { FunctionalComponent } from "preact";
import { withBasePath } from "../../src/base-path";

interface LogoProps {
  class?: string;
  label?: string;
}

/** Preserve the official symbol while letting the wordmark follow the active site theme. */
const Logo: FunctionalComponent<LogoProps> = ({ class: className, label = "Kamod UI" }) => (
  <span
    class={["kamod-ui-logo", className].filter(Boolean).join(" ")}
    role="img"
    aria-label={label}
  >
    <KamodIcon resolveAsset={withBasePath} />
    <span class="kamod-ui-logo-wordmark" aria-hidden="true">
      kamod
    </span>
    <span class="kamod-ui-logo-dot" aria-hidden="true" />
    <span class="kamod-ui-logo-product" aria-hidden="true">
      UI
    </span>
  </span>
);

export default Logo;
