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
          replacing sample content. The <a href={withBasePath("/blocks/theming")}>theming guide</a>{" "}
          explains how semantic tokens keep those refinements consistent in light and dark mode.
          Work through typography, surfaces and density together, then check long labels, empty
          states and narrow layouts so the result works with real content as well as the preview.
        </p>
      </>
    );
  return (
    <>
      <p>
        Give every block the same foundation with <code>Tailwind CSS v4</code>, semantic tokens and
        Kamod’s theme runtime. Connect your global stylesheet, choose a preset and configure
        <strong> light and dark color schemes</strong> so copied blocks feel at home alongside the
        rest of your application, including its first render. This guide separates stylesheet setup,
        theme selection and local overrides, helping you choose the right place for each change
        instead of repeating color values across individual blocks.
      </p>
      <p>
        Start with the <a href={withBasePath("/docs/theming/css-setup")}>CSS setup guide</a>, then
        learn how <code>@source</code> discovery and tokens such as <code>--background</code>,{" "}
        <code>--foreground</code> and <code>--sidebar</code> affect the result. Use
        <strong> shared tokens for application-wide changes</strong> and local utilities for
        individual layouts; the <a href={withBasePath("/blocks/styles")}>component styles guide</a>{" "}
        helps you decide where each adjustment belongs. Finish by checking text contrast, focus
        indicators and sidebar surfaces in both schemes, and verify that the production build
        includes the utilities your copied source uses.
      </p>
    </>
  );
}
