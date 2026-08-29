import { AppSidebarPreviewShell } from "../shared/preview-shell";
import type { AppSidebarCollapseProps, AppSidebarPreviewMode } from "../shared/types";
import { AppSidebar03, type AppSidebar03Props } from "./sidebar-03";

export type AppSidebar03PreviewProps = AppSidebar03Props &
  AppSidebarCollapseProps & {
    mode?: AppSidebarPreviewMode;
  };

export const AppSidebar03Preview = ({
  mode,
  open,
  defaultOpen,
  onOpenChange,
  ...sidebarProps
}: AppSidebar03PreviewProps) => (
  <AppSidebarPreviewShell
    title="sidebar-03"
    mode={mode}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    sidebar={<AppSidebar03 {...sidebarProps} />}
  />
);
