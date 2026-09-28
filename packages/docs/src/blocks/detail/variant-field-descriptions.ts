/** Integration guidance for source-extracted fields; shared names use owner-specific overrides. */
const sharedDescriptions: Record<string, string> = {
  title:
    "Visible destination label used in navigation rows and, where supported, collapsed-sidebar tooltips. Choose short, distinguishable names and keep titles unique within each list because the helpers also use them as rendering keys. Changing a title does not change its URL or select the current route.",
  url: "Destination used when the item renders as a link. Replace the demo’s # with an application route or a real URL; the shared click handler prevents navigation only for that exact placeholder. A parent with children may instead act as a disclosure or dropdown trigger, so its URL is not necessarily followed. Router-specific link components must be wired into the copied helper.",
  isActive:
    "Optional current-destination marker; omitting it leaves the item unmarked. Documentation links and direct primary links use it for their active styling and aria-current. Collapsible groups use active data for their initial open state, not as controlled disclosure state. Nested primary links, dropdown entries and Favorites do not currently read this marker; adapt those renderers if you need route highlighting there.",
  icon: "Key selecting a component from the copied navigation-icons.ts map. Use one of that map’s supported keys; an arbitrary icon name or SVG string will not resolve to a component. To introduce a new symbol, import a Kamod icon and add it to the map before using its key in your data. The adjacent text remains the destination’s visible label.",
  groups:
    "Documentation groups rendered in array order, each with a heading and its own destination list. Supply your application’s hierarchy here; NavDocs does not load fixtures or discover routes automatically. An empty array renders no groups. Use collapsibleSections to make the group headings toggle their links, and set a child’s isActive value to initially expand its group.",
  versions:
    "Version labels displayed in the documentation dropdown, in the supplied order. Use unique strings without a leading v because the helper adds that prefix itself. The array must be supplied, but an empty array produces a menu with no choices. Selecting a label changes local display state only; connect release-specific routes and navigation data in your application.",
  defaultVersion:
    "Initial displayed version when VersionSwitcher mounts. Supply a value from versions so the initial label corresponds to an available choice. This is not a controlled value: changing it later does not reset the switcher’s local selection, and removing the selected version from the choices does not update the label. Adapt the helper to controlled state if version changes must follow your router.",
  teams:
    "Workspaces available in the switcher, in display order. The first entry is selected initially, and an empty array hides the switcher entirely. Selection is stored locally by team name; if that name disappears from the array, the display falls back to the first entry. Choosing a team does not change routes, fetch workspace data or persist an account preference—connect those actions in your copied switcher.",
  user: "Display data for the sidebar’s user row: name, email and avatar fallback text. Supply it from your application’s session or profile state; the helper does not retrieve or validate the user. The current row has no account menu or action handler, so rendering it does not add logout, profile editing or authentication. Add those behaviors explicitly when adapting the composition.",
  projects:
    "Project links rendered in the supplied order beneath the Projects label. Each entry provides its own name, URL and icon-map key; the helper does not fetch projects or decide which ones the user may access. An empty array leaves the group label without links, so omit the helper if the entire group should disappear. The group is hidden when the sidebar collapses to icons.",
  logo: "Workspace mark shown both in the selected-team trigger and in the dropdown list. The exact string kamod renders the included Kamod brand icon; any other string is displayed as text, such as initials or an emoji. This is not an image URL prop. Adapt the logo renderer if you need uploaded logos or another image component.",
  plan: "Secondary text displayed beneath the selected workspace’s name, such as Enterprise or Personal workspace. The switcher treats it as a display label only; it does not enforce subscription permissions or determine available features. Keep it short enough for the compact trigger, where longer text is truncated.",
  avatar:
    "Short text rendered inside the user row’s colored avatar frame, typically initials. The string is displayed directly: supplying an image URL will show that URL as text rather than load an image. Generate an appropriate fallback from your user data, or replace the frame with a core Avatar when profile pictures are needed.",
  collapsible:
    "Controls how NavMain presents items that have children; defaults to true. With true, clicking the parent toggles its submenu and an active parent starts open. With false, the parent becomes a normal link and its child links remain visible. Items without children stay links in either mode. This option controls navigation submenus, not the sidebar’s desktop or mobile open state.",
  collapsibleSections:
    "Enables independent disclosure controls for documentation groups; defaults to false, so all group links are visible. When enabled, a group starts open if one of its items is active, and users can then toggle it locally. Later route changes do not turn that initial value into controlled open state. This option does not collapse the outer sidebar or affect mobile navigation.",
  onSubmit:
    "Receives the validated email and password when the user submits the local login form. Return a promise for the form to await your sign-in request; a thrown error or rejection enters its error state. The copied demo still waits and rejects emails containing error before calling your handler, and it can show success without a handler. Replace those demo checks and messages, then handle session creation and navigation in your application.",
  onSocialLogin:
    "Called with github or google when the corresponding provider button is pressed, independently of email/password validation. The form awaits a returned promise and displays a demo success or error message; omitting the callback does not hide the buttons. Connect your provider redirect or sign-in flow and replace the simulated delay/status copy. Although AuthProvider also includes gitlab, the current form has no GitLab button.",
  onSocialSignup:
    "Called with github or google from the provider buttons when showSocial is enabled. This path is separate from the email form’s field and terms validation; a returned promise is awaited and failures use the social error state. Connect your provider registration flow and any consent requirements in your app. Without this callback the demo can still show success, and the AuthProvider union alone does not add a GitLab button.",
  forgotPasswordHref:
    "URL for the Forgot your password? link beside the password field; defaults to #. Point it to your recovery page, where your app can request and complete a password reset. This prop only changes the link destination; it does not send an email, validate the recovery request or open a recovery dialog. Replace the anchor in the copied form if your router requires its own link component.",
  signupHref:
    "URL for the Sign up link below the login form; defaults to #. Supply your registration route so users can move from sign-in to account creation. Changing this value does not carry over entered credentials or configure a signup service. For client-side routing, adapt the rendered anchor to your app’s navigation conventions.",
  loginHref:
    "URL for the Log in link below the signup form; defaults to #. Set it to the existing-account sign-in route appropriate for your application. The link does not submit the signup form or transfer its entered values. Use your router’s link component in the copied source if navigation must stay within a client-side router.",
  termsHref:
    "Destination for the Terms of Service link beside the signup consent checkbox; defaults to #. Link to the terms that apply to your product and keep that content available to users before they submit. The email form requires the checkbox locally, but this URL does not record acceptance and the SignupValues payload does not include it. Add any required consent data to your own submission flow.",
  privacyHref:
    "Destination for the Privacy Policy link in the signup form’s consent text; defaults to #. Supply the actual policy page for your product rather than leaving the demo anchor in place. This is a navigation prop only: it does not fetch policy content, track which version was read or add consent information to the submitted values.",
  showSocial:
    "Shows the GitHub and Google signup buttons and their separator above the email fields. It defaults to false on SignupForm, while the supplied Signup05 page explicitly enables it. Enabling the controls does not configure providers; supply onSocialSignup and connect the corresponding flow. The email form remains available, and hiding the social controls does not alter its validation.",
  email:
    "Email string passed to your submit callback after the form’s simple local format check. The copied form forwards the entered value without normalizing it; decide how your service handles surrounding whitespace and address casing. Passing the local check neither verifies ownership nor proves that an account exists. The demo also treats addresses containing error as a simulated failure before invoking onSubmit.",
  password:
    "Password string entered in the form and forwarded to onSubmit after the local minimum-length check of eight characters. The field does not trim or hash the value, and the demo’s validation is not an authentication service. Apply your application’s actual credential rules and submit through the appropriate service; avoid placing this value in logs or URLs. It is never included in the email-only MagicLinkValues payload.",
  label:
    "Text for one breadcrumb in the header’s ordered trail. Place the current page last: that final item is always rendered as page text, even if it has an href. Earlier items become links only when they supply href. Keep labels concise and distinct within the trail because they also serve as rendering keys.",
  href: "Optional URL for an intermediate breadcrumb. When present on a non-final item it renders a BreadcrumbLink; when omitted, the item renders as page text instead. The last breadcrumb never becomes a link, even if a URL is supplied. Set real parent destinations here rather than relying on the fallback trail’s # placeholder.",
  hiddenOnMobile:
    "Hides this breadcrumb and its preceding separator below 768px; omitted or false keeps them visible. Use it for intermediate hierarchy levels when space is limited. The helper does not protect the final item from this flag, so leave it unset on the current page. Review the whole trail on mobile after hiding items so the remaining context is still understandable.",
  children:
    "Your page content rendered directly beneath DashboardShell’s optional breadcrumb header inside SidebarInset. Supplying content replaces the placeholder panels completely; add your own padding, layout and loading states around it. Null or undefined falls back to the selected placeholder arrangement. Use this on the local DashboardShell in your copied composition, not as a prop on the exported SidebarXX wrapper.",
  breadcrumbParent:
    "Parent label in the fallback two-level breadcrumb trail, used when breadcrumbs is omitted or empty. Defaults to Build Your Application and is hidden below 768px; an empty string removes it. Its fallback link points to #. Use the breadcrumbs array instead when the parent needs a real destination or the hierarchy contains more levels.",
  breadcrumbPage:
    "Current-page label in the fallback breadcrumb trail; defaults to Data Fetching. It stays visible on mobile and is rendered as page text rather than a link. This value is ignored when a non-empty breadcrumbs array is supplied. Update it from your page context, or switch to that array for a fully specified hierarchy.",
  breadcrumbs:
    "Ordered trail of labels and optional destinations; place the current page last. A non-empty array replaces breadcrumbParent and breadcrumbPage, while an empty array still uses their fallback values rather than hiding the trail. Use hiddenOnMobile selectively on intermediate items. To remove the whole header and its toggle, use showHeader instead.",
  headerClass:
    "Class string replacing the header’s default flex layout, height, border and horizontal padding. Include any structural classes you still need when overriding it; this is not merely appended to the defaults. stickyHeader independently adds sticky positioning, top offset, stacking and background classes. The value has no visible effect when showHeader is false.",
  contentClass:
    "Extra classes merged into the grid, list and squares placeholder wrappers, alongside their flex layout and padding classes. This does not style custom children or the outer SidebarInset. The centered placeholder uses its own fixed wrapper and ignores this value. Once you supply real content, put its classes on your own elements instead.",
  triggerClass:
    "Class string passed to the breadcrumb header’s SidebarTrigger, replacing the default -ml-1 margin. Use it to adjust the toggle’s position within your chosen header layout while retaining the core trigger behavior. An empty string removes that default margin. It has no visible effect when showHeader is false and does not control whether the sidebar is open.",
  headerInnerClass:
    "Classes merged with the inner header row’s fixed flex alignment and gap when headerInner is true. Defaults to px-3; supplying a value replaces that default padding rather than appending to it. Use this for the row around the toggle, separator and breadcrumbs, while headerClass styles the outer header. It is ignored when the inner row is disabled.",
  headerInner:
    "Wraps the sidebar toggle, separator and breadcrumbs in a shared inner row; defaults to false. Enable it when the header needs an outer surface and a separately padded group of controls. The row receives flex alignment plus headerInnerClass, whose default is px-3. This changes markup and spacing only, not navigation or sidebar state.",
  stickyHeader:
    "Adds sticky top positioning, z-index and the theme background to the breadcrumb header; defaults to false. It keeps that header visible within the applicable scroll container rather than making the entire page fixed. Review ancestor overflow when integrating the copied layout because it affects sticky behavior. No sticky header is rendered when showHeader is false.",
  showHeader:
    "Controls whether DashboardShell renders its breadcrumb header, separator and sidebar toggle; defaults to true. Setting it to false leaves the content area intact but also removes that built-in toggle. If your composition supplies its own header, place a SidebarTrigger there when users still need to open or collapse navigation. This flag does not hide the sidebar itself.",
  placeholder:
    "Selects the demonstration content shown when children is null or undefined; defaults to grid. Choose grid for three summary panels and a larger area, list for repeated rows, squares for a tile grid or centered for a narrower centered composition. These are static visual placeholders, not loading or data-fetching components. The option is ignored as soon as you supply your own content.",
  contentPaddingTop:
    "Controls top padding on the grid, list and squares placeholder wrappers; defaults to true. Setting it to false retains their side and bottom padding but removes the top gap, useful when matching a particular header composition. It does not affect custom children. The centered placeholder has its own fixed padding and also ignores this option.",
};

