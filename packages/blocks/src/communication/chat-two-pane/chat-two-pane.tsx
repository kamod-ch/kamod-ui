import { ChevronLeftIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { useControllableState } from "../../shared";
import { ChatThread, type ChatThreadProps } from "../chat-thread/chat-thread";
import type { ChatConversation, CommunicationLayout } from "../shared/types";

export type ChatTwoPaneProps = ChatThreadProps & {
  conversations?: ChatConversation[];
  activeConversationId?: string | null;
  defaultActiveConversationId?: string | null;
  onActiveConversationChange?: (id: string | null) => void;
  layout?: CommunicationLayout;
};

export const ChatTwoPane = ({
  conversations = [],
  activeConversationId,
  defaultActiveConversationId = null,
  onActiveConversationChange,
  layout = "auto",
  peer,
  ...thread
}: ChatTwoPaneProps) => {
  const [active, setActive] = useControllableState<string | null>({
    value: activeConversationId,
    defaultValue: defaultActiveConversationId,
    onChange: onActiveConversationChange,
  });
  const selected = conversations.find((item) => item.id === active) ?? null;
  const stacked = layout === "stack";
  const showList = !stacked || !selected;
  const showThread = !stacked || Boolean(selected);

  return (
    <div
      data-slot="block-chat-two-pane"
      data-layout={layout}
      class={`bg-background text-foreground overflow-hidden rounded-xl border ${
        stacked ? "grid grid-cols-1" : "grid md:grid-cols-[18rem_minmax(0,1fr)]"
      } ${layout === "auto" && !selected ? "max-md:grid-cols-1" : ""}`}
    >
      <aside
        class={`border-border min-h-[28rem] border-r ${
          stacked && !showList ? "hidden" : ""
        } ${layout === "auto" && selected ? "max-md:hidden" : ""}`}
      >
        <p class="px-3 py-2 text-sm font-medium">Conversations</p>
        <ul>
          {conversations.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                class={`hover:bg-muted flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm ${
                  item.id === active ? "bg-muted" : ""
                }`}
                aria-current={item.id === active ? "true" : undefined}
                onClick={() => setActive(item.id)}
              >
                <span class="flex w-full items-center justify-between gap-2">
                  <span class="font-medium">{item.title}</span>
                  {item.unread ? (
                    <span class="bg-primary text-primary-foreground rounded-full px-1.5 text-[10px]">
                      {item.unread}
                    </span>
                  ) : null}
                </span>
                <span class="text-muted-foreground line-clamp-1 text-xs">{item.preview}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div
        class={`min-w-0 ${stacked && !showThread ? "hidden" : ""} ${
          layout === "auto" && !selected ? "max-md:hidden" : ""
        }`}
      >
        {stacked && selected ? (
          <div class="border-b px-2 py-1">
            <Button type="button" size="sm" variant="ghost" onClick={() => setActive(null)}>
              <ChevronLeftIcon size={16} aria-hidden="true" />
              Back
            </Button>
          </div>
        ) : layout === "auto" && selected ? (
          <div class="border-b px-2 py-1 md:hidden">
            <Button type="button" size="sm" variant="ghost" onClick={() => setActive(null)}>
              <ChevronLeftIcon size={16} aria-hidden="true" />
              Back
            </Button>
          </div>
        ) : null}
        <ChatThread {...thread} peer={peer ?? selected?.peer} />
      </div>
    </div>
  );
};
