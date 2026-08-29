import { BoxesIcon } from "@kamod-ch/icons/lucide";
import { cn } from "@kamod-ch/ui";
import type { MarketingIcon } from "./types";

export type BrandMarkProps = {
  name?: string;
  icon?: MarketingIcon;
  href?: string;
  class?: string;
  size?: "sm" | "md";
};

export const BrandMark = ({
  name = "Acme",
  icon: Icon = BoxesIcon,
  href = "#",
  class: className,
  size = "md",
}: BrandMarkProps) => {
  const iconBox = size === "sm" ? "size-7" : "size-8";
  const iconSize = size === "sm" ? 14 : 16;
  return (
    <a href={href} class={cn("flex items-center gap-2", className)}>
      <span
        class={cn(
          "flex items-center justify-center rounded-md bg-primary text-primary-foreground",
          iconBox,
        )}
      >
        <Icon size={iconSize} />
      </span>
      <span class={size === "sm" ? "text-sm font-semibold" : "text-base font-semibold"}>
        {name}
      </span>
    </a>
  );
};
