/** Shared copy dependencies; keep the original folder structure when copying a page. */
import type { BlockFile } from "../types";
export function authSupportFiles(id: string): BlockFile[] {
  const files = ["auth-utils.ts", "google-icon.tsx"];
  if (id.endsWith("-02") || id.endsWith("-03")) {
    files.push(
      "kamod-brand-link.tsx",
      "kamod-brand-sizes.ts",
      "kamod-logo.tsx",
      "kamod-logo-url.ts",
      "kamod-logo-horizontal.svg",
      "kamod-logo-horizontal-dark.svg",
    );
  }
  if (id.endsWith("-02") || id.endsWith("-04")) files.push("auth-cover-url.ts", "auth-cover.svg");
  return files.map((file) => ({
    path: `src/${file.startsWith("kamod-") ? "shared/branding" : "auth/shared"}/${file}`,
    label:
      file === "auth-utils.ts"
        ? "lib/auth-utils.ts"
        : file === "auth-cover.svg"
          ? "assets/auth-cover.svg"
          : `${file.startsWith("kamod-") ? "shared/branding" : "auth/shared"}/${file}`,
    kind: file.endsWith(".svg") ? "asset" : "support",
  }));
}
