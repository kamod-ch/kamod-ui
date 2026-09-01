import { Dialog } from "./Dialog";
import { DialogClose } from "./DialogClose";
import { DialogContent } from "./DialogContent";
import { DialogDescription } from "./DialogDescription";
import { DialogFooter } from "./DialogFooter";
import { DialogHeader } from "./DialogHeader";
import { DialogPortal } from "./DialogPortal";
import { DialogTitle } from "./DialogTitle";
import { DialogTrigger } from "./DialogTrigger";

export { useDialog } from "./Dialog";
export type { DialogContentPresentation, DialogContentProps } from "./DialogContent";
export { dialogViewportBleedClass } from "./DialogContent";
export { useModalPanelA11y } from "./useModalPanelA11y";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

export default {
  Root: Dialog,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
