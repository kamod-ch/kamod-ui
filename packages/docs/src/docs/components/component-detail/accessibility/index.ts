import { feedbackAccessibility } from "./feedback";
import { formischAccessibility } from "./formisch";
import { inputAccessibility } from "./inputs";
import { navigationAccessibility } from "./navigation";
import { overlayAccessibility } from "./overlays";
import { presentationAccessibility } from "./presentation";
import { typeDefinitionAccessibility } from "./type-definition";
import type { AccessibilityProfile, AccessibilityProfiles } from "./types";

const profiles: AccessibilityProfiles = {
  ...inputAccessibility,
  ...navigationAccessibility,
  ...overlayAccessibility,
  ...feedbackAccessibility,
  ...presentationAccessibility,
  formisch: formischAccessibility,
  "type-definition": typeDefinitionAccessibility,
};

/** Undefined deliberately retains the existing section for other documentation families. */
export function componentAccessibility(slug: string): AccessibilityProfile | undefined {
  return profiles[slug];
}

export const accessibilityContents = [
  { id: "accessibility-foundation", label: "Built-in behavior and defaults" },
  { id: "accessibility-naming", label: "Labels and relationships" },
  { id: "accessibility-interaction", label: "Keyboard and focus" },
  { id: "accessibility-pitfalls", label: "States and integration details" },
  { id: "accessibility-review", label: "Verify the complete interaction" },
];

/** Keep rendered subsections and portable Markdown in the same order. */
export function accessibilitySections(profile: AccessibilityProfile) {
  return [profile.foundation, profile.naming, profile.interaction, profile.pitfalls].map(
    (text, index) => ({ ...accessibilityContents[index], text }),
  );
}
