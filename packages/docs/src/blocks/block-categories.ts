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
      "Choose a navigation layout that fits your application, from **grouped links and nested menus** to icon-only collapse, floating panels and inset sidebars. Each variant composes `Sidebar` primitives from `@kamod-ch/ui`, so you can adapt the navigation, branding and surrounding content together. Open a block to explore its **responsive behavior**, review the source and setup steps, then replace the sample destinations with your own routes.",
    label: "sidebar",
    blocks: sidebarBlockMetadata,
  },
  "application-shell": {
    title: "Application Shells for Your Workspace",
    description:
      "Give your workspace a consistent frame with **responsive sidebar navigation**, breadcrumbs and an account menu. Supply `navigationGroups` and `breadcrumbs` to describe your application, then render each page through `children` inside the shared layout. The shell leaves **routing, authentication and account actions** to your app. Explore the demo and typed examples to understand nested navigation, desktop collapse and the separate mobile navigation before connecting your own data.",
    label: "application shell",
    blocks: applicationShellBlockMetadata,
  },
  login: {
    title: "Login Forms and Sign-in Pages",
    description:
      "Find a sign-in layout that fits your entry point, from a compact form to a split page or an email-only flow. The examples include **field validation and submission feedback**; **your authentication service handles the actual sign-in**. Connect `onSubmit` and, where supported, `onSocialLogin` to your existing flow, then adapt the branding and account links. Each detail page provides the live demo, source files and setup guidance for that variant.",
    label: "login",
    blocks: loginBlockMetadata,
  },
  signup: {
    title: "Signup Forms and Registration Pages",
    description:
      "Build a registration entry point around a compact form, a split layout or supported social-provider options. Each example includes **validation and submission feedback while leaving account creation to your service**. Connect `onSubmit` and, where available, `onSocialSignup`, then adapt the fields, branding and legal links to your product. Use the detail page to inspect the form behavior and required files before integrating the layout into your **onboarding flow**.",
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
