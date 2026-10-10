import { Button, Input, Label, Textarea } from "@kamod-ch/ui";
import { useId, useState } from "preact/hooks";
import kamodLogoUrl from "../application-shell-1/assets/kamod-ui-logo.svg?url";
import { createPreviewNavigation } from "../shared/preview-data";
import { ApplicationShell8 } from "./application-shell-8";

const navigationGroups = createPreviewNavigation("Workspace settings");
const initial = {
  name: "Design workspace",
  email: "team@example.com",
  description: "A shared place for components, documentation and product decisions.",
};

/** A real native form with externally associated footer buttons; writes stay local to the preview. */
export function ApplicationShell8Preview() {
  const formId = useId();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [path, setPath] = useState("/workspace");
  const [notice, setNotice] = useState("All changes saved locally.");
  const dirty = Object.keys(initial).some(
    (key) => draft[key as keyof typeof initial] !== saved[key as keyof typeof initial],
  );
  const update = (field: keyof typeof initial, value: string) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
    setNotice("Your changes are not saved yet.");
  };
  return (
    <ApplicationShell8
      brand={{
        name: "Kamod UI",
        description: "Workspace settings",
        href: "/workspace",
        logo: <img src={kamodLogoUrl} alt="" class="size-4" width={16} height={16} />,
      }}
      navigationGroups={navigationGroups}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[
        { label: "Workspace", href: "/workspace" },
        { label: path === "/workspace" ? "Settings" : path.slice(1) },
      ]}
      currentPath={path}
      onNavigate={(item, event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
          return;
        event.preventDefault();
        if (item.href) setPath(item.href);
        setNotice(`${item.label} selected. Your draft stays in this local preview.`);
      }}
      onUserAction={(action) =>
        setNotice(`${action} selected. Connect your account service in your app.`)
      }
      footerStatus={
        <p role="status">
          {dirty ? "Unsaved changes · " : "Saved · "}
          {notice}
        </p>
      }
      footerActions={
        <>
          <Button type="reset" form={formId} variant="outline" disabled={!dirty}>
            Discard changes
          </Button>
          <Button type="submit" form={formId} disabled={!dirty}>
            Save settings
          </Button>
        </>
      }
    >
      <form
        id={formId}
        class="mx-auto max-w-3xl space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved({ ...draft });
          setNotice("Saved in this preview only.");
        }}
        onReset={(event) => {
          event.preventDefault();
          setDraft({ ...saved });
          setNotice("Returned to your last saved values.");
        }}
      >
        <div>
          <p class="text-xs font-medium text-muted-foreground">WORKSPACE / SETTINGS</p>
          <h1 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Workspace settings</h1>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
            Update your workspace details. The action bar stays within reach while you move through
            the form.
          </p>
        </div>
        <section
          aria-labelledby={`${formId}-identity`}
          class="space-y-5 rounded-xl border bg-card p-5 text-card-foreground"
        >
          <div>
            <h2 id={`${formId}-identity`} class="font-semibold">
              Workspace identity
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Use a recognizable name and a short description of the work this space supports.
            </p>
          </div>
          <div class="space-y-2">
            <Label htmlFor={`${formId}-name`}>Workspace name</Label>
            <Input
              id={`${formId}-name`}
              name="name"
              required
              maxLength={80}
              value={draft.name}
              onInput={(event) => update("name", event.currentTarget.value)}
            />
          </div>
          <div class="space-y-2">
            <Label htmlFor={`${formId}-description`}>Description</Label>
            <Textarea
              id={`${formId}-description`}
              name="description"
              rows={5}
              maxLength={500}
              value={draft.description}
              onInput={(event) => update("description", event.currentTarget.value)}
            />
          </div>
        </section>
        <section
          aria-labelledby={`${formId}-contact`}
          class="space-y-5 rounded-xl border bg-card p-5 text-card-foreground"
        >
          <div>
            <h2 id={`${formId}-contact`} class="font-semibold">
              Team contact
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              A shared address makes it easier to reach the people responsible for this workspace.
            </p>
          </div>
          <div class="space-y-2">
            <Label htmlFor={`${formId}-email`}>Contact email</Label>
            <Input
              id={`${formId}-email`}
              name="email"
              type="email"
              required
              value={draft.email}
              onInput={(event) => update("email", event.currentTarget.value)}
            />
          </div>
          <p class="text-xs leading-relaxed text-muted-foreground">
            Native validation checks the required name and email before the local save runs. No
            messages are sent and no data leaves this preview.
          </p>
        </section>
        <p class="pb-4 text-sm leading-relaxed text-muted-foreground">
          Try changing a value, saving it, and making another edit. Discard returns to your last
          saved values. Sidebar collapse and mobile navigation preserve the draft.
        </p>
      </form>
    </ApplicationShell8>
  );
}
