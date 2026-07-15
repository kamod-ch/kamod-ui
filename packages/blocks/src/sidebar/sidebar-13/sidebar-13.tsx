import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-13");

export const Sidebar13 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
