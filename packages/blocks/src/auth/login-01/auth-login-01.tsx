import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

export type AuthLogin01Payload = { email: string; password: string };

export type AuthLogin01Props = {
  title?: string;
  description?: string;
  signUpHref?: string;
  forgotPasswordHref?: string;
  oauthProviders?: CatalogOauthProvider[];
  onSubmit?: (payload: AuthLogin01Payload) => void | Promise<void>;
  onOauth?: (provider: CatalogOauthProvider) => void | Promise<void>;
  linkComponent?: BlockLinkComponent;
};

export const AuthLogin01 = ({
  title = "Welcome back",
  description = "Sign in to your account to continue.",
  signUpHref = "#",
  forgotPasswordHref = "#",
  oauthProviders = ["google", "github"],
  onSubmit,
  onOauth,
  linkComponent,
}: AuthLogin01Props) => {
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

  return (
    <div
      data-slot="block-auth-login-01"
      class="flex min-h-svh items-center justify-center bg-muted/30 p-6 text-foreground"
    >
      <Card class="w-full max-w-sm">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <form ref={formRef} class="grid gap-4" onSubmit={submit} noValidate>
            <div class="grid gap-2">
              <Label for="auth-login-01-email">Email</Label>
              <Input
                id="auth-login-01-email"
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
                <Label for="auth-login-01-password">Password</Label>
                {renderBlockLink(linkComponent, {
                  href: forgotPasswordHref,
                  class:
                    "text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
                  children: "Forgot password?",
                })}
              </div>
              <Input
                id="auth-login-01-password"
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
          <AuthOauthRow providers={oauthProviders} disabled={pending} onOauth={oauth} />
        </CardContent>
        <CardFooter class="justify-center">
          <p class="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            {renderBlockLink(linkComponent, {
              href: signUpHref,
              class: "ml-1 font-medium text-foreground hover:underline",
              children: "Sign up",
            })}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
