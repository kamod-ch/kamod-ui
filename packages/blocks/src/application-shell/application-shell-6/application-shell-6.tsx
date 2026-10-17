import { ShellFrame } from "../shared/shell-frame";
import type { ApplicationShellInspectorProps } from "../shared/types";

export type ApplicationShell6Props = ApplicationShellInspectorProps;

/** Inspector workspace composition. Routing, identity and service actions remain application-owned. */
export function ApplicationShell6(props: ApplicationShell6Props) {
  return <ShellFrame {...props} layout="inspector" />;
}
