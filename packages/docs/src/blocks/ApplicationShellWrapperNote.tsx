import { ArrowUpRightIcon, LayersIcon } from "@kamod-ch/icons/lucide";
import { DocsCallout } from "../docs/components/DocsCallout";

/** A compact map of the wrapper styling boundary and the shell's existing landmark. */
export function ApplicationShellWrapperNote() {
  return (
    <DocsCallout
      class="shell-wrapper-note"
      icon={<LayersIcon />}
      title={
        <span class="shell-wrapper-heading">
          Wrapper Styling
          <span>
            <i aria-hidden="true">·</i> Outer layer
          </span>
        </span>
      }
      footer={
        <>
          <span>
            <strong>One main is enough.</strong> The shell already renders <code>main</code>; don’t
            nest another.
          </span>
          <a href="#application-shell-structure">
            See the structure <ArrowUpRightIcon size={14} aria-hidden="true" />
          </a>
        </>
      }
    >
      <div class="shell-wrapper-content">
        <p>
          <code>class</code> and <code>className</code> style the <strong>outer wrapper</strong>.
          Keep customization at that boundary: arbitrary HTML attributes and other provider options
          are <strong>not forwarded</strong>.
        </p>
        <div class="shell-wrapper-map" aria-hidden="true">
          <span>
            class <i>·</i> className
          </span>
          <div>
            <span>main</span>
            <span>Your page content</span>
          </div>
        </div>
      </div>
    </DocsCallout>
  );
}
