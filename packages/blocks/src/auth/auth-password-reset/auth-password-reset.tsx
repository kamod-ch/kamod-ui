import { ArrowLeftIcon, MailCheckIcon } from "@kamod-ch/icons/lucide";
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
import { renderBlockLink, useControllableState } from "../../shared";
import {
  type CatalogPasswordRule,
  defaultPasswordError,
  focusFirstError,
  GENERIC_AUTH_ERROR,
  isEmail,
  toSafeAuthMessage,
} from "../shared/catalog-form";
import { AuthStatusMessage } from "../shared/status-message";

export type PasswordResetStage = "request" | "sent" | "reset" | "done";

export type AuthPasswordResetProps = {
  signInHref?: string;
  stage?: PasswordResetStage;
  defaultStage?: PasswordResetStage;
  onStageChange?: (stage: PasswordResetStage) => void;
  onRequest?: (email: string) => void | Promise<void>;
  onReset?: (password: string) => void | Promise<void>;
  validatePassword?: CatalogPasswordRule;
  minPasswordLength?: number;
  /** Opt-in only. Product default does not show a demo advance control. */
  showSentAdvance?: boolean;
  sentAdvanceLabel?: string;
  linkComponent?: BlockLinkComponent;
};

export const AuthPasswordReset = ({
  signInHref = "#",
  stage: stageProp,
  defaultStage = "request",
  onStageChange,
  onRequest,
  onReset,
  validatePassword,
  minPasswordLength = 8,
  showSentAdvance = false,
  sentAdvanceLabel = "I have a reset token",
  linkComponent,
}: AuthPasswordResetProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [stage, setStage] = useControllableState<PasswordResetStage>({
    value: stageProp,
    defaultValue: defaultStage,
    onChange: onStageChange,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const passwordRule =
    validatePassword ?? ((value: string) => defaultPasswordError(value, minPasswordLength));

  const backLink = renderBlockLink(linkComponent, {
    href: signInHref,
    class: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
    children: (
      <>
        <ArrowLeftIcon size={12} />
        Back to sign in
      </>
    ),
  });

  const submitRequest = async (event: SubmitEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!isEmail(email)) next.email = "Enter a valid email address.";
    setFieldErrors(next);
    setError("");
    if (Object.keys(next).length) {
      focusFirstError(formRef.current, next);
      return;
    }
    setPending(true);
    try {
      await onRequest?.(email);
      setStage("sent");
    } catch (cause) {
      setError(toSafeAuthMessage(cause, GENERIC_AUTH_ERROR));
    } finally {
      setPending(false);
    }
  };

  const submitReset = async (event: SubmitEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    const passwordMessage = passwordRule(password);
    if (passwordMessage) next.password = passwordMessage;
    if (password !== confirm) next.confirm = "Passwords don't match.";
    setFieldErrors(next);
    setError("");
    if (Object.keys(next).length) {
      focusFirstError(formRef.current, next);
      return;
    }
    setPending(true);
    try {
      await onReset?.(password);
      setStage("done");
    } catch (cause) {
      setError(toSafeAuthMessage(cause, GENERIC_AUTH_ERROR));
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      data-slot="block-auth-password-reset"
      class="flex min-h-svh items-center justify-center bg-background p-6 text-foreground"
    >
      <Card class="w-full max-w-sm">
        {stage === "request" ? (
          <>
            <CardHeader class="text-center">
              <CardTitle class="text-2xl">Forgot password?</CardTitle>
              <CardDescription>
                Enter your email and we&apos;ll send you a reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} class="grid gap-4" onSubmit={submitRequest} noValidate>
                <div class="grid gap-2">
                  <Label for="reset-email">Email</Label>
                  <Input
                    id="reset-email"
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
                {error ? <AuthStatusMessage tone="error">{error}</AuthStatusMessage> : null}
                <Button type="submit" class="w-full" disabled={pending}>
                  {pending ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </CardContent>
            <CardFooter class="justify-center">{backLink}</CardFooter>
          </>
        ) : null}

        {stage === "sent" ? (
          <CardContent class="space-y-4 pt-6 text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheckIcon size={24} />
            </div>
            <div class="space-y-1">
              <h3 class="text-lg font-semibold">Check your inbox</h3>
              <p class="text-sm text-muted-foreground" role="status">
                We&apos;ve sent a reset link to{" "}
                <span class="font-medium text-foreground">{email}</span>.
              </p>
            </div>
            {showSentAdvance ? (
              <Button
                type="button"
                variant="outline"
                class="w-full"
                onClick={() => setStage("reset")}
              >
                {sentAdvanceLabel}
              </Button>
            ) : null}
            <button
              type="button"
              class="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              onClick={() => setStage("request")}
            >
              Wrong email?
            </button>
          </CardContent>
        ) : null}

        {stage === "reset" ? (
          <>
            <CardHeader class="text-center">
              <CardTitle class="text-2xl">Set new password</CardTitle>
              <CardDescription>
                Pick a strong password you haven&apos;t used before.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} class="grid gap-4" onSubmit={submitReset} noValidate>
                <div class="grid gap-2">
                  <Label for="reset-pw">New password</Label>
                  <Input
                    id="reset-pw"
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
                  <Label for="reset-confirm">Confirm password</Label>
                  <Input
                    id="reset-confirm"
                    name="confirm"
                    type="password"
                    autocomplete="new-password"
                    value={confirm}
                    disabled={pending}
                    aria-invalid={fieldErrors.confirm ? "true" : undefined}
                    onInput={(event) => setConfirm(event.currentTarget.value)}
                  />
                  <FieldError
                    errors={fieldErrors.confirm ? [{ message: fieldErrors.confirm }] : []}
                  />
                </div>
                {error ? <AuthStatusMessage tone="error">{error}</AuthStatusMessage> : null}
                <Button type="submit" class="w-full" disabled={pending}>
                  {pending ? "Saving…" : "Reset password"}
                </Button>
              </form>
            </CardContent>
          </>
        ) : null}

        {stage === "done" ? (
          <CardContent class="space-y-4 pt-6 text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-success/20 text-success">
              <MailCheckIcon size={24} />
            </div>
            <div class="space-y-1">
              <h3 class="text-lg font-semibold">All set</h3>
              <p class="text-sm text-muted-foreground" role="status">
                Your password has been updated. You can now sign in with the new password.
              </p>
            </div>
            <Button class="w-full" href={signInHref}>
              Continue to sign in
            </Button>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
};
