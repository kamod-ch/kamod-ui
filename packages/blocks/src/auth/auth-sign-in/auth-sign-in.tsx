import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  FieldError,
  Input,
  Label,
} from "@kamod-ch/ui";
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

export type AuthSignInPayload = {
  email: string;
  password: string;
  remember: boolean;
};

export type AuthSignInProps = {
  title?: string;
  description?: string;
  signUpHref?: string;
  forgotPasswordHref?: string;
  oauthProviders?: CatalogOauthProvider[];
  onSubmit?: (payload: AuthSignInPayload) => void | Promise<void>;
  onOauth?: (provider: CatalogOauthProvider) => void | Promise<void>;
  linkComponent?: BlockLinkComponent;
};

export const AuthSignIn = ({
  title = "Welcome back",
  description = "Sign in to your account to continue",
  signUpHref = "#",
  forgotPasswordHref = "#",
  oauthProviders = ["github", "google"],
  onSubmit,
  onOauth,
  linkComponent,
}: AuthSignInProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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
      await onSubmit?.({ email, password, remember });
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

  return (
    <div
      data-slot="block-auth-sign-in"
      class="flex min-h-svh items-center justify-center bg-background p-6 text-foreground"
    >
      <Card class="w-full max-w-sm">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <form ref={formRef} class="grid gap-4" onSubmit={submit} noValidate>
            <div class="grid gap-2">
              <Label for="auth-sign-in-email">Email</Label>
              <Input
                id="auth-sign-in-email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@company.com"
                value={email}
                disabled={pending}
                aria-invalid={fieldErrors.email ? "true" : undefined}
                onInput={(event) => setEmail(event.currentTarget.value)}
              />
              <FieldError errors={fieldErrors.email ? [{ message: fieldErrors.email }] : []} />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center justify-between gap-3">
                <Label for="auth-sign-in-password">Password</Label>
                {renderBlockLink(linkComponent, {
                  href: forgotPasswordHref,
                  class:
                    "text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
                  children: "Forgot password?",
                })}
              </div>
              <Input
                id="auth-sign-in-password"
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
            <div class="flex items-center gap-2">
              <Checkbox
                id="auth-sign-in-remember"
                name="remember"
                checked={remember}
                disabled={pending}
                onCheckedChange={(value) => setRemember(value === true)}
              />
              <Label for="auth-sign-in-remember" class="text-sm font-normal">
                Remember me for 30 days
              </Label>
            </div>
            {error ? <AuthStatusMessage tone="error">{error}</AuthStatusMessage> : null}
            {success ? (
              <AuthStatusMessage tone="success">Signed in. Continue in your app.</AuthStatusMessage>
            ) : null}
            <Button type="submit" class="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <AuthOauthRow providers={oauthProviders} disabled={pending} onOauth={oauth} />
        </CardContent>
        <CardFooter class="justify-center">
          <p class="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            {renderBlockLink(linkComponent, {
              href: signUpHref,
              class: "font-medium text-foreground underline-offset-4 hover:underline",
              children: "Sign up",
            })}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
