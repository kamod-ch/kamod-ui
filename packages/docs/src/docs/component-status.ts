/**
 * Preserve upstream's existing Updated badges alongside significant contributor changes.
 * New additions require a variant or meaningful public API change; documentation, styling,
 * internal refactors and bug fixes alone do not qualify. Keep evidence beside entries and
 * retire badges deliberately when release notes cover them, not during contribution audits.
 */
export const docsUpdatedComponentSlugs = new Set([
  // Upstream baseline: 45e9f9f9 (parent of the first contributor commit, 238b342a).
  // Originally in docs/registry.ts; preserved when extracted by 891dce34.
  "popover",
  "tooltip",
  "toggle",
  "toggle-group",
  "tree",
  "typography",
  "textarea",
  "spinner",
  "switch",
  "tabs",

  // Local: new `callout` variant and exported AlertCallout composition API.
  "alert",
  // 24e97c8e / 238b342a: DropdownContent.portal and public useDropdown hook.
  "dropdown",
  // 4fee3830: reusable definition API; local titleMetadata/triggerHint slots.
  "type-definition",
]);

/** Newly available components; retire entries after their introduction is reflected in release notes. */
export const docsAddedComponentSlugs = new Set(["code"]);
