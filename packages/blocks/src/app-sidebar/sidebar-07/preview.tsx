import { AppSidebarPreviewShell } from "../shared/preview-shell";
import type { AppSidebarCollapseProps, AppSidebarPreviewMode } from "../shared/types";
import { AppSidebar07, type AppSidebar07Props } from "./sidebar-07";

export type AppSidebar07PreviewProps = AppSidebar07Props &
  AppSidebarCollapseProps & {
    mode?: AppSidebarPreviewMode;
  };

export const AppSidebar07Preview = ({
  mode,
  open,
  defaultOpen,
  onOpenChange,
  ...sidebarProps
}: AppSidebar07PreviewProps) => (
  <AppSidebarPreviewShell
    title="sidebar-07"
    mode={mode}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    sidebar={<AppSidebar07 {...sidebarProps} />}
  />
);
