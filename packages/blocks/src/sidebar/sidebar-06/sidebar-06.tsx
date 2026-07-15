import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-06");

export const Sidebar06 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
