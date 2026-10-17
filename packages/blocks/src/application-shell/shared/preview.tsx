import { Badge, Button, Input, Label, Textarea } from "@kamod-ch/ui";
import type { ComponentType } from "preact";
import { useId, useMemo, useState } from "preact/hooks";
import kamodLogoUrl from "../application-shell-1/assets/kamod-ui-logo.svg?url";
import { createPreviewNavigation, profiles } from "./preview-data";
import type { ApplicationShellLayoutProps } from "./types";

/** Local-only demos: real navigation state, filtering, item selection and visible action feedback. */
export function ShellPreview({
  variant,
  Shell,
}: {
  variant: keyof typeof profiles;
  Shell: ComponentType<ApplicationShellLayoutProps>;
}) {
  const profile = profiles[variant];
  const id = useId();
  const [path, setPath] = useState("/workspace");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<string[]>([...profile.items]);
  const [selected, setSelected] = useState<string>(profile.items[0]);
  const [notice, setNotice] = useState("Demo workspace · Changes stay in this preview.");
  const [draft, setDraft] = useState(
    "Describe the outcome, audience and next review. Keep one clear owner for the work.",
  );
  const navigationGroups = useMemo(() => createPreviewNavigation(profile.title), [profile.title]);
  const heading =
    path === "/workspace" ? profile.title : path.slice(1).replace(/^./, (c) => c.toUpperCase());
  const visible = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  const act = () => {
    if (variant === 6) {
      setNotice(`Saved “${selected}” in this preview only.`);
      return;
    }
    const label = `${profile.kind} ${items.length + 1}`;
    setItems((previous) => [...previous, label]);
    setSelected(label);
    setQuery("");
    setNotice(`Created “${label}” in this preview only.`);
  };
  return (
    <Shell
      brand={{
        name: "Kamod UI",
        description: profile.brandDescription,
        href: "/workspace",
        // The horizontal header stays text-only; its mobile sidebar uses the K monogram.
        logo:
          variant === 4 ? undefined : (
            <img src={kamodLogoUrl} alt="" width={16} height={16} class="size-4 object-contain" />
          ),
      }}
      navigationGroups={navigationGroups}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[{ label: "Workspace", href: "/workspace" }, { label: heading }]}
      currentPath={path}
      onNavigate={(destination, event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
          return;
        event.preventDefault();
        if (destination.href) {
          setPath(destination.href);
          setQuery("");
        }
        setNotice(`${destination.label} selected. Navigation is local to this preview.`);
      }}
      onUserAction={(action) =>
        setNotice(
          `${action === "logout" ? "Sign out" : action} selected. Connect your account service in your app.`,
        )
      }
      headerActions={<Badge variant="outline">Demo</Badge>}
      sectionLabel="Project sections"
      sectionLinks={
        variant === 7
          ? [
              { id: "overview", label: "Overview", href: "/workspace" },
              { id: "activity", label: "Activity", href: "/activity" },
              { id: "members", label: "Members", href: "/members" },
            ]
          : undefined
      }
      inspectorTitle="Document details"
      inspector={
        variant === 6 ? (
          <div class="space-y-5 text-sm">
            <div>
              <p class="text-xs text-muted-foreground">Selected document</p>
              <p class="mt-1 font-medium">{selected}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Owner</p>
              <p class="mt-1">Alex Morgan</p>
            </div>
            <div>
              <p class="mb-2 text-xs text-muted-foreground">Workflow</p>
              <Badge variant="secondary">Draft</Badge>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground">
              Save updates this local demonstration. Connect a real save callback and revision
              policy in your application.
            </p>
          </div>
        ) : undefined
      }
    >
      <div class="mx-auto max-w-6xl space-y-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="mb-2 text-xs font-medium text-muted-foreground">
              WORKSPACE / {heading.toUpperCase()}
            </p>
            <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h1>
            <p class="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {profile.subtitle}
            </p>
          </div>
          <Button size="sm" onClick={act}>
            {profile.action}
          </Button>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            [profile.metric, String(items.length)],
            ["In progress", String(Math.max(items.length - 1, 0))],
            ["Workspace", "Demo"],
          ].map(([label, value]) => (
            <div key={label} class="rounded-xl border bg-card p-4 text-card-foreground">
              <p class="text-xs text-muted-foreground">{label}</p>
              <p class="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div class="space-y-2">
          <Label htmlFor={`${id}-search`}>Find {profile.title.toLowerCase()}</Label>
          <Input
            id={`${id}-search`}
            value={query}
            placeholder={`Search ${profile.title.toLowerCase()}…`}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
        <div
          class={
            variant === 2
              ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              : "divide-y rounded-xl border bg-card text-card-foreground"
          }
        >
          {visible.map((item, index) => (
            <button
              type="button"
              key={item}
              aria-pressed={selected === item}
              onClick={() => {
                setSelected(item);
                setNotice(`${item} selected.`);
              }}
              class={`flex w-full min-w-0 items-center gap-3 p-4 text-left focus-visible:outline-2 focus-visible:outline-ring ${variant === 2 ? "min-h-28 rounded-xl border bg-card" : "first:rounded-t-xl last:rounded-b-xl"} ${selected === item ? "bg-primary/10" : ""}`}
            >
              <span
                aria-hidden="true"
                class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium"
              >
                {variant === 4
                  ? item
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                  : String(index + 1).padStart(2, "0")}
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium">{item}</span>
                <span class="mt-1 block text-xs text-muted-foreground">
                  {profile.kind} · {selected === item ? "Selected" : "Ready to review"}
                </span>
              </span>
            </button>
          ))}
          {!visible.length && (
            <p class="p-5 text-sm text-muted-foreground">
              No matches. Try another name or clear your search.
            </p>
          )}
        </div>
        {variant === 6 && (
          <div class="space-y-2">
            <Label htmlFor={`${id}-draft`}>{selected}</Label>
            <Textarea
              id={`${id}-draft`}
              value={draft}
              onInput={(event) => setDraft(event.currentTarget.value)}
              rows={6}
            />
            <p class="text-xs text-muted-foreground">
              This is one scratch draft shared by the demo’s document selections.
            </p>
          </div>
        )}
        <p role="status" class="border-t pt-4 text-xs leading-relaxed text-muted-foreground">
          {notice}
        </p>
      </div>
    </Shell>
  );
}
