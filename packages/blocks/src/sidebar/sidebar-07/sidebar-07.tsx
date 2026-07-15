import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-07");

export const Sidebar07 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
