import type { JSX } from "preact";
import { useEffect } from "preact/hooks";
import { cn } from "../../lib/utils";
import { useAvatarContext } from "./context";

export type AvatarImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

export const AvatarImage = ({
  class: className,
  src,
  alt = "",
  onLoad,
  onError,
  ...rest
}: AvatarImageProps) => {
  const { notifyLoad, notifyError, resetImage, showFallback } = useAvatarContext();

  useEffect(() => {
    resetImage();
    if (!src || src === "") {
      notifyError();
    }
  }, [src, resetImage, notifyError]);

  return (
    <img
      data-slot="avatar-image"
      src={src}
      alt={alt}
      class={cn("absolute inset-0 z-10 size-full object-cover", showFallback && "invisible", className)}
      onLoad={(e) => {
        onLoad?.(e);
        notifyLoad();
      }}
      onError={(e) => {
        onError?.(e);
        notifyError();
      }}
      {...rest}
    />
  );
};
