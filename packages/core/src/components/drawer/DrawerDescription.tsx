import type { DialogDescriptionProps } from "../dialog/DialogDescription";
import { SheetDescription } from "../sheet/SheetDescription";

export type DrawerDescriptionProps = DialogDescriptionProps;

export const DrawerDescription = (props: DrawerDescriptionProps) => (
  <SheetDescription data-slot="drawer-description" {...props} />
);
