import { Popover, popover } from "./Popover";
import { PopoverClose, popoverClose } from "./PopoverClose";
import { PopoverContent, popoverContent } from "./PopoverContent";
import { PopoverDescription, popoverDescription } from "./PopoverDescription";
import { PopoverHeader, popoverHeader } from "./PopoverHeader";
import { PopoverTitle, popoverTitle } from "./PopoverTitle";
import { PopoverTrigger, popoverTrigger } from "./PopoverTrigger";

const PopoverVariants = {
  popover,
  popoverClose,
  popoverContent,
  popoverDescription,
  popoverHeader,
  popoverTitle,
  popoverTrigger
};

export {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  PopoverVariants
};

export default {
  Root: Popover,
  Close: PopoverClose,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription
};
