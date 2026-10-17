import { Chart } from "@kamod-ch/ui";
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
      text: "**Emphasize Change Across an Ordered Series.** A line chart connects successive observations so the reader can follow change across the horizontal axis. Configure the series around a meaningful sequence and use labels that explain both the measured value and its interval.\n\nProvide a readable summary or data alternative outside the graphic, and test missing values rather than silently treating absent measurements as zero.",
      code: `import { Chart } from "@/components/kamod-ui/chart";

const points = [
  { month: "Jan", value: 18 },
  { month: "Feb", value: 27 },
  { month: "Mar", value: 23 }
];

export const Example = () => <Chart type="line" data={points} xKey="month" yKey="value" />;`,
      renderPreview: () => (
        <Chart title="Monthly Trend" description="Sample line-series style container.">
          <div class="text-sm text-muted-foreground">Jan: 18, Feb: 27, Mar: 23</div>
        </Chart>
      ),
    },
    {
      id: "bar-chart",
      title: "Bar Chart",
      text: "**Make Category Comparisons Easy to Read.** A bar chart makes differences between categories visible through a shared baseline. Configure each bar around a comparable measure, keeping the category label and value close enough that readers can interpret the comparison without guessing.\n\nExplain the important takeaway in nearby text and provide access to the underlying values, especially when the chart summarizes information needed to make a decision.",
      code: `import { Chart } from "@/components/kamod-ui/chart";

const rows = [
  { name: "A", sessions: 120 },
  { name: "B", sessions: 92 }
];

export const Example = () => <Chart type="bar" data={rows} xKey="name" yKey="sessions" />;`,
      renderPreview: () => (
        <Chart title="Category Compare" description="Sample bar-series style container.">
          <div class="text-sm text-muted-foreground">A: 120, B: 92</div>
        </Chart>
      ),
    },
  ],
  apiRows: [
    { prop: "title", type: "string", defaultValue: "undefined" },
    { prop: "description", type: "string", defaultValue: "undefined" },
    { prop: "children", type: "ComponentChildren", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Provide textual summaries for trends and ensure color is not the only channel for series distinction.",
});
