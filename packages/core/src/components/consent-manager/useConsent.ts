import type { Signal } from "@preact/signals";
import type { ComponentChildren } from "preact";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { ConsentState } from "./consentStorage";

export type ConsentCategory = {
  id: string;
  title: string;
  description: string;
  /** Stays enabled. The switch is on and cannot be turned off. */
  required?: boolean;
  /** Initial switch position before a decision exists. Defaults to false. */
  defaultEnabled?: boolean;
  /** Extra copy revealed by the accordion. */
  details?: ComponentChildren;
};

export type ConsentManagerLabels = {
  title: string;
  description: string;
  acceptAll: string;
  necessaryOnly: string;
  settings: string;
  settingsTitle: string;
  settingsDescription: string;
  save: string;
  back: string;
};

export const defaultConsentManagerLabels: ConsentManagerLabels = {
  title: "Your privacy, your choice",
  description:
    "We use cookies to run this site, measure usage, and personalize content. Necessary cookies stay on. Everything else is your choice.",
  acceptAll: "Accept all",
  necessaryOnly: "Necessary only",
  settings: "Settings",
  settingsTitle: "Cookie settings",
  settingsDescription: "Choose which categories you allow. You can change this choice later.",
  save: "Save selection",
  back: "Back",
};

export type ConsentManagerView = "summary" | "settings";

export type ConsentContextValue = {
  categories: readonly ConsentCategory[];
  labels: ConsentManagerLabels;
  consent: Signal<ConsentState | null>;
  draft: Signal<Record<string, boolean>>;
  view: Signal<ConsentManagerView>;
  hasConsent: (id: string) => boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: () => void;
  open: () => void;
  back: () => void;
  setCategory: (id: string, enabled: boolean) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export const ConsentProvider = ConsentContext.Provider;

export const useConsentContext = (): ConsentContextValue => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentManager");
  }
  return context;
};

export type ConsentApi = {
  /** Saved decision, or null until the person chooses. */
  state: ConsentState | null;
  /** Required categories are always allowed. Optional ones follow the saved decision. */
  hasConsent: (id: string) => boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: () => void;
  /** Opens the settings level with the saved switches. */
  open: () => void;
};

/** Read and update the decision from inside ConsentManager. */
export const useConsent = (): ConsentApi => {
  const context = useConsentContext();
  const state = context.consent.value;
  return {
    state,
    hasConsent: (id) => {
      const category = context.categories.find((item) => item.id === id);
      if (!category) return false;
      if (category.required) return true;
      return context.consent.value?.categories[id] === true;
    },
    acceptAll: context.acceptAll,
    rejectAll: context.rejectAll,
    save: context.save,
    open: context.open,
  };
};
