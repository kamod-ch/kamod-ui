import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-12");

export const Sidebar12 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
