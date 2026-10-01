/** Shared disclosure state and fragment navigation for source-backed API cards. */
import { useEffect, useRef, useState } from "preact/hooks";

/**
 * One listener per reference, with at most one scheduled scroll. Pass stable IDs.
 * Repeated links can reopen a closed definition without requiring a hash change.
 * Cleanup cancels pending work so an old guide cannot move the next page's focus.
 */
export function useTypeDefinitions(ids: readonly string[], initiallyOpen: readonly string[] = []) {
  const [openIds, setOpenIds] = useState(() => new Set(initiallyOpen));
  const frame = useRef(0);
  const setOpen = (id: string, open: boolean) => {
    setOpenIds((current) => {
      if (current.has(id) === open) return current;
      const next = new Set(current);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  };
  const reveal = (id: string, focus = true) => {
    window.cancelAnimationFrame(frame.current);
    setOpen(id, true);
    // Wait for the disclosure render before restoring the fragment's position.
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      const heading = document.getElementById(id);
      heading?.scrollIntoView({ block: "start", behavior: "instant" });
      if (focus) heading?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    const restoreHash = (event?: HashChangeEvent) => {
      // Cancel even when navigating away from a type, avoiding a stale scroll back.
      window.cancelAnimationFrame(frame.current);
      frame.current = 0;
      const id = ids.find((id) => window.location.hash === `#${id}`);
      if (id) reveal(id, Boolean(event));
    };
    restoreHash();
    window.addEventListener("hashchange", restoreHash);
    return () => {
      window.removeEventListener("hashchange", restoreHash);
      window.cancelAnimationFrame(frame.current);
    };
  }, [ids]);

  return { isOpen: (id: string) => openIds.has(id), setOpen, reveal };
}
