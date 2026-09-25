/** Component-free registry data for lightweight documentation overviews. */
import type { BlockDefinition, BlockFile, SignupBlockId } from "../auth/types";

const descriptions: Record<SignupBlockId, string> = {
  "signup-01": "A simple signup form.",
  "signup-02": "A two column signup page with a cover image.",
  "signup-03": "A signup page with a muted background color.",
  "signup-04": "A signup page with form and image.",
  "signup-05": "A simple signup form with social providers.",
};

const blockFiles = (id: SignupBlockId): BlockFile[] => {
  const files: BlockFile[] = [
    { path: `src/signup/${id}/page.tsx`, label: "app/signup/page.tsx", kind: "page" },
    {
      path: `src/signup/${id}/signup-form.tsx`,
      label: "components/signup-form.tsx",
      kind: "component",
    },
    { path: "src/auth/shared/auth-utils.ts", label: "lib/auth-utils.ts", kind: "support" },
  ];
  if (["signup-02", "signup-04"].includes(id)) {
    files.push({
      path: "src/auth/shared/auth-cover.svg",
      label: "assets/auth-cover.svg",
      kind: "asset",
    });
  }
  return files;
};

export const signupBlockMetadata: (Omit<BlockDefinition, "component"> & {
  id: SignupBlockId;
  category: "signup";
})[] = (Object.keys(descriptions) as SignupBlockId[]).map((id) => ({
  id,
  title: id,
  description: descriptions[id],
  category: "signup",
  files: blockFiles(id),
  dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
  uiComponents: ["Button", "Input", "Label", "Card", "Alert", "Checkbox", "Separator"],
  tags: ["auth", "signup", "form"],
  features: [
    "validation",
    "loading",
    "terms",
    "success-state",
    "error-state",
    "accessible",
    "dark-mode",
    "responsive",
  ],
  preview: { height: id === "signup-04" ? 840 : 760, fullWidth: true },
  installCommand: `@kamod-ch/blocks/signup/${id}`,
}));
