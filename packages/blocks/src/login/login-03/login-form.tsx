import { ChromeIcon, GithubIcon } from "@kamod-ch/icons/shadcn";
import { Alert, AlertDescription, Button, Input, Label } from "@kamod-ch/ui";
import { useRef, useState } from "preact/hooks";
import type { AuthProvider, AuthStatus, LoginValues } from "../../auth/shared/auth-utils";
import { demoRejects, focusFirstError, isEmail, sleep } from "../../auth/shared/auth-utils";

export type LoginFormProps = {
  onSubmit?: (values: LoginValues) => void | Promise<void>;
  onSocialLogin?: (provider: AuthProvider) => void | Promise<void>;
  forgotPasswordHref?: string;
  signupHref?: string;
};

export function LoginForm({
  onSubmit,
  onSocialLogin,
  forgotPasswordHref = "#",
  signupHref = "#",
}: LoginFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});
  const [status, setStatus] = useState<AuthStatus>({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Partial<Record<keyof LoginValues, string>> = {};
    if (!isEmail(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 8) next.password = "Password must be at least 8 characters.";
    return next;
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setStatus({ type: "idle", message: "" });
    if (Object.keys(next).length) {
      focusFirstError(formRef.current, next);
      return;
    }
    setLoading(true);
    try {
      await sleep();
      if (demoRejects(values.email)) throw new Error("Demo error");
      await onSubmit?.(values);
      setStatus({
        type: "success",
        message: "Demo login complete. Connect your auth provider here.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Demo login failed. Try an email without the word error.",
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
        <h1 class="text-2xl font-semibold tracking-tight">Login to your account</h1>
        <p class="text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="login-03-email">Email</Label>
          <Input
            id="login-03-email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="m@example.com"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-03-email-error" : undefined}
            onInput={(event) =>
              setValues((current) => ({ ...current, email: event.currentTarget.value }))
            }
          />
          {errors.email ? (
            <p id="login-03-email-error" class="text-sm text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div class="grid gap-2">
          <div class="flex items-center justify-between gap-3">
            <Label for="login-03-password">Password</Label>
            <a
              href={forgotPasswordHref}
              class="text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="login-03-password"
            name="password"
            type="password"
            autocomplete="current-password"
            value={values.password}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-03-password-error" : undefined}
            onInput={(event) =>
              setValues((current) => ({ ...current, password: event.currentTarget.value }))
            }
          />
          {errors.password ? (
            <p id="login-03-password-error" class="text-sm text-destructive">
              {errors.password}
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
          {loading ? "Signing in..." : "Login"}
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
            <GithubIcon aria-hidden="true" /> GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => void social("google")}
          >
            <ChromeIcon aria-hidden="true" /> Google
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
