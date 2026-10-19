import type { ThemePresetId } from "@kamod-ch/themes";
import foundation from "../../../../../themes/src/tokens.css?raw";

type Scheme = "light" | "dark";
export type ColorGroup =
  | "surfaces"
  | "actions"
  | "feedback"
  | "boundaries"
  | "charts"
  | "sidebar"
  | "extended";
export type ThemeColorToken = {
  name: string;
  label: string;
  group: ColorGroup;
  description: string;
  pair?: string;
  light: { declaration: string; source: string };
  dark: { declaration: string; source: string };
  optional?: boolean;
};

const brands = import.meta.glob<string>("../../../../../themes/src/brands/*.css", {
  eager: true,
  query: "?raw",
  import: "default",
});

function blocks(css: string) {
  return [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
    ([, selector, body]) => ({
      selector: selector.trim(),
      values: Object.fromEntries(
        [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
          name.slice(2),
          value.trim(),
        ]),
      ),
    }),
  );
}
const foundationBlocks = blocks(foundation);
const foundationLight = foundationBlocks.find(({ selector }) =>
  selector.includes("[data-theme-scope]"),
)!.values;
const foundationDark = foundationBlocks.find(({ selector }) => selector === ".dark")!.values;

export const colorGroups: { id: ColorGroup; label: string; description: string }[] = [
  {
    id: "surfaces",
    label: "Surfaces & reading",
    description: "Canvas, layers and the text that belongs on each one.",
  },
  {
    id: "actions",
    label: "Brand & interaction",
    description: "Primary intent, supporting actions and quieter selected states.",
  },
  {
    id: "feedback",
    label: "Feedback & status",
    description: "Meaningful messages, always paired with words or icons.",
  },
  {
    id: "boundaries",
    label: "Borders & focus",
    description: "Structure and keyboard focus; translucent values keep their alpha.",
  },
  {
    id: "charts",
    label: "Charts & data",
    description: "Five ordered series colors. Keep labels or patterns alongside color.",
  },
  {
    id: "sidebar",
    label: "Sidebar & navigation",
    description: "A complete local palette for navigation surfaces and selection.",
  },
  {
    id: "extended",
    label: "Preset source colors",
    description:
      "Additional named shades supplied by this preset. Components use the semantic roles above.",
  },
];

