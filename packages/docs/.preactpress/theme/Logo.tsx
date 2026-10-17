/** @jsxImportSource preact */
import { KamodIcon } from "@kamod-ch/brand";
import type { FunctionalComponent } from "preact";

interface LogoProps {
  class?: string;
  label?: string;
  base?: string;
}

/** Preserve the official symbol while letting the wordmark follow the active site theme. */
const Logo: FunctionalComponent<LogoProps> = ({
  class: className,
  label = "Kamod UI",
  base = "/",
}) => (
  <span
    class={["kamod-ui-logo", className].filter(Boolean).join(" ")}
    role="img"
    aria-label={label}
  >
    <KamodIcon base={base} />
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
