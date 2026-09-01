import type { ComponentChildren } from "preact";
import { createPortal } from "../../lib/createPortal";
import { useDialog } from "./Dialog";

export type DialogPortalProps = {
  /** Keep the portal mounted while exit animations run. */
  forceMount?: boolean;
  children?: ComponentChildren;
};

/**
 * Portals dialog children to `document.body` without overlay or panel chrome.
 * Use for custom modal layouts (e.g. motion wrappers) that supply their own structure.
 */
export function DialogPortal({ forceMount = false, children }: DialogPortalProps) {
  const dialog = useDialog();
  const isOpen = dialog.open.value;
  if (!isOpen && !forceMount) return null;

  if (typeof document === "undefined") return <>{children}</>;
  return createPortal(<>{children}</>, document.body);
}
