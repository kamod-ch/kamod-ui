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
      "Dark mode reverses the primary action to a light surface and separates cards from the darker page with neutral layers. Fuchsia remains the secondary identity; the primary color is not always a hue. The default radius is 0.625rem.",
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
      "Do not assume the preset also installs a component library or its fonts. The stylesheet names Geist and Fira Code stacks; load any chosen font files separately and inspect secondary and status roles.",
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
      "Sunset places rose primary actions and orange secondary actions on warm orange and amber surfaces, with stone text. Its pink primary accent and amber secondary accent extend that warmth into interaction states. The 0.5rem radius keeps a colorful interface from becoming overly soft in shape.",
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
      "Dark mode moves to warm charcoal and preserves the orange identity, with lighter text and a brighter primary accent. Thin translucent borders separate surfaces without introducing a cool gray cast. The preset uses a 0.5rem radius and declares Lato and Source Serif 4 font stacks.",
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
      "The dark scheme is the more dramatic study: an almost-black page, charcoal cards and a bright emerald action with dark text. The secondary surface remains a restrained indigo tint. A 0.5rem radius and Inter/system font stacks keep the underlying geometry direct.",
    application:
      "Use it for technical consoles, automation tools and dense operational workspaces. Let the bright emerald action identify the task to run or confirm; keep supporting information on quieter surfaces.",
    review:
      "The primary hue and success feedback are both green. A successful result needs a readable status label, and the brand action should not imply that an operation has already succeeded.",
  },
  watson: {
    character: "Expressive pink · Cyan contrast",
    palette:
      "Watson pairs a saturated pink primary action with a cyan-based secondary surface, using pink-tinted muted and selected backgrounds. Its extended palette offers additional brand shades, but the components still consume the same semantic roles. It declares Nunito Sans for body text and Onest for display text.",
    schemes:
      "Dark mode uses near-black surfaces, a lighter pink primary action with dark text and a brighter cyan secondary treatment. Mint success and lemon warning colors give feedback its own vocabulary. The preset inherits the foundation radius rather than defining a separate one.",
    application:
      "Use it for expressive product interfaces and collaborative tools. Keep the pink-tinted surfaces low in the hierarchy and use full-strength accents where they identify an action or selection.",
    review:
      "A tinted muted surface is not a disabled state by itself. Review disabled, selected, focused and warning states together, and load the named fonts only when your app intends to use them.",
  },
  professional: {
    character: "Yellow landmark · Black structure",
    palette:
      "Professional uses a vivid yellow primary action with black text, a black secondary action with white text and neutral gray surfaces. The filled action makes yellow a landmark rather than a background for the entire application. Poppins and IBM Plex Mono stacks accompany a 0.5rem radius.",
    schemes:
      "Dark mode retains the yellow primary action, places content on deep blue-gray surfaces and turns the secondary action light. The text pairing changes with the surface: dark text on yellow stays deliberate rather than following the page’s light text automatically.",
    application:
      "Use it for commerce, catalogs and administrative tools that need a strong confirmation or purchase action. Keep supporting controls neutral so a single yellow action can lead the flow.",
    review:
      "Do not reuse yellow as small text on white just because it works as a filled button. Check the primary foreground pairing and distinguish warning feedback with words and icons.",
  },
};

export const presetStudies = THEME_PRESETS.map((preset) => ({ ...preset, ...studies[preset.id] }));
export const presetStudyId = (id: ThemePresetId) => `color-theme-${id}`;
