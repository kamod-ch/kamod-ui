import type { CatalogBlockDefinition } from "../shared";
import { Bento01 } from "./bento-01";
import { definitions, type MarketingBlockId } from "./catalog-definitions";
import { Contact01 } from "./contact-01";
import { ContactUs } from "./contact-us";
import { Cta01 } from "./cta-01";
import { Faq01 } from "./faq-01";
import { Features01 } from "./features-01";
import { Footer01 } from "./footer-01";
import { Header01 } from "./header-01";
import { Hero01 } from "./hero-01";
import { Logos01 } from "./logos-01";
import { Logos02 } from "./logos-02";
import { Logos03 } from "./logos-03";
import { Pricing01 } from "./pricing-01";
import { Testimonials01 } from "./testimonials-01";

export type { MarketingBlockId } from "./catalog-definitions";

export type MarketingBlockDefinition = CatalogBlockDefinition<MarketingBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const components = {
  "bento-01": Bento01,
  "contact-01": Contact01,
  "contact-us": ContactUs,
  "cta-01": Cta01,
  "faq-01": Faq01,
  "features-01": Features01,
  "footer-01": Footer01,
  "header-01": Header01,
  "hero-01": Hero01,
  "logos-01": Logos01,
  "logos-02": Logos02,
  "logos-03": Logos03,
  "pricing-01": Pricing01,
  "testimonials-01": Testimonials01,
} satisfies Record<MarketingBlockId, MarketingBlockDefinition["component"]>;

export const marketingBlocks: MarketingBlockDefinition[] = definitions.map((block) => ({
  ...(block as Omit<MarketingBlockDefinition, "component" | "installCommand" | "source">),
  source: "uipkge",
  component: components[block.id as MarketingBlockId],
  installCommand: `@kamod-ch/blocks/marketing/${block.id}`,
}));

export const marketingBlocksById = marketingBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<MarketingBlockId, MarketingBlockDefinition>,
);
