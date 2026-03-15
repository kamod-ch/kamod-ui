import { SheetHeader, type SheetHeaderProps } from "../sheet/SheetHeader";

export type DrawerHeaderProps = SheetHeaderProps;

export const DrawerHeader = (props: DrawerHeaderProps) => <SheetHeader data-slot="drawer-header" {...props} />;

