export { focusFirstError, isEmail } from "./auth-utils";

export const GENERIC_AUTH_ERROR = "Something went wrong. Please try again.";

/** Never surface thrown error details in the UI. */
export const toSafeAuthMessage = (_error: unknown, fallback = GENERIC_AUTH_ERROR): string =>
  fallback;

export const defaultPasswordError = (password: string, minLength = 8): string | undefined => {
  if (password.length < minLength) return `Use at least ${minLength} characters.`;
  return undefined;
};

export type CatalogOauthProvider = "github" | "google";

export type CatalogPasswordRule = (password: string) => string | undefined;
