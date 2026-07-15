import { Sidebar } from "./Sidebar";
import { SidebarContent } from "./SidebarContent";
import { SidebarFooter } from "./SidebarFooter";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
  SidebarSeparator,
} from "./SidebarGroup";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarInset } from "./SidebarInset";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./SidebarMenu";
import { SidebarProvider, useSidebar } from "./SidebarProvider";
import { SidebarRail } from "./SidebarRail";
import { SidebarTrigger } from "./SidebarTrigger";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};

export default {
  Provider: SidebarProvider,
  Root: Sidebar,
  Trigger: SidebarTrigger,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Inset: SidebarInset,
  Rail: SidebarRail,
  Group: SidebarGroup,
  Menu: SidebarMenu,
};
