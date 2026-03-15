import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { tv } from "tailwind-variants";
import { createDismissableLayer, createIdFactory } from "../../lib/interactive";

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

export const dropdownRoot = tv({
  base: "relative inline-flex"
});

export type DropdownProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  children?: ComponentChildren;
};

export const Dropdown = ({ defaultOpen = false, class: className, children, ...rest }: DropdownProps) => {
  const open = useMemo(() => signal(defaultOpen), []);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const instanceId = useMemo(() => nextDropdownId(), []);

  useEffect(() => {
    const layer = createDismissableLayer({
      root: () => rootRef.current,
      open: () => open.value,
      onDismiss: () => {
        open.value = false;
      }
    });
    return () => layer.dispose();
  }, []);

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen: (next) => {
          open.value = next;
        },
        triggerId: `${instanceId}-trigger`,
        contentId: `${instanceId}-content`,
        rootRef,
        triggerRef,
        contentRef
      }}
    >
      <div
        ref={rootRef}
        class={dropdownRoot({ class: className as string | undefined })}
        data-slot="dropdown"
        data-state={open.value ? "open" : "closed"}
        {...rest}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};
