import Logo from "../../.preactpress/theme/Logo";
import { APP_BASE_URL } from "../base-path";

type KamodUiBrandLogoProps = {
  class?: string;
  label?: string;
};

export const KamodUiBrandLogo = ({
  class: className,
  label = "Kamod UI",
}: KamodUiBrandLogoProps) => <Logo label={label} class={className} base={APP_BASE_URL} />;
