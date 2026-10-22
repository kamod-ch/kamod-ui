import type { ComponentChildren } from "preact";
import { BrandText } from "../docs/components/brand/BrandText";
import { PathDisplay } from "../docs/components/PathDisplay";
import type { BlockCategory, BlockOverviewEntry } from "./block-categories";

/** Integration guidance supplements each variant's own registry description. */
const guidance: Record<BlockCategory, ComponentChildren> = {
  sidebar: (
    <>
      Adapt the <code>Sidebar</code> components from <PathDisplay path={"@kamod-ch/ui"} /> to your
      navigation, branding and page content. Replace sample destinations with your own routes, then
      check the <strong>Mobile Layout and Keyboard Navigation</strong> in the live demo. The source
      and setup steps show which files belong to this variant.
    </>
  ),
  "application-shell": (
    <>
      Supply <code>navigationGroups</code> and <code>breadcrumbs</code>, then render your pages
      through <code>children</code>. <strong>Routing and Account Actions Stay in Your App</strong>.
      Explore desktop collapse and mobile navigation in the demo before connecting your data; the
      typed examples below explain the shell's configuration.
    </>
  ),
  login: (
    <>
      Connect the form's <code>onSubmit</code> callback to your authentication service, then adapt
      the fields, branding and account links. <strong>Your App Handles Authentication</strong>; the
      block provides the form interface. Try validation and submission feedback in the live demo,
      and review the source before integrating the form into your sign-in flow.
    </>
  ),
  signup: (
    <>
      Connect the form's <code>onSubmit</code> callback to your account service, then adapt the
      fields, branding and legal links. <strong>Account Creation Stays in Your App</strong>; the
      block provides the registration interface. Explore validation and submission feedback in the
      live demo, then use the source and setup steps to integrate your onboarding flow.
    </>
  ),
  "app-sidebar": (
    <>
      Pass navigation and user callbacks from your router, then render page content in{" "}
      <code>SidebarInset</code>. Explore collapse and mobile behavior in the preview before wiring
      production routes.
    </>
  ),
  auth: (
    <>
      Connect submit and OAuth handlers to your authentication service. Catalog variants expose
      typed props; session persistence and network calls remain in your application.
    </>
  ),
  marketing: (
    <>
      Replace demo copy and links with your product content. Each section accepts typed props rather
      than a CMS schema—compose blocks on your landing pages as ordinary Preact components.
    </>
  ),
  dashboard: (
    <>
      Supply controlled data and event handlers for charts, lists and shells. Demo fixtures show
      structure and accessibility patterns; your app owns fetching and persistence.
    </>
  ),
  communication: (
    <>
      Provide messages, threads and send handlers from your backend. Use the preview to validate
      layout and keyboard behavior before connecting live data.
    </>
  ),
  commerce: (
    <>
      Wire payment and checkout callbacks to your PSP or tokenization layer. Treat PAN/CVC as
      transient input only and prefer hosted fields in production.
    </>
  ),
};

/** Keep variant-specific features first, followed by practical category guidance. */
export function BlockDetailDescription({
  category,
  block,
}: {
  category: BlockCategory;
  block: BlockOverviewEntry;
}) {
  return (
    <>
      <BrandText>
        {block.description} {guidance[category]}
      </BrandText>
    </>
  );
}
