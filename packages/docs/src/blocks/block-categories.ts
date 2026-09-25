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
  dependencies: readonly string[];
  tags: readonly string[];
  features?: readonly string[];
};

export const blockCategories = {
  sidebar: {
    title: "Sidebar Navigation and Layout Blocks",
    description:
      "Compare grouped links, nested menus, icon collapse and floating or inset layouts built with `Sidebar` from `@kamod-ch/ui`. Copy a variant’s source and replace the sample destinations with your application’s routes.",
    label: "sidebar",
    blocks: sidebarBlockMetadata,
  },
  "application-shell": {
    title: "Application Shells for Your Workspace",
    description:
      "Build your workspace around responsive sidebar navigation, breadcrumbs and an account menu. Supply `navigationGroups` and `breadcrumbs`, render pages through `children`, and connect your own router and account actions.",
    label: "application shell",
    blocks: applicationShellBlockMetadata,
  },
  login: {
    title: "Login Forms and Sign-in Pages",
    description:
      "Choose compact forms, split layouts or email-only sign-in, with validation and submission feedback built in. Connect `onSubmit` to your authentication service and, where available, `onSocialLogin` to your provider flow.",
    label: "login",
    blocks: loginBlockMetadata,
  },
  signup: {
    title: "Signup Forms and Registration Pages",
    description:
      "Choose compact registration forms, split layouts or social-provider options, with validation and submission feedback. Connect `onSubmit` and, where available, `onSocialSignup` to your account service, then adapt the fields and legal links.",
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
