/** Small source-backed reference for the copied helpers, not props on the zero-prop page wrappers. */

import authSource from "../../../../blocks/src/auth/shared/auth-utils.ts?raw";
import { sidebarBlockMetadata } from "../../../../blocks/src/sidebar/metadata";

const sidebarSources = import.meta.glob<string>(
  [
    "../../../../blocks/src/sidebar/shared/*.{ts,tsx}",
    "../../../../blocks/src/sidebar/data/*.{ts,tsx}",
  ],
  { query: "?raw", import: "default", eager: true },
);

const forms = import.meta.glob<string>(
  [
    "../../../../blocks/src/login/*/login-form.tsx",
    "../../../../blocks/src/signup/*/signup-form.tsx",
  ],
  { query: "?raw", import: "default", eager: true },
);

export type GuideField = { name: string; type: string; required: boolean; description: string };
export type GuideType = {
  name: string;
  title: string;
  description: string;
  source: string;
  fields: GuideField[];
};

/** Only the checked-in, semicolon-terminated aliases used below are supported. Fail on source drift. */
function definition(source: string, name: string): string {
  const match = source.match(
    new RegExp(`^export type ${name} = (?:[^\\n]+;$|[^\\n]*\\{\\n[\\s\\S]*?^};)`, "m"),
  );
  if (!match) throw new Error(`Missing or unsupported guide type: ${name}`);
  return match[0];
}

const descriptions: Record<string, string> = {
  title: "Visible navigation label. Keep names concise and distinguishable.",
  url: "Destination URL. The demo uses # placeholders; replace these with application routes.",
  isActive:
    "Marks the current destination or initially opens its parent disclosure. Drive it from your router.",
  icon: "Icon rendered beside the label; use a supported navigation icon key or the component type shown in the signature.",
  items:
    "Ordered destinations or nested links for this navigation helper. Supply your own data; helpers do not import demo fixtures.",
  groups: "Ordered documentation groups with titles and destination links.",
  teams:
    "Available workspaces. The first is initially selected; choosing one updates local display state only.",
  team: "Workspace details shown by the local switcher.",
  user: "Display details for the user area. This presentation does not implement account actions or authentication.",
  projects: "Project destinations and their icons, shown below the primary navigation.",
  logo: "Brand mark or short fallback text. The demo uses kamod for the included brand icon.",
  plan: "Secondary workspace label, such as a subscription tier.",
  avatar: "Short fallback text displayed inside the user avatar frame.",
  collapsible:
    "Use disclosure controls for submenus. Defaults to true; false keeps child links expanded.",
  collapsibleSections:
    "Allow each documentation group to collapse. Defaults to false; groups with active items start open.",
  onSubmit:
    "Awaited after local validation. Connect your service here; demo delays and success/error messages still need replacing.",
  onSocialLogin:
    "Receives github or google when a provider button is pressed. Supply your provider sign-in flow.",
  onSocialSignup:
    "Receives github or google from the social buttons when shown. Supply your provider registration flow.",
  forgotPasswordHref:
    "Password recovery destination. Defaults to #; replace it with your own route.",
  signupHref: "Account registration destination. Defaults to #.",
  loginHref: "Existing-account sign-in destination. Defaults to #.",
  termsHref: "Terms destination. Defaults to #; link to your product's terms.",
  privacyHref: "Privacy policy destination. Defaults to #.",
  showSocial:
    "Shows GitHub and Google buttons. Defaults to false on the form; Signup05 passes true.",
  email: "Email entered by the user. The demo checks its shape; verify it through your service.",
  password:
    "Password entered by the user. The demo requires at least eight characters; never log this value.",
  name: "Visible name. Replace demo workspace, user or project names with your application data.",
  label: "Visible breadcrumb label; the final breadcrumb represents the current page.",
  href: "Optional destination URL for a breadcrumb link.",
  hiddenOnMobile: "Hides this intermediate breadcrumb below 768px; keep the current page visible.",
  children: "Actual page content. When omitted, DashboardShell renders its placeholder panels.",
  breadcrumbParent:
    "Fallback parent label when breadcrumbs is omitted or empty. Defaults to Build Your Application.",
  breadcrumbPage: "Fallback current-page label. Defaults to Data Fetching.",
  breadcrumbs:
    "Ordered breadcrumb items; provide the current page last. A non-empty array overrides the fallback labels.",
  headerClass:
    "Classes for the breadcrumb header. Replaces the default flex, height, border and padding classes; stickyHeader adds its own sticky classes.",
  contentClass:
    "Additional classes for placeholder content only. When children is supplied, style that content directly.",
  triggerClass: "Classes for the sidebar toggle. Replaces the default -ml-1 margin.",
  headerInnerClass:
    "Classes added to the optional inner header row. Defaults to px-3; used only when headerInner is true.",
  headerInner: "Wraps the header controls in an inner padded row. Defaults to false.",
  stickyHeader: "Keeps the breadcrumb header at the top while scrolling. Defaults to false.",
  showHeader: "Renders the breadcrumb header and sidebar toggle. Defaults to true.",
  placeholder:
    "Placeholder arrangement used only when children is omitted: grid, list, squares or centered. Defaults to grid.",
  contentPaddingTop: "Includes top padding on placeholder content. Defaults to true.",
};

