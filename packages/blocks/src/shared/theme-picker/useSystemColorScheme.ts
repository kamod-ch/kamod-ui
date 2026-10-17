import { useEffect, useState } from "preact/hooks";

/** Subscribe only while needed, without reading browser state during SSR. */
export function useSystemColorScheme(enabled: boolean) {
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    if (!enabled || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setScheme(media.matches ? "dark" : "light");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [enabled]);
  return scheme;
}
