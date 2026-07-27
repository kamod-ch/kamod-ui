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
    <div
      class={["flex items-center justify-center bg-white", frameClass, className]
        .filter(Boolean)
        .join(" ")}
    >
      <KamodIcon size={size} onLightBackground />
    </div>
  );
}
