import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@kamod-ch/ui";
import { Fragment } from "preact";
import { withBasePath } from "../../base-path";
import { linkTitle } from "../../link-title";
import { KamodMarkIcon } from "./brand/KamodMarkIcon";

/** Shared quiet, slash-separated trail above library and block page introductions. */
export function PageBreadcrumbs({
  ancestors,
  current,
  label = "Breadcrumb",
  className = "",
}: {
  ancestors: { label: string; href: string }[];
  current: string;
  label?: string;
  className?: string;
}) {
  return (
    <Breadcrumb aria-label={label} class={`block-guide-breadcrumb ${className}`}>
      <BreadcrumbList>
        {ancestors.map((item) => (
          <Fragment key={item.href}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={withBasePath(item.href)}
                title={linkTitle(item.label)}
                class={item.href === "/" ? "page-breadcrumb-home" : undefined}
              >
                {item.href === "/" && <KamodMarkIcon size="0.92em" />}
                {linkTitle(item.label)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbLink href="#" aria-current="page" title={linkTitle(current)}>
            {linkTitle(current)}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
