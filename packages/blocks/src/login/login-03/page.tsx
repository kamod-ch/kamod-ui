import { GalleryVerticalEndIcon } from "@kamod-ch/icons/lucide";
import { Card, CardContent } from "@kamod-ch/ui";
import { LoginForm } from "./login-form";

export function Login03() {
  return (
    <main class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 text-foreground md:p-10">
      <a href="#" class="flex items-center gap-2 font-medium" aria-label="Kamod home">
        <span class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEndIcon class="size-4" aria-hidden="true" />
        </span>
        Kamod Inc.
      </a>
      <Card class="w-full max-w-sm bg-card text-card-foreground">
        <CardContent class="p-6 md:p-8">
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
