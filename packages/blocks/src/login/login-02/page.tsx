import { authCoverUrl } from "../../auth/shared/auth-cover-url";
import { KamodBrandLink } from "../../auth/shared/kamod-brand-link";
import { LoginForm } from "./login-form";

export function Login02() {
  return (
    <main class="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <section class="flex flex-col gap-4 p-6 md:p-10">
        <KamodBrandLink />
        <div class="flex flex-1 items-center justify-center">
          <div class="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </section>
      <aside class="relative hidden bg-muted lg:block">
        <img
          src={authCoverUrl}
          alt="Abstract product interface preview"
          width={1200}
          height={1400}
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.65] dark:grayscale"
        />
      </aside>
    </main>
  );
}
