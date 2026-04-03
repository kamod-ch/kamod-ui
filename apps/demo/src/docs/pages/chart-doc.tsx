import { Chart } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const chartDocPage = createGenericDocPage({
  slug: "chart",
  title: "Chart",
  usageLabel: "Chart wraps charting primitives with Kamod design tokens.",
  installationText: "Import Chart from `@/components/kamod-ui/chart` and pass series plus config.",
  usageText: "Use semantic labels and concise legends to keep visualizations understandable.",
  exampleSections: [
    {
      id: "line-chart",
      title: "Line Chart",
      text: "Render trend data with a line configuration.",
      code: `import { Chart } from "@/components/kamod-ui/chart";

const points = [
  { month: "Jan", value: 18 },
  { month: "Feb", value: 27 },
  { month: "Mar", value: 23 }
];

export const Example = () => <Chart type="line" data={points} xKey="month" yKey="value" />;`,
      renderPreview: () => (
        <Chart title="Monthly trend" description="Sample line-series style container.">
          <div class="text-sm text-muted-foreground">Jan: 18, Feb: 27, Mar: 23</div>
        </Chart>
      )
    },
    {
      id: "bar-chart",
      title: "Bar Chart",
      text: "Use bars for direct category comparison.",
      code: `import { Chart } from "@/components/kamod-ui/chart";

const rows = [
  { name: "A", sessions: 120 },
  { name: "B", sessions: 92 }
];

export const Example = () => <Chart type="bar" data={rows} xKey="name" yKey="sessions" />;`,
      renderPreview: () => (
        <Chart title="Category compare" description="Sample bar-series style container.">
          <div class="text-sm text-muted-foreground">A: 120, B: 92</div>
        </Chart>
      )
    }
  ],
  apiRows: [
    { prop: "title", type: "string", defaultValue: "undefined" },
    { prop: "description", type: "string", defaultValue: "undefined" },
    { prop: "children", type: "ComponentChildren", defaultValue: "undefined" }
  ],
  accessibilityText: "Provide textual summaries for trends and ensure color is not the only channel for series distinction."
});
