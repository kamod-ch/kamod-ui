import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-01");

export const Sidebar01 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
