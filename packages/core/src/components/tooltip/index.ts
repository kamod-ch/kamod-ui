import { Tooltip, TooltipProvider } from "./Tooltip";
import { TooltipContent } from "./TooltipContent";
import { TooltipTrigger } from "./TooltipTrigger";

export { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger };

export default {
  Provider: TooltipProvider,
  Root: Tooltip,
  Trigger: TooltipTrigger,
  Content: TooltipContent
};
