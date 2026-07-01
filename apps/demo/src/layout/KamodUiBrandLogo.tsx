import logoDark from "../assets/logo-kamod-ui-dark.svg";
import logoLight from "../assets/logo-kamod-ui-light.svg";

type KamodUiBrandLogoProps = {
  class?: string;
};

export const KamodUiBrandLogo = ({ class: className }: KamodUiBrandLogoProps) => (
  <>
    <img
      src={logoDark}
      alt="kamod | UI"
      class={["docs-topbar-brand-logo", "docs-topbar-brand-logo--light-theme", className]
        .filter(Boolean)
        .join(" ")}
    />
    <img
      src={logoLight}
      alt=""
      aria-hidden="true"
      class={["docs-topbar-brand-logo", "docs-topbar-brand-logo--dark-theme", className]
        .filter(Boolean)
        .join(" ")}
    />
  </>
);
