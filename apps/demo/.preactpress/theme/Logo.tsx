import type { FunctionalComponent } from "preact";
import { withBasePath } from "../../src/base-path";

interface LogoProps {
  class?: string;
  label?: string;
}

const Logo: FunctionalComponent<LogoProps> = ({ class: className, label = "kamod UI" }) => (
  <>
    <img
      src={withBasePath("/logo-kamod-ui-dark.svg")}
      alt={label}
      class={["ku-logo", "ku-logo--light-theme", className].filter(Boolean).join(" ")}
      decoding="async"
    />
    <img
      src={withBasePath("/logo-kamod-ui-light.svg")}
      alt=""
      aria-hidden="true"
      class={["ku-logo", "ku-logo--dark-theme", className].filter(Boolean).join(" ")}
      decoding="async"
    />
  </>
);

export default Logo;
