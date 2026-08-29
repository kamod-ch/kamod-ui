import { SidebarInset, SidebarProvider, SidebarTrigger } from "@kamod-ch/ui";
import type { ComponentChildren, JSX } from "preact";
import type { AppSidebarCollapseProps, AppSidebarPreviewMode, SidebarWidthVars } from "./types";
import { toSidebarProviderStyle } from "./width-style";

export type AppSidebarPreviewShellProps = AppSidebarCollapseProps & {
  title: string;
  sidebar: ComponentChildren;
  mode?: AppSidebarPreviewMode;
  widthVars?: Partial<SidebarWidthVars>;
  style?: JSX.CSSProperties;
};

export const AppSidebarPreviewShell = ({
  title,
  sidebar,
  mode = "desktop",
  open,
  defaultOpen,
  onOpenChange,
  widthVars,
  style,
}: AppSidebarPreviewShellProps) => {
  const collapsed = mode === "collapsed";
  const resolvedDefaultOpen = defaultOpen ?? !collapsed;
  const mergedStyle = {
    ...(widthVars ? toSidebarProviderStyle(widthVars) : {}),
    ...(typeof style === "object" && style !== null ? style : {}),
  };

  return (
    <SidebarProvider
      defaultOpen={open === undefined ? resolvedDefaultOpen : undefined}
      open={open}
      onOpenChange={onOpenChange}
      style={Object.keys(mergedStyle).length ? mergedStyle : undefined}
      class={mode === "mobile" ? "min-h-[28rem] max-w-[24rem]" : "min-h-[28rem]"}
    >
      {sidebar}
      <SidebarInset>
        <header class="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <h1 class="text-sm font-semibold">{title}</h1>
        </header>
        <div class="flex-1 p-6">
          <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <div class="aspect-video rounded-xl bg-muted/50" />
            <div class="aspect-video rounded-xl bg-muted/50" />
            <div class="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div class="mt-4 min-h-[40vh] rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
