import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@kamod-ch/ui";
import { Fragment } from "preact";
import { withBasePath } from "../../base-path";

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
              <BreadcrumbLink href={withBasePath(item.href)} title={item.label}>
                {item.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbLink href="#" aria-current="page" title={current}>
            {current}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
