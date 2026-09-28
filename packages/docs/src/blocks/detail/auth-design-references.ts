import type { LoginBlockId, SignupBlockId } from "../../../../blocks/src/auth/types";

/** Layout matches verified against shadcn/ui's registry and the local page/form sources. */
export const authDesignReferences = {
  "login-01": {
    focus:
      "the centered form, readable field width and separation between credentials and provider actions",
    adaptation:
      "The Kamod form adds local validation and submission feedback. Connect its callbacks to real sign-in and provider flows; the visual reference does not configure authentication for your app.",
  },
  "login-02": {
    focus: "the balance between a branded form column and the large cover area on wider screens",
    adaptation:
      "Kamod keeps the split-page arrangement and hides the cover below 1024px. Replace the sample branding and artwork while keeping important instructions within the form column.",
  },
  "login-03": {
    focus:
      "the contrast between a compact sign-in surface and a muted surrounding page, with branding above",
    adaptation:
      "Kamod places the form in an explicit core Card and uses semantic theme colors. Treat the reference as guidance for spacing and hierarchy, not a requirement to reproduce every field or provider option.",
  },
  "login-04": {
    focus:
      "the shared card containing the form and image, including how the image supports rather than dominates the sign-in task",
    adaptation:
      "Kamod assembles the form and cover inside a core Card and hides the image below 768px. Keep the form usable on its own; the cover should not carry essential sign-in instructions.",
  },
  "login-05": {
    focus:
      "the minimal email-first layout and the distinction between submitting an email address and choosing a social provider",
    adaptation:
      "The Kamod email-only callback receives MagicLinkValues. Your service must send the sign-in link and handle its completion; the demo’s success state does not mean an email was sent.",
  },
  "signup-01": {
    focus:
      "the compact registration form and the order of identity fields, the primary action and the return-to-login link",
    adaptation:
      "Kamod adds form validation, submission feedback and a required terms checkbox. Your service owns account creation, and any consent record must be added to your application’s contract explicitly.",
  },
  "signup-02": {
    focus:
      "the registration column beside a larger cover area, with branding kept close to the form",
    adaptation:
      "The Kamod cover disappears below 1024px while the form and branding remain. Keep registration requirements and legal information in that persistent column rather than placing them in the artwork.",
  },
  "signup-03": {
    focus:
      "the centered registration surface, its contrast with the muted background and the brand placement above it",
    adaptation:
      "Kamod uses a core Card around the registration form. Validation and service callbacks belong to the form; the surrounding card supplies presentation rather than an account-management implementation.",
  },
  "signup-04": {
    focus:
      "the form-and-image card and how the registration content remains readable when the image is removed",
    adaptation:
      "Kamod places both columns in a shared core Card and hides the cover below 768px. Test your actual field errors and consent wording without the image, since they determine the form’s required height.",
  },
  "signup-05": {
    focus:
      "the relationship between registration fields, the primary submit action and alternative provider buttons",
    adaptation:
      "This Kamod page enables showSocial on SignupForm. Connect onSubmit and onSocialSignup separately; showing GitHub and Google buttons does not set up OAuth or create a user account.",
  },
} satisfies Record<LoginBlockId | SignupBlockId, { focus: string; adaptation: string }>;
