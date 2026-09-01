import { useEffect, useState } from "preact/hooks";

/** Keeps subtree mounted until `show` exit completes (via `onExitComplete`). */
export function useMotionMount(show: boolean) {
  const [mounted, setMounted] = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
    }
  }, [show]);

  const onExitComplete = () => setMounted(false);

  return { mounted, onExitComplete };
}
