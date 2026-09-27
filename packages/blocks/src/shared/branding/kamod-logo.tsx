import { cn } from "@kamod-ch/ui";
import { type KamodBrandSize, kamodLogoSizeClass } from "./kamod-brand-sizes";
import { kamodLogoDarkUrl, kamodLogoLightUrl } from "./kamod-logo-url";

type KamodLogoProps = {
  class?: string;
  size?: KamodBrandSize;
};

export function KamodLogo({ class: className, size = "md" }: KamodLogoProps) {
  const imgClass = cn(kamodLogoSizeClass[size], "block object-contain");

  return (
    <span class={cn("inline-flex shrink-0", className)} aria-hidden="true">
      <img src={kamodLogoLightUrl} alt="" decoding="async" class={cn(imgClass, "dark:hidden")} />
      <img
        src={kamodLogoDarkUrl}
        alt=""
        decoding="async"
        class={cn(imgClass, "hidden dark:block")}
      />
    </span>
  );
}
