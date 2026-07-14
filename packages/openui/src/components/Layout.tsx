import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kamod-ch/ui/card";
import { cn } from "@kamod-ch/ui/lib/utils";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import {
  DEFAULT_MAX_CHILDREN_PER_NODE,
  MAX_DESCRIPTION_LENGTH,
  MAX_LABEL_LENGTH,
} from "../constants";
import { alignmentSchema, spacingSchema, widthSchema } from "../tokens/schemas";
import { alignmentClass, spacingGapClass, widthClass } from "../tokens/variants";
import { alertComponent } from "./Alert";
import { avatarComponent } from "./Avatar";
import { badgeComponent } from "./Badge";
import { buttonComponent } from "./Button";
import { chartComponent } from "./Chart";
import { dataTableComponent } from "./DataTable";
import { dividerComponent } from "./Divider";
import { emptyComponent } from "./Empty";
import { checkboxComponent, switchComponent } from "./Form";
import { headingComponent } from "./Heading";
import { imageComponent } from "./Image";
import { itemComponent } from "./Item";
import { kbdComponent } from "./Kbd";
import { labelComponent } from "./Label";
import { linkComponent } from "./Link";
import { localeSegmentGroupComponent } from "./LocaleSegmentGroup";
import { progressComponent } from "./Progress";
import { proseComponent } from "./Prose";
import { skeletonComponent } from "./Skeleton";
import { spinnerComponent } from "./Spinner";
import { textComponent } from "./Text";
import { themeToggleComponent } from "./ThemeToggle";
import { toastComponent } from "./Toast";
import { tooltipComponent } from "./Tooltip";
import { videoComponent } from "./Video";

/** Leaf + feedback + actions allowed inside layout/card (no nested Stack/Grid/Card). */
export const contentChildUnion = z.union([
  textComponent.ref,
  headingComponent.ref,
  dividerComponent.ref,
  badgeComponent.ref,
  alertComponent.ref,
  progressComponent.ref,
  skeletonComponent.ref,
  spinnerComponent.ref,
  emptyComponent.ref,
  avatarComponent.ref,
  labelComponent.ref,
  tooltipComponent.ref,
  imageComponent.ref,
  videoComponent.ref,
  itemComponent.ref,
  kbdComponent.ref,
  chartComponent.ref,
  proseComponent.ref,
  toastComponent.ref,
  themeToggleComponent.ref,
  localeSegmentGroupComponent.ref,
  buttonComponent.ref,
  linkComponent.ref,
  switchComponent.ref,
  checkboxComponent.ref,
]);

export const inlineComponent = defineComponent({
  name: "Inline",
  description:
    "Horizontal flex layout that wraps. Use for toolbars, badge rows, and button groups. First arg is children.",
  props: z.object({
    children: z
      .array(
        z.union([
          textComponent.ref,
          badgeComponent.ref,
          buttonComponent.ref,
          linkComponent.ref,
          dividerComponent.ref,
          skeletonComponent.ref,
        ]),
      )
      .max(DEFAULT_MAX_CHILDREN_PER_NODE)
      .default([]),
    gap: spacingSchema,
    align: alignmentSchema,
    width: widthSchema,
  }),
  component: ({ props, renderNode }) => (
    <div
      class={cn(
        "flex flex-row flex-wrap",
        spacingGapClass[props.gap],
        alignmentClass[props.align],
        widthClass[props.width],
      )}
      data-slot="openui-inline"
    >
      {renderNode(props.children)}
    </div>
  ),
});

export const cardComponent = defineComponent({
  name: "Card",
  description:
    "Surface container for grouped content. First arg is children. Optional title and description follow.",
  props: z.object({
    children: z
      .array(z.union([contentChildUnion, inlineComponent.ref]))
      .max(DEFAULT_MAX_CHILDREN_PER_NODE)
      .default([]),
    title: z.string().max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    size: z.enum(["default", "sm"]).default("default"),
  }),
  component: ({ props, renderNode }) => (
    <Card size={props.size}>
      {props.title || props.description ? (
        <CardHeader>
          {props.title ? <CardTitle>{props.title}</CardTitle> : null}
          {props.description ? <CardDescription>{props.description}</CardDescription> : null}
        </CardHeader>
      ) : null}
      <CardContent class="flex flex-col gap-3">{renderNode(props.children)}</CardContent>
    </Card>
  ),
});

/** Leaves + surfaces for Grid cells (no nested Grid/Stack — keeps tree bounds). */
const gridChildUnion = z.union([contentChildUnion, inlineComponent.ref, cardComponent.ref]);

export const gridComponent = defineComponent({
  name: "Grid",
  description: "CSS grid layout. First arg is children, then columns (1–4).",
  props: z.object({
    children: z.array(gridChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
    columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(2),
    gap: spacingSchema,
    width: widthSchema,
  }),
  component: ({ props, renderNode }) => {
    const cols =
      props.columns === 1
        ? "grid-cols-1"
        : props.columns === 2
          ? "grid-cols-2"
          : props.columns === 3
            ? "grid-cols-3"
            : "grid-cols-4";
    return (
      <div
        class={cn("grid", cols, spacingGapClass[props.gap], widthClass[props.width])}
        data-slot="openui-grid"
      >
        {renderNode(props.children)}
      </div>
    );
  },
});

/** Stack may compose grids, data tables, and cards for dashboard-style pages. */
const stackChildUnion = z.union([
  contentChildUnion,
  inlineComponent.ref,
  cardComponent.ref,
  gridComponent.ref,
  dataTableComponent.ref,
]);

export const stackComponent = defineComponent({
  name: "Stack",
  description:
    "Vertical flex layout. First arg is children. Prefer Stack as the root for page sections. May contain Grid, Card, Table, and leaf content — not nested Stack.",
  props: z.object({
    children: z.array(stackChildUnion).max(DEFAULT_MAX_CHILDREN_PER_NODE).default([]),
    gap: spacingSchema,
    align: alignmentSchema,
    width: widthSchema,
  }),
  component: ({ props, renderNode }) => (
    <div
      class={cn(
        "flex flex-col",
        spacingGapClass[props.gap],
        alignmentClass[props.align],
        widthClass[props.width],
      )}
      data-slot="openui-stack"
    >
      {renderNode(props.children)}
    </div>
  ),
});
