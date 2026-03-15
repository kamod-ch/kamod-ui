import { Sidebar } from "./Sidebar";
import { SidebarContent } from "./SidebarContent";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarInset } from "./SidebarInset";
import { SidebarProvider } from "./SidebarProvider";
import { SidebarTrigger } from "./SidebarTrigger";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
};

export default {
  Provider: SidebarProvider,
  Root: Sidebar,
  Trigger: SidebarTrigger,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Inset: SidebarInset
};
