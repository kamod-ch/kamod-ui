import { ShieldCheckIcon, SparklesIcon, ZapIcon } from "@kamod-ch/icons/lucide";
import { Button, FieldError, Input, Label } from "@kamod-ch/ui";
import type { ComponentChildren, ComponentType } from "preact";
import { useRef, useState } from "preact/hooks";
import type { BlockLinkComponent } from "../../shared";
import { renderBlockLink } from "../../shared";
import {
  type CatalogOauthProvider,
  focusFirstError,
  GENERIC_AUTH_ERROR,
  isEmail,
  toSafeAuthMessage,
} from "../shared/catalog-form";
import { AuthOauthRow } from "../shared/oauth-row";
import { AuthStatusMessage } from "../shared/status-message";

export type AuthLogin02Bullet = {
  text: string;
  icon?: ComponentType<{ size?: number; class?: string }>;
};

export type AuthLogin02Payload = { email: string; password: string };

export type AuthLogin02Props = {
  brandName?: string;
  brandMark?: ComponentChildren;
  eyebrow?: string;
  headline?: string;
  headlineAccent?: string;
  lede?: string;
  bullets?: AuthLogin02Bullet[];
  copyright?: string;
  brandPanel?: ComponentChildren;
  title?: string;
  description?: string;
  signUpHref?: string;
  forgotPasswordHref?: string;
  oauthProviders?: CatalogOauthProvider[];
  onSubmit?: (payload: AuthLogin02Payload) => void | Promise<void>;
  onOauth?: (provider: CatalogOauthProvider) => void | Promise<void>;
  linkComponent?: BlockLinkComponent;
};

const defaultBullets: AuthLogin02Bullet[] = [
  { text: "One-command install, full source ownership", icon: ZapIcon },
  { text: "SOC 2 compliant, SSO out of the box", icon: ShieldCheckIcon },
  { text: "Themeable tokens, dark mode, RTL ready", icon: SparklesIcon },
];

export const AuthLogin02 = ({
  brandName = "Acme",
  brandMark,
  eyebrow = "Why teams switch",
  headline = "Ship features in",
  headlineAccent = "hours",
  lede = "Reusable components, opinionated defaults, and a registry that keeps your team writing product code instead of reinventing the same UI.",
  bullets = defaultBullets,
  copyright = `© ${new Date().getFullYear()} ${brandName}, Inc.`,
  brandPanel,
  title = "Welcome back",
  description = "Sign in to continue to your workspace.",
  signUpHref = "#",
  forgotPasswordHref = "#",
  oauthProviders = ["google", "github"],
  onSubmit,
  onOauth,
  linkComponent,
}: AuthLogin02Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!isEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setFieldErrors(next);
    setError("");
    setSuccess(false);
    if (Object.keys(next).length) {
      focusFirstError(formRef.current, next);
      return;
    }
    setPending(true);
    try {
      await onSubmit?.({ email, password });
      setSuccess(true);
    } catch (cause) {
      setError(toSafeAuthMessage(cause, GENERIC_AUTH_ERROR));
    } finally {
      setPending(false);
    }
  };

  const oauth = async (provider: CatalogOauthProvider) => {
    setError("");
    setSuccess(false);
    setPending(true);
    try {
      await onOauth?.(provider);
      setSuccess(true);
    } catch (cause) {
      setError(toSafeAuthMessage(cause, GENERIC_AUTH_ERROR));
    } finally {
      setPending(false);
    }
  };

  const panel = brandPanel ?? (
    <>
      <div class="relative z-[1] flex items-center gap-2.5 text-foreground">
        {brandMark ?? (
          <span class="grid size-8 place-items-center rounded-md bg-primary font-bold text-primary-foreground">
            {brandName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span class="text-base font-semibold">{brandName}</span>
      </div>
      <div class="relative z-[1] max-w-md">
        <p class="mb-3 text-[11px] font-medium tracking-[0.14em] text-muted-foreground/80 uppercase">
          {eyebrow}
        </p>
        <h2 class="text-3xl leading-tight font-semibold tracking-tight text-balance">
          {headline} <span class="text-primary">{headlineAccent}</span>, not sprints.
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{lede}</p>
        <ul class="mt-8 space-y-3 text-sm">
          {bullets.map((bullet) => {
            const Icon = bullet.icon;
            return (
              <li key={bullet.text} class="flex items-start gap-3">
                {Icon ? <Icon class="mt-0.5 shrink-0 text-primary" size={16} /> : null}
                <span class="text-foreground">{bullet.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <p class="relative z-[1] text-xs text-muted-foreground/70">{copyright}</p>
    </>
  );

  return (
    <div
      data-slot="block-auth-login-02"
      class="grid min-h-svh bg-background text-foreground lg:grid-cols-2"
    >
      <aside class="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-primary/5 p-12 lg:flex">
        {panel}
      </aside>
      <div class="flex items-center justify-center p-6 sm:p-12">
        <div class="w-full max-w-sm space-y-6">
          <div class="space-y-1.5 text-center lg:text-left">
            <h1 class="text-3xl font-semibold tracking-tight">{title}</h1>
            <p class="text-sm text-muted-foreground">{description}</p>
          </div>
          <form ref={formRef} class="grid gap-4" onSubmit={submit} noValidate>
            <div class="grid gap-2">
              <Label for="auth-login-02-email">Email</Label>
              <Input
                id="auth-login-02-email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                value={email}
                disabled={pending}
                aria-invalid={fieldErrors.email ? "true" : undefined}
                onInput={(event) => setEmail(event.currentTarget.value)}
              />
              <FieldError errors={fieldErrors.email ? [{ message: fieldErrors.email }] : []} />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center justify-between gap-3">
                <Label for="auth-login-02-password">Password</Label>
                {renderBlockLink(linkComponent, {
                  href: forgotPasswordHref,
                  class:
                    "text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
                  children: "Forgot?",
                })}
              </div>
              <Input
                id="auth-login-02-password"
                name="password"
                type="password"
                autocomplete="current-password"
                value={password}
                disabled={pending}
                aria-invalid={fieldErrors.password ? "true" : undefined}
                onInput={(event) => setPassword(event.currentTarget.value)}
              />
              <FieldError
                errors={fieldErrors.password ? [{ message: fieldErrors.password }] : []}
              />
            </div>
            {error ? <AuthStatusMessage tone="error">{error}</AuthStatusMessage> : null}
            {success ? (
              <AuthStatusMessage tone="success">Signed in. Continue in your app.</AuthStatusMessage>
            ) : null}
            <Button type="submit" class="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <AuthOauthRow
            providers={oauthProviders}
            disabled={pending}
            onOauth={oauth}
            label="Or"
            surfaceClass="bg-background"
          />
          <p class="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            {renderBlockLink(linkComponent, {
              href: signUpHref,
              class: "ml-1 font-medium text-foreground hover:underline",
              children: "Sign up",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
