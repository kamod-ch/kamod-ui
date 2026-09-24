import { Blobatar, type BlobatarProps } from "@blobatar/preact";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from "@kamod-ch/ui/avatar";
import { cn } from "@kamod-ch/ui/utils";
import type { ComponentChildren } from "preact";

/** Blobatar tuning and passthrough — `name`, Kamod `size`, and `elementRef` are owned by SmartAvatar. */
export type SmartAvatarBlobatarOptions = Omit<BlobatarProps, "name" | "size" | "elementRef">;

export type SmartAvatarProps = Omit<AvatarProps, "children"> & {
  /** Seed for the deterministic blobatar fallback. */
  name: string;
  src?: string | null;
  /** When set, the outer Avatar is a single labelled image for assistive tech. */
  label?: string;
  badge?: ComponentChildren;
  blobatar?: SmartAvatarBlobatarOptions;
};

export function SmartAvatar({
  name,
  src,
  label,
  badge,
  blobatar,
  size,
  class: className,
  ...rest
}: SmartAvatarProps) {
  const hasSrc = src != null && src !== "";
  const { class: blobatarClass, animate, ...blobatarRest } = blobatar ?? {};
  const mergedBlobatarClass = cn("size-full", blobatarClass);
  const isAnimated = animate === "hover" || animate === "always";

  const labelledProps = label ? ({ role: "img", "aria-label": label } as const) : {};

  const fallbackBlobatar = (
    isAnimated
      ? {
          name,
          animate,
          class: mergedBlobatarClass,
          ...blobatarRest,
          "aria-hidden": true,
        }
      : {
          name,
          class: mergedBlobatarClass,
          ...blobatarRest,
          "aria-hidden": true,
          alt: "",
        }
  ) as BlobatarProps;

  return (
    <Avatar size={size} class={className} {...rest} {...labelledProps}>
      {hasSrc ? <AvatarImage src={src} alt="" aria-hidden /> : null}
      <AvatarFallback>
        <Blobatar {...fallbackBlobatar} />
      </AvatarFallback>
      {badge != null ? <AvatarBadge>{badge}</AvatarBadge> : null}
    </Avatar>
  );
}
