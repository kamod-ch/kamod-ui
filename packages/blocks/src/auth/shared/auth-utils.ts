export type AuthProvider = "github" | "google" | "gitlab";
export type LoginValues = { email: string; password: string };
export type MagicLinkValues = { email: string };
export type SignupValues = { name: string; email: string; password: string };
export type AuthStatus = { type: "idle" | "success" | "error"; message: string };

export const sleep = (ms = 600) => new Promise((resolve) => window.setTimeout(resolve, ms));
export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
export const demoRejects = (email: string) => email.trim().toLowerCase().includes("error");

export const focusFirstError = (form: HTMLFormElement | null, errors: Record<string, string>) => {
  const first = Object.keys(errors)[0];
  if (!first || !form) return;
  const field = form.querySelector<HTMLElement>(`[name="${first}"]`);
  field?.focus();
};