const ownerDescriptions: Record<string, Record<string, string>> = {
  DocumentationGroup: {
    title:
      "Heading displayed above this documentation group’s links. When collapsibleSections is enabled it also labels the disclosure button; otherwise it remains a static group label. Use a concise category name and keep group titles unique because NavDocs uses them as keys. The title does not itself define a destination.",
    items:
      "Links belonging to this documentation group, displayed in array order. Supply each label and destination and mark the current link with isActive when appropriate. An empty array leaves an empty group rather than removing its heading. With collapsibleSections enabled, an active child causes the group to start open; later route changes do not control its disclosure state.",
  },
  NavigationItem: {
    items:
      "Optional nested destinations for this primary navigation item. Omit it or supply an empty array to keep the parent as a direct link. NavMain renders children inline, optionally behind a disclosure, while NavMainDropdowns places them in a dropdown. These children are NavigationLink entries, so this shape supports one child level rather than an arbitrary recursive tree. Child active markers are not rendered by these submenu helpers.",
  },
  NavMainProps: {
    items:
      "Primary navigation rows, in display order, with icon-map keys and optional child links. Each row without children navigates directly; rows with children follow the collapsible setting. Supply your own data and derive active markers from your router because NavMain does not discover the current route. An empty array leaves the Platform label with no destination rows.",
  },
  NavMainDropdownsProps: {
    items:
      "Primary navigation data for the dropdown-based helper. Rows with children open a menu to the right, while rows without children render direct links; the parent URL is not followed when it is a dropdown trigger. Array order controls display order and an empty array leaves only the Platform label. The helper receives its data from you and does not synchronize selection with a router.",
  },
  NavFavoritesProps: {
    items:
      "Saved destination links shown under Favorites, in the order you supply. Each row gets the helper’s fixed star icon; this is not a bookmarking store and clicking a link does not save or remove anything. Supply persisted favorites from your app if needed. Empty arrays leave the group heading, and the current renderer does not use each link’s optional isActive marker.",
  },
  NavSecondaryProps: {
    items:
      "Secondary destinations such as support or feedback, rendered in array order in a group with an automatic top margin. Each entry supplies its label, URL and icon component. The helper provides links only, not the support action or service behind them. An empty array renders an empty group; omit the helper when that space should disappear too.",
  },
  SecondaryItem: {
    icon: "Preact component rendered before this secondary link’s label. Pass the icon component itself, such as LifeBuoyIcon, rather than a string key or an already-created JSX element. Unlike primary navigation, this helper does not resolve an icon-map name. Choose an icon that remains legible at the sidebar’s compact size; the adjacent title provides the destination text.",
  },
  SettingsItem: {
    title:
      "Visible settings category label in the dialog’s navigation. In the supplied Sidebar13 example the first entry is always styled as active, so reordering entries moves the highlight but does not create working panel selection. Keep titles distinct and replace that demo selection rule with your own state when connecting real settings panels.",
    icon: "Renderable Preact content shown beside the settings label, for example a JSX element such as <SettingsIcon />. This differs from the icon-map key used by primary navigation and the component reference used by secondary links. Create the element in your settings data and use its props for any sizing adjustments. The icon itself does not implement panel switching.",
  },
  Team: {
    name: "Workspace name displayed in the selected-team trigger and dropdown choices. TeamSwitcher also uses this value as its selection identity and rendering key, so names must be unique and stable while the list is mounted. Renaming or removing the selected name makes the display fall back to the first available team. If names are editable in your product, consider adapting the helper to use a separate stable ID.",
  },
  Project: {
    name: "Project label shown beside its icon in the Projects group. Keep names distinguishable and unique within the list because the helper uses them as rendering keys. This is presentation data, not a project identifier sent to a backend. Put the actual destination in url and manage project loading and permissions in your application.",
  },
  User: {
    name: "User-facing display name shown above the email in the sidebar’s account row. It is rendered as text and truncated to fit the compact layout. Provide it from your profile data rather than assuming it is a login identifier. Changing the name does not update an account or attach behavior to the row.",
    email:
      "Secondary account label shown beneath the user’s name, truncated when space is limited. Unlike form submission values, this field is display-only: NavUser does not validate it, create a mail link or verify account ownership. Supply the appropriate profile email from your app. It is not automatically synchronized with the standalone login or signup forms.",
  },
  SignupValues: {
    name: "Name entered by the user and passed to the signup callback. Local validation requires at least two characters after trimming for the check, but the submitted value itself is not trimmed. Decide how your service normalizes and stores display names. This payload contains only name, email and password; the separately managed terms checkbox is not included.",
  },
  SignupFormProps: {
    onSubmit:
      "Receives name, email and password after the local field checks and terms acceptance pass. Return a promise so the form awaits account creation; thrown errors or rejections reach its error state. The copied form still runs its artificial delay and error-address check first and shows demo success even without a callback. Replace those behaviors and messages, and add any consent record your service requires because SignupValues does not contain the checkbox state.",
  },
};

/** Resolve overloaded field names against their owning type and the actual extracted signature. */
export function getVariantFieldDescription(owner: string, field: string, type: string): string {
  if (owner === "LoginFormProps" && field === "onSubmit" && type.includes("MagicLinkValues")) {
    return "Receives an object containing only email after the email-only form passes its local format check. Return a promise for the form to await your magic-link request; your service must actually send the link and handle its completion. The copied form still delays and rejects error-containing addresses before invoking the callback, and can show its sent message without one. Replace that demo behavior and status copy; no password or session is created by this callback automatically.";
  }
  const description = ownerDescriptions[owner]?.[field] ?? sharedDescriptions[field];
  if (!description) throw new Error(`Missing field documentation: ${owner}.${field}`);
  return description;
}
