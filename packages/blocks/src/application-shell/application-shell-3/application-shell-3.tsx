import { ShellFrame } from "../shared/shell-frame";
import type { ApplicationShellFrameProps } from "../shared/types";

export type ApplicationShell3Props = ApplicationShellFrameProps;

/** Rail workspace composition. Routing, identity and service actions remain application-owned. */
export function ApplicationShell3(props: ApplicationShell3Props) {
  return <ShellFrame {...props} layout="rail" />;
}
