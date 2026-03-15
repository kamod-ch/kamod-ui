import { SheetDescription } from "../sheet/SheetDescription";
import type { DialogDescriptionProps } from "../dialog/DialogDescription";

export type DrawerDescriptionProps = DialogDescriptionProps;

export const DrawerDescription = (props: DrawerDescriptionProps) => (
  <SheetDescription data-slot="drawer-description" {...props} />
);

