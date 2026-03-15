import { useLayoutEffect } from "preact/hooks";
import { Command, type CommandProps, useCommand } from "../command/Command";
import { cn } from "../../lib/utils";
import { useCombobox } from "./combobox-context";

function CommandNavBridge() {
  const cmd = useCommand();
  const combo = useCombobox();
  const navRef = combo.commandNavRef;
  useLayoutEffect(() => {
    navRef.current = {
      moveHighlight: cmd.moveHighlight,
      activateHighlighted: cmd.activateHighlighted
    };
    return () => {
      navRef.current = null;
    };
  }, [cmd.moveHighlight, cmd.activateHighlighted, navRef]);
  return null;
}

export const ComboboxCommand = ({
  autoHighlight: autoHighlightProp,
  class: className,
  children,
  ...rest
}: CommandProps) => {
  const ctx = useCombobox();
  const query = ctx.liftedFilter && ctx.filterQuery ? ctx.filterQuery : undefined;
  const hasVis = ctx.liftedFilter && ctx.hasVisibleItems ? ctx.hasVisibleItems : undefined;
  const autoHighlight = autoHighlightProp ?? ctx.autoHighlight;
  return (
    <Command
      {...rest}
      class={cn("rounded-lg border-0 bg-transparent shadow-none", className)}
      autoHighlight={autoHighlight}
      query={query}
      hasVisibleItems={hasVis}
    >
      <CommandNavBridge />
      {children}
    </Command>
  );
};

export type { CommandProps as ComboboxCommandProps };
