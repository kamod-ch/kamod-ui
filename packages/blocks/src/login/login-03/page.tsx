import { Card, CardContent } from "@kamod-ch/ui";
import { KamodBrandLink } from "../../auth/shared/kamod-brand-link";
import { LoginForm } from "./login-form";

export function Login03() {
  return (
    <main class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 text-foreground md:p-10">
      <KamodBrandLink />
      <Card class="w-full max-w-sm bg-card text-card-foreground">
        <CardContent class="p-6 md:p-8">
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
