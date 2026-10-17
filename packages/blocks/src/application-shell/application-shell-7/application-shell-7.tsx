import { ShellFrame } from "../shared/shell-frame";
import type { ApplicationShellSectionsProps } from "../shared/types";

export type ApplicationShell7Props = ApplicationShellSectionsProps;

/** Contextual route navigation beneath the shared breadcrumb header. */
export function ApplicationShell7(props: ApplicationShell7Props) {
  return <ShellFrame {...props} layout="sections" />;
}
