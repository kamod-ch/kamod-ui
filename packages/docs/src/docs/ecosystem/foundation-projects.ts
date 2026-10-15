import { BracesIcon, LayersIcon, SunMoonIcon, TypeIcon } from "@kamod-ch/icons/lucide";

export type FoundationProject = {
  examples: readonly { label: string; href: string }[];
  ownership: string;
  delivery: string;
  detail: string;
  Icon: typeof BracesIcon;
};

/** Small, source-verified starting points; blocks deliberately describe copied source, not npm. */
export const foundationProjects: Readonly<Partial<Record<string, FoundationProject>>> = {
  "@kamod-ch/ui": {
    examples: [
      { label: "Button", href: "/docs/button/installation" },
      { label: "Input", href: "/docs/input/installation" },
      { label: "Dialog", href: "/docs/dialog/installation" },
    ],
    ownership: "Labels, validation and what each action does.",
    delivery: "Package",
    detail: "Preact native",
    Icon: BracesIcon,
  },
  "@kamod-ch/blocks": {
    examples: [
      { label: "application-shell-1", href: "/blocks/application-shell/application-shell-1" },
      { label: "sidebar-01", href: "/blocks/sidebar/sidebar-01" },
    ],
    ownership: "Routes, account actions and application data.",
    delivery: "Local source",
    detail: "Copy & adapt",
    Icon: LayersIcon,
  },
  "@kamod-ch/themes": {
    examples: [
      { label: "--primary", href: "/docs/theming/installation#token-overrides" },
      { label: "--muted", href: "/docs/theming/installation#token-overrides" },
      { label: "--ring", href: "/docs/theming/installation#token-overrides" },
    ],
    ownership: "Brand colors and the modes your app exposes.",
    delivery: "Theme CSS",
    detail: "Light + dark",
    Icon: SunMoonIcon,
  },
  "@kamod-ch/typeset": {
    examples: [
      {
        label: ".typeset",
        href: "https://github.com/kamod-ch/kamod-ui/tree/main/packages/typeset#readme",
      },
      {
        label: ".typeset-reading",
        href: "https://github.com/kamod-ch/kamod-ui/tree/main/packages/typeset#presets",
      },
      {
        label: ".not-typeset",
        href: "https://github.com/kamod-ch/kamod-ui/tree/main/packages/typeset#opt-out",
      },
    ],
    ownership: "Your HTML, Markdown renderer and content hierarchy.",
    delivery: "Content CSS",
    detail: "CSS only",
    Icon: TypeIcon,
  },
};
