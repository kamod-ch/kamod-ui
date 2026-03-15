import { SheetTitle } from "../sheet/SheetTitle";
import type { DialogTitleProps } from "../dialog/DialogTitle";

export type DrawerTitleProps = DialogTitleProps;

export const DrawerTitle = (props: DrawerTitleProps) => <SheetTitle data-slot="drawer-title" {...props} />;

