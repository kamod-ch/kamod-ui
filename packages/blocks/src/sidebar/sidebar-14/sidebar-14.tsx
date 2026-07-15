import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-14");

export const Sidebar14 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
