import { AppSidebarPreviewShell } from "../shared/preview-shell";
import type { AppSidebarCollapseProps, AppSidebarPreviewMode } from "../shared/types";
import { AppSidebar01, type AppSidebar01Props } from "./sidebar-01";

export type AppSidebar01PreviewProps = AppSidebar01Props &
  AppSidebarCollapseProps & {
    mode?: AppSidebarPreviewMode;
  };

export const AppSidebar01Preview = ({
  mode,
  open,
  defaultOpen,
  onOpenChange,
  ...sidebarProps
}: AppSidebar01PreviewProps) => (
  <AppSidebarPreviewShell
    title="sidebar-01"
    mode={mode}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    sidebar={<AppSidebar01 {...sidebarProps} />}
  />
);
