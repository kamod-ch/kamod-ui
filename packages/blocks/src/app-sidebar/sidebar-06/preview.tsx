import { AppSidebarPreviewShell } from "../shared/preview-shell";
import type { AppSidebarCollapseProps, AppSidebarPreviewMode } from "../shared/types";
import { AppSidebar06, type AppSidebar06Props } from "./sidebar-06";

export type AppSidebar06PreviewProps = AppSidebar06Props &
  AppSidebarCollapseProps & {
    mode?: AppSidebarPreviewMode;
  };

export const AppSidebar06Preview = ({
  mode,
  open,
  defaultOpen,
  onOpenChange,
  ...sidebarProps
}: AppSidebar06PreviewProps) => (
  <AppSidebarPreviewShell
    title="sidebar-06"
    mode={mode}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    sidebar={<AppSidebar06 {...sidebarProps} />}
  />
);
