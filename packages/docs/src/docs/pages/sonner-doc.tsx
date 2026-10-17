import { Button, dismissSonner, Sonner, sonner } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const sonnerDocPage = createGenericDocPage({
  slug: "sonner",
  title: "Sonner",
  usageLabel: "Sonner provides toast-like notifications with imperative helpers.",
  installationText: "Import Sonner and helper functions from `@/components/kamod-ui/sonner`.",
  usageText: "Mount Sonner once near app root, then trigger notifications from events.",
  exampleSections: [
    {
      id: "basic-toast",
      title: "Basic Toast",
      text: "**Confirm the Outcome of an Action.** Trigger a short success notification after an operation has actually completed. The toast summarizes the result near the edge of the interface, while the main screen should also reflect the updated application state.\n\nKeep the message specific, mount the notification surface once in the application and provide persistent feedback elsewhere when the result is too important to disappear automatically.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Sonner, sonner } from "@/components/kamod-ui/sonner";

export const Example = () => (
  <>
    <Button onClick={() => sonner.success("Changes saved")}>Show toast</Button>
    <Sonner />
  </>
);`,
      renderPreview: () => (
        <>
          <Button onClick={() => sonner({ title: "Changes saved" })}>Show toast</Button>
          <Sonner />
        </>
      ),
    },
    {
      id: "dismissible-toast",
      title: "Dismissible Toast",
      text: "**Track the Notification that Belongs to the Workflow.** Retain the notification identifier when a later workflow change needs to dismiss the toast programmatically. This ties the message's lifetime to the operation it describes rather than leaving outdated feedback visible after the context changes.\n\nKeep the returned identifier with the relevant task and avoid dismissing unrelated messages; a notification disappearing should not be mistaken for proof that the operation succeeded.",
      code: `import { dismissSonner } from "lucide-preact"
import { Button } from "@/components/kamod-ui/button"
import { Sonner, sonner } from "@/components/kamod-ui/sonner";

export const Example = () => (
  <>
    <Button onClick={() => sonner("Uploading...")}>Start upload</Button>
    <Button variant="outline" onClick={() => dismissSonner()}>Dismiss all</Button>
    <Sonner />
  </>
);`,
      renderPreview: () => (
        <>
          <Button
            onClick={() =>
              sonner({ title: "Uploading...", description: "Your file is being processed." })
            }
          >
            Start upload
          </Button>
          <Button variant="outline" onClick={() => dismissSonner("all")}>
            Dismiss all
          </Button>
          <Sonner />
        </>
      ),
    },
  ],
  apiRows: [
    {
      prop: "sonner",
      type: "(args: { title: string; description?: string }) => string",
      defaultValue: "function",
    },
    { prop: "dismissSonner", type: "(id: string) => void", defaultValue: "function" },
    { prop: "Sonner", type: "Notification outlet component", defaultValue: "mounted" },
  ],
  accessibilityText:
    "Ensure toast messages stay short, avoid critical-only notifications, and keep important outcomes visible in page content.",
});
