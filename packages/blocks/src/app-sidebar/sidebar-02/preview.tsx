import { AppSidebarPreviewShell } from "../shared/preview-shell";
import type { AppSidebarCollapseProps, AppSidebarPreviewMode } from "../shared/types";
import { AppSidebar02, type AppSidebar02Props } from "./sidebar-02";

export type AppSidebar02PreviewProps = AppSidebar02Props &
  AppSidebarCollapseProps & {
    mode?: AppSidebarPreviewMode;
  };

export const AppSidebar02Preview = ({
  mode,
  open,
  defaultOpen,
  onOpenChange,
  ...sidebarProps
}: AppSidebar02PreviewProps) => (
  <AppSidebarPreviewShell
    title="sidebar-02"
    mode={mode}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    sidebar={<AppSidebar02 {...sidebarProps} />}
  />
);
