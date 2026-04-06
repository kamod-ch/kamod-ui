import { Button, Toaster, useToast } from "@kamod-ui/core";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const ToastPreview = () => {
  const { toast } = useToast();
  return (
    <div class="grid gap-2">
      <Button
        onClick={() =>
          toast({
            title: "Event has been created",
            description: "Your settings have been updated.",
            variant: "success",
            actionLabel: "Undo",
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </div>
  );
};

const ToastPreviewPersistent = () => {
  const { toast, dismiss } = useToast();
  const [lastId, setLastId] = useState<string | null>(null);
  return (
    <div class="grid gap-2">
      <div class="flex gap-2">
        <Button
          onClick={() => {
            const id = toast({
              title: "Upload started",
              description: "We are processing your file.",
              variant: "warning",
              duration: 0,
            });
            setLastId(id);
          }}
        >
          Start upload
        </Button>
        <Button variant="outline" onClick={() => lastId && dismiss(lastId)}>
          Dismiss
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

const ToastPreviewTypes = () => {
  const { toast } = useToast();
  return (
    <div class="grid gap-2">
      <div class="docs-button-row">
        <Button
          onClick={() =>
            toast({
              title: "Default toast",
              description: "This is the default notification style.",
            })
          }
        >
          Default
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Event has been created",
              description: "Everything worked as expected.",
              variant: "success",
            })
          }
        >
          Success
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Heads up",
              description: "A newer version is available.",
              variant: "info",
            })
          }
        >
          Info
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Storage almost full",
              description: "Only 10% free space left.",
              variant: "warning",
            })
          }
        >
          Warning
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Something went wrong",
              description: "Please retry in a moment.",
              variant: "error",
            })
          }
        >
          Error
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

const ToastPreviewPosition = () => {
  const { toast } = useToast();
  const [position, setPosition] = useState<
    "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  >("bottom-right");
  return (
    <div class="grid gap-2">
      <div class="docs-button-row">
        <Button
          variant={position === "top-left" ? "default" : "outline"}
          onClick={() => setPosition("top-left")}
        >
          Top Left
        </Button>
        <Button
          variant={position === "top-center" ? "default" : "outline"}
          onClick={() => setPosition("top-center")}
        >
          Top Center
        </Button>
        <Button
          variant={position === "top-right" ? "default" : "outline"}
          onClick={() => setPosition("top-right")}
        >
          Top Right
        </Button>
        <Button
          variant={position === "bottom-left" ? "default" : "outline"}
          onClick={() => setPosition("bottom-left")}
        >
          Bottom Left
        </Button>
        <Button
          variant={position === "bottom-center" ? "default" : "outline"}
          onClick={() => setPosition("bottom-center")}
        >
          Bottom Center
        </Button>
        <Button
          variant={position === "bottom-right" ? "default" : "outline"}
          onClick={() => setPosition("bottom-right")}
        >
          Bottom Right
        </Button>
      </div>
      <Button
        onClick={() =>
          toast({
            title: "Position demo",
            description: `This toast appears at ${position}.`,
            variant: "info",
          })
        }
      >
        Show positioned toast
      </Button>
      <Toaster position={position} />
    </div>
  );
};

