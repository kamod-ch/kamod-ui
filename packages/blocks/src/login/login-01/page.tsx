import { LoginForm } from "./login-form";

export function Login01() {
  return (
    <main class="flex min-h-svh items-center justify-center bg-background p-6 text-foreground md:p-10">
      <div class="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
