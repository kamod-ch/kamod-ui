import { SidebarBlockShell } from "../SidebarBlockShell";
import { sidebarVariants } from "../sidebar-data";

const variant = sidebarVariants.find((item) => item.id === "sidebar-02");

export const Sidebar02 = () => {
  if (!variant) return null;
  return <SidebarBlockShell variant={variant} />;
};
