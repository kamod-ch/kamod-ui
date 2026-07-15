import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-09");

export const Sidebar09 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
