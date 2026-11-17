import type { ConsentManagerProps } from "./ConsentManager";
import { ConsentManager } from "./ConsentManager";
import type { ConsentManagerCategoryProps } from "./ConsentManagerCategory";
import { ConsentManagerCategory } from "./ConsentManagerCategory";
import type { ConsentManagerContentProps } from "./ConsentManagerContent";
import { ConsentManagerContent } from "./ConsentManagerContent";
import type { ConsentManagerSettingsProps } from "./ConsentManagerSettings";
import { ConsentManagerSettings } from "./ConsentManagerSettings";
import type { ConsentManagerSummaryProps } from "./ConsentManagerSummary";
import { ConsentManagerSummary } from "./ConsentManagerSummary";
import type { ConsentManagerTriggerProps } from "./ConsentManagerTrigger";
import { ConsentManagerTrigger } from "./ConsentManagerTrigger";
import type { ConsentState, ConsentStorage } from "./consentStorage";
import {
  type ConsentApi,
  type ConsentCategory,
  type ConsentManagerLabels,
  defaultConsentManagerLabels,
  useConsent,
} from "./useConsent";

export type {
  ConsentApi,
  ConsentCategory,
  ConsentManagerCategoryProps,
  ConsentManagerContentProps,
  ConsentManagerLabels,
  ConsentManagerProps,
  ConsentManagerSettingsProps,
  ConsentManagerSummaryProps,
  ConsentManagerTriggerProps,
  ConsentState,
  ConsentStorage,
};
export {
  ConsentManager,
  ConsentManagerCategory,
  ConsentManagerContent,
  ConsentManagerSettings,
  ConsentManagerSummary,
  ConsentManagerTrigger,
  defaultConsentManagerLabels,
  useConsent,
};

export default {
  Root: ConsentManager,
  Content: ConsentManagerContent,
  Summary: ConsentManagerSummary,
  Settings: ConsentManagerSettings,
  Category: ConsentManagerCategory,
  Trigger: ConsentManagerTrigger,
};
