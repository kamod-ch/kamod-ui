import { useEffect, useRef } from "preact/hooks";
import type { UseKeyboardShortcutsOptions } from "./shortcuts-help-types";
import {
  isEditableTarget,
  matchesKeyboardShortcut,
  resolveShortcutPlatform,
} from "./shortcuts-help-utils";

export const useKeyboardShortcuts = ({
  shortcuts,
  platform: platformProp,
  enabled = true,
}: UseKeyboardShortcutsOptions): void => {
  const platform = resolveShortcutPlatform(platformProp);
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let composing = false;

    const onCompositionStart = () => {
      composing = true;
    };

    const onCompositionEnd = () => {
      composing = false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (composing) return;
      if (isEditableTarget(event.target)) return;

      for (const shortcut of shortcutsRef.current) {
        if (shortcut.enabled === false) continue;
        if (matchesKeyboardShortcut(event, shortcut.keys, platform)) {
          event.preventDefault();
          shortcut.onTrigger(event);
          return;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("compositionstart", onCompositionStart);
    document.addEventListener("compositionend", onCompositionEnd);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("compositionstart", onCompositionStart);
      document.removeEventListener("compositionend", onCompositionEnd);
    };
  }, [enabled, platform]);
};
