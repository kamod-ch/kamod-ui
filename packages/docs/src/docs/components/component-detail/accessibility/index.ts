import { codeAccessibility } from "./code";
import { feedbackAccessibility } from "./feedback";
import { formischAccessibility } from "./formisch";
import { inputAccessibility } from "./inputs";
import { navigationAccessibility } from "./navigation";
import { overlayAccessibility } from "./overlays";
import { presentationAccessibility } from "./presentation";
import { typeDefinitionAccessibility } from "./type-definition";
import type { AccessibilityProfile, AccessibilityProfiles } from "./types";

const profiles: AccessibilityProfiles = {
  code: codeAccessibility,
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

/** Overlays, menus and form controls keep the full accessibility article. */
const detailedAccessibilitySlugs = new Set([
  "alert-dialog",
  "calendar",
  "checkbox",
  "combobox",
  "command",
  "context-menu",
  "date-picker",
  "dialog",
  "drawer",
  "dropdown",
  "dropzone",
  "field",
  "formisch",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "label",
  "menubar",
  "native-select",
  "navigation-menu",
  "popover",
  "radio-group",
  "select",
  "selectable-card",
  "sheet",
  "slider",
  "sonner",
  "switch",
  "textarea",
  "toast",
  "tooltip",
]);

export function usesDetailedAccessibility(slug: string): boolean {
  return detailedAccessibilitySlugs.has(slug);
}

export const accessibilityContents = [
  { id: "accessibility-foundation", label: "Built-in Behavior and Defaults" },
  { id: "accessibility-naming", label: "Labels and Relationships" },
  { id: "accessibility-interaction", label: "Keyboard and Focus" },
  { id: "accessibility-pitfalls", label: "States and Integration Details" },
  { id: "accessibility-review", label: "Verify the Complete Interaction" },
];

/** Keep rendered subsections and portable Markdown in the same order. */
export function accessibilitySections(profile: AccessibilityProfile) {
  return [profile.foundation, profile.naming, profile.interaction, profile.pitfalls].map(
    (text, index) => ({ ...accessibilityContents[index], text }),
  );
}
