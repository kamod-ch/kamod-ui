import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const sidebarDocPage = createGenericDocPage({
  slug: "sidebar",
  title: "Sidebar",
  usageLabel: "Sidebar provides a collapsible navigation rail for app layouts.",
  installationText: "Import SidebarProvider and sidebar primitives from `@/components/kamod-ui/sidebar`.",
  usageText: "Wrap sidebar regions in SidebarProvider and toggle visibility with SidebarTrigger.",
  exampleSections: [
    {
      id: "basic-sidebar",
      title: "Basic Sidebar",
      text: "Render a basic sidebar with header and content sections.",
      code: `import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/kamod-ui/sidebar";

export const Example = () => (
  <SidebarProvider defaultOpen>
    <div class="grid gap-2">
      <SidebarTrigger />
      <Sidebar class="rounded-md border p-3">
        <SidebarHeader>Workspace</SidebarHeader>
        <SidebarContent>Navigation content</SidebarContent>
      </Sidebar>
    </div>
  </SidebarProvider>
);`,
      renderPreview: () => (
        <SidebarProvider defaultOpen>
          <div class="grid gap-2">
            <SidebarTrigger />
            <Sidebar class="rounded-md border p-3">
              <SidebarHeader>Workspace</SidebarHeader>
              <SidebarContent>Navigation content</SidebarContent>
            </Sidebar>
          </div>
        </SidebarProvider>
      )
    },
    {
      id: "sidebar-with-inset",
      title: "Sidebar With Inset",
      text: "Use SidebarInset for content area adjacent to sidebar.",
      code: `import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/kamod-ui/sidebar";

export const Example = () => (
  <SidebarProvider defaultOpen>
    <div class="grid gap-2">
      <SidebarTrigger />
      <div class="grid grid-cols-[220px_1fr] gap-3">
        <Sidebar class="rounded-md border p-3">
          <SidebarContent>Menu</SidebarContent>
        </Sidebar>
        <SidebarInset class="rounded-md border p-3">Main content</SidebarInset>
      </div>
    </div>
  </SidebarProvider>
);`,
      renderPreview: () => (
        <SidebarProvider defaultOpen>
          <div class="grid gap-2">
            <SidebarTrigger />
            <div class="grid grid-cols-[220px_1fr] gap-3">
              <Sidebar class="rounded-md border p-3">
                <SidebarContent>Menu</SidebarContent>
              </Sidebar>
              <SidebarInset class="rounded-md border p-3">Main content</SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      )
    }
  ],
  apiRows: [
    { prop: "SidebarProvider defaultOpen", type: "boolean", defaultValue: "true" },
    { prop: "SidebarTrigger", type: "toggle button", defaultValue: "optional but recommended" },
    { prop: "Sidebar state", type: "open | closed", defaultValue: "derived from provider" }
  ],
  accessibilityText: "Ensure sidebar navigation remains keyboard reachable and provide a clear toggle label on smaller screens."
});
