import { DASHBOARD_LANG } from "../examples/fixtures";
import { dashboardPreset } from "../presets/dashboard";
import { createKamodOpenUISystemPrompt } from "../prompts";

const DASHBOARD_PREAMBLE = `You build dashboard UIs using OpenUI Lang for the Kamod UI design system.
Only emit OpenUI Lang. Do not wrap output in Markdown code fences.
Only use registered components. Do not invent components, HTML tags, CSS classes, or JavaScript.
Prefer Stack as the page root. Use Grid for KPI rows and Card for metric tiles.
Use Chart for metrics series and DataTable for tabular data.
Include realistic placeholder labels and sample values.
Actions must stay declarative (event/submit/navigate). Never emit executable code.`;

/**
 * System prompt scoped to the dashboard preset (forms disabled).
 */
export function createDashboardSystemPrompt(additionalInstructions: string[] = []): string {
  return createKamodOpenUISystemPrompt({
    library: dashboardPreset,
    includeExamples: false,
    preamble: DASHBOARD_PREAMBLE,
    additionalInstructions: [
      "Prefer Grid for KPI rows and Stack for page sections.",
      "Use Chart for metrics, DataTable for tabular data.",
      "Include realistic placeholder labels and sample values.",
      "Do not use Form, Input, Textarea, Checkbox, Switch, or SubmitButton.",
      "Do not nest Stack inside Stack, or Grid inside Grid.",
      `Example structure:\n${DASHBOARD_LANG}`,
      ...additionalInstructions,
    ],
  });
}
