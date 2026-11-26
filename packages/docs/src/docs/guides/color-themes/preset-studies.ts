import { THEME_PRESETS, type ThemePresetId } from "@kamod-ch/themes";

export type PresetStudy = {
  character: string;
  palette: string;
  schemes: string;
  application: string;
  review: string;
};

/** Editorial guidance only; rendered colors come directly from the shipped theme CSS. */
const studies: Record<ThemePresetId, PresetStudy> = {
  kamod: {
    character: "Neutral foundation · Fuchsia detail",
    palette:
      "Kamod starts with white and neutral surfaces, a near-black primary action and a fuchsia secondary accent. Its strongest contrast belongs to the main action rather than to a colored page background. This makes it a useful baseline for comparing component hierarchy before choosing a more expressive palette.",
    schemes:
      "Dark mode reverses the primary action to a light surface and separates cards from the darker page with neutral layers. Fuchsia remains the secondary identity; the primary color is not always a hue.",
    application:
      "Use it for documentation, settings and interfaces where content should lead. Keep the strongest fill for the action that completes the current task; use secondary color for a distinct supporting role.",
    review:
      "Check subtle borders and disabled controls against neighboring neutral surfaces. A quiet palette still needs a visible selected state and keyboard focus.",
  },
  shadcn: {
    character: "Monochrome structure · Compact shape",
    palette:
      "The shadcn preset uses zinc-like neutrals, black-and-white primary actions and a 0.5rem radius. Page and card surfaces sit close together, so spacing, boundaries and typography carry much of the structure. It is a familiar starting point when adapting an existing neutral component system.",
    schemes:
      "Dark mode keeps the page and card very dark, with white primary actions and lighter borders. This preset overrides a focused subset of tokens: unspecified roles inherit the theme foundation. Its secondary role therefore still includes the default fuchsia; monochrome primary styling does not mean every semantic color is gray.",
    application:
      "Use it when your product already has a neutral visual foundation. Compare the same card with Kamod to decide whether the tighter shape and lower surface separation suit your content.",
    review:
      "Check input boundaries, selected navigation and keyboard focus against neighboring neutral surfaces. Review secondary and status roles too; a monochrome main action does not make every role neutral.",
  },
  ocean: {
    character: "Cool cyan · Indigo counterpart",
    palette:
      "Ocean pairs cyan primary actions with indigo secondary actions, slate text and pale cyan cards. The two accent families distinguish the main action from its companion without coloring every surface. Its 0.75rem radius gives cards and controls a slightly softer outline than the other presets.",
    schemes:
      "Dark mode uses a deep slate page and card surfaces, with brighter cyan and indigo accents. Sky-tinted selection surfaces and cyan outlines keep the cool identity visible beyond the main button.",
    application:
      "Use it for workspaces, account settings and dashboards that benefit from two clear action roles. Keep indigo for supporting actions, and let slate surfaces carry long reading sessions.",
    review:
      "Cyan is also present in informational feedback. Retain labels and icons so a primary action and an information message are distinguishable by purpose, not hue alone.",
  },
  sunset: {
    character: "Rose action · Amber warmth",
    palette:
      "Sunset places rose primary actions and orange secondary actions on warm orange and amber surfaces, with stone text. Its pink primary accent and amber secondary accent extend that warmth into interaction states.",
    schemes:
      "Dark mode switches to stone surfaces and orange-white text, while rose and orange actions become lighter. The background becomes quieter rather than remaining a bright orange sheet. Violet information and lime success colors offer useful separation from the warm brand accents.",
    application:
      "Consider it for creative tools, welcoming onboarding and content with a warmer tone. Reserve the boldest rose fill for a clear next step rather than surrounding every paragraph with color.",
    review:
      "Rose also appears in error feedback. Use explicit error wording and a meaningful icon so an error cannot be confused with an ordinary brand-colored action.",
  },
  "cursor-warm": {
    character: "Warm paper · Orange emphasis",
    palette:
      "Cursor Warm combines cream page surfaces, white cards, warm dark text and a saturated orange primary action. Its secondary surface is a quiet cream-gray; the secondary accent is rose. This is a palette where a secondary action can be deliberately restrained instead of becoming another bright button.",
    schemes:
      "Dark mode moves to warm charcoal and preserves the orange identity, with lighter text and a brighter primary accent. Thin translucent borders separate surfaces without introducing a cool gray cast.",
    application:
      "Use it for text-focused tools, editorial interfaces and project workspaces. Leave room for the warm page color to show between white cards; the orange action can then stand out with little extra decoration.",
    review:
      "Treat the cream secondary token as a surface, not a text color. Check long secondary descriptions and orange-filled controls at their actual font sizes, especially when reducing density.",
  },
  voltage: {
    character: "Emerald signal · Deep charcoal",
    palette:
      "Voltage combines emerald primary actions, a lavender-tinted secondary surface and warm neutral borders. Its light scheme uses paper-like backgrounds and white cards. The secondary accent is a stronger indigo than the secondary surface, illustrating why an accent token and a filled surface are not interchangeable.",
    schemes:
      "The dark scheme is the more dramatic study: an almost-black page, charcoal cards and a bright emerald action with dark text. The secondary surface remains a restrained indigo tint.",
    application:
      "Use it for technical consoles, automation tools and dense operational workspaces. Let the bright emerald action identify the task to run or confirm; keep supporting information on quieter surfaces.",
    review:
      "The primary hue and success feedback are both green. A successful result needs a readable status label, and the brand action should not imply that an operation has already succeeded.",
  },
  watson: {
    character: "Pink action · Graphite control",
    palette:
      "watson pairs a saturated pink primary action with a graphite secondary, light grey field and card surfaces and black text. Hover and pressed states turn aubergine. The extended palette offers further brand shades, but the components still consume the same semantic roles.",
    schemes:
      "Dark mode uses near-black and charcoal surfaces, keeps the pink action with white text and switches the focus ring to cyan. Mint, lemon and light blue fills carry feedback, always with black text; error red also takes black text.",
    application:
      "Use it for news, community and editorial products. Let the pink action lead, keep tags and switches graphite, and give titles the Onest display face.",
    review:
      "White on pink only reaches 3.9:1, so the button label stays 16px bold and pink text on white turns aubergine. Check focus, error bars and placeholders in both appearances, and load the watson fonts only when the app uses them.",
  },
  professional: {
    character: "Yellow landmark · Black structure",
    palette:
      "Professional uses a vivid yellow primary action with black text, a black secondary action with white text and neutral gray surfaces. The filled action makes yellow a landmark rather than a background for the entire application.",
    schemes:
      "Dark mode retains the yellow primary action, places content on deep blue-gray surfaces and turns the secondary action light. The text pairing changes with the surface: dark text on yellow stays deliberate rather than following the page’s light text automatically.",
    application:
      "Use it for commerce, catalogs and administrative tools that need a strong confirmation or purchase action. Keep supporting controls neutral so a single yellow action can lead the flow.",
    review:
      "Do not reuse yellow as small text on white just because it works as a filled button. Check the primary foreground pairing and distinguish warning feedback with words and icons.",
  },
  "20min": {
    character: "Electric blue · News clarity",
    palette:
      "20 Minuten pairs an electric blue primary action with a deep navy secondary, white reading surfaces and light grey groupings. Cyan, purple, orange and green stay in the chart and feedback roles instead of decorating the page.",
    schemes:
      "Dark mode moves to blue-grey surfaces and switches the action colour to cyan with black text, following the live site. Cards sit one step darker than the page, popovers one step lighter.",
    application:
      "Use it for news, feeds and content apps where headlines lead and a single blue action marks the next step. Keep section navigation as tabs with a clear active bar.",
    review:
      "Blue is both the action colour and the active tab colour. Make sure links, active tabs and buttons stay distinguishable by shape, not only by hue, and load Matter only with a valid licence.",
  },
  redhat: {
    character: "Brand red accent · Interactive blue",
    palette:
      "Red Hat follows the Red Hat Design System: interactive blue for actions, links and focus, near-black text on white, and light grey groupings. Brand red is reserved for identity moments such as the active tab and the first chart series.",
    schemes:
      "Dark mode uses the system's near-black canvas with slightly lighter cards. Actions turn light blue with dark text, and status colors switch to their brighter on-dark variants with dark text.",
    application:
      "Use it for enterprise consoles, documentation and product sites. Keep one blue primary action per view, use outlined secondary and tertiary actions for the rest, and let red mark where you are rather than what to click.",
    review:
      "Red is not an action color here, so do not use it for primary buttons in product UI. Check that outlined buttons stay distinguishable from links, and load the Red Hat fonts when the app should match the brand.",
  },
};

export const presetStudies = THEME_PRESETS.map((preset) => ({ ...preset, ...studies[preset.id] }));
export const presetStudyId = (id: ThemePresetId) => `color-theme-${id}`;
