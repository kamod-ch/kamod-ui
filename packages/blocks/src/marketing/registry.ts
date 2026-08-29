import type { CatalogBlockDefinition, CatalogBlockFile } from "../shared";
import { Bento01 } from "./bento-01";
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

export type MarketingBlockId =
  | "bento-01"
  | "contact-01"
  | "contact-us"
  | "cta-01"
  | "faq-01"
  | "features-01"
  | "footer-01"
  | "header-01"
  | "hero-01"
  | "logos-01"
  | "logos-02"
  | "logos-03"
  | "pricing-01"
  | "testimonials-01";

export type MarketingBlockDefinition = CatalogBlockDefinition<MarketingBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const catalog = (id: MarketingBlockId) => `https://uipkge.dev/react/blocks/${id}`;

const componentFile = (id: MarketingBlockId): CatalogBlockFile => ({
  path: `src/marketing/${id}/${id}.tsx`,
  label: `components/${id}.tsx`,
  kind: "component",
});

const support = (path: string, label: string): CatalogBlockFile => ({
  path,
  label,
  kind: "support",
});

const usage = (id: MarketingBlockId, name: string) =>
  `import { ${name} } from "@kamod-ch/blocks/marketing/${id}";\n\nexport const Example = () => <${name} />;`;

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

const definitions: Omit<MarketingBlockDefinition, "component" | "installCommand" | "source">[] = [
  {
    id: "bento-01",
    title: "Bento 01",
    description: "Four-tile bento section with stats, progress, and configurable content.",
    category: "marketing",
    catalogUrl: catalog("bento-01"),
    files: [componentFile("bento-01")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Badge", "Card", "Progress"],
    tags: ["marketing", "bento", "features"],
    features: ["typed-tiles", "semantic-tokens", "responsive-grid"],
    preview: { height: 820, fullWidth: true },
    props: [
      { name: "eyebrow", type: "string", description: "Small uppercase kicker above the heading." },
      { name: "heading", type: "string", description: "Section heading." },
      { name: "lede", type: "string", description: "Supporting copy." },
      {
        name: "tiles",
        type: "BentoTile[]",
        description: "Grid tiles with optional icon, badge, stats, and progress.",
      },
    ],
    usage: usage("bento-01", "Bento01"),
  },
  {
    id: "contact-01",
    title: "Contact 01",
    description: "Contact details, map placeholder, and an accessible async contact form.",
    category: "marketing",
    catalogUrl: catalog("contact-01"),
    files: [
      componentFile("contact-01"),
      support("src/marketing/shared/contact-form.tsx", "components/contact-form.tsx"),
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Card", "FieldError", "Input", "Label", "Select", "Textarea"],
    tags: ["marketing", "contact", "form"],
    features: ["async-submit", "native-validation", "status-messages", "map-slot"],
    preview: { height: 860, fullWidth: true },
    props: [
      {
        name: "onSubmit",
        type: "(payload: ContactPayload) => void | Promise<void>",
        description: "Async submit handler.",
      },
      {
        name: "mapSlot",
        type: "ComponentChildren",
        description: "Optional map or illustration instead of the dashed placeholder.",
      },
      { name: "rows", type: "ContactRow[]", description: "Email, phone, and office rows." },
      {
        name: "linkComponent",
        type: "BlockLinkComponent",
        description: "Router-neutral link adapter.",
      },
    ],
    usage: usage("contact-01", "Contact01"),
  },
  {
    id: "contact-us",
    title: "Contact Us",
    description:
      "Contact layout with an optional map adapter. No Mapbox dependency or token required.",
    category: "marketing",
    catalogUrl: catalog("contact-us"),
    files: [
      componentFile("contact-us"),
      support("src/marketing/shared/contact-form.tsx", "components/contact-form.tsx"),
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Card", "FieldError", "Input", "Label", "Select", "Textarea"],
    tags: ["marketing", "contact", "map"],
    features: ["optional-map-adapter", "ssr-placeholder", "async-submit"],
    preview: { height: 860, fullWidth: true },
    props: [
      {
        name: "accessToken",
        type: "string",
        description: "Optional map provider token. Without it a placeholder is shown.",
      },
      {
        name: "renderMap",
        type: "ContactMapAdapter",
        description: "Optional renderer used only when a token is present.",
      },
      {
        name: "mapSlot",
        type: "ComponentChildren",
        description: "Fully custom map slot that bypasses the adapter.",
      },
      {
        name: "onSubmit",
        type: "(payload: ContactPayload) => void | Promise<void>",
        description: "Async submit handler.",
      },
    ],
    usage: usage("contact-us", "ContactUs"),
  },
  {
    id: "cta-01",
    title: "CTA 01",
    description: "Centered call-to-action with primary and secondary actions.",
    category: "marketing",
    catalogUrl: catalog("cta-01"),
    files: [componentFile("cta-01")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button"],
    tags: ["marketing", "cta"],
    features: ["typed-actions", "href-or-callback"],
    preview: { height: 520, fullWidth: true },
    props: [
      { name: "heading", type: "string", description: "CTA heading." },
      { name: "primary", type: "MarketingAction", description: "Primary button or link." },
      { name: "secondary", type: "MarketingAction", description: "Secondary button or link." },
    ],
    usage: usage("cta-01", "Cta01"),
  },
  {
    id: "faq-01",
    title: "FAQ 01",
    description: "Single-collapsible FAQ accordion with heading structure and a contact link.",
    category: "marketing",
    catalogUrl: catalog("faq-01"),
    files: [componentFile("faq-01")],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Accordion"],
    tags: ["marketing", "faq", "accordion"],
    features: ["heading-per-item", "keyboard", "link-adapter"],
    preview: { height: 820, fullWidth: true },
    props: [
      { name: "items", type: "FaqItem[]", description: "Question and answer pairs." },
      { name: "contactEmail", type: "string", description: "Support email shown in the lede." },
      {
        name: "linkComponent",
        type: "BlockLinkComponent",
        description: "Router-neutral link adapter.",
      },
    ],
    usage: usage("faq-01", "Faq01"),
  },
  {
    id: "features-01",
    title: "Features 01",
    description: "Six feature cards with Kamod Icons and semantic tokens.",
    category: "marketing",
    catalogUrl: catalog("features-01"),
    files: [componentFile("features-01")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Card"],
    tags: ["marketing", "features"],
    features: ["typed-features", "kamod-icons"],
    preview: { height: 760, fullWidth: true },
    props: [
      {
        name: "features",
        type: "FeatureItem[]",
        description: "Title, description, and optional icon.",
      },
      { name: "heading", type: "string", description: "Section heading." },
    ],
    usage: usage("features-01", "Features01"),
  },
  {
    id: "footer-01",
    title: "Footer 01",
    description: "Footer with newsletter callback, typed columns, and social links.",
    category: "marketing",
    catalogUrl: catalog("footer-01"),
    files: [
      componentFile("footer-01"),
      support("src/marketing/shared/brand-mark.tsx", "components/brand-mark.tsx"),
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Input", "Separator"],
    tags: ["marketing", "footer", "newsletter"],
    features: ["newsletter-callback", "typed-links", "status-messages"],
    preview: { height: 560, fullWidth: true },
    props: [
      {
        name: "onSubscribe",
        type: "(email: string) => void | Promise<void>",
        description: "Newsletter submit callback.",
      },
      { name: "columns", type: "FooterColumn[]", description: "Navigation columns." },
      {
        name: "social",
        type: "FooterSocialLink[]",
        description: "Social links with optional icons.",
      },
      {
        name: "linkComponent",
        type: "BlockLinkComponent",
        description: "Router-neutral link adapter.",
      },
    ],
    usage: usage("footer-01", "Footer01"),
  },
  {
    id: "header-01",
    title: "Header 01",
    description: "Sticky header with desktop navigation and an accessible mobile sheet.",
    category: "marketing",
    catalogUrl: catalog("header-01"),
    files: [
      componentFile("header-01"),
      support("src/marketing/shared/brand-mark.tsx", "components/brand-mark.tsx"),
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Sheet"],
    tags: ["marketing", "header", "navigation"],
    features: ["desktop-nav", "mobile-sheet", "escape-focus-restore", "link-adapter"],
    preview: { height: 140, fullWidth: true },
    props: [
      { name: "links", type: "MarketingLink[]", description: "Primary navigation links." },
      { name: "open", type: "boolean", description: "Controlled mobile sheet state." },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Sheet open-change callback.",
      },
      {
        name: "linkComponent",
        type: "BlockLinkComponent",
        description: "Router-neutral link adapter.",
      },
    ],
    usage: usage("header-01", "Header01"),
  },
  {
    id: "hero-01",
    title: "Hero 01",
    description: "Two-column hero with KPI cards and an onboarding queue collage.",
    category: "marketing",
    catalogUrl: catalog("hero-01"),
    files: [componentFile("hero-01")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Avatar", "Badge", "Button", "Card"],
    tags: ["marketing", "hero"],
    features: ["responsive-metrics", "typed-actions"],
    preview: { height: 780, fullWidth: true },
    props: [
      { name: "heading", type: "string", description: "Hero heading." },
      { name: "primary", type: "MarketingAction", description: "Primary CTA." },
      { name: "metrics", type: "HeroMetric[]", description: "KPI cards shown beside the copy." },
      { name: "queue", type: "HeroQueueItem[]", description: "Onboarding queue rows." },
    ],
    usage: usage("hero-01", "Hero01"),
  },
  {
    id: "logos-01",
    title: "Logos 01",
    description: "Static logo grid. Logos are data or slots; placeholders are labeled as such.",
    category: "marketing",
    catalogUrl: catalog("logos-01"),
    files: [
      componentFile("logos-01"),
      support("src/marketing/shared/logos.tsx", "components/logos.tsx"),
    ],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: [],
    tags: ["marketing", "logos", "social-proof"],
    features: ["logo-slots", "placeholder-wordmarks"],
    preview: { height: 320, fullWidth: true },
    props: [
      {
        name: "logos",
        type: "LogoItem[]",
        description: "Wordmarks with optional href or custom children.",
      },
      { name: "eyebrow", type: "string", description: "Kicker above the grid." },
    ],
    usage: usage("logos-01", "Logos01"),
  },
  {
    id: "logos-02",
    title: "Logos 02",
    description:
      "Single-row logo marquee that pauses on hover and focus and respects reduced motion.",
    category: "marketing",
    catalogUrl: catalog("logos-02"),
    files: [
      componentFile("logos-02"),
      support("src/marketing/shared/logos.tsx", "components/logos.tsx"),
    ],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: [],
    tags: ["marketing", "logos", "marquee"],
    features: ["pause-on-hover-focus", "prefers-reduced-motion", "no-duplicate-when-reduced"],
    preview: { height: 320, fullWidth: true },
    props: [
      { name: "logos", type: "LogoItem[]", description: "Logos in the marquee track." },
      { name: "duration", type: "string", description: "CSS animation duration, for example 30s." },
    ],
    usage: usage("logos-02", "Logos02"),
  },
  {
    id: "logos-03",
    title: "Logos 03",
    description: "Three alternating marquee rows with reduced-motion and pause-on-focus behavior.",
    category: "marketing",
    catalogUrl: catalog("logos-03"),
    files: [
      componentFile("logos-03"),
      support("src/marketing/shared/logos.tsx", "components/logos.tsx"),
    ],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: [],
    tags: ["marketing", "logos", "marquee"],
    features: ["alternating-rows", "pause-on-hover-focus", "prefers-reduced-motion"],
    preview: { height: 420, fullWidth: true },
    props: [
      { name: "rows", type: "LogoItem[][]", description: "One logo list per marquee row." },
      { name: "eyebrow", type: "string", description: "Kicker above the rows." },
    ],
    usage: usage("logos-03", "Logos03"),
  },
  {
    id: "pricing-01",
    title: "Pricing 01",
    description:
      "Three-tier pricing with controlled or uncontrolled billing cycle and localizable labels.",
    category: "marketing",
    catalogUrl: catalog("pricing-01"),
    files: [componentFile("pricing-01")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Badge", "Button", "Card", "ToggleGroup"],
    tags: ["marketing", "pricing"],
    features: ["controlled-billing", "localizable-prices", "cta-callbacks"],
    preview: { height: 920, fullWidth: true },
    props: [
      { name: "cycle", type: '"monthly" | "yearly"', description: "Controlled billing cycle." },
      {
        name: "onCycleChange",
        type: "(cycle: BillingCycle) => void",
        description: "Billing-cycle change callback.",
      },
      {
        name: "tiers",
        type: "PricingTier[]",
        description: "Plans with monthly/yearly or custom price labels and CTAs.",
      },
      {
        name: "periodLabel",
        type: "string",
        description: "Localizable suffix shown next to numeric prices.",
      },
    ],
    usage: usage("pricing-01", "Pricing01"),
  },
  {
    id: "testimonials-01",
    title: "Testimonials 01",
    description:
      "Manual testimonial slider with live status, keyboard controls, and reduced motion.",
    category: "marketing",
    catalogUrl: catalog("testimonials-01"),
    files: [componentFile("testimonials-01")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Avatar", "Button", "Card"],
    tags: ["marketing", "testimonials"],
    features: ["controlled-index", "live-status", "reduced-motion", "keyboard"],
    preview: { height: 720, fullWidth: true },
    props: [
      { name: "index", type: "number", description: "Controlled active slide." },
      {
        name: "onIndexChange",
        type: "(index: number) => void",
        description: "Slide-change callback.",
      },
      { name: "items", type: "Testimonial[]", description: "Quotes, names, and roles." },
    ],
    usage: usage("testimonials-01", "Testimonials01"),
  },
];

export const marketingBlocks: MarketingBlockDefinition[] = definitions.map((block) => ({
  ...block,
  source: "uipkge",
  component: components[block.id],
  installCommand: `@kamod-ch/blocks/marketing/${block.id}`,
}));

export const marketingBlocksById = marketingBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<MarketingBlockId, MarketingBlockDefinition>,
);
