import type { ComponentType } from "preact";

export type DashboardIcon = ComponentType<{
  size?: number;
  class?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;
