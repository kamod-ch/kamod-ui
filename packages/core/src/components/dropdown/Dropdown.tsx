import { signal } from "@preact/signals";
import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef } from "preact/hooks";
import { tv } from "tailwind-variants";
import { createDismissableLayer, createIdFactory } from "../../lib/interactive";
import { cn } from "../../lib/utils";

export type DropdownContextValue = {
  open: ReturnType<typeof signal<boolean>>;
  setOpen: (next: boolean) => void;
  triggerId: string;
  contentId: string;
  rootRef: { current: HTMLDivElement | null };
  triggerRef: { current: HTMLElement | null };
  contentRef: { current: HTMLDivElement | null };
};

const DropdownContext = createContext<DropdownContextValue | null>(null);
const nextDropdownId = createIdFactory("kamod-dropdown");

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("Dropdown subcomponents must be used within Dropdown");
  return context;
};

const dropdownRoot = tv({
  base: "relative inline-flex",
});

export type DropdownProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  children?: ComponentChildren;
};

export const Dropdown = ({
  defaultOpen = false,
  class: className,
  children,
  ...rest
}: DropdownProps) => {
  const open = useMemo(() => signal(defaultOpen), []);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const instanceId = useMemo(() => nextDropdownId(), []);

  const triggerId = `${instanceId}-trigger`;
  const contentId = `${instanceId}-content`;
  const setOpen = (next: boolean) => {
    open.value = next;
  };

  useEffect(() => {
    const layer = createDismissableLayer({
      root: () => rootRef.current,
      open: () => open.value,
      onDismiss: () => {
        open.value = false;
      },
    });
    return () => layer.dispose();
  }, [open]);

  // Island hydrate can leave Preact onClick dead; native capture keeps the trigger reliable.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest(`#${CSS.escape(triggerId)}`);
      if (!trigger || !root.contains(trigger)) return;
      // Menu items handle their own activation.
      if (target.closest('[data-slot="dropdown-item"]')) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      open.value = !open.value;
    };

    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, [open, triggerId]);

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen,
        triggerId,
        contentId,
        rootRef,
        triggerRef,
        contentRef,
      }}
    >
      <div
        ref={rootRef}
        class={cn(dropdownRoot(), className)}
        data-slot="dropdown"
        data-state={open.value ? "open" : "closed"}
        {...rest}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};
