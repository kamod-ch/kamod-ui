/** Executable documentation example: the footer participates in the page's native form. */
export const actionShellUsage = `import { Button, Input, Label } from "@kamod-ch/ui";
import { useId, useState } from "preact/hooks";
import { ApplicationShell8, type ApplicationShell8Props } from "./components/application-shell/application-shell-8";

type WorkspaceProps = Pick<ApplicationShell8Props,
  "currentPath" | "onNavigate" | "onUserAction">;

export function Workspace(props: WorkspaceProps) {
  const formId = useId();
  const [name, setName] = useState("Kamod workspace");
  const [saved, setSaved] = useState(name);
  const [message, setMessage] = useState("Ready to edit.");
  const dirty = name !== saved;
  return (
    <ApplicationShell8
      {...props}
      brand={{ name: "Kamod UI", href: "/workspace" }}
      navigationGroups={[{ id: "workspace", items: [
        { id: "settings", label: "Settings", href: "/workspace" },
      ] }]}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: "Workspace" }, { label: "Settings" }]}
      footerStatus={<p role="status">{dirty ? "Unsaved changes" : message}</p>}
      footerActions={<>
        <Button type="reset" form={formId} variant="outline" disabled={!dirty}>Discard</Button>
        <Button type="submit" form={formId} disabled={!dirty}>Save</Button>
      </>}
    >
      <h1 class="mb-6 text-2xl font-semibold">Workspace settings</h1>
      <form id={formId} class="space-y-2"
        onSubmit={event => {
          event.preventDefault();
          setSaved(name); // Local demonstration: replace with your service boundary.
          setMessage("Saved in this example.");
        }}
        onReset={event => { event.preventDefault(); setName(saved); }}>
        <Label htmlFor={formId + "-name"}>Workspace name</Label>
        <Input id={formId + "-name"} name="workspace" required value={name}
          onInput={event => setName(event.currentTarget.value)} />
      </form>
    </ApplicationShell8>
  );
}`;
