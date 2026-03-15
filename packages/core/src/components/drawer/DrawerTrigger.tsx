import { SheetTrigger } from "../sheet/SheetTrigger";
import type { DialogTriggerProps } from "../dialog/DialogTrigger";

export type DrawerTriggerProps = DialogTriggerProps;

export const DrawerTrigger = (props: DrawerTriggerProps) => <SheetTrigger data-slot="drawer-trigger" {...props} />;

