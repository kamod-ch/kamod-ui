import type { CatalogAuthBlockId } from "@kamod-ch/blocks";
import authMfa from "../../../blocks/src/auth/auth-mfa/auth-mfa.tsx?raw";
import authPasswordReset from "../../../blocks/src/auth/auth-password-reset/auth-password-reset.tsx?raw";
import authSignIn from "../../../blocks/src/auth/auth-sign-in/auth-sign-in.tsx?raw";
import authSignUp from "../../../blocks/src/auth/auth-sign-up/auth-sign-up.tsx?raw";
import authLogin01 from "../../../blocks/src/auth/login-01/auth-login-01.tsx?raw";
import authLogin02 from "../../../blocks/src/auth/login-02/auth-login-02.tsx?raw";
import register01 from "../../../blocks/src/auth/register-01/register-01.tsx?raw";
import catalogForm from "../../../blocks/src/auth/shared/catalog-form.ts?raw";
import googleIcon from "../../../blocks/src/auth/shared/google-icon.tsx?raw";
import oauthRow from "../../../blocks/src/auth/shared/oauth-row.tsx?raw";
import statusMessage from "../../../blocks/src/auth/shared/status-message.tsx?raw";

const sources: Record<CatalogAuthBlockId, Record<string, string>> = {
  "auth-mfa": {
    "components/auth-mfa.tsx": authMfa,
    "components/catalog-form.ts": catalogForm,
  },
  "auth-password-reset": {
    "components/auth-password-reset.tsx": authPasswordReset,
    "components/catalog-form.ts": catalogForm,
    "components/status-message.tsx": statusMessage,
  },
  "auth-sign-in": {
    "components/auth-sign-in.tsx": authSignIn,
    "components/catalog-form.ts": catalogForm,
    "components/oauth-row.tsx": oauthRow,
    "components/status-message.tsx": statusMessage,
    "components/google-icon.tsx": googleIcon,
  },
  "auth-sign-up": {
    "components/auth-sign-up.tsx": authSignUp,
    "components/catalog-form.ts": catalogForm,
    "components/oauth-row.tsx": oauthRow,
    "components/status-message.tsx": statusMessage,
    "components/google-icon.tsx": googleIcon,
  },
  "login-01": {
    "components/auth-login-01.tsx": authLogin01,
    "components/catalog-form.ts": catalogForm,
    "components/oauth-row.tsx": oauthRow,
    "components/status-message.tsx": statusMessage,
    "components/google-icon.tsx": googleIcon,
  },
  "login-02": {
    "components/auth-login-02.tsx": authLogin02,
    "components/catalog-form.ts": catalogForm,
    "components/oauth-row.tsx": oauthRow,
    "components/status-message.tsx": statusMessage,
    "components/google-icon.tsx": googleIcon,
  },
  "register-01": {
    "components/register-01.tsx": register01,
    "components/catalog-form.ts": catalogForm,
    "components/oauth-row.tsx": oauthRow,
    "components/status-message.tsx": statusMessage,
    "components/google-icon.tsx": googleIcon,
  },
};

export const getCatalogAuthBlockSource = (id: CatalogAuthBlockId, fileLabel: string): string =>
  sources[id]?.[fileLabel] ?? Object.values(sources[id] ?? {})[0] ?? "";
