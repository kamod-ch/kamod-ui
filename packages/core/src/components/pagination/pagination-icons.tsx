import type { JSX } from "preact";
import { cn } from "../../lib/utils";

const svgBase: JSX.SVGAttributes<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": true
};

export const PaginationChevronLeft = ({ class: className, ...props }: JSX.SVGAttributes<SVGSVGElement>) => (
  <svg {...svgBase} viewBox="0 0 24 24" class={cn("size-4", className)} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const PaginationChevronRight = ({ class: className, ...props }: JSX.SVGAttributes<SVGSVGElement>) => (
  <svg {...svgBase} viewBox="0 0 24 24" class={cn("size-4", className)} {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const PaginationMoreHorizontal = ({ class: className, ...props }: JSX.SVGAttributes<SVGSVGElement>) => (
  <svg {...svgBase} viewBox="0 0 24 24" class={cn("size-4", className)} {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
