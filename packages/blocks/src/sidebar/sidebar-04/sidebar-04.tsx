import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-04");

export const Sidebar04 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
