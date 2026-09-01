import type { MotionProps } from "@kamod-ch/motion/motion";

/** Optional motion overrides shared by ui-motion content adapters (presets are the defaults). */
export type MotionComponentProps = Pick<
  MotionProps,
  "initial" | "animate" | "exit" | "transition" | "reducedMotion"
>;