type Description = { group: ColorGroup; description: string; pair?: string; label?: string };
const descriptions: Record<string, Description> = {
  background: {
    group: "surfaces",
    label: "Canvas",
    pair: "foreground",
    description:
      "The page canvas underneath your interface. Leave it visible between content regions; pair it with foreground for ordinary page text.",
  },
  foreground: {
    group: "surfaces",
    label: "Page text",
    pair: "background",
    description:
      "The default reading color on the page canvas. Use this for headings and body text; a filled action needs its own matching foreground instead.",
  },
  card: {
    group: "surfaces",
    label: "Surface",
    pair: "card-foreground",
    description:
      "A raised or grouped content surface, such as a settings panel or preview. Separation can come from layout and borders even when it matches the canvas.",
  },
  "card-foreground": {
    group: "surfaces",
    label: "Surface text",
    pair: "card",
    description:
      "Text placed on a card surface. Keep this pairing when a local preset changes the card independently from the page canvas.",
  },
  popover: {
    group: "surfaces",
    label: "Floating surface",
    pair: "popover-foreground",
    description:
      "The surface of floating menus, popovers and small overlays. It can sit one step above the card in dark mode.",
  },
  "popover-foreground": {
    group: "surfaces",
    label: "Floating text",
    pair: "popover",
    description:
      "Readable text inside a floating surface. Pair it with popover rather than assuming ordinary page text is always correct.",
  },
  muted: {
    group: "surfaces",
    label: "Quiet surface",
    pair: "muted-foreground",
    description:
      "Low-emphasis backgrounds for supporting content and quiet UI. A muted surface is not a disabled state by itself.",
  },
  "muted-foreground": {
    group: "surfaces",
    label: "Quiet text",
    pair: "muted",
    description:
      "Supporting descriptions, labels and metadata. Check it on the actual surface and at the intended reading size; it is not intended for every small text label.",
  },
  primary: {
    group: "actions",
    label: "Primary",
    pair: "primary-foreground",
    description:
      "The strongest action in the current flow. It can be near-black, white or a saturated hue; it describes importance rather than a fixed brand color.",
  },
  "primary-foreground": {
    group: "actions",
    label: "Primary text",
    pair: "primary",
    description:
      "Text and icons on the filled primary action. Keep this pair intact when copying a color; light or yellow actions may deliberately require dark text.",
  },
  "primary-accent": {
    group: "actions",
    label: "Primary emphasis",
    pair: "primary",
    description:
      "An alternate primary emphasis for interaction and accent treatments. It is a separate role, not a universal foreground or a guarantee that every component uses it on hover.",
  },
  secondary: {
    group: "actions",
    label: "Secondary",
    pair: "secondary-foreground",
    description:
      "A supporting filled action or distinct companion surface. Some presets make it colorful; others deliberately keep it quiet so the primary action leads.",
  },
  "secondary-foreground": {
    group: "actions",
    label: "Secondary text",
    pair: "secondary",
    description:
      "Text and icons on a secondary fill. Use this with secondary rather than borrowing the primary action's text color.",
  },
  "secondary-accent": {
    group: "actions",
    label: "Secondary emphasis",
    pair: "secondary",
    description:
      "A stronger or alternate expression of the secondary role. A subtle secondary surface and its accent can be different hues or have very different intensities.",
  },
  accent: {
    group: "actions",
    label: "Selection surface",
    pair: "accent-foreground",
    description:
      "Low-emphasis interaction surfaces such as highlighted menu items. Use alongside a clear selected or active indicator; a tint alone should not carry the meaning.",
  },
  "accent-foreground": {
    group: "actions",
    label: "Selection text",
    pair: "accent",
    description:
      "Text or icons on the accent surface. Keep the pair when building selected navigation or menu items.",
  },
  border: {
    group: "boundaries",
    label: "Boundary",
    description:
      "Subtle divisions between content regions and control edges. An alpha color is composited over its actual backdrop, so its appearance changes with that backdrop.",
  },
  input: {
    group: "boundaries",
    label: "Input edge",
    description:
      "The boundary or surface accent used by form controls. Check it next to the field's real background, especially when this declaration is translucent.",
  },
  ring: {
    group: "boundaries",
    label: "Focus ring",
    pair: "outline",
    description:
      "The semantic ring color, initially an alias of outline in the foundation. Presets can override it independently; use visible focus rather than relying on hover alone.",
  },
  outline: {
    group: "boundaries",
    label: "Focus outline",
    pair: "ring",
    description:
      "The standard outline color for keyboard focus treatments. Ring and outline are distinct tokens even when their resolved colors happen to match.",
  },
  "sidebar-background": {
    group: "sidebar",
    label: "Sidebar surface",
    pair: "sidebar-foreground",
    description:
      "The navigation canvas. Tailwind's bg-sidebar alias reads this variable; there is no separate --sidebar color to maintain.",
  },
  "sidebar-foreground": {
    group: "sidebar",
    label: "Sidebar text",
    pair: "sidebar-background",
    description: "Default text and icons in the sidebar, paired with its local navigation surface.",
  },
  "sidebar-primary": {
    group: "sidebar",
    label: "Sidebar primary",
    pair: "sidebar-primary-foreground",
    description:
      "The strongest navigation action or primary mark inside a sidebar. It is independent from the page's primary role.",
  },
  "sidebar-primary-foreground": {
    group: "sidebar",
    label: "Sidebar primary text",
    pair: "sidebar-primary",
    description:
      "Text or icons on the sidebar's primary fill. Use the navigation pair even if it currently matches the global action colors.",
  },
  "sidebar-accent": {
    group: "sidebar",
    label: "Sidebar selection",
    pair: "sidebar-accent-foreground",
    description:
      "Highlighted and interactive navigation surfaces. Accompany color with the item's selected state, label or indicator.",
  },
  "sidebar-accent-foreground": {
    group: "sidebar",
    label: "Sidebar selected text",
    pair: "sidebar-accent",
    description:
      "Text and icons on the sidebar accent surface, preserving the preset's navigation contrast pairing.",
  },
  "sidebar-border": {
    group: "sidebar",
    label: "Sidebar boundary",
    description:
      "Navigation dividers and the sidebar edge. This may be quieter than the page's border color.",
  },
  "sidebar-outline": {
    group: "sidebar",
    label: "Sidebar focus",
    description:
      "Focus styling inside navigation. Both outline-sidebar-outline and ring-sidebar-ring consume this same source variable; sidebar-ring is a Tailwind alias, not another runtime token.",
  },
};
for (const [name, label, description] of [
  [
    "info",
    "Information",
    "Informational guidance that does not claim success, warning or failure.",
  ],
  [
    "success",
    "Success",
    "A completed or successful result. A green brand action does not replace an explicit success message.",
  ],
  [
    "warning",
    "Warning",
    "An important caution that needs attention before continuing. Add a label or icon so hue is not the only signal.",
  ],
  [
    "error",
    "Error",
    "An invalid value or failed result. Include a useful explanation and a way to recover.",
  ],
  [
    "destructive",
    "Danger",
    "A destructive action such as deleting a resource. The foundation aliases error, but a preset can override it separately.",
  ],
]) {
  descriptions[name] = { group: "feedback", label, pair: `${name}-foreground`, description };
  descriptions[`${name}-foreground`] = {
    group: "feedback",
    label: `${label} text`,
    pair: name,
    description: `Text and icons on the ${name} fill. Keep this foreground with its paired surface; it is not automatically the page's ordinary text color.`,
  };
}
for (let series = 1; series <= 5; series += 1) {
  descriptions[`chart-${series}`] = {
    group: "charts",
    label: `Series ${series}`,
    description: `Color ${series} in the five-series chart palette. Keep a consistent series order across views and add labels, markers or a legend so the data remains understandable without color.`,
  };
}

