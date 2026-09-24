/** Overview metadata comes from the block registries without importing their demo components. */
import { applicationShellBlockMetadata } from "../../../blocks/src/application-shell/metadata";
import { loginBlockMetadata } from "../../../blocks/src/login/metadata";
import { sidebarBlockMetadata } from "../../../blocks/src/sidebar/metadata";
import { signupBlockMetadata } from "../../../blocks/src/signup/metadata";

/** The fields needed to link a registered block to its documentation. */
export type BlockOverviewEntry = {
  id: string;
  title: string;
  description: string;
  installCommand: string;
  tags: readonly string[];
  features?: readonly string[];
};

export const blockCategories = {
  sidebar: {
    title: "Building Blocks for the Web",
    description:
      "Clean, modern building blocks. Copy and paste into your apps. Built with Preact and Kamod UI. Open Source.",
    label: "sidebar",
    blocks: sidebarBlockMetadata,
  },
  "application-shell": {
    title: "Application Shell Blocks",
    description: "Responsive application layouts built with Preact and Kamod UI.",
    label: "application shell",
    blocks: applicationShellBlockMetadata,
  },
  login: {
    title: "Login Blocks",
    description: "Responsive login screens built with Preact and Kamod UI primitives.",
    label: "login",
    blocks: loginBlockMetadata,
  },
  signup: {
    title: "Signup Blocks",
    description:
      "Accessible signup screens with validation, terms copy, and social-provider callbacks.",
    label: "signup",
    blocks: signupBlockMetadata,
  },
} satisfies Record<
  string,
  { title: string; description: string; label: string; blocks: readonly BlockOverviewEntry[] }
>;

export type BlockCategory = keyof typeof blockCategories;

/** Resolve only registered legacy anchors; unknown or malformed fragments stay on the overview. */
export function legacyBlockDestination(category: BlockCategory, hash: string): string | undefined {
  let id: string;
  try {
    id = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return undefined;
  }
  return blockCategories[category].blocks.some((block) => block.id === id)
    ? `/blocks/${category}/${id}#${id}`
    : undefined;
}
