import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@kamod-ch/ui/breadcrumb";
import { defineComponent } from "@openuidev/react-lang";
import { Fragment } from "preact";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { validateNavigationTarget } from "../security/navigation";

const breadcrumbItemSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  href: z.string().max(200).optional(),
});

export const breadcrumbComponent = defineComponent({
  name: "Breadcrumb",
  description:
    "Navigation trail. Args: items [{label, href?}]. Last item is the current page (not linked).",
  props: z.object({
    items: z.array(breadcrumbItemSchema).min(1).max(12),
  }),
  component: ({ props }) => (
    <Breadcrumb>
      <BreadcrumbList>
        {props.items.map((item, index) => {
          const isLast = index === props.items.length - 1;
          const decision = !isLast && item.href ? validateNavigationTarget(item.href) : null;
          const showLink = Boolean(decision?.allowed);

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast || !showLink || !decision?.allowed ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={decision.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  ),
});
