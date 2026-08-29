import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthMfa } from "./auth-mfa";
import { AuthPasswordReset } from "./auth-password-reset";
import { AuthSignIn } from "./auth-sign-in";
import { AuthSignUp } from "./auth-sign-up";
import { AuthLogin01 } from "./login-01";
import { AuthLogin02 } from "./login-02";
import { Register01 } from "./register-01";
import { GENERIC_AUTH_ERROR } from "./shared/catalog-form";

afterEach(() => cleanup());

const deferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("catalog auth blocks", () => {
  it("submits sign-in payload including remember", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<AuthSignIn onSubmit={onSubmit} />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByLabelText("Remember me for 30 days"));
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        email: "ada@example.com",
        password: "password123",
        remember: true,
      }),
    );
    expect(document.body.contains(await screen.findByRole("status"))).toBe(true);
  });

  it("shows pending, disables submit, and never leaks thrown error details", async () => {
    const gate = deferred<void>();
    const onSubmit = vi.fn(() => gate.promise);
    render(<AuthLogin01 onSubmit={onSubmit} />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    const pending = await screen.findByRole("button", { name: "Signing in…" });
    expect((pending as HTMLButtonElement).disabled).toBe(true);

    gate.reject(new Error("secret token leaked from API"));
    expect(document.body.contains(await screen.findByRole("alert"))).toBe(true);
    expect(screen.getByText(GENERIC_AUTH_ERROR)).toBeTruthy();
    expect(screen.queryByText(/secret token/)).toBeNull();
  });

  it("blocks sign-up on password mismatch and terms gate", async () => {
    const onSubmit = vi.fn();
    render(<AuthSignUp onSubmit={onSubmit} />);

    fireEvent.input(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.input(screen.getByLabelText("Confirm password"), {
      target: { value: "password321" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(document.body.contains(await screen.findByText("Passwords don't match."))).toBe(true);
    expect(document.body.contains(screen.getByText("Accept the terms to continue."))).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.input(screen.getByLabelText("Confirm password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Ada Lovelace",
        email: "ada@example.com",
        password: "password123",
      }),
    );
  });

  it("applies consumer password rules on register-01", async () => {
    const onSubmit = vi.fn();
    render(
      <Register01
        onSubmit={onSubmit}
        validatePassword={(password) =>
          password.includes("!") ? undefined : "Add an exclamation mark."
        }
      />,
    );

    fireEvent.input(screen.getByLabelText("Name"), { target: { value: "Ada Lovelace" } });
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.input(screen.getByLabelText("Confirm password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(document.body.contains(await screen.findByText("Add an exclamation mark."))).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("pastes an OTP code, verifies asynchronously, and supports keyboard keys", async () => {
    const onVerify = vi.fn().mockResolvedValue(undefined);
    render(<AuthMfa onVerify={onVerify} autoSubmit />);

    const otp = screen.getByLabelText("6-digit verification code") as HTMLInputElement;
    otp.focus();
    fireEvent.keyDown(otp, { key: "ArrowRight" });
    fireEvent.keyDown(otp, { key: "Backspace" });
    fireEvent.input(otp, { target: { value: "847291" } });

    await waitFor(() => expect(onVerify).toHaveBeenCalledWith("847291"));
    expect(document.body.contains(await screen.findByText("Verified"))).toBe(true);
  });

  it("clears the MFA resend cooldown timer on unmount", async () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const { unmount } = render(<AuthMfa onResend={() => undefined} resendCooldown={30} />);

    fireEvent.click(screen.getByRole("button", { name: "Resend code" }));
    expect(document.body.contains(await screen.findByText(/Resend available in 30s/))).toBe(true);

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it("walks password-reset stages without a demo advance control", async () => {
    const onRequest = vi.fn().mockResolvedValue(undefined);
    const onReset = vi.fn().mockResolvedValue(undefined);
    const { unmount } = render(<AuthPasswordReset onRequest={onRequest} onReset={onReset} />);

    expect(screen.queryByRole("button", { name: "I have a reset token" })).toBeNull();
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(document.body.contains(await screen.findByText("Check your inbox"))).toBe(true);
    expect(onRequest).toHaveBeenCalledWith("ada@example.com");
    expect(screen.queryByRole("button", { name: "I have a reset token" })).toBeNull();
    unmount();

    render(<AuthPasswordReset stage="reset" onRequest={onRequest} onReset={onReset} />);
    fireEvent.input(screen.getByLabelText("New password"), { target: { value: "password123" } });
    fireEvent.input(screen.getByLabelText("Confirm password"), { target: { value: "nope" } });
    fireEvent.click(screen.getByRole("button", { name: "Reset password" }));
    expect(document.body.contains(await screen.findByText("Passwords don't match."))).toBe(true);
  });

  it("completes a controlled password reset into the done stage when uncontrolled", async () => {
    const onReset = vi.fn().mockResolvedValue(undefined);
    render(<AuthPasswordReset defaultStage="reset" onReset={onReset} />);

    fireEvent.input(screen.getByLabelText("New password"), { target: { value: "password123" } });
    fireEvent.input(screen.getByLabelText("Confirm password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset password" }));
    expect(document.body.contains(await screen.findByText("All set"))).toBe(true);
    expect(onReset).toHaveBeenCalledWith("password123");
  });

  it("keeps login-02 brand panel as a desktop-only composition", () => {
    render(<AuthLogin02 brandPanel={<p>Brand copy</p>} />);
    const aside = document.querySelector("aside");
    expect(aside?.className).toContain("hidden");
    expect(aside?.className).toContain("lg:flex");
    expect(aside?.textContent).toContain("Brand copy");
    expect(screen.getByLabelText("Email")).toBeTruthy();
  });

  it("does not expose demoCode on the productive MFA API", () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "auth-mfa/auth-mfa.tsx"),
      "utf8",
    );
    expect(source).not.toContain("demoCode");
  });

  it("imports catalog auth modules without window access at load time", async () => {
    const mod = await import("./index");
    expect(mod.catalogAuthBlocks).toHaveLength(7);
    expect(typeof mod.AuthMfa).toBe("function");
    expect(typeof mod.AuthPasswordReset).toBe("function");
    expect(typeof mod.AuthSignIn).toBe("function");
    expect(typeof mod.AuthSignUp).toBe("function");
    expect(typeof mod.AuthLogin01).toBe("function");
    expect(typeof mod.AuthLogin02).toBe("function");
    expect(typeof mod.Register01).toBe("function");
  });
});
