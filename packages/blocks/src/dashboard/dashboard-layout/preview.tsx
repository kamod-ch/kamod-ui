import { DashboardLayout } from "./dashboard-layout";

export type DashboardLayoutPreviewMode = "desktop" | "collapsed" | "mobile";

export type DashboardLayoutPreviewProps = {
  mode?: DashboardLayoutPreviewMode;
};

export const DashboardLayoutPreview = ({ mode = "desktop" }: DashboardLayoutPreviewProps) => (
  <div class={mode === "mobile" ? "min-h-[28rem] max-w-[24rem]" : "min-h-[28rem]"}>
    <DashboardLayout defaultOpen={mode !== "collapsed"}>
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div class="mt-4 min-h-[40vh] rounded-xl bg-muted/50" />
    </DashboardLayout>
  </div>
);
