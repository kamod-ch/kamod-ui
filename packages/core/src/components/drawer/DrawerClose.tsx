import type { DialogCloseProps } from "../dialog/DialogClose";
import { SheetClose } from "../sheet/SheetClose";

export type DrawerCloseProps = DialogCloseProps;

export const DrawerClose = (props: DrawerCloseProps) => (
  <SheetClose data-slot="drawer-close" {...props} />
);
