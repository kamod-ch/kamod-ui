/** Editorial claims are checked against the local implementation, not inferred from a component name. */
export type AccessibilityProfile = {
  foundation: string;
  naming: string;
  interaction: string;
  pitfalls: string;
  checks: readonly [string, string, string];
  example?: { title: string; note: string; code: string };
};
export type AccessibilityProfiles = Record<string, AccessibilityProfile>;
