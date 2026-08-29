import type { MarketingBlockId } from "@kamod-ch/blocks";
import bento01 from "../../../blocks/src/marketing/bento-01/bento-01.tsx?raw";
import contact01 from "../../../blocks/src/marketing/contact-01/contact-01.tsx?raw";
import contactUs from "../../../blocks/src/marketing/contact-us/contact-us.tsx?raw";
import cta01 from "../../../blocks/src/marketing/cta-01/cta-01.tsx?raw";
import faq01 from "../../../blocks/src/marketing/faq-01/faq-01.tsx?raw";
import features01 from "../../../blocks/src/marketing/features-01/features-01.tsx?raw";
import footer01 from "../../../blocks/src/marketing/footer-01/footer-01.tsx?raw";
import header01 from "../../../blocks/src/marketing/header-01/header-01.tsx?raw";
import hero01 from "../../../blocks/src/marketing/hero-01/hero-01.tsx?raw";
import logos01 from "../../../blocks/src/marketing/logos-01/logos-01.tsx?raw";
import logos02 from "../../../blocks/src/marketing/logos-02/logos-02.tsx?raw";
import logos03 from "../../../blocks/src/marketing/logos-03/logos-03.tsx?raw";
import pricing01 from "../../../blocks/src/marketing/pricing-01/pricing-01.tsx?raw";
import brandMark from "../../../blocks/src/marketing/shared/brand-mark.tsx?raw";
import contactForm from "../../../blocks/src/marketing/shared/contact-form.tsx?raw";
import logosShared from "../../../blocks/src/marketing/shared/logos.tsx?raw";
import testimonials01 from "../../../blocks/src/marketing/testimonials-01/testimonials-01.tsx?raw";

const sources: Record<MarketingBlockId, Record<string, string>> = {
  "bento-01": { "components/bento-01.tsx": bento01 },
  "contact-01": {
    "components/contact-01.tsx": contact01,
    "components/contact-form.tsx": contactForm,
  },
  "contact-us": {
    "components/contact-us.tsx": contactUs,
    "components/contact-form.tsx": contactForm,
  },
  "cta-01": { "components/cta-01.tsx": cta01 },
  "faq-01": { "components/faq-01.tsx": faq01 },
  "features-01": { "components/features-01.tsx": features01 },
  "footer-01": {
    "components/footer-01.tsx": footer01,
    "components/brand-mark.tsx": brandMark,
  },
  "header-01": {
    "components/header-01.tsx": header01,
    "components/brand-mark.tsx": brandMark,
  },
  "hero-01": { "components/hero-01.tsx": hero01 },
  "logos-01": {
    "components/logos-01.tsx": logos01,
    "components/logos.tsx": logosShared,
  },
  "logos-02": {
    "components/logos-02.tsx": logos02,
    "components/logos.tsx": logosShared,
  },
  "logos-03": {
    "components/logos-03.tsx": logos03,
    "components/logos.tsx": logosShared,
  },
  "pricing-01": { "components/pricing-01.tsx": pricing01 },
  "testimonials-01": { "components/testimonials-01.tsx": testimonials01 },
};

export const getMarketingBlockSource = (id: MarketingBlockId, fileLabel: string): string =>
  sources[id]?.[fileLabel] ?? Object.values(sources[id] ?? {})[0] ?? "";
