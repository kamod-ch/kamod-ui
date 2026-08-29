import type { CatalogBlockDefinition, CatalogBlockFile } from "../shared";
import { AuthMfa } from "./auth-mfa";
import { AuthPasswordReset } from "./auth-password-reset";
import { AuthSignIn } from "./auth-sign-in";
import { AuthSignUp } from "./auth-sign-up";
import { AuthLogin01 } from "./login-01";
import { AuthLogin02 } from "./login-02";
import { Register01 } from "./register-01";

export type CatalogAuthBlockId =
  | "auth-mfa"
  | "auth-password-reset"
  | "auth-sign-in"
  | "auth-sign-up"
  | "login-01"
  | "login-02"
  | "register-01";

export type CatalogAuthBlockDefinition = CatalogBlockDefinition<CatalogAuthBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const catalog = (id: CatalogAuthBlockId) => `https://uipkge.dev/react/blocks/${id}`;

const componentFile = (id: CatalogAuthBlockId, fileName: string): CatalogBlockFile => ({
  path: `src/auth/${id}/${fileName}`,
  label: `components/${fileName}`,
  kind: "component",
});

const support = (path: string, label: string): CatalogBlockFile => ({
  path,
  label,
  kind: "support",
});

const usage = (id: CatalogAuthBlockId, name: string) =>
  `import { ${name} } from "@kamod-ch/blocks/auth/${id}";\n\nexport const Example = () => <${name} />;`;

const sharedForm = support("src/auth/shared/catalog-form.ts", "components/catalog-form.ts");
const oauthRow = support("src/auth/shared/oauth-row.tsx", "components/oauth-row.tsx");
const statusMessage = support(
  "src/auth/shared/status-message.tsx",
  "components/status-message.tsx",
);
const googleIcon = support("src/auth/shared/google-icon.tsx", "components/google-icon.tsx");

const components = {
  "auth-mfa": AuthMfa,
  "auth-password-reset": AuthPasswordReset,
  "auth-sign-in": AuthSignIn,
  "auth-sign-up": AuthSignUp,
  "login-01": AuthLogin01,
  "login-02": AuthLogin02,
  "register-01": Register01,
} satisfies Record<CatalogAuthBlockId, CatalogAuthBlockDefinition["component"]>;

