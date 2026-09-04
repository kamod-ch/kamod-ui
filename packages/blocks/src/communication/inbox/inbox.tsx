import { ArchiveIcon, ChevronLeftIcon, StarIcon } from "@kamod-ch/icons/lucide";
import { Badge, Button, cn, Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kamod-ch/ui";
import {
  type DateFormatOptions,
  formatDayLabel,
  formatTime,
  useControllableState,
} from "../../shared";
import type {
  CommunicationLayout,
  InboxFolder,
  InboxLabel,
  InboxMessage,
  InboxPane,
} from "../shared/types";

export type InboxProps = {
  folders?: InboxFolder[];
  labels?: InboxLabel[];
  messages?: InboxMessage[];
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
  activeFolderId?: string;
  defaultActiveFolderId?: string;
  onActiveFolderChange?: (id: string) => void;
  onStar?: (id: string, starred: boolean) => void;
  onArchive?: (id: string) => void;
  onReply?: (id: string) => void;
  onForward?: (id: string) => void;
  onCompose?: () => void;
  layout?: CommunicationLayout;
  pane?: InboxPane;
  defaultPane?: InboxPane;
  onPaneChange?: (pane: InboxPane) => void;
  locale?: string;
  timeZone?: string;
  now?: Date;
};

export const Inbox = ({
  folders = [],
  labels = [],
  messages = [],
  selectedId,
  defaultSelectedId = null,
  onSelectedIdChange,
  activeFolderId,
  defaultActiveFolderId = folders[0]?.id ?? "inbox",
  onActiveFolderChange,
  onStar,
  onArchive,
  onReply,
  onForward,
  onCompose,
  layout = "auto",
  pane,
  defaultPane = "list",
  onPaneChange,
  locale = "en-US",
  timeZone,
  now,
}: InboxProps) => {
  const [folder, setFolder] = useControllableState({
    value: activeFolderId,
    defaultValue: defaultActiveFolderId,
    onChange: onActiveFolderChange,
  });
  const [selected, setSelected] = useControllableState<string | null>({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: onSelectedIdChange,
  });
  const [mobilePane, setMobilePane] = useControllableState<InboxPane>({
    value: pane,
    defaultValue: defaultPane,
    onChange: onPaneChange,
  });
  const stamp = now ?? new Date("2026-08-14T18:00:00.000Z");
  const options: DateFormatOptions = { locale, timeZone };
  const visible = messages.filter((item) => item.folderId === folder);
  const current = messages.find((item) => item.id === selected) ?? null;
  const stacked = layout === "stack";
  const show = (which: InboxPane) => !stacked || mobilePane === which;
  const autoHide = (which: InboxPane, className: string) =>
    layout === "auto"
      ? `${className} ${which === "folders" ? "max-lg:hidden" : which === "list" && current ? "max-md:hidden" : which === "reader" && !current ? "max-md:hidden" : ""}`
      : className;

  const openMessage = (id: string) => {
    setSelected(id);
    setMobilePane("reader");
  };

  return (
    <div
      data-slot="block-inbox"
      data-layout={layout}
      class={cn(
        "bg-background text-foreground overflow-hidden rounded-xl border",
        stacked
          ? "grid grid-cols-1"
          : "grid lg:grid-cols-[12rem_20rem_minmax(0,1fr)] md:grid-cols-[20rem_minmax(0,1fr)]",
      )}
    >
      <nav
        aria-label="Folders"
        class={
          stacked
            ? show("folders")
              ? "border-r"
              : "hidden"
            : autoHide("folders", "border-r max-lg:hidden")
        }
      >
        <p class="px-3 py-2 text-sm font-medium">Mail</p>
        <ul>
          {folders.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                class={cn(
                  "hover:bg-muted flex w-full items-center justify-between px-3 py-2 text-left text-sm",
                  item.id === folder && "bg-muted font-medium",
                )}
                onClick={() => {
                  setFolder(item.id);
                  setSelected(null);
                  setMobilePane("list");
                }}
              >
                <span>{item.label}</span>
                {item.count != null ? (
                  <span class="text-muted-foreground text-xs">{item.count}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
        {labels.length ? (
          <div class="border-t px-3 py-2">
            <p class="text-muted-foreground mb-1 text-xs">Labels</p>
            <ul class="space-y-1">
              {labels.map((item) => (
                <li key={item.id} class="text-xs">
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div class="p-3">
          <Button type="button" size="sm" class="w-full" onClick={onCompose}>
            Compose
          </Button>
        </div>
      </nav>
      <section
        class={
          stacked
            ? show("list")
              ? "border-r min-h-[28rem]"
              : "hidden"
            : autoHide("list", "border-r min-h-[28rem]")
        }
      >
        {stacked ? (
          <div class="flex items-center gap-2 border-b px-2 py-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setMobilePane("folders")}
            >
              <ChevronLeftIcon size={16} aria-hidden="true" />
              Folders
            </Button>
          </div>
        ) : null}
        <ul>
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                class={cn(
                  "hover:bg-muted flex w-full flex-col items-start gap-0.5 border-b px-3 py-2 text-left",
                  item.id === selected && "bg-muted",
                )}
                aria-current={item.id === selected ? "true" : undefined}
                onClick={() => openMessage(item.id)}
              >
                <span class="flex w-full items-center justify-between gap-2 text-sm">
                  <span class={item.read ? "font-normal" : "font-semibold"}>{item.from}</span>
                  <span class="text-muted-foreground text-[10px]">
                    {formatDayLabel(new Date(item.createdAt), stamp, options)}
                  </span>
                </span>
                <span class="text-sm">{item.subject}</span>
                <span class="text-muted-foreground line-clamp-1 text-xs">{item.snippet}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <article
        class={
          stacked
            ? show("reader")
              ? "min-h-[28rem] p-4"
              : "hidden"
            : autoHide("reader", "min-h-[28rem] p-4")
        }
      >
        {stacked && current ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            class="mb-2"
            onClick={() => setMobilePane("list")}
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
            Inbox
          </Button>
        ) : layout === "auto" && current ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            class="mb-2 md:hidden"
            onClick={() => {
              setSelected(null);
              setMobilePane("list");
            }}
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
            Inbox
          </Button>
        ) : null}
        {current ? (
          <div class="space-y-3">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 class="text-lg font-semibold">{current.subject}</h2>
                <p class="text-muted-foreground text-sm">
                  {current.from}
                  {current.to ? ` → ${current.to}` : ""} ·{" "}
                  {formatTime(new Date(current.createdAt), options)}
                </p>
                <div class="mt-1 flex flex-wrap gap-1">
                  {(current.labelIds ?? []).map((id) => {
                    const label = labels.find((item) => item.id === id);
                    return label ? (
                      <Badge key={id} variant="secondary">
                        {label.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
              <div class="flex gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-pressed={current.starred}
                  aria-label={current.starred ? "Unstar" : "Star"}
                  onClick={() => onStar?.(current.id, !current.starred)}
                >
                  <StarIcon size={16} aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Archive"
                  onClick={() => onArchive?.(current.id)}
                >
                  <ArchiveIcon size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
            <p class="whitespace-pre-wrap text-sm">{current.body}</p>
            <div class="flex gap-2">
              <Button type="button" size="sm" onClick={() => onReply?.(current.id)}>
                Reply
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onForward?.(current.id)}
              >
                Forward
              </Button>
            </div>
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Select a message</EmptyTitle>
              <EmptyDescription>Choose a conversation from the list.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </article>
    </div>
  );
};
