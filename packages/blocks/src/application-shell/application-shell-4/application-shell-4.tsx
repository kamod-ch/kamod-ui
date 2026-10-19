import { ShellFrame } from "../shared/shell-frame";
import type { ApplicationShellFrameProps } from "../shared/types";

export type ApplicationShell4Props = Omit<
  ApplicationShellFrameProps,
  "open" | "defaultOpen" | "onOpenChange"
>;

/** Horizontal workspace composition. Routing, identity and service actions remain application-owned. */
export function ApplicationShell4(props: ApplicationShell4Props) {
  return <ShellFrame {...props} layout="horizontal" />;
}
