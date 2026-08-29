import { useEffect, useState } from "preact/hooks";
import { prefersReducedMotion, subscribeReducedMotion } from "../../shared";

export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => subscribeReducedMotion(setReduced), []);
  return reduced || prefersReducedMotion();
};
