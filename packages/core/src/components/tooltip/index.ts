import { Tooltip, TooltipProvider } from "./Tooltip";
import { TooltipContent } from "./TooltipContent";
import { TooltipTrigger } from "./TooltipTrigger";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

export default {
  Provider: TooltipProvider,
  Root: Tooltip,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
