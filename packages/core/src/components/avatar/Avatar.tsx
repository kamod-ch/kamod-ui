import type { ComponentChild, ComponentChildren, JSX, VNode } from "preact";
import { isValidElement, toChildArray } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { AvatarBadge } from "./AvatarBadge";
import { AvatarContext } from "./context";

/** Outer shell: no overflow so AvatarBadge rings are not clipped. */
export const avatarRoot = tv({
  base: "group/avatar relative inline-flex shrink-0 select-none",
  variants: {
    size: {
      sm: "size-8",
      default: "size-10",
      lg: "size-12"
    }
  },
  defaultVariants: { size: "default" }
});

/** Circular clip + border for image/fallback only. */
const avatarMedia = tv({
  base: [
    "absolute inset-0 overflow-hidden rounded-full border border-border",
    "after:pointer-events-none after:absolute after:inset-0 after:z-[5] after:rounded-full after:border after:border-border/50"
  ]
});

function partitionAvatarChildren(children: ComponentChildren): { media: ComponentChild[]; badges: VNode[] } {
  const media: ComponentChild[] = [];
  const badges: VNode[] = [];
  for (const node of toChildArray(children)) {
    if (isValidElement(node) && node.type === AvatarBadge) {
      badges.push(node);
    } else {
      media.push(node);
    }
  }
  return { media, badges };
}

export type AvatarProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "size"> & {
  children?: ComponentChildren;
  size?: "sm" | "default" | "lg";
};

export const Avatar = ({ size = "default", class: className, children, ...rest }: AvatarProps) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const notifyLoad = useCallback(() => {
    setLoaded(true);
    setFailed(false);
  }, []);

  const notifyError = useCallback(() => {
    setFailed(true);
    setLoaded(false);
  }, []);

  const resetImage = useCallback(() => {
    setLoaded(false);
    setFailed(false);
  }, []);

  const showFallback = !loaded || failed;

  const value = useMemo(
    () => ({
      notifyLoad,
      notifyError,
      resetImage,
      showFallback
    }),
    [notifyLoad, notifyError, resetImage, showFallback]
  );

  const dataSize = size === "default" ? "default" : size;
  const { media, badges } = partitionAvatarChildren(children);

  return (
    <AvatarContext.Provider value={value}>
      <span
        {...rest}
        data-slot="avatar"
        data-size={dataSize}
        class={avatarRoot({ size, class: className as string | undefined })}
      >
        <span class={avatarMedia()}>{media}</span>
        {badges}
      </span>
    </AvatarContext.Provider>
  );
};
