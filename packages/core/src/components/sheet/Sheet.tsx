import type { ComponentChildren, JSX } from "preact";
import { Dialog, type DialogProps } from "../dialog/Dialog";

export type SheetProps = DialogProps & { children?: ComponentChildren };

export const Sheet = ({ children, lockBodyScroll = true, ...rest }: SheetProps) => (
  <Dialog data-slot="sheet" lockBodyScroll={lockBodyScroll} {...rest}>
    {children}
  </Dialog>
);

