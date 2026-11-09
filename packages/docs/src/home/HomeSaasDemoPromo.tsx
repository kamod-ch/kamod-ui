import { ArrowUpRightIcon, LayoutDashboardIcon } from "@kamod-ch/icons/lucide";
import { markDemoEntryLocation } from "../analytics/growth-meta";
import { withBasePath } from "../base-path";

/**
 * Lightweight hero visual for the team demo — links out instead of embedding the full app bundle.
 */
export function HomeSaasDemoPromo() {
  const demoHref = withBasePath("/demo/saas-team");
  return (
    <a
      class="home-saas-demo-promo"
      href={demoHref}
      onClick={() => markDemoEntryLocation("landing")}
      aria-label="Explore the SaaS team management demo — application shell, metrics and team table"
    >
      <div class="home-saas-demo-promo-chrome" aria-hidden="true">
        <span class="home-saas-demo-promo-brand">
          <LayoutDashboardIcon size={16} strokeWidth={2} />
          Team workspace demo
        </span>
        <span class="home-saas-demo-promo-pill">Live route</span>
      </div>
      <div class="home-saas-demo-promo-metrics" aria-hidden="true">
        {[
          ["Members", "5"],
          ["Active", "4"],
          ["Invites", "1"],
        ].map(([label, value]) => (
          <div class="home-saas-demo-promo-metric" key={label}>
            <span class="home-saas-demo-promo-metric-label">{label}</span>
            <span class="home-saas-demo-promo-metric-value">{value}</span>
          </div>
        ))}
      </div>
      <p class="home-saas-demo-promo-copy">
        Application shell, local team data, search and invite flow.
        <ArrowUpRightIcon size={16} aria-hidden="true" />
      </p>
    </a>
  );
}