export const coreColorNames = [
  "primary",
  "secondary",
  "accent",
  "background",
  "card",
  "muted",
  "destructive",
  "sidebar-background",
] as const;
export const semanticColorNames = Object.keys(foundationLight).filter((name) => name !== "radius");

const title = (name: string) => name.replace(/^color-/, "").replace(/[_-]/g, " ");

/** Declarations come from shipped CSS, including its real cascade and inherited roles. */
export function themeColorTokens(preset: ThemePresetId): ThemeColorToken[] {
  const file = `brands/${preset}.css`;
  const css = brands[`../../../../../themes/src/${file}`] ?? "";
  const presetBlocks = blocks(css);
  const light =
    presetBlocks.find(({ selector }) => selector.includes("[data-theme-scope]"))?.values ?? {};
  const dark =
    presetBlocks.find(({ selector }) => selector.startsWith(".dark[data-theme="))?.values ?? {};
  const declaration = (name: string, scheme: Scheme) => {
    if (scheme === "dark" && dark[name]) return { declaration: dark[name], source: file };
    if (light[name]) return { declaration: light[name], source: file };
    return {
      declaration: (scheme === "dark" ? foundationDark[name] : undefined) ?? foundationLight[name],
      source: "tokens.css",
    };
  };
  const tokens: ThemeColorToken[] = semanticColorNames.map((name) => ({
    name,
    label: descriptions[name]?.label ?? title(name),
    group: descriptions[name]?.group ?? "surfaces",
    description:
      descriptions[name]?.description ?? "A semantic color supplied by the theme foundation.",
    pair: descriptions[name]?.pair,
    light: declaration(name, "light"),
    dark: declaration(name, "dark"),
  }));
  const extended = presetBlocks.find(({ selector }) => selector === "@theme")?.values ?? {};
  for (const [name, value] of Object.entries(extended)) {
    if (!name.startsWith("color-")) continue;
    tokens.push({
      name,
      label: title(name),
      group: "extended",
      description:
        "An optional source color from Watson's extended palette. It is the same in light and dark mode. Prefer semantic roles for reusable components; choose this named shade only when your design needs its specific hue.",
      pair: undefined,
      light: { declaration: value, source: file },
      dark: { declaration: value, source: file },
      optional: true,
    } as ThemeColorToken);
  }
  // Local preset extensions are color roles too; typography, radii and shadow recipes are not.
  for (const [name, value] of Object.entries({ ...light, ...dark })) {
    if (
      semanticColorNames.includes(name) ||
      name.includes("shadow") ||
      !/^(?:#|rgba?\(|hsla?\(|oklch\(|color-mix\(|var\(--color-)/.test(value)
    )
      continue;
    const purpose = name.startsWith("cursor-surface-")
      ? "An extra surface level for Cursor Warm previews. The numbered scale changes with the appearance; use a semantic card or background role for ordinary reusable component surfaces."
      : name.startsWith("cursor-ai-")
        ? `A Cursor Warm preview color for the ${name.slice("cursor-ai-".length)} activity. Keep its activity label alongside the tint; these optional shades do not replace semantic feedback states.`
        : name.startsWith("cursor-text-")
          ? "An additional low-emphasis text color from Cursor Warm's preview palette. It includes transparency, so check the final reading contrast on the actual surface at the intended font size."
          : "An additional boundary color from Cursor Warm's preview palette. Its alpha blends with the actual background; use the semantic border role unless this stronger preview treatment is intentional.";
    tokens.push({
      name,
      label: title(name).replace(/^cursor /, ""),
      group: "extended",
      description: purpose,
      light: declaration(name, "light"),
      dark: declaration(name, "dark"),
      optional: true,
    });
  }
  return tokens;
}

export type ResolvedColor = { css: string; hex?: string; rgb?: string; alpha?: number };

/** Canvas supplies a clipped, 8-bit sRGB export; the original CSS remains authoritative. */
export function colorFromBytes(css: string, bytes: ArrayLike<number>): ResolvedColor {
  const [red, green, blue, alphaByte] = Array.from(bytes);
  const alpha = alphaByte / 255;
  const hex =
    `#${[red, green, blue, ...(alphaByte === 255 ? [] : [alphaByte])].map((value) => value.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
  return {
    css,
    hex,
    rgb: `rgb(${red} ${green} ${blue}${alphaByte === 255 ? "" : ` / ${Number(alpha.toFixed(3))}`})`,
    alpha,
  };
}

export function tokenColorExpression(token: ThemeColorToken, scheme: Scheme = "light") {
  return token.optional
    ? `var(--${token.name}, ${token[scheme].declaration})`
    : `var(--${token.name})`;
}
