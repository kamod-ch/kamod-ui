import { ShellFrame } from "../shared/shell-frame";
import type { ApplicationShellActionsProps } from "../shared/types";

export type ApplicationShell8Props = ApplicationShellActionsProps;

/** Long-form workspace with persistent, application-owned page actions. */
export function ApplicationShell8(props: ApplicationShell8Props) {
  return <ShellFrame {...props} layout="actions" />;
}
