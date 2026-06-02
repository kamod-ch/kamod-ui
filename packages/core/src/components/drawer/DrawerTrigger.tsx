import type { DialogTriggerProps } from "../dialog/DialogTrigger";
import { SheetTrigger } from "../sheet/SheetTrigger";

export type DrawerTriggerProps = DialogTriggerProps;

export const DrawerTrigger = (props: DrawerTriggerProps) => (
  <SheetTrigger data-slot="drawer-trigger" {...props} />
);
