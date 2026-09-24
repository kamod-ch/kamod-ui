/** Component-free registry data for lightweight documentation overviews. */
import type { BlockDefinition, BlockFile, LoginBlockId } from "../auth/types";

const descriptions: Record<LoginBlockId, string> = {
  "login-01": "A simple login form.",
  "login-02": "A two column login page with a cover image.",
  "login-03": "A login page with a muted background color.",
  "login-04": "A login page with form and image.",
  "login-05": "A simple email-only login page.",
};

const blockFiles = (id: LoginBlockId): BlockFile[] => {
  const files: BlockFile[] = [
    { path: `src/login/${id}/page.tsx`, label: "app/login/page.tsx", kind: "page" },
    {
      path: `src/login/${id}/login-form.tsx`,
      label: "components/login-form.tsx",
      kind: "component",
    },
    { path: "src/auth/shared/auth-utils.ts", label: "lib/auth-utils.ts", kind: "support" },
  ];
  if (["login-02", "login-04"].includes(id)) {
    files.push({
      path: "src/auth/shared/auth-cover.svg",
      label: "assets/auth-cover.svg",
      kind: "asset",
    });
  }
  return files;
};

export const loginBlockMetadata: (Omit<BlockDefinition, "component"> & {
  id: LoginBlockId;
  category: "login";
})[] = (Object.keys(descriptions) as LoginBlockId[]).map((id) => ({
  id,
  title: id,
  description: descriptions[id],
  category: "login",
  files: blockFiles(id),
  dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
  uiComponents: ["Button", "Input", "Label", "Card", "Alert", "Separator"],
  tags: ["auth", "login", "form"],
  features: [
    "validation",
    "loading",
    "success-state",
    "error-state",
    "accessible",
    "dark-mode",
    "responsive",
  ],
  preview: { height: id === "login-04" ? 760 : 700, fullWidth: true },
  installCommand: `@kamod-ch/blocks/login/${id}`,
}));
