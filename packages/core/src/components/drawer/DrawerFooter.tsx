import { SheetFooter, type SheetFooterProps } from "../sheet/SheetFooter";

export type DrawerFooterProps = SheetFooterProps;

export const DrawerFooter = (props: DrawerFooterProps) => <SheetFooter data-slot="drawer-footer" {...props} />;

