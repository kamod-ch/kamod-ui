export const canUseDOM = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined";

export const onClient = <T>(read: () => T, fallback: T): T => {
  if (!canUseDOM()) return fallback;
  try {
    return read();
  } catch {
    return fallback;
  }
};

export const prefersReducedMotion = (): boolean =>
  onClient(
    () =>
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    false,
  );

export const subscribeReducedMotion = (onChange: (reduced: boolean) => void): (() => void) => {
  if (!canUseDOM() || typeof window.matchMedia !== "function") {
    return () => undefined;
  }

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const listener = () => onChange(media.matches);
  listener();
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};

export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const editable = target.getAttribute("contenteditable");
  if (editable === "" || editable === "true" || editable === "plaintext-only") return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};
