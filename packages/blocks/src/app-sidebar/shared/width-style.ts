import type { JSX } from "preact";
import type { SidebarWidthVars } from "./types";

export const sidebar05WidthVars: SidebarWidthVars = {
  "--sidebar-width": "19.5rem",
  "--sidebar-width-icon": "3.5rem",
};

export const toSidebarProviderStyle = (vars: Partial<SidebarWidthVars>): JSX.CSSProperties =>
  vars as JSX.CSSProperties;
