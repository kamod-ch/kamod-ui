import { GitBranchIcon, MailIcon } from "@kamod-ch/icons/lucide";
import { Alert, AlertDescription, Button, Input, Label } from "@kamod-ch/ui";
import { useRef, useState } from "preact/hooks";
import type { AuthProvider, AuthStatus, MagicLinkValues } from "../../auth/shared/auth-utils";
import { demoRejects, focusFirstError, isEmail, sleep } from "../../auth/shared/auth-utils";

export type LoginFormProps = {
  onSubmit?: (values: MagicLinkValues) => void | Promise<void>;
  onSocialLogin?: (provider: AuthProvider) => void | Promise<void>;
  signupHref?: string;
};

export function LoginForm({ onSubmit, onSocialLogin, signupHref = "#" }: LoginFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof MagicLinkValues, string>>>({});
  const [status, setStatus] = useState<AuthStatus>({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof MagicLinkValues, string>> = {};
    if (!isEmail(email)) next.email = "Enter a valid email address.";
    setErrors(next);
    setStatus({ type: "idle", message: "" });
    if (Object.keys(next).length) {
      focusFirstError(formRef.current, next);
      return;
    }
    setLoading(true);
    try {
      await sleep();
      if (demoRejects(email)) throw new Error("Demo error");
      await onSubmit?.({ email });
      setStatus({ type: "success", message: "Demo magic link sent. Check your inbox copy." });
    } catch {
      setStatus({
        type: "error",
        message: "Demo magic link failed. Try an email without the word error.",
      });
    } finally {
      setLoading(false);
    }
  };

  const social = async (provider: AuthProvider) => {
    setLoading(true);
    setStatus({ type: "idle", message: "" });
    try {
      await sleep(350);
      await onSocialLogin?.(provider);
      setStatus({ type: "success", message: `${provider} demo callback fired.` });
    } catch {
      setStatus({ type: "error", message: `${provider} demo callback failed.` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={submit} class="grid gap-6" noValidate>
      <div class="grid gap-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Check your inbox</h1>
        <p class="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a secure login link.
        </p>
      </div>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="login-05-email">Email</Label>
          <Input
            id="login-05-email"
            name="email"
            type="email"
            autocomplete="email"
            inputMode="email"
            placeholder="m@example.com"
            value={email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "login-05-email-error login-05-email-help" : "login-05-email-help"
            }
            onInput={(event) => setEmail(event.currentTarget.value)}
          />
          <p id="login-05-email-help" class="text-sm text-muted-foreground">
            We&apos;ll email a one-time login link for this demo.
          </p>
          {errors.email ? (
            <p id="login-05-email-error" class="text-sm text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>
        {status.message ? (
          <Alert
            variant={status.type === "error" ? "destructive" : "default"}
            role="status"
            aria-live="polite"
          >
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        ) : null}
        <Button type="submit" disabled={loading} class="w-full">
          {loading ? "Sending link..." : "Email login link"}
        </Button>
        <div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span class="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => void social("github")}
          >
            <GitBranchIcon aria-hidden="true" /> GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => void social("google")}
          >
            <MailIcon aria-hidden="true" /> Google
          </Button>
        </div>
      </div>
      <p class="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href={signupHref} class="text-primary underline-offset-4 hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}
