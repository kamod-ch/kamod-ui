import { Button, Sonner, dismissSonner, sonner } from "@kamod-ui/core";
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
      text: "Display a short success message after an action.",
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
      text: "Close notifications programmatically if workflow changes.",
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