const definitions: Omit<CatalogAuthBlockDefinition, "component" | "installCommand" | "source">[] = [
  {
    id: "auth-mfa",
    title: "Auth MFA",
    description:
      "Authenticator OTP with configurable length, optional auto-submit, async verify, and a resend cooldown.",
    category: "auth",
    catalogUrl: catalog("auth-mfa"),
    files: [componentFile("auth-mfa", "auth-mfa.tsx"), sharedForm],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Card", "InputOTP"],
    tags: ["auth", "mfa", "otp"],
    features: ["configurable-length", "auto-submit", "async-verify", "timer-cleanup"],
    preview: { height: 720, fullWidth: true },
    props: [
      { name: "length", type: "number", description: "OTP length. Defaults to 6." },
      {
        name: "autoSubmit",
        type: "boolean",
        description: "Verify when the code is complete. Defaults to true.",
      },
      {
        name: "onVerify",
        type: "(code: string) => boolean | void | Promise<boolean | void>",
        description: "Async verifier. Return false or throw to show a safe error.",
      },
      {
        name: "onResend",
        type: "() => void | Promise<void>",
        description: "Resend callback. Starts the cooldown after success.",
      },
      {
        name: "resendCooldown",
        type: "number",
        description: "Seconds before resend is available again.",
      },
      {
        name: "linkComponent",
        type: "BlockLinkComponent",
        description: "Router-neutral link adapter.",
      },
    ],
    usage: usage("auth-mfa", "AuthMfa"),
  },
  {
    id: "auth-password-reset",
    title: "Auth Password Reset",
    description: "Request, sent, reset, and done stages for a password-reset flow.",
    category: "auth",
    catalogUrl: catalog("auth-password-reset"),
    files: [
      componentFile("auth-password-reset", "auth-password-reset.tsx"),
      sharedForm,
      statusMessage,
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Card", "FieldError", "Input", "Label"],
    tags: ["auth", "password-reset"],
    features: ["explicit-stages", "controlled-stage", "async-callbacks", "no-demo-advance"],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "stage",
        type: '"request" | "sent" | "reset" | "done"',
        description: "Controlled stage.",
      },
      {
        name: "onStageChange",
        type: "(stage: PasswordResetStage) => void",
        description: "Stage-change callback.",
      },
      {
        name: "onRequest",
        type: "(email: string) => void | Promise<void>",
        description: "Send-reset-link callback.",
      },
      {
        name: "onReset",
        type: "(password: string) => void | Promise<void>",
        description: "Set-new-password callback.",
      },
      {
        name: "showSentAdvance",
        type: "boolean",
        description: "Opt-in control to move from sent to reset. Off by default.",
      },
    ],
    usage: usage("auth-password-reset", "AuthPasswordReset"),
  },
  {
    id: "auth-sign-in",
    title: "Auth Sign In",
    description: "Full-page sign-in with remember-me, OAuth buttons, and forgot/signup links.",
    category: "auth",
    catalogUrl: catalog("auth-sign-in"),
    files: [
      componentFile("auth-sign-in", "auth-sign-in.tsx"),
      sharedForm,
      oauthRow,
      statusMessage,
      googleIcon,
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Card", "Checkbox", "FieldError", "Input", "Label"],
    tags: ["auth", "sign-in"],
    features: ["remember-me", "oauth-callbacks", "async-submit", "link-adapter"],
    preview: { height: 820, fullWidth: true },
    props: [
      {
        name: "onSubmit",
        type: "(payload: AuthSignInPayload) => void | Promise<void>",
        description: "Email, password, and remember flag.",
      },
      {
        name: "onOauth",
        type: "(provider: CatalogOauthProvider) => void | Promise<void>",
        description: "OAuth button callback. No provider SDKs.",
      },
      {
        name: "oauthProviders",
        type: "CatalogOauthProvider[]",
        description: "Visible OAuth buttons. github and/or google.",
      },
      {
        name: "linkComponent",
        type: "BlockLinkComponent",
        description: "Router-neutral link adapter.",
      },
    ],
    usage: usage("auth-sign-in", "AuthSignIn"),
  },
  {
    id: "auth-sign-up",
    title: "Auth Sign Up",
    description: "Registration card with password confirmation, terms gate, and OAuth.",
    category: "auth",
    catalogUrl: catalog("auth-sign-up"),
    files: [
      componentFile("auth-sign-up", "auth-sign-up.tsx"),
      sharedForm,
      oauthRow,
      statusMessage,
      googleIcon,
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Card", "Checkbox", "FieldError", "Input", "Label"],
    tags: ["auth", "sign-up"],
    features: ["password-confirm", "terms-gate", "custom-password-rules", "async-submit"],
    preview: { height: 920, fullWidth: true },
    props: [
      {
        name: "onSubmit",
        type: "(payload: AuthSignUpPayload) => void | Promise<void>",
        description: "Name, email, and password.",
      },
      {
        name: "validatePassword",
        type: "CatalogPasswordRule",
        description: "Optional extra password rules from the consumer.",
      },
      {
        name: "onOauth",
        type: "(provider: CatalogOauthProvider) => void | Promise<void>",
        description: "OAuth button callback.",
      },
    ],
    usage: usage("auth-sign-up", "AuthSignUp"),
  },
  {
    id: "login-01",
    title: "Auth Login 01",
    description:
      "Compact muted-background login card with SSO. Distinct from the existing Login01 block.",
    category: "auth",
    catalogUrl: catalog("login-01"),
    files: [
      componentFile("login-01", "auth-login-01.tsx"),
      sharedForm,
      oauthRow,
      statusMessage,
      googleIcon,
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Card", "FieldError", "Input", "Label"],
    tags: ["auth", "login"],
    features: ["compact-card", "oauth-callbacks", "forgot-link"],
    preview: { height: 780, fullWidth: true },
    props: [
      {
        name: "onSubmit",
        type: "(payload: AuthLogin01Payload) => void | Promise<void>",
        description: "Email and password. No remember-me control.",
      },
      {
        name: "onOauth",
        type: "(provider: CatalogOauthProvider) => void | Promise<void>",
        description: "OAuth button callback.",
      },
    ],
    usage: usage("login-01", "AuthLogin01"),
  },
  {
    id: "login-02",
    title: "Auth Login 02",
    description: "Split login with a configurable brand panel that collapses on small screens.",
    category: "auth",
    catalogUrl: catalog("login-02"),
    files: [
      componentFile("login-02", "auth-login-02.tsx"),
      sharedForm,
      oauthRow,
      statusMessage,
      googleIcon,
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "FieldError", "Input", "Label"],
    tags: ["auth", "login", "split"],
    features: ["mobile-form-only", "brand-panel-slot", "oauth-callbacks"],
    preview: { height: 860, fullWidth: true },
    props: [
      {
        name: "brandPanel",
        type: "ComponentChildren",
        description: "Replace the entire left-hand brand panel.",
      },
      {
        name: "bullets",
        type: "AuthLogin02Bullet[]",
        description: "Brand-panel selling points with optional icons.",
      },
      {
        name: "onSubmit",
        type: "(payload: AuthLogin02Payload) => void | Promise<void>",
        description: "Email and password.",
      },
    ],
    usage: usage("login-02", "AuthLogin02"),
  },
  {
    id: "register-01",
    title: "Register 01",
    description: "Compact muted-background registration card with terms gate and SSO.",
    category: "auth",
    catalogUrl: catalog("register-01"),
    files: [
      componentFile("register-01", "register-01.tsx"),
      sharedForm,
      oauthRow,
      statusMessage,
      googleIcon,
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Card", "Checkbox", "FieldError", "Input", "Label"],
    tags: ["auth", "register"],
    features: ["password-confirm", "terms-gate", "compact-card"],
    preview: { height: 920, fullWidth: true },
    props: [
      {
        name: "onSubmit",
        type: "(payload: Register01Payload) => void | Promise<void>",
        description: "Name, email, and password.",
      },
      {
        name: "validatePassword",
        type: "CatalogPasswordRule",
        description: "Optional extra password rules.",
      },
      {
        name: "onOauth",
        type: "(provider: CatalogOauthProvider) => void | Promise<void>",
        description: "OAuth button callback.",
      },
    ],
    usage: usage("register-01", "Register01"),
  },
];

export const catalogAuthBlocks: CatalogAuthBlockDefinition[] = definitions.map((block) => ({
  ...block,
  source: "uipkge",
  component: components[block.id],
  installCommand: `@kamod-ch/blocks/auth/${block.id}`,
}));

export const catalogAuthBlocksById = catalogAuthBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<CatalogAuthBlockId, CatalogAuthBlockDefinition>,
);
