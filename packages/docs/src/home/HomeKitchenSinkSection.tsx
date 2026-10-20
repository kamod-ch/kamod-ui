import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../base-path";
import { PageEyebrow } from "../docs/components/PageEyebrow";
import { KitchenSinkShowcase } from "../kitchen-sink/KitchenSinkShowcase";

export default function HomeKitchenSinkSection() {
  return (
    <section
      id="kitchen-sink"
      class="home-kitchen-sink"
      data-testid="kitchen-sink"
      aria-labelledby="home-kitchen-sink-title"
    >
      <div class="home-kitchen-sink-intro">
        <PageEyebrow>Kitchen Sink</PageEyebrow>
        <h2 id="home-kitchen-sink-title">Live Component Playground</h2>
        <p class="home-kitchen-sink-lead">
          Forms, inputs, feedback and navigation patterns in one composite grid — the same showcase
          that powers the demo site.
        </p>
        <a class="home-text-link" href={withBasePath("/kitchen-sink")}>
          Open full kitchen sink
          <ArrowUpRightIcon size={16} aria-hidden="true" />
        </a>
      </div>
      <KitchenSinkShowcase />
    </section>
  );
}
