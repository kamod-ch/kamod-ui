import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarInset,
  SidebarTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { Fragment } from "preact";
import type { BreadcrumbItem as BreadcrumbConfig, SidebarBlockLayout } from "../sidebar-data";

export type DashboardShellProps = {
  children?: ComponentChildren;
  breadcrumbParent?: string;
  breadcrumbPage?: string;
  breadcrumbs?: BreadcrumbConfig[];
  headerClass?: string;
  contentClass?: string;
  triggerClass?: string;
  headerInner?: boolean;
  stickyHeader?: boolean;
  showHeader?: boolean;
  placeholder?: SidebarBlockLayout["placeholder"];
  contentPaddingTop?: boolean;
};

const PlaceholderContent = ({
  kind,
  contentClass,
  contentPaddingTop = true,
}: {
  kind: DashboardShellProps["placeholder"];
  contentClass?: string;
  contentPaddingTop?: boolean;
}) => {
  const padding = contentPaddingTop ? "p-4" : "p-4 pt-0";
  const baseClass = ["flex flex-1 flex-col gap-4", padding, contentClass].filter(Boolean).join(" ");

  if (kind === "list") {
    return (
      <div class={baseClass}>
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} class="aspect-video h-12 w-full rounded-lg bg-muted/50" />
        ))}
      </div>
    );
  }
  if (kind === "squares") {
    return (
      <div class={baseClass}>
        <div class="grid auto-rows-min gap-4 md:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} class="aspect-square rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }
  if (kind === "centered") {
    return (
      <div class="flex flex-1 flex-col gap-4 px-4 py-10">
        <div class="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
        <div class="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
      </div>
    );
  }
  return (
    <div class={baseClass}>
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
};

const BreadcrumbNav = ({
  breadcrumbs,
  breadcrumbParent,
  breadcrumbPage,
}: Pick<DashboardShellProps, "breadcrumbs" | "breadcrumbParent" | "breadcrumbPage">) => {
  if (breadcrumbs?.length) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 ? (
                <BreadcrumbSeparator class={item.hiddenOnMobile ? "hidden md:block" : undefined} />
              ) : null}
              <BreadcrumbItem class={item.hiddenOnMobile ? "hidden md:block" : undefined}>
                {index === breadcrumbs.length - 1 || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbParent ? (
          <>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink href="#">{breadcrumbParent}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
          </>
        ) : null}
        <BreadcrumbItem>
          <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const DashboardShell = ({
  children,
  breadcrumbParent = "Build Your Application",
  breadcrumbPage = "Data Fetching",
  breadcrumbs,
  headerClass = "flex h-16 shrink-0 items-center gap-2 border-b px-4",
  contentClass,
  triggerClass = "-ml-1",
  headerInner = false,
  stickyHeader = false,
  showHeader = true,
  placeholder = "grid",
  contentPaddingTop = true,
}: DashboardShellProps) => {
  const headerContent = (
    <>
      <SidebarTrigger class={triggerClass || undefined} />
      <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
      <BreadcrumbNav
        breadcrumbs={breadcrumbs}
        breadcrumbParent={breadcrumbParent}
        breadcrumbPage={breadcrumbPage}
      />
    </>
  );

  return (
    <SidebarInset>
      {showHeader ? (
        <header
          class={[headerClass, stickyHeader ? "sticky top-0 z-10 bg-background" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {headerInner ? (
            <div class="flex items-center gap-2 px-3">{headerContent}</div>
          ) : (
            headerContent
          )}
        </header>
      ) : null}
      {children ?? (
        <PlaceholderContent
          kind={placeholder}
          contentClass={contentClass}
          contentPaddingTop={contentPaddingTop}
        />
      )}
    </SidebarInset>
  );
};
