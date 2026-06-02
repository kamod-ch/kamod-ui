import type { DialogTitleProps } from "../dialog/DialogTitle";
import { SheetTitle } from "../sheet/SheetTitle";

export type DrawerTitleProps = DialogTitleProps;

export const DrawerTitle = (props: DrawerTitleProps) => (
  <SheetTitle data-slot="drawer-title" {...props} />
);
