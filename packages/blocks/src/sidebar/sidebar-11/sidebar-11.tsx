import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-11");

export const Sidebar11 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
