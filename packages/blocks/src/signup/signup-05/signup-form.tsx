import { ChromeIcon, GithubIcon } from "@kamod-ch/icons/shadcn";
import { Alert, AlertDescription, Button, Checkbox, Input, Label } from "@kamod-ch/ui";
import { useRef, useState } from "preact/hooks";
import type { AuthProvider, AuthStatus, SignupValues } from "../../auth/shared/auth-utils";
import { demoRejects, focusFirstError, isEmail, sleep } from "../../auth/shared/auth-utils";

export type SignupFormProps = {
  onSubmit?: (values: SignupValues) => void | Promise<void>;
  onSocialSignup?: (provider: AuthProvider) => void | Promise<void>;
  loginHref?: string;
  termsHref?: string;
  privacyHref?: string;
  showSocial?: boolean;
};

export function SignupForm({
  onSubmit,
  onSocialSignup,
  loginHref = "#",
  termsHref = "#",
  privacyHref = "#",
  showSocial = false,
}: SignupFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<SignupValues>({ name: "", email: "", password: "" });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupValues | "terms", string>>>({});
  const [status, setStatus] = useState<AuthStatus>({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Partial<Record<keyof SignupValues | "terms", string>> = {};
    if (values.name.trim().length < 2) next.name = "Enter your name.";
    if (!isEmail(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (!accepted) next.terms = "Accept the terms to continue.";
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
        message: "Demo account created. Wire this to your signup API.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Demo signup failed. Try an email without the word error.",
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
      await onSocialSignup?.(provider);
      setStatus({ type: "success", message: `${provider} signup callback fired.` });
    } catch {
      setStatus({ type: "error", message: `${provider} signup callback failed.` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={submit} class="grid gap-6" noValidate>
      <div class="grid gap-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p class="text-sm text-muted-foreground">Enter your information to get started</p>
      </div>
      {showSocial ? (
        <div class="grid gap-3">
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
          <div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span class="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
      ) : null}
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="signup-05-name">Name</Label>
          <Input
            id="signup-05-name"
            name="name"
            autocomplete="name"
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "signup-05-name-error" : undefined}
            onInput={(event) =>
              setValues((current) => ({ ...current, name: event.currentTarget.value }))
            }
          />
          {errors.name ? (
            <p id="signup-05-name-error" class="text-sm text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div class="grid gap-2">
          <Label for="signup-05-email">Email</Label>
          <Input
            id="signup-05-email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="m@example.com"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "signup-05-email-error" : undefined}
            onInput={(event) =>
              setValues((current) => ({ ...current, email: event.currentTarget.value }))
            }
          />
          {errors.email ? (
            <p id="signup-05-email-error" class="text-sm text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div class="grid gap-2">
          <Label for="signup-05-password">Password</Label>
          <Input
            id="signup-05-password"
            name="password"
            type="password"
            autocomplete="new-password"
            value={values.password}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "signup-05-password-error" : undefined}
            onInput={(event) =>
              setValues((current) => ({ ...current, password: event.currentTarget.value }))
            }
          />
          {errors.password ? (
            <p id="signup-05-password-error" class="text-sm text-destructive">
              {errors.password}
            </p>
          ) : null}
        </div>
        <div class="flex items-start gap-3">
          <Checkbox
            id="signup-05-terms"
            name="terms"
            checked={accepted}
            aria-invalid={Boolean(errors.terms)}
            aria-describedby={
              errors.terms ? "signup-05-terms-error signup-05-terms-help" : "signup-05-terms-help"
            }
            onCheckedChange={(value) => setAccepted(value === true)}
          />
          <div class="grid gap-1.5 leading-none">
            <Label for="signup-05-terms">Accept terms</Label>
            <p id="signup-05-terms-help" class="text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a class="text-primary underline-offset-4 hover:underline" href={termsHref}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a class="text-primary underline-offset-4 hover:underline" href={privacyHref}>
                Privacy Policy
              </a>
              .
            </p>
            {errors.terms ? (
              <p id="signup-05-terms-error" class="text-sm text-destructive">
                {errors.terms}
              </p>
            ) : null}
          </div>
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
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </div>
      <p class="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href={loginHref} class="text-primary underline-offset-4 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}
