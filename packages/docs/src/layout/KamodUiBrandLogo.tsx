import Logo from "../../.preactpress/theme/Logo";

type KamodUiBrandLogoProps = {
  class?: string;
  label?: string;
};

export const KamodUiBrandLogo = ({
  class: className,
  label = "Kamod UI",
}: KamodUiBrandLogoProps) => <Logo label={label} class={className} />;
