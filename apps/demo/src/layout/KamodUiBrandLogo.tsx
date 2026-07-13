import Logo from "../../.preactpress/theme/Logo";

type KamodUiBrandLogoProps = {
  class?: string;
};

export const KamodUiBrandLogo = ({ class: className }: KamodUiBrandLogoProps) => (
  <Logo label="kamod UI" class={className} />
);
