import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-05");

export const Sidebar05 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
