import type { ThemePresetId } from "@kamod-ch/themes";

type PresetExercise = {
  fits: readonly [string, string, string];
  title: string;
  task: string;
  check: string;
};

/** Product exercises make the design advice testable without adding more live demos. */
export const presetExercises: Record<ThemePresetId, PresetExercise> = {
  kamod: {
    fits: ["Settings", "Documentation", "Everyday tools"],
    title: "One preference, one clear action",
    task: "Give a settings form one primary Save action. Keep reset and help secondary, then add a visible saved message.",
    check: "The main action, keyboard focus and saved result remain distinct.",
  },
  shadcn: {
    fits: ["Data tables", "Admin screens", "Utility panels"],
    title: "Make a dense list easy to follow",
    task: "Place a search field above a record list. Use spacing and boundaries to separate the selected row from nearby actions.",
    check: "Selection, hover and focus are recognizable without extra shadows.",
  },
  ocean: {
    fits: ["Workspaces", "Account settings", "Dashboards"],
    title: "Give two actions different jobs",
    task: "Pair a cyan Save action with an indigo supporting action. Keep the same assignment in the following confirmation panel.",
    check: "Primary and supporting actions keep their meaning in both appearances.",
  },
  sunset: {
    fits: ["Onboarding", "Creative tools", "Welcoming flows"],
    title: "Welcome someone through a real form",
    task: "Build a short welcome form with one rose Continue action. Use warm supporting surfaces and show an explicit validation message.",
    check: "An error reads as feedback rather than another brand-colored action.",
  },
  "cursor-warm": {
    fits: ["Editors", "Project spaces", "Long-form content"],
    title: "Turn a note into a small editor",
    task: "Place a white editing card on the warm page. Reserve orange for Save, with a quieter control for returning to the list.",
    check: "Long text stays comfortable and the next action is easy to locate.",
  },
  voltage: {
    fits: ["Automation", "Technical consoles", "Operations"],
    title: "Run a task and explain the result",
    task: "Use emerald for Run, then display pending, completed and failed results with clear words and icons alongside the action.",
    check: "The green brand action never implies that a task has already succeeded.",
  },
  watson: {
    fits: ["Collaboration", "Social products", "Expressive tools"],
    title: "Invite someone into a shared space",
    task: "Let a pink Invite action lead. Use cyan for a supporting destination, and compare the selected and disabled invitation states.",
    check: "A pink-tinted surface alone does not communicate selection or a disabled state.",
  },
  professional: {
    fits: ["Commerce", "Product catalogs", "Administration"],
    title: "Make a purchase decision unmistakable",
    task: "Build a product summary with one yellow confirmation action and its dark foreground. Keep comparison and cancellation neutral.",
    check: "The confirmation and any warning have separate wording and visual roles.",
  },
};
