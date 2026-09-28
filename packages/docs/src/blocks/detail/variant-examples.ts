/** Copyable local integrations; presentation components do not own code templates. */
import type { VariantGuide } from "./VariantDocumentation";

/** Import from the directory structure listed in the installation guide. */
export function variantImport({ component, category, block }: VariantGuide): string {
  if (category === "sidebar")
    return `import { ${component} } from "./components/blocks/${block.id}";`;
  return `import { ${component} } from "./components/blocks/${category}/${block.id}/page";`;
}

/** The wrapper has no props; show how to configure its local helpers instead. */
export function integrationExample(guide: VariantGuide): string {
  const { category, block } = guide;
  if (category === "sidebar") {
    if (guide.files.some((file) => file.label === "components/nav-main.tsx"))
      return `// Inside ${block.id}.tsx; keep its SidebarProvider and surrounding layout.
<NavMain items={[{
  title: "Projects", url: "/projects", icon: "frame", isActive: true,
  items: [{ title: "Overview", url: "/projects/overview" }],
}]} />`;
    if (guide.files.some((file) => file.label === "components/nav-docs.tsx"))
      return `// Replace the NavDocs data in ${block.id}.tsx.
<NavDocs groups={[{
  title: "Workspace",
  items: [{ title: "Projects", url: "/projects", isActive: true }],
}]} />`;
    if (block.id === "sidebar-06")
      return `// Replace the dropdown data in ${block.id}.tsx.
<NavMainDropdowns items={[{
  title: "Projects", url: "/projects", icon: "frame",
  items: [{ title: "Overview", url: "/projects/overview" }],
}]} />`;
    if (guide.files.some((file) => file.label === "components/dashboard-shell.tsx"))
      return `// Replace this block's DashboardShell placeholder content.
<DashboardShell breadcrumbs={[{ label: "Workspace", href: "/" }, { label: "Projects" }]}>
  <h1 class="text-2xl font-semibold">Projects</h1>
  <p>Your routed content goes here.</p>
</DashboardShell>`;
    return `// In ${block.id}.tsx, keep DialogTitle and replace the demo panels.
<section aria-labelledby="account-settings">
  <h2 id="account-settings">Account settings</h2>
  <p>Place your application's settings form here.</p>
</section>`;
  }
  const signup = category === "signup";
  const form = signup ? "SignupForm" : "LoginForm";
  const values = signup
    ? "SignupValues"
    : block.id === "login-05"
      ? "MagicLinkValues"
      : "LoginValues";
  const social = !signup || block.id === "signup-05";
  const props = ["onSubmit={submit}"];
  if (social) props.push(`${signup ? "onSocialSignup" : "onSocialLogin"}={startProvider}`);
  if (signup) {
    props.push('loginHref="/login"', 'termsHref="/terms"', 'privacyHref="/privacy"');
    if (block.id === "signup-05") props.push("showSocial");
  } else {
    props.push('signupHref="/signup"');
    if (block.id !== "login-05") props.push('forgotPasswordHref="/forgot-password"');
  }
  return `import { ${form} } from "./components/blocks/${category}/${block.id}/${category}-form";
import type { ${values}${social ? ", AuthProvider" : ""} } from "./components/blocks/auth/shared/auth-utils";

type Props = {
  submit: (values: ${values}) => Promise<void>;${social ? "\n  startProvider: (provider: AuthProvider) => Promise<void>;" : ""}
};

// These functions come from your application's authentication service.
export const AccountForm = ({ submit${social ? ", startProvider" : ""} }: Props) => (
  <${form}
    ${props.join("\n    ")}
  />
);`;
}
