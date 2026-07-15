import type { BlockDefinition, BlockFile, LoginBlockId } from "../auth/types";
import { Login01 } from "./login-01";
import { Login02 } from "./login-02";
import { Login03 } from "./login-03";
import { Login04 } from "./login-04";
import { Login05 } from "./login-05";

const components = {
  "login-01": Login01,
  "login-02": Login02,
  "login-03": Login03,
  "login-04": Login04,
  "login-05": Login05,
} satisfies Record<LoginBlockId, BlockDefinition["component"]>;

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

export const loginBlocks: BlockDefinition[] = (Object.keys(components) as LoginBlockId[]).map(
  (id) => ({
    id,
    title: id,
    description: descriptions[id],
    category: "login",
    component: components[id],
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
  }),
);

export const loginBlocksById = loginBlocks.reduce<Record<LoginBlockId, BlockDefinition>>(
  (acc, block) => {
    acc[block.id as LoginBlockId] = block;
    return acc;
  },
  {} as Record<LoginBlockId, BlockDefinition>,
);
