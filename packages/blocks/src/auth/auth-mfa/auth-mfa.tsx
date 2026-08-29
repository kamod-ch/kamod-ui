import { RefreshCwIcon, ShieldCheckIcon } from "@kamod-ch/icons/lucide";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@kamod-ch/ui";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { BlockLinkComponent } from "../../shared";
import { renderBlockLink } from "../../shared";
import { GENERIC_AUTH_ERROR, toSafeAuthMessage } from "../shared/catalog-form";

export type AuthMfaProps = {
  title?: string;
  description?: string;
  length?: number;
  autoSubmit?: boolean;
  continueHref?: string;
  recoveryHref?: string;
  resendCooldown?: number;
  onVerify?: (code: string) => boolean | void | Promise<boolean | void>;
  onResend?: () => void | Promise<void>;
  onContinue?: () => void;
  linkComponent?: BlockLinkComponent;
};

export const AuthMfa = ({
  title = "Two-step verification",
  description = "Enter the 6-digit code from your authenticator app.",
  length = 6,
  autoSubmit = true,
  continueHref = "#",
  recoveryHref = "#",
  resendCooldown = 30,
  onVerify,
  onResend,
  onContinue,
  linkComponent,
}: AuthMfaProps) => {
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const verifyingRef = useRef(false);
  const lastAttemptRef = useRef("");
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const verify = useCallback(
    async (value: string) => {
      if (value.length !== length || verifyingRef.current || lastAttemptRef.current === value) {
        return;
      }
      verifyingRef.current = true;
      lastAttemptRef.current = value;
      setPending(true);
      setError("");
      try {
        const result = await onVerify?.(value);
        if (result === false) {
          setError("We couldn't verify that code. Try again.");
          setCode("");
          lastAttemptRef.current = "";
          return;
        }
        setVerified(true);
      } catch (cause) {
        setError(toSafeAuthMessage(cause, GENERIC_AUTH_ERROR));
        setCode("");
        lastAttemptRef.current = "";
      } finally {
        verifyingRef.current = false;
        setPending(false);
      }
    },
    [length, onVerify],
  );

  useEffect(() => {
    if (!autoSubmit || verified || pending) return;
    if (code.length === length) void verify(code);
  }, [autoSubmit, code, length, pending, verified, verify]);

  const startCooldown = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setResendIn(resendCooldown);
    timerRef.current = window.setInterval(() => {
      setResendIn((current) => {
        if (current <= 1) {
          window.clearInterval(timerRef.current);
          timerRef.current = 0;
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  };

  const resend = async () => {
    setError("");
    setPending(true);
    try {
      await onResend?.();
      startCooldown();
    } catch (cause) {
      setError(toSafeAuthMessage(cause, GENERIC_AUTH_ERROR));
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      data-slot="block-auth-mfa"
      class="flex min-h-svh items-center justify-center bg-background p-6 text-foreground"
    >
      <Card class="w-full max-w-sm">
        {verified ? (
          <CardContent class="space-y-4 pt-6 text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-success/20 text-success">
              <ShieldCheckIcon size={24} />
            </div>
            <div class="space-y-1">
              <h3 class="text-lg font-semibold">Verified</h3>
              <p class="text-sm text-muted-foreground" role="status" aria-live="polite">
                You&apos;re all set. Continue to your dashboard.
              </p>
            </div>
            <Button class="w-full" href={continueHref} onClick={onContinue}>
              Continue
            </Button>
          </CardContent>
        ) : (
          <>
            <CardHeader class="text-center">
              <div class="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheckIcon size={24} />
              </div>
              <CardTitle class="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <form
                class="grid justify-center gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void verify(code);
                }}
              >
                <InputOTP
                  id="auth-mfa-code"
                  name="otp"
                  maxLength={length}
                  value={code}
                  disabled={pending}
                  pattern={REGEXP_ONLY_DIGITS}
                  autoComplete="one-time-code"
                  aria-label={`${length}-digit verification code`}
                  aria-invalid={error ? "true" : undefined}
                  aria-describedby={
                    error ? "auth-mfa-error" : pending ? "auth-mfa-pending" : undefined
                  }
                  onValueChange={(next) => {
                    lastAttemptRef.current = "";
                    setCode(next);
                    setError("");
                  }}
                >
                  <InputOTPGroup>
                    {Array.from({ length }, (_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {autoSubmit ? null : (
                  <Button type="submit" disabled={pending || code.length !== length}>
                    Verify
                  </Button>
                )}
              </form>
              {pending ? (
                <p
                  id="auth-mfa-pending"
                  class="text-center text-sm text-muted-foreground"
                  role="status"
                >
                  Verifying…
                </p>
              ) : null}
              {error ? (
                <p id="auth-mfa-error" class="text-center text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <div class="text-center">
                {resendIn === 0 ? (
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    disabled={pending}
                    onClick={() => void resend()}
                  >
                    <RefreshCwIcon size={12} />
                    Resend code
                  </button>
                ) : (
                  <p class="text-xs text-muted-foreground" role="status">
                    Resend available in {resendIn}s
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter class="justify-center">
              <p class="text-xs text-muted-foreground">
                Lost your device?{" "}
                {renderBlockLink(linkComponent, {
                  href: recoveryHref,
                  class: "text-foreground underline-offset-4 hover:underline",
                  children: "Use a recovery code",
                })}
              </p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};
