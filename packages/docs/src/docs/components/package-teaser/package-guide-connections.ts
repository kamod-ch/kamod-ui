import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";

export type PackageGuideSlug = PackageTeaserConfig["slug"];

/** Lightweight identities avoid importing other guides and their examples to render a link. */
export const packageGuideIdentities = {
  "hooks-package": { title: "Hooks", path: "@kamod-ch/hooks" },
  "icons-package": { title: "Icons", path: "@kamod-ch/icons" },
  "i18n-package": { title: "i18n", path: "@kamod-ch/i18n" },
  "signals-package": { title: "Signals", path: "@kamod-ch/signals" },
  "state-package": { title: "State", path: "@kamod-ch/state" },
} satisfies Record<PackageGuideSlug, { title: string; path: string }>;

type Connection = { package: PackageGuideSlug; title: string; text: string };
type Ending = {
  companionIntro: string;
  companions: readonly Connection[];
  next: { title: string; text: string; href: string; label: string; check: string };
};

/** Curated handoffs describe responsibilities, not implicit integrations or new dependencies. */
export const packageGuideConnections = {
  "hooks-package": {
    companionIntro:
      "A good hook solves one behavior. Add a companion when your feature needs a longer lifetime, clearer transitions or a wider audience—not just another abstraction.",
    companions: [
      {
        package: "signals-package",
        title: "Let a preference travel",
        text: "A display preference can outgrow the component that first introduced it. Compare persistedSignal with useLocalStorageState when several screens need the same value; choose one owner instead of maintaining two writable copies.",
      },
      {
        package: "state-package",
        title: "Give a workflow a vocabulary",
        text: "Keep small interactions in hooks, then use named actions for a workflow shared across screens. A draft editor is a useful example: the store owns the draft, while the component owns whether its help panel is open.",
      },
      {
        package: "i18n-package",
        title: "Make the feedback speak",
        text: "Counters, loading messages and confirmation labels need complete translated sentences. Keep numeric values in the hook and format the message at the view boundary, so language changes do not reset the underlying interaction.",
      },
    ],
    next: {
      title: "One interaction, properly finished.",
      text: "Put the bounded quantity example into a real field: label the value, explain its limits and show what happens at the minimum and maximum. A working interaction is a better next milestone than a larger hook collection.",
      href: "/docs/input/installation",
      label: "Explore Input controls",
      check: "Try keyboard input, a repeated action and navigating away while work is pending.",
    },
  },
  "icons-package": {
    companionIntro:
      "An icon becomes useful when it explains a real action or state. These companions connect the SVG to behavior, language and a consistent source of truth.",
    companions: [
      {
        package: "hooks-package",
        title: "Put the symbol to work",
        text: "Connect a search, expand or favorite action to component-owned behavior. Let the surrounding button handle interaction and focus; useToggle can supply a simple state without making the SVG itself interactive.",
      },
      {
        package: "i18n-package",
        title: "Give every action a voice",
        text: "Translate visible labels and icon-only accessible names together. Choose words that describe the action rather than the picture, and review directional symbols separately when supporting a right-to-left interface.",
      },
      {
        package: "state-package",
        title: "Make status tell one story",
        text: "Map a workflow’s state to a label and an icon in one view helper. Saving, saved and failed should all reflect the same store value; avoid a second status flag that can disagree with the operation it describes.",
      },
    ],
    next: {
      title: "Small icon. Clear purpose.",
      text: "Choose a family in the catalog, copy the exact import and try it inside a real Button. Compare it beside neighboring actions at the actual rendered size; consistent visual weight matters more than matching SVG dimensions alone.",
      href: "/docs/button/installation",
      label: "Build an icon action",
      check: "Confirm the accessible name, keyboard focus and contrast in both color modes.",
    },
  },
  "i18n-package": {
    companionIntro:
      "Translation reaches beyond the message catalog. Connect the language choice, the controls around it and their feedback without making locale state responsible for every preference.",
    companions: [
      {
        package: "signals-package",
        title: "Remember the language choice",
        text: "Persist a validated locale preference when it should survive a visit. Decide how a saved choice interacts with a route or account setting; persistence supplies a value, not your application’s locale precedence or server request isolation.",
      },
      {
        package: "icons-package",
        title: "Make the language menu legible",
        text: "Pair a language symbol with the language’s own name rather than relying on a flag. Keep the name readable at narrow widths and give icon-only controls translated accessible labels; an icon family does not determine text direction.",
      },
      {
        package: "hooks-package",
        title: "Localize the whole interaction",
        text: "A counter or async interaction needs translated limits, pending feedback and errors as well as its button label. Keep the raw value and request state separate from formatted text, then render those messages through the active locale.",
      },
    ],
    next: {
      title: "Try a second language on a real screen.",
      text: "Take one form from its field instructions through validation and success feedback. Use a longer translation and a right-to-left locale to find assumptions that a short navigation label would miss.",
      href: "/docs/direction/installation",
      label: "Review direction-aware UI",
      check:
        "Check document lang, the relevant dir boundary and the server-to-client locale handoff.",
    },
  },
  "signals-package": {
    companionIntro:
      "Persistence gives a value a longer life. Keep the surrounding behavior, domain events and display text with the packages that own those responsibilities.",
    companions: [
      {
        package: "hooks-package",
        title: "Keep the temporary bits temporary",
        text: "Save the user’s preference, but keep an open menu or unfinished hover interaction local. Hooks help a component manage its own behavior while the persisted signal remains the single source for the durable value.",
      },
      {
        package: "state-package",
        title: "Separate remembering from deciding",
        text: "Use a reducer when a feature needs explicit domain transitions. If selected preferences also need persistence, define the read/write boundary deliberately; the State signals bridge does not automatically persist a store through this package.",
      },
      {
        package: "i18n-package",
        title: "Restore a preference, then resolve a locale",
        text: "A saved language identifier can inform the translation setup after validation. Specify precedence between storage, routing and server data, and resolve the initial locale consistently so restoring a preference does not flash the wrong language.",
      },
    ],
    next: {
      title: "Make a preference earn its place.",
      text: "Connect one harmless display setting to a Switch, reload the page and offer a clear reset. Test an older stored value too: a preference is only convenient when returning visitors can recover from changes to its shape.",
      href: "/docs/switch/installation",
      label: "Connect a preference control",
      check:
        "Check fresh storage, unavailable storage, sign-out behavior and restoring the default.",
    },
  },
  "state-package": {
    companionIntro:
      "A store is the home of domain facts. Give persistence, transient interaction and human-readable messages their own clear boundaries around it.",
    companions: [
      {
        package: "signals-package",
        title: "Remember only what should survive",
        text: "A workflow may keep a display preference across visits without saving every transient state. Decide exactly which values can be restored and how they re-enter the domain model; avoid two authoritative writers for the same fact.",
      },
      {
        package: "hooks-package",
        title: "Leave the interface room to breathe",
        text: "Keep a tooltip, temporary expansion or local focus behavior near its component. Hooks can own that presentation state while actions and selectors describe the shared workflow; every open panel does not need a reducer event.",
      },
      {
        package: "i18n-package",
        title: "Translate outcomes, not stored facts",
        text: "Store a stable status or error identifier, then translate its message in the consuming view. A language change should update the explanation without replaying an action, refetching a result or rewriting the underlying domain state.",
      },
    ],
    next: {
      title: "Finish one complete transition.",
      text: "Follow one user action through pending, success and failure, then show each result with an Alert. Keep the request outside the reducer and make retry behavior explicit, so the view explains what the model actually knows.",
      href: "/docs/alert/installation",
      label: "Give outcomes a clear voice",
      check:
        "Try repeated dispatch, a stale response and two independently created store instances.",
    },
  },
} satisfies Record<PackageGuideSlug, Ending>;

export const packageGuideHref = (slug: PackageGuideSlug) => `/docs/${slug}/installation`;

/** The page and its downloadable reference use identical resource purposes and destinations. */
export function packageSourceResources(config: PackageTeaserConfig) {
  return [
    {
      title: "Dedicated documentation",
      text: "Exact signatures, supported options and deeper examples.",
      href: config.externalDocsUrl,
    },
    {
      title: "Source & release history",
      text: "Implementation, release notes and the project’s issue tracker.",
      href: config.githubUrl,
    },
    {
      title: "Published package",
      text: "Compare the version and peer requirements with your lockfile.",
      href: config.npmUrl,
    },
  ];
}

/** Preserve the guide's attribution and license advice in every display/export format. */
export function packageSourceNotices(config: PackageTeaserConfig) {
  return [
    ...(config.slug === "icons-package"
      ? [
          "Icon artwork can carry its own upstream notices. Check the selected family’s source and license information in the repository before redistributing assets; the package’s license does not replace notices attached to individual icon sets.",
        ]
      : []),
    "When copying or distributing source, retain the applicable license and attribution notices from the version you use.",
  ];
}
