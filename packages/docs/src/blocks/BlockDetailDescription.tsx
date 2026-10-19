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
