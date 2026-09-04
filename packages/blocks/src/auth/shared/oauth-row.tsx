import { GithubIcon } from "@kamod-ch/icons/shadcn";
import { Button, cn, Separator } from "@kamod-ch/ui";
import type { CatalogOauthProvider } from "./catalog-form";
import { GoogleIcon } from "./google-icon";

export type AuthOauthRowProps = {
  providers?: CatalogOauthProvider[];
  disabled?: boolean;
  onOauth?: (provider: CatalogOauthProvider) => void | Promise<void>;
  label?: string;
  surfaceClass?: string;
};

export const AuthOauthRow = ({
  providers = ["google", "github"],
  disabled,
  onOauth,
  label = "Or continue with",
  surfaceClass = "bg-card",
}: AuthOauthRowProps) => {
  if (!providers.length) return null;
  return (
    <div class="grid gap-3">
      <div class="relative">
        <Separator />
        <span
          class={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-[11px] tracking-wider text-muted-foreground uppercase",
            surfaceClass,
          )}
        >
          {label}
        </span>
      </div>
      <div class={providers.length > 1 ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
        {providers.includes("google") ? (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => void onOauth?.("google")}
          >
            <GoogleIcon aria-hidden="true" />
            Google
          </Button>
        ) : null}
        {providers.includes("github") ? (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => void onOauth?.("github")}
          >
            <GithubIcon aria-hidden="true" />
            GitHub
          </Button>
        ) : null}
      </div>
    </div>
  );
};
