/** Small source-backed reference for the copied helpers, not props on the zero-prop page wrappers. */

import authSource from "../../../../blocks/src/auth/shared/auth-utils.ts?raw";
import appSidebarSource from "../../../../blocks/src/sidebar/shared/app-sidebar.tsx?raw";
import dashboardSource from "../../../../blocks/src/sidebar/shared/dashboard-shell.tsx?raw";
import sidebarSource from "../../../../blocks/src/sidebar/sidebar-data.ts?raw";

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
  id: "Stable registered variant ID used to select this composition.",
  title: "Registry title identifying the variant.",
  description: "Short description of the layout.",
  eyebrow: "Descriptive label in the variant configuration.",
  features: "Feature tags describing the variant; tags do not enable behavior by themselves.",
  layout: "Optional breadcrumb, header and placeholder configuration for the selected composition.",
  floating: "Uses a floating sidebar surface in the standard composition.",
  dropdowns: "Selects dropdown navigation in the standard composition.",
  iconMode: "Enables the standard composition's desktop icon collapse.",
  inset: "Selects the inset workspace composition.",
  nested: "Selects the two-pane navigation composition.",
  popover:
    "Selects the favorites/action-menu composition; it does not wrap the sidebar in a Popover.",
  fileTree: "Selects the expandable file-tree composition.",
  calendar: "Selects the calendar navigation composition.",
  dialog: "Selects the settings dialog composition.",
  right: "Places the standard application sidebar on the right.",
  dual: "Selects the application sidebar plus the right utility pane.",
  submenus: "Shows always-expanded app submenus in the standard composition.",
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
  name: "Display name entered by the user. Signup requires at least two non-whitespace characters.",
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
  headerInner: "Wraps the header controls in an inner padded row. Defaults to false.",
  stickyHeader: "Keeps the breadcrumb header at the top while scrolling. Defaults to false.",
  showHeader: "Renders the breadcrumb header and sidebar toggle. Defaults to true.",
  placeholder:
    "Placeholder arrangement used only when children is omitted: grid, list, squares or centered. Defaults to grid.",
  contentPaddingTop: "Includes top padding on placeholder content. Defaults to true.",
  mode: "Selects docs, app, submenus or dropdowns navigation. Defaults to docs.",
  collapsibleSections:
    "Makes documentation navigation groups independently collapsible. Defaults to false.",
  collapsibleSubmenus: "Adds disclosure triggers in submenu mode. Defaults to false.",
  showSearchForm:
    "Adds search in submenu mode; documentation mode always includes it. Defaults to false. Connect a search implementation yourself.",
  showOptInForm:
    "Shows the sample newsletter card in dropdown mode. Defaults to false; it has no subscription backend.",
  showSecondaryNav: "Adds sample utility navigation in app mode. Defaults to false.",
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
  if (category === "sidebar")
    return [
      reference(
        dashboardSource,
        "DashboardShellProps",
        "Page content and breadcrumbs",
        "Local layout helper used by the sidebar compositions. All props are optional; pass children to replace the demo panels.",
      ),
      reference(
        appSidebarSource,
        "AppSidebarProps",
        "Navigation composition",
        "Local sidebar helper. Extends the core SidebarProps, forwarding side, variant, collapsible and other sidebar attributes.",
      ),
      reference(
        sidebarSource,
        "SidebarBlockVariant",
        "Variant configuration",
        "Configuration selected by the zero-prop page. Specialized layout flags select distinct compositions; they are not arbitrary mix-and-match options. Pass a variant to the local SidebarBlockShell helper.",
      ),
      reference(
        sidebarSource,
        "SidebarBlockLayout",
        "Header and placeholder options",
        "Optional layout settings consumed by sidebar compositions. Each variant may supply its own defaults in sidebar-data.ts.",
      ),
      reference(
        sidebarSource,
        "BreadcrumbItem",
        "Breadcrumb data",
        "An ordered destination within the header; only label is required.",
      ),
    ];
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
