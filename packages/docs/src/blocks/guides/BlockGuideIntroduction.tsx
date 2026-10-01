import { withBasePath } from "../../base-path";
import type { blockGuides } from "./guide-catalog";

type GuideSlug = (typeof blockGuides)[number]["slug"];

/** Rich introductions stay in the guide route chunk, outside navigation metadata. */
export function BlockGuideIntroduction({ slug }: { slug: GuideSlug }) {
  if (slug === "getting-started")
    return (
      <>
        <p>
          Start with a <a href={withBasePath("/blocks")}>block collection</a> that fits your screen,
          then bring its source into your <code>Preact</code> application. This guide walks through
          <strong> choosing, installing and connecting a complete composition</strong>, from
          checking <code>package.json</code> to replacing demo content with your own routes, data
          and services. You’ll learn what to copy, which dependencies belong in your app and how to
          keep the composition independent of your router or authentication provider.
        </p>
        <p>
          Use each variant’s <strong>Code tab and setup guide</strong> for its exact files and
          dependencies. Keep relative imports intact, reuse components from{" "}
          <code>@kamod-ch/ui</code>, and follow the{" "}
          <a href={withBasePath("/docs/theming/css-setup")}>CSS setup instructions</a> before
          checking the first render, keyboard navigation and smaller screens. Start with the working
          example, then adapt one part at a time; the{" "}
          <a href={withBasePath("/blocks/styles")}>component styles guide</a> helps you refine its
          appearance without losing the behavior already provided by the shared components.
        </p>
      </>
    );
  if (slug === "styles")
    return (
      <>
        <p>
          Make a block feel like your product by refining its{" "}
          <strong>spacing, hierarchy and component treatments</strong>. Learn which changes belong
          in the <code>Preact</code> composition, which can use a component’s <code>variant</code>{" "}
          or <code>size</code> props, and which should become shared theme decisions across your
          app. Start with the existing structure, identify the visual details you want to change and
          keep reusable patterns close to the components that own them.
        </p>
        <p>
          Explore the <a href={withBasePath("/docs/components")}>component reference</a> before
          changing an interaction, and use <code>class</code> utilities for local layout
          adjustments. Keep <strong>focus states and responsive behavior</strong> intact while
          replacing sample content. The{" "}
          <a href={withBasePath("/docs/theming/installation")}>shared theming guide</a> explains how
          semantic tokens keep those refinements consistent in light and dark mode. Work through
          typography, surfaces and density together, then check long labels, empty states and narrow
          layouts so the result works with real content as well as the preview.
        </p>
      </>
    );
  return (
    <>
      <p>
        Bring a copied layout into the <strong>theme your application already uses</strong>. Blocks
        compose the same <code>@kamod-ch/ui</code> components and semantic tokens as individual
        controls. This guide focuses on{" "}
        <strong>sidebar surfaces, copied-source discovery and complete-screen checks</strong>, so
        you can adapt a composition without introducing another stylesheet or appearance system.
      </p>
      <p>
        Start with the{" "}
        <a href={withBasePath("/docs/theming/installation")}>
          shared Theming &amp; Tailwind reference
        </a>{" "}
        for global CSS, preset overrides and runtime setup. Then use this companion to check{" "}
        <code>--sidebar-background</code>, distinguish preview settings from application preferences
        and verify overlays in both schemes. Add a{" "}
        <a href={withBasePath("/docs/theme-toggle/installation")}>Theme Toggle</a> where it suits
        your layout; keep an explicit System option when users need it. For local spacing and
        hierarchy, continue with <a href={withBasePath("/blocks/styles")}>Component styles</a>.
      </p>
    </>
  );
}
