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
    fits: ["News", "Community", "Editorial tools"],
    title: "Invite readers into the conversation",
    task: "Build a comment form with a grey field, a pink Send action and a graphite tag. Show the focused, invalid and disabled states side by side.",
    check:
      "The pink action keeps a 16px bold label, and the invalid field shows its red edge and a message.",
  },
  professional: {
    fits: ["Commerce", "Product catalogs", "Administration"],
    title: "Make a purchase decision unmistakable",
    task: "Build a product summary with one yellow confirmation action and its dark foreground. Keep comparison and cancellation neutral.",
    check: "The confirmation and any warning have separate wording and visual roles.",
  },
  "20min": {
    fits: ["News", "Content feeds", "Media apps"],
    title: "Build a news section with one clear next step",
    task: "Combine section tabs, a teaser card with an 8px image and a blue Discover action. Add a navy secondary action and an outline Load more.",
    check:
      "The active tab and the primary action are both blue but remain clearly different elements.",
  },
  redhat: {
    fits: ["Enterprise consoles", "Documentation", "Product sites"],
    title: "Configure a cluster without losing your place",
    task: "Combine tabs with a red active bar, a form with outlined and filled blue actions, and status tags for running, degraded and failed nodes.",
    check:
      "Red only marks location and brand; every clickable action is blue and errors use red-orange with a label.",
  },
};
