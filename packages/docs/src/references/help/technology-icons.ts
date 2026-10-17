import {
  BrandAstroIcon,
  BrandCss3Icon,
  BrandHtml5Icon,
  BrandReactIcon,
  BrandSvelteIcon,
  BrandTablerIcon,
  BrandVueIcon,
} from "@kamod-ch/icons/tabler/outline";
import { brandIcons } from "../../docs/components/brand/brand-icons";

// Extra marks stay in the lazy help chunk; ordinary prose keeps its existing icon set.
const technologyIcons: Record<string, typeof BrandReactIcon> = {
  ...brandIcons,
  Astro: BrandAstroIcon,
  CSS: BrandCss3Icon,
  HTML: BrandHtml5Icon,
  "Preact Signals": BrandReactIcon,
  "React DOM": BrandReactIcon,
  Svelte: BrandSvelteIcon,
  Tabler: BrandTablerIcon,
  Vue: BrandVueIcon,
};

/** The loader supplies a canonical technology name, even for versioned or aliased text. */
export function technologyIcon(module: string) {
  return Object.hasOwn(technologyIcons, module) ? technologyIcons[module] : undefined;
}
