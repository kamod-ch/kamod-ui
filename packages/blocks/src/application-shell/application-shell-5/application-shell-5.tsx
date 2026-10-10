import { ShellFrame } from "../shared/shell-frame";
import type { ApplicationShellFrameProps } from "../shared/types";

export type ApplicationShell5Props = ApplicationShellFrameProps;

/** Right workspace composition. Routing, identity and service actions remain application-owned. */
export function ApplicationShell5(props: ApplicationShell5Props) {
  return <ShellFrame {...props} layout="right" />;
}
