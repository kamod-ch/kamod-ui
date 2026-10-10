import { CheckIcon, LayersIcon } from "@kamod-ch/icons/lucide";
import { Badge, Button, Input, Label, Switch } from "@kamod-ch/ui";
import { useId, useState } from "preact/hooks";

/** A self-contained composition: preferences stay local to this demo. */
export function WorkspaceDemo() {
  const id = useId();
  const [name, setName] = useState("Design workspace");
  const [updates, setUpdates] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <form
      aria-label="Workspace preferences"
      class="bg-card text-card-foreground p-5 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
      onInput={() => setSaved(false)}
    >
      <div class="mb-5 flex items-center justify-between gap-3">
        <span class="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
          <LayersIcon size={22} aria-hidden="true" />
        </span>
        <Badge variant="secondary">Your Workspace</Badge>
      </div>
      <h2 class="text-2xl font-semibold tracking-tight">Make It Yours</h2>
      <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
        Name your workspace, choose your updates, and try saving your preferences.
      </p>
      <div class="mt-6 grid gap-2.5">
        <Label htmlFor={`${id}-name`}>Workspace name</Label>
        <Input
          id={`${id}-name`}
          value={name}
          required
          pattern={".*\\S.*"}
          title="Enter a workspace name, not just spaces."
          maxLength={60}
          class="min-h-10"
          onInput={(event) => setName(event.currentTarget.value)}
        />
      </div>
      <div class="my-6 flex items-center justify-between gap-4">
        <div>
          <Label htmlFor={`${id}-updates`}>Product updates</Label>
          <p id={`${id}-help`} class="mt-1 text-xs text-muted-foreground">
            Keep your team in the loop.
          </p>
        </div>
        <Switch
          id={`${id}-updates`}
          checked={updates}
          onCheckedChange={(value) => {
            setUpdates(value);
            setSaved(false);
          }}
          aria-describedby={`${id}-help`}
          size="sm"
        />
      </div>
      <Button type="submit" class="min-h-10 w-full">
        {saved ? (
          <>
            <CheckIcon size={15} aria-hidden="true" /> Saved in This Demo
          </>
        ) : (
          "Save Preferences"
        )}
      </Button>
      <p
        role="status"
        class="mt-3.5 min-h-8 text-xs leading-relaxed text-muted-foreground break-words"
      >
        {saved
          ? `${name.trim()}: updates ${updates ? "on" : "off"}. Nothing was sent.`
          : "Try it here. Changes stay in this example."}
      </p>
    </form>
  );
}
