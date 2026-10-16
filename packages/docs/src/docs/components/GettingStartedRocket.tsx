import { RocketIcon } from "@kamod-ch/icons/tabler/outline";

/** Decorative route-local flight; CSS owns motion and reduced-motion fallback. */
export function GettingStartedRocket() {
  return (
    <span class="getting-started-flight" aria-hidden="true">
      <span class="getting-started-flight-trail">
        <i />
        <i />
        <i />
      </span>
      <RocketIcon size={78} strokeWidth={1.4} />
      <span class="getting-started-flight-star">✦</span>
    </span>
  );
}
