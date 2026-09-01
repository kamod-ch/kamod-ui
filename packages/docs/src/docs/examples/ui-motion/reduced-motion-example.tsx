import type { ReducedMotionPolicy } from "@kamod-ch/motion";
import { useReducedMotion } from "@kamod-ch/motion/hooks/use-reduced-motion";
import { Motion } from "@kamod-ch/motion/motion";
import { slideUp } from "@kamod-ch/motion/presets";
import { Button } from "@kamod-ch/ui/button";
import { useState } from "preact/hooks";
import type { UiMotionDocExample } from "./types.js";

const POLICIES: ReducedMotionPolicy[] = ["user", "always", "never"];

export const REDUCED_MOTION_EXAMPLE_CODE = `import type { ReducedMotionPolicy } from "@kamod-ch/motion";
import { Motion } from "@kamod-ch/motion/motion";
import { useReducedMotion } from "@kamod-ch/motion/hooks/use-reduced-motion";
import { slideUp } from "@kamod-ch/motion/presets";
import { Button } from "@kamod-ch/ui/button";
import { useState } from "preact/hooks";

const POLICIES: ReducedMotionPolicy[] = ["user", "always", "never"];

export function ReducedMotionCard() {
  const [policy, setPolicy] = useState<ReducedMotionPolicy>("user");
  const reduced = useReducedMotion({ policy });

  return (
    <div class="flex w-full max-w-md flex-col gap-4">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Reduced motion policy">
        {POLICIES.map((entry) => (
          <Button
            key={entry}
            size="sm"
            variant={policy === entry ? "default" : "outline"}
            aria-pressed={policy === entry}
            onClick={() => setPolicy(entry)}
          >
            {entry}
          </Button>
        ))}
      </div>
      <p class="text-sm text-muted-foreground">
        policy: <strong>{policy}</strong>
        {" · "}
        reduced: <strong>{reduced ? "yes" : "no"}</strong>
      </p>
      <Motion
        class="flex h-28 items-center justify-center rounded-xl border border-dashed bg-muted/30 text-sm"
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={slideUp.transition}
        reducedMotion={policy}
      >
        {reduced ? "Spatial motion skipped — opacity only" : "Full slide-up animation"}
      </Motion>
    </div>
  );
}`;

export function ReducedMotionPreview() {
  const [policy, setPolicy] = useState<ReducedMotionPolicy>("user");
  const reduced = useReducedMotion({ policy });

  return (
    <div class="flex w-full max-w-md flex-col gap-4">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Reduced motion policy">
        {POLICIES.map((entry) => (
          <Button
            key={entry}
            size="sm"
            variant={policy === entry ? "default" : "outline"}
            aria-pressed={policy === entry}
            onClick={() => setPolicy(entry)}
          >
            {entry}
          </Button>
        ))}
      </div>
      <p class="text-sm text-muted-foreground" data-testid="ui-motion-reduced-status">
        policy: <strong>{policy}</strong>
        {" · "}
        reduced: <strong>{reduced ? "yes" : "no"}</strong>
      </p>
      <Motion
        class="flex h-28 items-center justify-center rounded-xl border border-dashed bg-muted/30 text-sm"
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={slideUp.transition}
        reducedMotion={policy}
        data-testid="ui-motion-reduced-panel"
      >
        {reduced ? "Spatial motion skipped — opacity only" : "Full slide-up animation"}
      </Motion>
    </div>
  );
}

export const reducedMotionExample: UiMotionDocExample = {
  id: "reduced-motion",
  title: "Reduced motion",
  text: "Switch the reducedMotion policy on the same card — user respects the OS setting without changing it, always skips spatial motion, and never keeps full motion regardless of system preference.",
  code: REDUCED_MOTION_EXAMPLE_CODE,
  renderPreview: () => <ReducedMotionPreview />,
};
