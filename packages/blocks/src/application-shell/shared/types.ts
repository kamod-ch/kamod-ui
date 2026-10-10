import type { ComponentChildren } from "preact";
import type {
  ApplicationShell1Props,
  ApplicationShellNavigationLink,
} from "../application-shell-1/types";

/** Router-independent frame data. Children belong inside the shell's existing main landmark. */
export type ApplicationShellFrameProps = ApplicationShell1Props & {
  /** Application-owned actions displayed beside the breadcrumb trail. */
  headerActions?: ComponentChildren;
};

/** Optional contextual information for Application Shell 6; hidden when omitted. */
export type ApplicationShellInspectorProps = ApplicationShellFrameProps & {
  inspector?: ComponentChildren;
  /** Accessible heading and toggle label; defaults to "Details". */
  inspectorTitle?: string;
};

/** Contextual destinations below the header, separate from global sidebar navigation. */
export type ApplicationShellSectionsProps = ApplicationShellFrameProps & {
  /** Flat links or actions; an empty list omits the section navigation landmark. */
  sectionLinks?: readonly ApplicationShellNavigationLink[];
  /** Accessible name for the contextual navigation; defaults to "Section navigation". */
  sectionLabel?: string;
};

/** Persistent controls for long pages. Saving, validation and pending state belong to the caller. */
export type ApplicationShellActionsProps = ApplicationShellFrameProps & {
  /** Status content; add role="status" only to messages that should be announced. */
  footerStatus?: ComponentChildren;
  /** Actions in a sticky, wrapping footer. A submit button can target a form using its form attribute. */
  footerActions?: ComponentChildren;
};

/** Internal union of optional slots. Public entrypoints expose only their supported layout slots. */
export type ApplicationShellLayoutProps = ApplicationShellInspectorProps &
  ApplicationShellSectionsProps &
  ApplicationShellActionsProps;
