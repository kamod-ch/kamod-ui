import { actionShellUsage } from "./application-shell-action-example";
import type { ShellVariantId } from "./application-shell-profiles";
import { shellThreeStarter } from "./ShellThreeQuickstart";

/** Copyable consumer examples, typechecked against the complete source bundles. */
const workflowSlots: Record<string, string> = {
  "6": '\n      inspectorTitle="Project details"\n      inspector={<p>Owner: Alex Morgan · Status: Draft</p>}',
  "7": '\n      sectionLabel="Project sections"\n      sectionLinks={[\n        { id: "overview", label: "Overview", href: "/workspace" },\n        { id: "activity", label: "Activity", href: "/workspace/activity" },\n      ]}',
};

export function shellUsageCode(id: ShellVariantId) {
  if (id === "application-shell-8") return actionShellUsage;
  if (id === "application-shell-3") return shellThreeStarter;
  const number = id.split("-").at(-1);
  return `import { Button } from "@kamod-ch/ui";
import { ApplicationShell${number}, type ApplicationShell${number}Props } from "./components/application-shell/${id}";

type WorkspaceProps = Pick<ApplicationShell${number}Props,
  "currentPath" | "onNavigate" | "onUserAction">;

export function Workspace(props: WorkspaceProps) {
  return (
    <ApplicationShell${number}
      {...props}
      brand={{ name: "Kamod UI", description: "Team workspace", href: "/workspace" }}
      navigationGroups={[{ id: "workspace", label: "Workspace", items: [
        { id: "overview", label: "Overview", href: "/workspace" },
        { id: "settings", label: "Settings", href: "/settings" },
      ] }]}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: "Workspace", href: "/workspace" }, { label: "Overview" }]}
      headerActions={<Button href="/help" variant="outline" size="sm">Help</Button>}${workflowSlots[number ?? ""] ?? ""}
    >
      <h1 class="text-2xl font-semibold">Overview</h1>
      <p class="mt-2 text-muted-foreground">Your route content belongs here.</p>
    </ApplicationShell${number}>
  );
}`;
}
