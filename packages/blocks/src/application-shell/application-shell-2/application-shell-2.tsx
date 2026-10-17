import { ShellFrame } from "../shared/shell-frame";
import type { ApplicationShellFrameProps } from "../shared/types";

export type ApplicationShell2Props = ApplicationShellFrameProps;

/** Inset workspace composition. Routing, identity and service actions remain application-owned. */
export function ApplicationShell2(props: ApplicationShell2Props) {
  return <ShellFrame {...props} layout="inset" />;
}
