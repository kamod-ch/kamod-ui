import type { CatalogBlockDefinition, CatalogBlockFile } from "../shared";
import { AiLlmChatPreview } from "./ai-llm-chat";
import { ChatThreadPreview } from "./chat-thread";
import { ChatTwoPanePreview } from "./chat-two-pane";
import { InboxPreview } from "./inbox";

export type CommunicationBlockId = "ai-llm-chat" | "chat-thread" | "chat-two-pane" | "inbox";

export type CommunicationBlockDefinition = CatalogBlockDefinition<CommunicationBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const catalog = (id: CommunicationBlockId) => `https://uipkge.dev/react/blocks/${id}`;
const componentFile = (id: CommunicationBlockId, fileName: string): CatalogBlockFile => ({
  path: `src/communication/${id}/${fileName}`,
  label: `components/${fileName}`,
  kind: "component",
});
const support = (path: string, label: string): CatalogBlockFile => ({
  path,
  label,
  kind: "support",
});

const types = support("src/communication/shared/types.ts", "components/types.ts");
const fixtures = support("src/communication/shared/fixtures.ts", "components/fixtures.ts");

const components = {
  "ai-llm-chat": AiLlmChatPreview,
  "chat-thread": ChatThreadPreview,
  "chat-two-pane": ChatTwoPanePreview,
  inbox: InboxPreview,
} satisfies Record<CommunicationBlockId, CommunicationBlockDefinition["component"]>;

const definitions: Omit<CommunicationBlockDefinition, "component" | "installCommand" | "source">[] =
  [
    {
      id: "chat-thread",
      title: "Chat Thread",
      description:
        "Controlled messages with delivery status, typing, attach/call/video, and auto-scroll only when the user is near the end.",
      category: "communication",
      catalogUrl: catalog("chat-thread"),
      files: [componentFile("chat-thread", "chat-thread.tsx"), types, fixtures],
      dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
      uiComponents: ["Avatar", "Button", "Empty"],
      tags: ["communication", "chat"],
      features: ["controlled-messages", "near-end-scroll", "locale-grouping"],
      preview: { height: 640, fullWidth: true },
      props: [
        {
          name: "messages",
          type: "ChatMessage[]",
          description: "Controlled thread. No product defaults.",
        },
        { name: "selfId", type: "string", description: "Author id treated as the current user." },
        {
          name: "onSend",
          type: "(body: string) => void",
          description: "Composer submit. Consumer assigns ids.",
        },
      ],
      usage: `import { ChatThread } from "@kamod-ch/blocks/communication/chat-thread";

export const Example = () => (
  <ChatThread selfId="self" messages={[]} onSend={(body) => console.log(body)} />
);`,
    },
    {
      id: "chat-two-pane",
      title: "Chat Two Pane",
      description:
        "Conversation list plus thread. Mobile uses master/detail with a Back action instead of two squeezed columns.",
      category: "communication",
      catalogUrl: catalog("chat-two-pane"),
      files: [componentFile("chat-two-pane", "chat-two-pane.tsx"), types, fixtures],
      dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
      uiComponents: ["Button"],
      tags: ["communication", "chat"],
      features: ["controlled-active", "mobile-stack", "back-action"],
      preview: { height: 640, fullWidth: true },
      props: [
        { name: "conversations", type: "ChatConversation[]", description: "Sidebar rows." },
        {
          name: "activeConversationId",
          type: "string | null",
          description: "Controlled selection. Null shows the list on mobile.",
        },
        {
          name: "layout",
          type: '"auto" | "split" | "stack"',
          description: "stack forces master/detail.",
        },
      ],
      usage: `import { ChatTwoPane } from "@kamod-ch/blocks/communication/chat-two-pane";

export const Example = () => (
  <ChatTwoPane selfId="self" conversations={[]} messages={[]} layout="stack" />
);`,
    },
    {
      id: "inbox",
      title: "Inbox",
      description:
        "Folders, list, and reader. Mobile walks folders → list → reader. Star, archive, reply, forward, and compose are callbacks.",
      category: "communication",
      catalogUrl: catalog("inbox"),
      files: [componentFile("inbox", "inbox.tsx"), types, fixtures],
      dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
      uiComponents: ["Badge", "Button", "Empty"],
      tags: ["communication", "mail"],
      features: ["controlled-selection", "mobile-panes", "star-archive"],
      preview: { height: 720, fullWidth: true },
      props: [
        { name: "folders", type: "InboxFolder[]", description: "Mailbox folders." },
        { name: "messages", type: "InboxMessage[]", description: "Controlled mail items." },
        {
          name: "onStar",
          type: "(id: string, starred: boolean) => void",
          description: "Star toggle.",
        },
      ],
      usage: `import { Inbox } from "@kamod-ch/blocks/communication/inbox";

export const Example = () => <Inbox folders={[]} messages={[]} layout="stack" />;`,
    },
    {
      id: "ai-llm-chat",
      title: "AI LLM Chat",
      description:
        "Threads, model picker, and prompts. onSend may return a Promise or AsyncIterable. Stop uses AbortSignal. Code renders as text, never HTML. No setTimeout demo replies in product code.",
      category: "communication",
      catalogUrl: catalog("ai-llm-chat"),
      files: [
        componentFile("ai-llm-chat", "ai-llm-chat.tsx"),
        support("src/communication/shared/stream.ts", "components/stream.ts"),
        types,
        fixtures,
      ],
      dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
      uiComponents: ["Button", "Empty", "Select"],
      tags: ["communication", "ai"],
      features: ["abort-signal", "stream-or-promise", "code-as-text"],
      preview: { height: 720, fullWidth: true },
      props: [
        { name: "threads", type: "AiChatThread[]", description: "Sidebar threads." },
        {
          name: "models",
          type: "AiChatModel[]",
          description: "Selectable models. None are hard-coded.",
        },
        {
          name: "onSend",
          type: "(payload) => string | AsyncIterable<string> | Promise<...>",
          description: "Return void to stream externally via messages.",
        },
      ],
      usage: `import { AiLlmChat } from "@kamod-ch/blocks/communication/ai-llm-chat";

export const Example = () => (
  <AiLlmChat
    threads={[{ id: "t1", title: "Notes", updatedAt: "2026-08-14T12:00:00.000Z" }]}
    models={[{ id: "atlas", label: "Atlas" }]}
    onSend={async function* () { yield "Hello "; yield "world"; }}
  />
);`,
    },
  ];

export const communicationBlocks: CommunicationBlockDefinition[] = definitions.map((block) => ({
  ...block,
  source: "uipkge",
  component: components[block.id],
  installCommand: `@kamod-ch/blocks/communication/${block.id}`,
}));

export const communicationBlocksById = communicationBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<CommunicationBlockId, CommunicationBlockDefinition>,
);
