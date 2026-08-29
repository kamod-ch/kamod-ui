import { AppSidebarPreviewShell } from "../shared/preview-shell";
import type { AppSidebarCollapseProps, AppSidebarPreviewMode } from "../shared/types";
import { AppSidebar04, type AppSidebar04Props } from "./sidebar-04";

export type AppSidebar04PreviewProps = AppSidebar04Props &
  AppSidebarCollapseProps & {
    mode?: AppSidebarPreviewMode;
  };

export const AppSidebar04Preview = ({
  mode,
  open,
  defaultOpen,
  onOpenChange,
  ...sidebarProps
}: AppSidebar04PreviewProps) => (
  <AppSidebarPreviewShell
    title="sidebar-04"
    mode={mode}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    sidebar={<AppSidebar04 {...sidebarProps} />}
  />
);
