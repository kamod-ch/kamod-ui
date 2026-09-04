import { cn } from "@kamod-ch/ui";
import type { KamodBrandSize } from "./kamod-brand-sizes";
import { KamodIcon } from "./kamod-icon";

type KamodIconFrameProps = {
  size?: KamodBrandSize;
  class?: string;
  frameClass?: string;
};

export function KamodIconFrame({
  size = "md",
  class: className,
  frameClass = "aspect-square size-8 rounded-lg",
}: KamodIconFrameProps) {
  return (
    <div class={cn("flex items-center justify-center bg-white", frameClass, className)}>
      <KamodIcon size={size} onLightBackground />
    </div>
  );
}
