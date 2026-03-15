import { Drawer } from "./Drawer";
import { DrawerClose } from "./DrawerClose";
import { DrawerContent } from "./DrawerContent";
import { DrawerDescription } from "./DrawerDescription";
import { DrawerFooter } from "./DrawerFooter";
import { DrawerHeader } from "./DrawerHeader";
import { DrawerTitle } from "./DrawerTitle";
import { DrawerTrigger } from "./DrawerTrigger";

export type { DrawerDirection } from "./drawer-context";
export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger };

export default {
  Root: Drawer,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose
};

