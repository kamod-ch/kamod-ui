import {
  ArrowRightIcon,
  CheckIcon,
  FocusIcon,
  MousePointerClickIcon,
  ScanLineIcon,
} from "@kamod-ch/icons/lucide";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";

/** A concise visual review of the finished controls, using native in-page navigation. */
export function IconsIntegrationReview({ outcome }: { outcome: string }) {
  return (
    <section class="icons-integration-review" aria-labelledby="icons-integration-review">
      <header class="icons-integration-heading">
        <div>
          <span class="icons-integration-eyebrow">
            <CheckIcon size={14} aria-hidden="true" />
            Integration goal <span aria-hidden="true">·</span> The final pass
          </span>
          <h3 id="icons-integration-review" tabIndex={-1}>
            <BlockHeadingLink id="icons-integration-review">
              What a good integration looks like
            </BlockHeadingLink>
          </h3>
        </div>
        <a class="icons-integration-link" href="#put-it-to-work">
          See the example <ArrowRightIcon size={14} aria-hidden="true" />
        </a>
      </header>
      <p class="icons-integration-intro">{outcome}</p>

      <dl class="icons-integration-checks">
        <div>
          <dt>
            <ScanLineIcon size={17} strokeWidth={1.75} aria-hidden="true" /> One visual rhythm
          </dt>
          <dd>
            Use one family and a shared <code>size</code>. Compare stroke weight and alignment
            beside the actual text.
          </dd>
        </div>
        <div>
          <dt>
            <MousePointerClickIcon size={17} strokeWidth={1.75} aria-hidden="true" /> A clear
            purpose
          </dt>
          <dd>
            Keep a visible label when it fits. Give an icon-only button an <code>aria-label</code>{" "}
            that describes its action.
          </dd>
        </div>
        <div>
          <dt>
            <FocusIcon size={17} strokeWidth={1.75} aria-hidden="true" /> Focus you can follow
          </dt>
          <dd>
            Use <kbd>Tab</kbd> to move across the controls. Check that the focus ring stays clear in
            both light and dark mode.
          </dd>
        </div>
      </dl>

      <div class="icons-integration-footer">
        <p>One last look, in the real interface.</p>
        <a class="icons-integration-link" href="#accessibility">
          Accessibility notes <ArrowRightIcon size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
