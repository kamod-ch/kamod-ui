import { signal } from "@preact/signals";
import { useEffect, useMemo, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { createDismissableLayer } from "../../lib/interactive";
import { NavigationMenuRootContext, type NavigationMenuRootContextValue } from "./navigation-menu-context";

export type NavigationMenuProps = JSX.HTMLAttributes<HTMLElement> & {
  children?: ComponentChildren;
  /** Delay before opening a submenu on hover (ms). */
  delayDuration?: number;
  /** After opening, subsequent opens skip the delay for this many ms. */
  skipDelayDuration?: number;
  /** Passed to the root `nav` for RTL. */
  dir?: "ltr" | "rtl";
};

export const NavigationMenu = ({
  class: className,
  children,
  delayDuration = 200,
  skipDelayDuration = 300,
  dir,
  ...rest
}: NavigationMenuProps) => {
  const openValue = useMemo(() => signal<string | null>(null), []);
  const rootRef = useRef<HTMLElement | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastOpenAtRef = useRef(0);

  const ctx = useMemo<NavigationMenuRootContextValue>(() => {
    const clearTimers = () => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };

    return {
      openValue,
      delayDuration,
      skipDelayDuration,
      rootRef,
      openTimerRef,
      closeTimerRef,
      lastOpenAtRef,
      clearTimers,
      requestOpen: (itemValue: string) => {
        clearTimers();
        const now = Date.now();
        const skip = now - lastOpenAtRef.current < skipDelayDuration && lastOpenAtRef.current > 0;
        const run = () => {
          openValue.value = itemValue;
          lastOpenAtRef.current = Date.now();
        };
        if (skip || delayDuration <= 0) {
          run();
        } else {
          openTimerRef.current = setTimeout(run, delayDuration);
        }
      },
      requestClose: (delayMs = 120) => {
        clearTimers();
        closeTimerRef.current = setTimeout(() => {
          openValue.value = null;
          closeTimerRef.current = null;
        }, delayMs);
      },
      toggleItem: (itemValue: string) => {
        clearTimers();
        openValue.value = openValue.value === itemValue ? null : itemValue;
        if (openValue.value) lastOpenAtRef.current = Date.now();
      }
    };
  }, [openValue, delayDuration, skipDelayDuration]);

  useEffect(() => {
    ctx.delayDuration = delayDuration;
    ctx.skipDelayDuration = skipDelayDuration;
  }, [ctx, delayDuration, skipDelayDuration]);

  useEffect(() => {
    const layer = createDismissableLayer({
      root: () => rootRef.current,
      open: () => openValue.value != null,
      onDismiss: () => {
        openValue.value = null;
      }
    });
    return () => layer.dispose();
  }, [openValue]);

  return (
    <NavigationMenuRootContext.Provider value={ctx}>
      <nav
        ref={rootRef}
        data-slot="navigation-menu"
        aria-label="Main"
        dir={dir}
        class={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
        {...rest}
      >
        {children}
      </nav>
    </NavigationMenuRootContext.Provider>
  );
};
