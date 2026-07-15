import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-03");

export const Sidebar03 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
