import { Card, CardContent } from "@kamod-ch/ui";
import { LoginForm } from "./login-form";

const cover = new URL("../../auth/shared/auth-cover.svg", import.meta.url).href;

export function Login04() {
  return (
    <main class="flex min-h-svh items-center justify-center bg-muted p-6 text-foreground md:p-10">
      <Card class="w-full max-w-4xl overflow-hidden bg-card text-card-foreground">
        <CardContent class="grid p-0 md:grid-cols-2">
          <div class="p-6 md:p-8">
            <LoginForm />
          </div>
          <div class="relative hidden min-h-[560px] bg-muted md:block">
            <img
              src={cover}
              alt="Abstract product interface preview"
              width={1200}
              height={1400}
              loading="lazy"
              class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.65] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
