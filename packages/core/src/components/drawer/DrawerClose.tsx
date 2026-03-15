import { SheetClose } from "../sheet/SheetClose";
import type { DialogCloseProps } from "../dialog/DialogClose";

export type DrawerCloseProps = DialogCloseProps;

export const DrawerClose = (props: DrawerCloseProps) => <SheetClose data-slot="drawer-close" {...props} />;

