import {
  CopyIcon,
  PaperclipIcon,
  RefreshCwIcon,
  SquareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@kamod-ch/icons/lucide";
import {
  Button,
  cn,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kamod-ch/ui";
import { useEffect, useRef, useState } from "preact/hooks";
import { useControllableState } from "../../shared";
import { type AiSendPayload, type AiSendResult, consumeSendResult } from "../shared/stream";
import type {
  AiChatBlock,
  AiChatMessage,
  AiChatModel,
  AiChatThread,
  CommunicationLayout,
} from "../shared/types";

export type AiLlmChatProps = {
  threads?: AiChatThread[];
  activeThreadId?: string | null;
  defaultActiveThreadId?: string | null;
  onActiveThreadChange?: (id: string | null) => void;
  models?: AiChatModel[];
  activeModelId?: string;
  defaultActiveModelId?: string;
  onActiveModelChange?: (id: string) => void;
  messages?: AiChatMessage[];
  onMessagesChange?: (messages: AiChatMessage[]) => void;
  onSend?: (payload: AiSendPayload) => AiSendResult | Promise<AiSendResult | void> | void;
  onStop?: (reason: "abort") => void;
  onCopy?: (messageId: string, text: string) => void;
  onFeedback?: (messageId: string, value: "up" | "down") => void;
  onRegenerate?: (messageId: string) => void;
  onAttach?: () => void;
  layout?: CommunicationLayout;
  now?: Date;
};

const blocksOf = (message: AiChatMessage): AiChatBlock[] =>
  typeof message.content === "string" ? [{ type: "text", text: message.content }] : message.content;

const plainText = (message: AiChatMessage): string =>
  blocksOf(message)
    .map((block) => block.text)
    .join("\n");

const CodeBlock = ({ text, language }: { text: string; language?: string }) => (
  <pre class="bg-background overflow-x-auto rounded-md border p-3 text-xs">
    <code data-language={language}>{text}</code>
  </pre>
);

export const AiLlmChat = ({
  threads = [],
  activeThreadId,
  defaultActiveThreadId = threads[0]?.id ?? null,
  onActiveThreadChange,
  models = [],
  activeModelId,
  defaultActiveModelId = models[0]?.id ?? "",
  onActiveModelChange,
  messages = [],
  onMessagesChange,
  onSend,
  onStop,
  onCopy,
  onFeedback,
  onRegenerate,
  onAttach,
  layout = "auto",
  now,
}: AiLlmChatProps) => {
  const [threadId, setThreadId] = useControllableState<string | null>({
    value: activeThreadId,
    defaultValue: defaultActiveThreadId,
    onChange: onActiveThreadChange,
  });
  const [modelId, setModelId] = useControllableState({
    value: activeModelId,
    defaultValue: defaultActiveModelId,
    onChange: onActiveModelChange,
  });
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const idSeq = useRef(0);
  const stacked = layout === "stack";
  const createdAt = (now ?? new Date(0)).toISOString();

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
    onStop?.("abort");
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || streaming || !threadId) return;
    setDraft("");
    const controller = new AbortController();
    abortRef.current = controller;
    setStreaming(true);
    try {
      const result = await onSend?.({
        threadId,
        modelId,
        text,
        signal: controller.signal,
      });
      if (result == null) return;
      idSeq.current += 1;
      const assistantId = `assistant-${threadId}-${idSeq.current}`;
      const userId = `user-${threadId}-${idSeq.current}`;
      const base = messages;
      let assembled = "";
      await consumeSendResult(
        result,
        (chunk) => {
          assembled += chunk;
          onMessagesChange?.([
            ...base,
            { id: userId, role: "user", content: text, createdAt },
            {
              id: assistantId,
              role: "assistant",
              content: assembled,
              createdAt,
              streaming: true,
            },
          ]);
        },
        controller.signal,
      );
      if (!controller.signal.aborted) {
        onMessagesChange?.([
          ...base,
          { id: userId, role: "user", content: text, createdAt },
          {
            id: assistantId,
            role: "assistant",
            content: assembled,
            createdAt,
            streaming: false,
          },
        ]);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const copy = async (message: AiChatMessage) => {
    const text = plainText(message);
    onCopy?.(message.id, text);
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* consumer handles persistence */
    }
  };

  return (
    <div
      data-slot="block-ai-llm-chat"
      data-layout={layout}
      class={cn(
        "bg-background text-foreground overflow-hidden rounded-xl border",
        stacked ? "grid grid-cols-1" : "grid md:grid-cols-[16rem_minmax(0,1fr)]",
      )}
    >
      <aside class={cn("border-r", stacked && "border-b")}>
        <p class="px-3 py-2 text-sm font-medium">Threads</p>
        <ul>
          {threads.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                class={cn(
                  "hover:bg-muted w-full px-3 py-2 text-left text-sm",
                  item.id === threadId && "bg-muted font-medium",
                )}
                onClick={() => setThreadId(item.id)}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div class="flex min-h-[28rem] flex-col">
        <header class="flex items-center justify-between gap-2 border-b px-3 py-2">
          <p class="text-sm font-medium">Assistant</p>
          {models.length ? (
            <Select value={modelId} onValueChange={setModelId}>
              <SelectTrigger aria-label="Model" class="w-40">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </header>
        <div class="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          {messages.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Start a prompt</EmptyTitle>
                <EmptyDescription>
                  onSend may return a string, a Promise, or an AsyncIterable. Stop uses AbortSignal.
                  Code is rendered as text only.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                class="space-y-2 rounded-lg border p-3"
                data-role={message.role}
              >
                <p class="text-muted-foreground text-xs font-medium uppercase">{message.role}</p>
                {blocksOf(message).map((block, index) =>
                  block.type === "code" ? (
                    <CodeBlock key={index} text={block.text} language={block.language} />
                  ) : (
                    <p key={index} class="whitespace-pre-wrap text-sm">
                      {block.text}
                    </p>
                  ),
                )}
                {message.role === "assistant" ? (
                  <div class="flex flex-wrap gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Copy"
                      onClick={() => copy(message)}
                    >
                      <CopyIcon size={14} aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Good response"
                      onClick={() => onFeedback?.(message.id, "up")}
                    >
                      <ThumbsUpIcon size={14} aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Bad response"
                      onClick={() => onFeedback?.(message.id, "down")}
                    >
                      <ThumbsDownIcon size={14} aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Regenerate"
                      onClick={() => onRegenerate?.(message.id)}
                    >
                      <RefreshCwIcon size={14} aria-hidden="true" />
                    </Button>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
        <form
          class="flex items-end gap-2 border-t p-2"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Attach"
            onClick={onAttach}
          >
            <PaperclipIcon size={16} aria-hidden="true" />
          </Button>
          <label class="sr-only" for="ai-composer">
            Prompt
          </label>
          <textarea
            id="ai-composer"
            class="border-input min-h-10 flex-1 resize-none rounded-md border px-3 py-2 text-sm"
            rows={2}
            value={draft}
            onInput={(event) => setDraft((event.currentTarget as HTMLTextAreaElement).value)}
          />
          {streaming ? (
            <Button type="button" size="sm" variant="outline" onClick={stop}>
              <SquareIcon size={14} aria-hidden="true" />
              Stop
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={!draft.trim() || !threadId}>
              Send
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};
