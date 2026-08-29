import type { CatalogAuthBlockId } from "@kamod-ch/blocks";

/** Preview-only MFA demo code. Not part of the productive AuthMfa API. */
export const AUTH_MFA_PREVIEW_CODE = "123456";

export const catalogAuthPreviewProps: Partial<Record<CatalogAuthBlockId, Record<string, unknown>>> =
  {
    "auth-mfa": {
      description: "Enter the 6-digit preview code 123456 from your authenticator app.",
      onVerify: (code: string) => code === AUTH_MFA_PREVIEW_CODE,
    },
  };