export const toastDocPage = createGenericDocPage({
  slug: "toast",
  title: "Toast",
  usageLabel: "Toast displays transient notifications with Sonner-inspired variants and placement.",
  installationText:
    "Import Toaster and useToast from `@/components/kamod-ui/toast` and mount Toaster once near your app root.",
  usageText:
    "Trigger toasts with useToast and choose variant, duration and optional actionLabel. Use Toaster position to control placement.",
  exampleSections: [
    {
      id: "basic-toast",
      title: "Basic Toast",
      text: "Trigger a toast with title and optional description.",
      code: `import { Toaster, useToast } from "lucide-preact"
import { Button } from "@/components/kamod-ui/button";

export const Example = () => {
  const { toast } = useToast();
  return (
    <>
      <Button onClick={() => toast({ title: "Event has been created", description: "Your settings have been updated.", variant: "success", actionLabel: "Undo" })}>
        Show toast
      </Button>
      <Toaster />
    </>
  );
};`,
      renderPreview: () => <ToastPreview />,
    },
    {
      id: "toast-dismiss",
      title: "Toast Dismiss",
      text: "Dismiss notifications programmatically when workflow changes.",
      code: `import { Toaster, useToast } from "lucide-preact"
import { Button } from "@/components/kamod-ui/button";

export const Example = () => {
  const { toast, dismiss } = useToast();
  const [lastId, setLastId] = useState<string | null>(null);
  return (
    <>
      <Button onClick={() => setLastId(toast({ title: "Upload started", description: "We are processing your file.", variant: "warning", duration: 0 }))}>
        Start upload
      </Button>
      <Button variant="outline" onClick={() => lastId && dismiss(lastId)}>Dismiss</Button>
      <Toaster />
    </>
  );
};`,
      renderPreview: () => <ToastPreviewPersistent />,
    },
    {
      id: "toast-types",
      title: "Toast Types",
      text: "Show the available Sonner-style variants: default, success, info, warning and error.",
      code: `import { Toaster, useToast } from "lucide-preact"
import { Button } from "@/components/kamod-ui/button";

export const Example = () => {
  const { toast } = useToast();
  return (
    <>
      <Button onClick={() => toast({ title: "Default toast", description: "This is the default notification style." })}>Default</Button>
      <Button onClick={() => toast({ title: "Event has been created", description: "Everything worked as expected.", variant: "success" })}>Success</Button>
      <Button onClick={() => toast({ title: "Heads up", description: "A newer version is available.", variant: "info" })}>Info</Button>
      <Button onClick={() => toast({ title: "Storage almost full", description: "Only 10% free space left.", variant: "warning" })}>Warning</Button>
      <Button onClick={() => toast({ title: "Something went wrong", description: "Please retry in a moment.", variant: "error" })}>Error</Button>
      <Toaster />
    </>
  );
};`,
      renderPreview: () => <ToastPreviewTypes />,
    },
    {
      id: "toast-position",
      title: "Toast Position",
      text: "Switch between all supported Toaster positions and trigger a notification.",
      code: `import { Toaster, useToast } from "lucide-preact"
import { Button } from "@/components/kamod-ui/button";
import { useState } from "preact/hooks";

export const Example = () => {
  const { toast } = useToast();
  const [position, setPosition] = useState<"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right">("bottom-right");

  return (
    <>
      <Button variant={position === "top-left" ? "default" : "outline"} onClick={() => setPosition("top-left")}>Top Left</Button>
      <Button variant={position === "top-center" ? "default" : "outline"} onClick={() => setPosition("top-center")}>Top Center</Button>
      <Button variant={position === "top-right" ? "default" : "outline"} onClick={() => setPosition("top-right")}>Top Right</Button>
      <Button variant={position === "bottom-left" ? "default" : "outline"} onClick={() => setPosition("bottom-left")}>Bottom Left</Button>
      <Button variant={position === "bottom-center" ? "default" : "outline"} onClick={() => setPosition("bottom-center")}>Bottom Center</Button>
      <Button variant={position === "bottom-right" ? "default" : "outline"} onClick={() => setPosition("bottom-right")}>Bottom Right</Button>
      <Button onClick={() => toast({ title: "Position demo", description: \`This toast appears at \${position}.\`, variant: "info" })}>
        Show positioned toast
      </Button>
      <Toaster position={position} />
    </>
  );
};`,
      renderPreview: () => <ToastPreviewPosition />,
    },
  ],
  apiRows: [
    {
      prop: "toast",
      type: "(args: { title: string; description?: string; variant?: 'default' | 'success' | 'info' | 'warning' | 'error' | 'destructive'; actionLabel?: string; onAction?: () => void; duration?: number }) => string",
      defaultValue: "hook function",
    },
    { prop: "dismiss", type: "(id: string) => void", defaultValue: "hook function" },
    { prop: "Toaster", type: "notification outlet component", defaultValue: "mounted once" },
    {
      prop: "Toaster.position",
      type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
      defaultValue: "'bottom-right'",
    },
  ],
  accessibilityText:
    "Ensure critical outcomes are not communicated by toast-only messaging; keep important status visible in page content.",
});
