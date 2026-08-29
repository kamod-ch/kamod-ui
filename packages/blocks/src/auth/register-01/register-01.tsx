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
  type CatalogPasswordRule,
  defaultPasswordError,
  focusFirstError,
  GENERIC_AUTH_ERROR,
  isEmail,
  toSafeAuthMessage,
} from "../shared/catalog-form";
import { AuthOauthRow } from "../shared/oauth-row";
import { AuthStatusMessage } from "../shared/status-message";

export type Register01Payload = {
  name: string;
  email: string;
  password: string;
};

export type Register01Props = {
  title?: string;
  description?: string;
  signInHref?: string;
  termsHref?: string;
  privacyHref?: string;
  oauthProviders?: CatalogOauthProvider[];
  minPasswordLength?: number;
  validatePassword?: CatalogPasswordRule;
  onSubmit?: (payload: Register01Payload) => void | Promise<void>;
  onOauth?: (provider: CatalogOauthProvider) => void | Promise<void>;
  linkComponent?: BlockLinkComponent;
};

export const Register01 = ({
  title = "Create an account",
  description = "Enter your details to get started.",
  signInHref = "#",
  termsHref = "#",
  privacyHref = "#",
  oauthProviders = ["google", "github"],
  minPasswordLength = 8,
  validatePassword,
  onSubmit,
  onOauth,
  linkComponent,
}: Register01Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const passwordRule =
    validatePassword ?? ((value: string) => defaultPasswordError(value, minPasswordLength));

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!isEmail(email)) next.email = "Enter a valid email address.";
    const passwordMessage = passwordRule(password);
    if (passwordMessage) next.password = passwordMessage;
    if (password !== confirm) next.confirm = "Passwords don't match.";
    if (!accepted) next.terms = "Accept the terms to continue.";
    setFieldErrors(next);
    setError("");
    setSuccess(false);
    if (Object.keys(next).length) {
      focusFirstError(formRef.current, next);
      return;
    }
    setPending(true);
    try {
      await onSubmit?.({ name, email, password });
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
      data-slot="block-register-01"
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
              <Label for="register-01-name">Name</Label>
              <Input
                id="register-01-name"
                name="name"
                autocomplete="name"
                value={name}
                disabled={pending}
                aria-invalid={fieldErrors.name ? "true" : undefined}
                onInput={(event) => setName(event.currentTarget.value)}
              />
              <FieldError errors={fieldErrors.name ? [{ message: fieldErrors.name }] : []} />
            </div>
            <div class="grid gap-2">
              <Label for="register-01-email">Email</Label>
              <Input
                id="register-01-email"
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
              <Label for="register-01-password">Password</Label>
              <Input
                id="register-01-password"
                name="password"
                type="password"
                autocomplete="new-password"
                value={password}
                disabled={pending}
                aria-invalid={fieldErrors.password ? "true" : undefined}
                onInput={(event) => setPassword(event.currentTarget.value)}
              />
              <FieldError
                errors={fieldErrors.password ? [{ message: fieldErrors.password }] : []}
              />
            </div>
            <div class="grid gap-2">
              <Label for="register-01-confirm">Confirm password</Label>
              <Input
                id="register-01-confirm"
                name="confirm"
                type="password"
                autocomplete="new-password"
                value={confirm}
                disabled={pending}
                aria-invalid={fieldErrors.confirm ? "true" : undefined}
                onInput={(event) => setConfirm(event.currentTarget.value)}
              />
              <FieldError errors={fieldErrors.confirm ? [{ message: fieldErrors.confirm }] : []} />
            </div>
            <div class="flex items-start gap-2">
              <Checkbox
                id="register-01-terms"
                name="terms"
                checked={accepted}
                disabled={pending}
                aria-invalid={fieldErrors.terms ? "true" : undefined}
                onCheckedChange={(value) => setAccepted(value === true)}
              />
              <Label for="register-01-terms" class="text-sm leading-snug font-normal">
                I agree to the{" "}
                {renderBlockLink(linkComponent, {
                  href: termsHref,
                  class: "text-foreground underline-offset-4 hover:underline",
                  children: "Terms",
                })}{" "}
                and{" "}
                {renderBlockLink(linkComponent, {
                  href: privacyHref,
                  class: "text-foreground underline-offset-4 hover:underline",
                  children: "Privacy Policy",
                })}
                .
              </Label>
            </div>
            {fieldErrors.terms ? <FieldError errors={[{ message: fieldErrors.terms }]} /> : null}
            {error ? <AuthStatusMessage tone="error">{error}</AuthStatusMessage> : null}
            {success ? (
              <AuthStatusMessage tone="success">
                Account created. Continue in your app.
              </AuthStatusMessage>
            ) : null}
            <Button type="submit" class="w-full" disabled={pending}>
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <AuthOauthRow providers={oauthProviders} disabled={pending} onOauth={oauth} />
        </CardContent>
        <CardFooter class="justify-center">
          <p class="text-xs text-muted-foreground">
            Already have an account?{" "}
            {renderBlockLink(linkComponent, {
              href: signInHref,
              class: "ml-1 font-medium text-foreground hover:underline",
              children: "Sign in",
            })}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
