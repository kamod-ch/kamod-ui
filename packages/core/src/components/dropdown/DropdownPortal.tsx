import type { ComponentChildren, HTMLAttributes } from "preact";

/** No-op wrapper for API parity with shadcn; content stays in the tree (no portal). */
export type DropdownPortalProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const DropdownPortal = ({ children, ...rest }: DropdownPortalProps) => (
  <div data-slot="dropdown-portal" {...rest}>
    {children}
  </div>
);
