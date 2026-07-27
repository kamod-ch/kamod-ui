import type { KamodBrandSize } from "./kamod-brand-sizes";
import { KamodLogo } from "./kamod-logo";

type KamodBrandLinkProps = {
  href?: string;
  class?: string;
  size?: KamodBrandSize;
};

export function KamodBrandLink({ href = "#", class: className, size = "md" }: KamodBrandLinkProps) {
  return (
    <a
      href={href}
      class={["inline-flex items-center", className].filter(Boolean).join(" ")}
      aria-label="Kamod home"
    >
      <KamodLogo size={size} />
    </a>
  );
}
