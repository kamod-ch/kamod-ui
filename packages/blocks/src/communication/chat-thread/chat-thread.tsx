import { PaperclipIcon, PhoneIcon, SendIcon, VideoIcon } from "@kamod-ch/icons/lucide";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@kamod-ch/ui";
import { useEffect, useRef, useState } from "preact/hooks";
import { type DateFormatOptions, formatTime } from "../../shared";
import { groupMessagesByDay } from "../shared/group";
import type { ChatAuthor, ChatDeliveryStatus, ChatMessage } from "../shared/types";

export type ChatThreadProps = {
  messages?: ChatMessage[];
  selfId: string;
  peer?: ChatAuthor;
  authors?: Record<string, ChatAuthor>;
  typing?: boolean;
  onSend?: (body: string) => void;
  onAttach?: () => void;
  onCall?: () => void;
  onVideo?: () => void;
  locale?: string;
  timeZone?: string;
  now?: Date;
  composerPlaceholder?: string;
};

const statusLabel = (status?: ChatDeliveryStatus): string => {
  if (status === "read") return "Read";
  if (status === "delivered") return "Delivered";
  if (status === "failed") return "Failed";
  if (status === "pending") return "Sending";
  return "Sent";
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const ChatThread = ({
  messages = [],
  selfId,
  peer,
  authors = {},
  typing = false,
  onSend,
  onAttach,
  onCall,
  onVideo,
  locale = "en-US",
  timeZone,
  now,
  composerPlaceholder = "Write a message",
}: ChatThreadProps) => {
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const nearEnd = useRef(true);
  const stamp = now ?? new Date("2026-08-14T18:00:00.000Z");
  const options: DateFormatOptions = { locale, timeZone };
  const groups = groupMessagesByDay(messages, stamp, options);

  const onScroll = () => {
    const node = scroller.current;
    if (!node) return;
    nearEnd.current = node.scrollHeight - node.scrollTop - node.clientHeight < 96;
  };

  useEffect(() => {
    if (!nearEnd.current) return;
    const node = scroller.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, typing]);

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    onSend?.(body);
    setDraft("");
    nearEnd.current = true;
  };

  return (
    <div
      data-slot="block-chat-thread"
      class="bg-background text-foreground flex h-[32rem] flex-col overflow-hidden rounded-xl border"
    >
      <header class="flex items-center gap-3 border-b px-3 py-2">
        {peer ? (
          <Avatar size="sm">
            {peer.avatarUrl ? <AvatarImage src={peer.avatarUrl} alt="" /> : null}
            <AvatarFallback>{initials(peer.name)}</AvatarFallback>
          </Avatar>
        ) : null}
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">{peer?.name ?? "Conversation"}</p>
          <p class="text-muted-foreground text-xs">{typing ? "Typing…" : "Chat"}</p>
        </div>
        <Button type="button" size="icon-sm" variant="ghost" aria-label="Call" onClick={onCall}>
          <PhoneIcon size={16} aria-hidden="true" />
        </Button>
        <Button type="button" size="icon-sm" variant="ghost" aria-label="Video" onClick={onVideo}>
          <VideoIcon size={16} aria-hidden="true" />
        </Button>
      </header>
      <div ref={scroller} class="min-h-0 flex-1 overflow-y-auto px-3 py-3" onScroll={onScroll}>
        {groups.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No messages yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          groups.map((group) => (
            <section key={group.dateKey} class="mb-4 space-y-2">
              <h3 class="text-muted-foreground text-center text-xs">{group.label}</h3>
              {group.messages.map((message) => {
                const mine = message.authorId === selfId;
                const author = authors[message.authorId];
                return (
                  <article
                    key={message.id}
                    class={`flex ${mine ? "justify-end" : "justify-start"}`}
                    data-status={message.status}
                  >
                    <div
                      class={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      {!mine && author ? (
                        <p class="mb-0.5 text-[10px] font-medium opacity-80">{author.name}</p>
                      ) : null}
                      <p class="whitespace-pre-wrap">{message.body}</p>
                      <p
                        class={`mt-1 text-[10px] ${mine ? "opacity-80" : "text-muted-foreground"}`}
                      >
                        {formatTime(new Date(message.createdAt), options)}
                        {mine ? ` · ${statusLabel(message.status)}` : ""}
                      </p>
                    </div>
                  </article>
                );
              })}
            </section>
          ))
        )}
        {typing ? (
          <p class="text-muted-foreground px-1 text-xs" aria-live="polite">
            {peer?.name ?? "Someone"} is typing
          </p>
        ) : null}
      </div>
      <form
        class="flex items-end gap-2 border-t p-2"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <Button type="button" size="icon-sm" variant="ghost" aria-label="Attach" onClick={onAttach}>
          <PaperclipIcon size={16} aria-hidden="true" />
        </Button>
        <label class="sr-only" for="chat-composer">
          Message
        </label>
        <textarea
          id="chat-composer"
          class="border-input bg-background min-h-10 flex-1 resize-none rounded-md border px-3 py-2 text-sm"
          placeholder={composerPlaceholder}
          rows={1}
          value={draft}
          onInput={(event) => setDraft((event.currentTarget as HTMLTextAreaElement).value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
        />
        <Button type="submit" size="icon-sm" aria-label="Send" disabled={!draft.trim()}>
          <SendIcon size={16} aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
};
