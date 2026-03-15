export {
  Carousel,
  type CarouselApi,
  type CarouselOrientation,
  type CarouselProps
} from "./Carousel";
export { CarouselContent, type CarouselContentProps } from "./CarouselContent";
export { CarouselItem, type CarouselItemProps } from "./CarouselItem";
export { CarouselNext, type CarouselNextProps } from "./CarouselNext";
export { CarouselPrevious, type CarouselPreviousProps } from "./CarouselPrevious";

import { Carousel } from "./Carousel";
import { CarouselContent } from "./CarouselContent";
import { CarouselItem } from "./CarouselItem";
import { CarouselNext } from "./CarouselNext";
import { CarouselPrevious } from "./CarouselPrevious";

export default {
  Root: Carousel,
  Content: CarouselContent,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext
};
