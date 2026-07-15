import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginForm as Login01Form } from "../login/login-01/login-form";
import { LoginForm as MagicLoginForm } from "../login/login-05/login-form";
import { SignupForm } from "../signup/signup-05/signup-form";

afterEach(() => cleanup());

describe("auth form interactions", () => {
  it("validates login fields and submits valid values", async () => {
    const onSubmit = vi.fn();
    render(<Login01Form onSubmit={onSubmit} />);

    fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form")!);
    expect(document.body.contains(await screen.findByText("Enter a valid email address."))).toBe(
      true,
    );
    expect(document.activeElement).toBe(screen.getByLabelText("Email"));

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "demo@example.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ email: "demo@example.com", password: "password123" }),
    );
    expect(document.body.contains(await screen.findByText(/Demo login complete/))).toBe(true);
  });

  it("handles magic-link loading and error states", async () => {
    render(<MagicLoginForm />);
    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "error@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Email login link" }));

    expect(
      (screen.getByRole("button", { name: "Sending link..." }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(document.body.contains(await screen.findByText(/Demo magic link failed/))).toBe(true);
  });

  it("validates signup terms and fires social-provider callbacks", async () => {
    const onSocialSignup = vi.fn();
    render(<SignupForm showSocial onSocialSignup={onSocialSignup} />);

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(document.body.contains(await screen.findByText("Accept the terms to continue."))).toBe(
      true,
    );

    fireEvent.click(screen.getByRole("button", { name: /GitHub/ }));
    await waitFor(() => expect(onSocialSignup).toHaveBeenCalledWith("github"));
    expect(document.body.contains(await screen.findByText("github signup callback fired."))).toBe(
      true,
    );
  });
});
