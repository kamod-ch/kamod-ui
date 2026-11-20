import type { ThemePresetId } from "@kamod-ch/themes";

type DesignNote = { title: string; text: string; roles: readonly string[] };
export type PresetDesignNotes = {
  direction: string;
  principles: readonly [DesignNote, DesignNote];
  type: { body: string; family?: string; display: string; mono: string; advice: string };
  radius: string;
  shape: string;
  example: string;
};

/** Interpretation accompanies the shipped CSS; these notes never define the palette itself. */
export const presetDesignNotes: Record<ThemePresetId, PresetDesignNotes> = {
  kamod: {
    direction: "Let contrast do the talking.",
    principles: [
      {
        title: "Give the strongest fill one job",
        text: "Let a near-black action finish the task while the surrounding page stays quiet. If several controls compete for that fill, promote the most consequential one and simplify its neighbors.",
        roles: ["--primary", "--foreground"],
      },
      {
        title: "Make the accent intentional",
        text: "Fuchsia can identify a supporting action or a small point of interest. Repeating it across every heading, badge and border would remove the calm that makes this preset useful.",
        roles: ["--secondary", "--accent"],
      },
    ],
    type: {
      body: "Application / system",
      display: "Application / system",
      mono: "Application / system mono",
      advice:
        "The foundation leaves font choice to your app. Start with a native stack, establish a readable scale, then add a product typeface only if it improves the content.",
    },
    radius: "0.625rem",
    shape:
      "A balanced default: round enough for friendly controls, restrained enough for dense tools. Keep the same radius family across menus, inputs and cards.",
    example: "A little room for your next idea.",
  },
  shadcn: {
    direction: "Build the hierarchy before the decoration.",
    principles: [
      {
        title: "Separate with rhythm",
        text: "Close page and card values benefit from clear spacing and a thin boundary. Try a consistent section gap before adding darker shadows or another surface color.",
        roles: ["--card", "--border"],
      },
      {
        title: "Review inherited color too",
        text: "The black-and-white primary treatment is only part of this preset. Secondary and feedback roles can inherit values from the foundation, so include them when reviewing a real form or menu.",
        roles: ["--secondary", "--success"],
      },
    ],
    type: {
      body: "Geist / Geist Variable",
      family: '"Geist Variable", Geist',
      display: "Geist / Geist Variable",
      mono: "Fira Code / Fira Code Variable",
      advice:
        "A clear sans and a distinct mono make dense interfaces easier to scan. These are declared stacks; the comparison stays in native type rather than downloading fonts.",
    },
    radius: "0.5rem",
    shape:
      "Compact corners keep rows, tables and utility panels feeling direct. Preserve breathing room inside the component even when the outline is tighter.",
    example: "Clear structure. A useful next step.",
  },
  ocean: {
    direction: "Give a cool palette a clear sense of depth.",
    principles: [
      {
        title: "Keep cyan and indigo in different roles",
        text: "Cyan can lead the task and indigo can support it. Keep that assignment stable across the flow; switching their meaning from screen to screen makes two useful accents harder to learn.",
        roles: ["--primary", "--secondary"],
      },
      {
        title: "Let slate carry the reading",
        text: "Use the quieter page and muted text for longer explanations. A pale card or a narrow selected surface can provide enough color without tinting the entire workspace.",
        roles: ["--background", "--muted-foreground"],
      },
    ],
    type: {
      body: "Application / system",
      display: "Application / system",
      mono: "Application / system mono",
      advice:
        "Ocean changes color and shape without prescribing a font stack. A restrained sans works well with the softer corners; keep mono for identifiers and source.",
    },
    radius: "0.75rem",
    shape:
      "The softest base radius in this set. Repeat it deliberately; a few clearly separated cards usually explain depth better than many rounded boxes inside one another.",
    example: "A calmer place to bring work together.",
  },
  sunset: {
    direction: "Keep the welcome warm and the next step obvious.",
    principles: [
      {
        title: "Use warmth around the action",
        text: "Let the orange and amber surfaces set the tone while the rose action gives the reader a destination. Small warm details usually do more than a full-strength colored container.",
        roles: ["--card", "--primary"],
      },
      {
        title: "Keep brand and feedback separate",
        text: "Rose can be both an action color and part of an error treatment. Add a clear message and a meaningful icon to an error; a familiar brand hue alone should never carry that distinction.",
        roles: ["--error", "--error-foreground"],
      },
    ],
    type: {
      body: "Application / system",
      display: "Application / system",
      mono: "Application / system mono",
      advice:
        "Use a clear text face to balance the expressive colors. Avoid adding decorative typography to every small label; a strong heading and calm body copy already create contrast.",
    },
    radius: "0.5rem",
    shape:
      "Warm color meets a relatively compact shape. Keeping the corners consistent helps a colorful onboarding flow still feel organized and dependable.",
    example: "A warm start for something worth making.",
  },
  "cursor-warm": {
    direction: "Leave some paper around the ink.",
    principles: [
      {
        title: "Use the page as part of the composition",
        text: "Leave visible cream space between white cards. It creates a quiet depth cue without requiring a shadow on every block, and gives longer text a less clinical setting.",
        roles: ["--background", "--card"],
      },
      {
        title: "Keep orange precious",
        text: "Use orange for the next meaningful action, then let cream-gray support secondary controls. A restrained secondary action can be easier to understand than a second equally vivid button.",
        roles: ["--primary", "--secondary"],
      },
    ],
    type: {
      body: "Lato",
      family: '"Lato"',
      display: "Lato",
      mono: "System mono",
      advice:
        "The preset also declares Source Serif 4 as a serif option. Use it for a deliberate editorial passage if you load it, while keeping controls and long utility labels in the sans stack.",
    },
    radius: "0.5rem",
    shape:
      "Quiet corners and thin warm boundaries suit text-led work. Keep shadows light and use the card/page relationship to do most of the layering.",
    example: "Good ideas deserve a little breathing room.",
  },
  voltage: {
    direction: "Make the signal count.",
    principles: [
      {
        title: "Reserve emerald for a decision",
        text: "One strong run, confirm or connect action can anchor a dense tool. Keep supporting settings neutral so the signal stays useful rather than becoming a permanent visual alarm.",
        roles: ["--primary", "--secondary"],
      },
      {
        title: "Describe the state in words",
        text: "Green branding does not mean a task has completed successfully. Give running, ready and successful states distinct labels, and review their icons alongside the primary action.",
        roles: ["--success", "--muted-foreground"],
      },
    ],
    type: {
      body: "Inter / Inter Variable",
      family: '"Inter Variable", Inter',
      display: "System sans",
      mono: "System mono",
      advice:
        "The body stack and display stack are intentionally separate. Keep operational data and identifiers in a stable mono rhythm, with enough line height for scanning.",
    },
    radius: "0.5rem",
    shape:
      "Direct geometry supports dense operational screens. Use spacing and charcoal surface steps to separate regions before adding heavy outlines.",
    example: "A clear signal for your next move.",
  },
  watson: {
    direction: "Loud where it acts, calm where it reads.",
    principles: [
      {
        title: "Pink acts, graphite supports",
        text: "The pink fill marks the action and turns aubergine on hover. Tags, switch tracks and secondary actions use graphite with white text so they never compete with the action.",
        roles: ["--primary", "--secondary"],
      },
      {
        title: "Fields and cards sit on light grey",
        text: "Inputs, cards and menus share the grey surface; the focused field darkens one step. Selection and errors still need their own cue: a pink bar, a red edge or a word.",
        roles: ["--muted", "--accent"],
      },
    ],
    type: {
      body: "Nunito Sans",
      family: '"Nunito Sans Variable"',
      display: "Onest",
      mono: "Fira Code / Fira Code Variable",
      advice:
        "Running text in Nunito Sans Medium, labels SemiBold, buttons Bold 16. Titles in Onest Black. Load both faces with @kamod-ch/themes/brands/watson-fonts.css.",
    },
    radius: "6px",
    shape:
      "4px corners on buttons, fields and tags, 10px on cards, menus and dialogs, fully round icon buttons and avatars. No shadows: surfaces and dividers separate the layers.",
    example: "A shared space with a little personality.",
  },
  professional: {
    direction: "Create a landmark, not a yellow page.",
    principles: [
      {
        title: "Pair the yellow with its intended ink",
        text: "The primary fill uses black foreground; it is not a small-text accent for a white background. Keep the surface and foreground together when building a custom call to action.",
        roles: ["--primary", "--primary-foreground"],
      },
      {
        title: "Let neutral controls support the landmark",
        text: "A black or light secondary action gives the primary action room to lead. Use yellow sparingly in navigation and distinguish warning messages through their own label and feedback role.",
        roles: ["--secondary", "--warning"],
      },
    ],
    type: {
      body: "Poppins",
      family: "Poppins",
      display: "Poppins",
      mono: "IBM Plex Mono",
      advice:
        "A geometric sans and a distinct mono can separate product information from identifiers or specifications. Keep long descriptions regular in weight instead of making the whole catalog bold.",
    },
    radius: "0.5rem",
    shape:
      "Compact corners suit catalogs, purchase flows and administration. Prefer clear section boundaries and aligned rows to decorative frames around each specification.",
    example: "One clear choice. Everything else in its place.",
  },
  "20min": {
    direction: "Let the headline lead and the blue decide.",
    principles: [
      {
        title: "One blue action per view",
        text: "Electric blue marks the action and the active section. Use the navy secondary or an outline for supporting choices so the next step stays obvious.",
        roles: ["--primary", "--secondary"],
      },
      {
        title: "Group with grey, not with shadows",
        text: "The site separates content with light grey surfaces, thin borders and whitespace. Keep cards flat and let spacing carry the structure.",
        roles: ["--muted", "--border"],
      },
    ],
    type: {
      body: "Matter",
      family: "Matter",
      display: "Matter",
      mono: "System mono",
      advice:
        "One family in several weights: regular for reading, medium for labels and buttons, bold for headlines. Matter is a commercial font; without a licence the preset falls back to system fonts.",
    },
    radius: "8px",
    shape:
      "Small 4px corners on buttons, fields and tags; 8px on cards and images. The contrast between the two keeps controls compact and content soft.",
    example: "Know what matters, in 20 minutes.",
  },
};
