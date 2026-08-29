import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";

export type DashboardSectionProps = {
  slot: string;
  title: string;
  description?: string;
  action?: ComponentChildren;
  children?: ComponentChildren;
  class?: string;
};

export const DashboardSection = ({
  slot,
  title,
  description,
  action,
  children,
  class: className,
}: DashboardSectionProps) => (
  <div
    data-slot={slot}
    class={className ?? "flex justify-center bg-background p-6 text-foreground"}
  >
    <Card class="w-full max-w-md">
      <CardHeader>
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </div>
);