function reference(source: string, name: string, title: string, description: string): GuideType {
  const text = definition(source, name);
  const body = text.includes("{")
    ? text.slice(text.indexOf("{") + 1, text.lastIndexOf("}")).replace(/\/\*[\s\S]*?\*\//g, "")
    : "";
  const fields = body
    .split(";")
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const match = field.match(/^(\w+)(\?)?:\s*([\s\S]+)$/);
      if (!match) throw new Error(`Unsupported guide field: ${name}.${field}`);
      const description = descriptions[match[1]];
      if (!description) throw new Error(`Missing field documentation: ${name}.${match[1]}`);
      return {
        name: match[1],
        required: !match[2],
        type: match[3].replace(/\s+/g, " ").trim(),
        description,
      };
    });
  return { name, title, description, source: text, fields };
}

/** Each form's own signature is read, so email-only login and social signup cannot drift silently. */
export function getVariantApi(category: "sidebar" | "login" | "signup", id: string): GuideType[] {
  if (category === "sidebar") {
    const files = sidebarBlockMetadata.find((block) => block.id === id)?.files;
    if (!files) throw new Error(`Unknown sidebar: ${id}`);
    return files.flatMap((file) => {
      const source = sidebarSources[`../../../../blocks/${file.path}`];
      if (!source) return [];
      return [...source.matchAll(/^export type (\w+) =/gm)].map((match) => {
        const name = match[1];
        return reference(
          source,
          name,
          name.replace(/([a-z])([A-Z])/g, "$1 $2"),
          name.endsWith("Props")
            ? `Local helper inputs from ${file.label}. These configure the helper inside the copied page, not the exported variant itself.`
            : `Data shape from ${file.label}. Supply real application values using the required and optional fields below.`,
        );
      });
    });
  }
  const source = forms[`../../../../blocks/src/${category}/${id}/${category}-form.tsx`];
  if (!source) throw new Error(`Missing form source: ${id}`);
  const signup = category === "signup";
  const values = signup ? "SignupValues" : id === "login-05" ? "MagicLinkValues" : "LoginValues";
  return [
    reference(
      source,
      signup ? "SignupFormProps" : "LoginFormProps",
      "Complete form signature",
      "The local form accepts optional callbacks and destination links. The exported page wrapper takes no props and does not forward these callbacks.",
    ),
    reference(
      authSource,
      values,
      "Submission values",
      signup
        ? "Passed to onSubmit after local validation. Terms acceptance is kept separately and is not included in this payload."
        : "Passed to onSubmit after local validation. Your service remains responsible for completing the authentication flow.",
    ),
    reference(
      authSource,
      "AuthProvider",
      "Social provider",
      "The shared union includes gitlab, but the current forms render only GitHub and Google buttons. Adding another provider requires adding its UI and handler.",
    ),
  ];
}
