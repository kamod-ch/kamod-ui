import { Button } from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import { PageEyebrow } from "../docs/components/PageEyebrow";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { DocsTopbarActions } from "../layout/DocsTopbarActions";
import { KitchenSinkShowcase } from "./KitchenSinkShowcase";

export const KitchenSinkPage = () => (
  <DemoShell
    brand="Kamod UI"
    rootClassName="docs-shell landing-shell landing-shell--shadcn"
    topNavItems={demoTopNavItems}
    topNavLinksTestId="kitchen-sink-nav"
    topbarActions={<DocsTopbarActions />}
    mainContent={
      <div id="kitchen-sink" class="landing-shadcn-main" data-testid="kitchen-sink">
        <section class="landing-shadcn-intro" aria-labelledby="kitchen-sink-title">
          <div>
            <PageEyebrow>Kitchen Sink</PageEyebrow>
            <h1 id="kitchen-sink-title">Own Your UI. Built for Preact.</h1>
            <p class="landing-shadcn-intro-lead">
              A set of beautifully designed components that you can customize, extend, and build on.
              Open Source. Open Code.
            </p>
            <div class="landing-shadcn-intro-ctas">
              <Button href={withBasePath("/docs/getting-started")}>Get Started</Button>
              <Button href={withBasePath("/docs/components")} variant="outline">
                View Components
              </Button>
            </div>
          </div>
          <div class="landing-shadcn-subnav-bar2" />
        </section>

        <KitchenSinkShowcase />

        <p class="landing-shadcn-footer-note">
          This route is the <span class="font-medium text-foreground">Demo Kitchen Sink</span>.
          Layout inspired by{" "}
          <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
            ui.shadcn.com
          </a>{" "}
          — built with Kamod UI + Tailwind.
        </p>
      </div>
    }
    rightSidebar={null}
  />
);
