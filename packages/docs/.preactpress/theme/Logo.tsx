import { KamodProductLogo } from "@kamod-ch/brand";
import type { FunctionalComponent } from "preact";
import { withBasePath } from "../../src/base-path";

interface LogoProps {
  class?: string;
  label?: string;
}

const Logo: FunctionalComponent<LogoProps> = ({ class: className, label = "Kamod UI" }) => (
  <KamodProductLogo class={className} label={label} suffix="UI" resolveAsset={withBasePath} />
);

export default Logo;
