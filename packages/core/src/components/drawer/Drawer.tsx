import type { ComponentChildren } from "preact";
import { Sheet, type SheetProps } from "../sheet/Sheet";
import { DrawerProvider, type DrawerDirection } from "./drawer-context";

export type DrawerProps = SheetProps & {
  /** Edge the drawer opens from (shadcn/Vaul `direction`). Default `bottom`. */
  direction?: DrawerDirection;
  children?: ComponentChildren;
};

export const Drawer = ({ direction = "bottom", children, ...rest }: DrawerProps) => (
  <DrawerProvider value={{ direction }}>
    <Sheet data-slot="drawer" {...rest}>
      {children}
    </Sheet>
  </DrawerProvider>
);
