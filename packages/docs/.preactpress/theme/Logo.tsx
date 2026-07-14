import type { FunctionalComponent } from "preact";
import { withBasePath } from "../../src/base-path";

interface LogoProps {
  class?: string;
  label?: string;
}

const Logo: FunctionalComponent<LogoProps> = ({ class: className, label = "Kamod UI" }) => (
  <span class={["ku-logo", className].filter(Boolean).join(" ")} aria-label={label}>
    <span class="ku-logo__kamod-wrap" aria-hidden="true">
      <img
        src={withBasePath("/logo-kamod-dark.svg")}
        alt=""
        class="ku-logo__kamod ku-logo__kamod--light"
        decoding="async"
      />
      <img
        src={withBasePath("/logo-kamod-light.svg")}
        alt=""
        class="ku-logo__kamod ku-logo__kamod--dark"
        decoding="async"
      />
    </span>
    <span class="ku-logo__ui" aria-hidden="true">
      UI
    </span>
  </span>
);

export default Logo;
