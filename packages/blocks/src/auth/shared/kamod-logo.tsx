import { type KamodBrandSize, kamodLogoSizeClass } from "./kamod-brand-sizes";
import { kamodLogoDarkUrl, kamodLogoLightUrl } from "./kamod-logo-url";

type KamodLogoProps = {
  class?: string;
  size?: KamodBrandSize;
};

export function KamodLogo({ class: className, size = "md" }: KamodLogoProps) {
  const imgClass = [kamodLogoSizeClass[size], "block object-contain"].join(" ");

  return (
    <span class={["inline-flex shrink-0", className].filter(Boolean).join(" ")} aria-hidden="true">
      <img
        src={kamodLogoLightUrl}
        alt=""
        decoding="async"
        class={[imgClass, "dark:hidden"].join(" ")}
      />
      <img
        src={kamodLogoDarkUrl}
        alt=""
        decoding="async"
        class={[imgClass, "hidden dark:block"].join(" ")}
      />
    </span>
  );
}
