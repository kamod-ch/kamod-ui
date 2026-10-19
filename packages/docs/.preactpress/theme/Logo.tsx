/** @jsxImportSource preact */
import { KamodProductLogo } from "@kamod-ch/brand";
import type { FunctionalComponent } from "preact";

interface LogoProps {
  class?: string;
  label?: string;
  base?: string;
}

const Logo: FunctionalComponent<LogoProps> = ({
  class: className,
  label = "Kamod UI",
  base = "/",
}) => (
  <KamodProductLogo
    base={base}
    class={["kamod-ui-logo", className].filter(Boolean).join(" ")}
    label={label}
    suffix="UI"
  />
);

export default Logo;
