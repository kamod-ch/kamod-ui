import { AppSidebarPreviewShell } from "../shared/preview-shell";
import type { AppSidebarCollapseProps, AppSidebarPreviewMode } from "../shared/types";
import { sidebar05WidthVars } from "../shared/width-style";
import { AppSidebar05, type AppSidebar05Props } from "./sidebar-05";

export type AppSidebar05PreviewProps = AppSidebar05Props &
  AppSidebarCollapseProps & {
    mode?: AppSidebarPreviewMode;
  };

export const AppSidebar05Preview = ({
  mode,
  open,
  defaultOpen,
  onOpenChange,
  ...sidebarProps
}: AppSidebar05PreviewProps) => (
  <AppSidebarPreviewShell
    title="sidebar-05"
    mode={mode}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    widthVars={sidebar05WidthVars}
    sidebar={<AppSidebar05 {...sidebarProps} />}
  />
);
