import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  cn,
} from "@kamod-ch/ui";
import { Fragment } from "preact";
import type { ApplicationShellFrameProps } from "./types";

/** A single current-page crumb on mobile; native links and the full trail on desktop. */
export function ShellBreadcrumbs({
  breadcrumbs,
  onNavigate,
}: Pick<ApplicationShellFrameProps, "breadcrumbs" | "onNavigate">) {
  if (!breadcrumbs.length) return null;
  return (
    <Breadcrumb class="min-w-0 flex-1">
      <BreadcrumbList class="flex-nowrap">
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={`${index}-${crumb.label}`}>
            {index > 0 && <BreadcrumbSeparator class="hidden md:block" />}
            <BreadcrumbItem
              class={cn("min-w-0", index < breadcrumbs.length - 1 && "hidden md:flex")}
            >
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage class="truncate">{crumb.label}</BreadcrumbPage>
              ) : crumb.href ? (
                <BreadcrumbLink
                  href={crumb.href}
                  class="truncate"
                  onClick={(event) => onNavigate?.(crumb, event)}
                >
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <span class="truncate">{crumb.label}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
