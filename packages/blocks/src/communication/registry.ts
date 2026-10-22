import type { CatalogBlockDefinition } from "../shared";
import { AiLlmChatPreview } from "./ai-llm-chat";
import { type CommunicationBlockId, definitions } from "./catalog-definitions";
import { ChatThreadPreview } from "./chat-thread";
import { ChatTwoPanePreview } from "./chat-two-pane";
import { InboxPreview } from "./inbox";

export type { CommunicationBlockId } from "./catalog-definitions";

export type CommunicationBlockDefinition = CatalogBlockDefinition<CommunicationBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const components = {
  "ai-llm-chat": AiLlmChatPreview,
  "chat-thread": ChatThreadPreview,
  "chat-two-pane": ChatTwoPanePreview,
  inbox: InboxPreview,
} satisfies Record<CommunicationBlockId, CommunicationBlockDefinition["component"]>;

export const communicationBlocks: CommunicationBlockDefinition[] = definitions.map((block) => ({
  ...(block as Omit<CommunicationBlockDefinition, "component" | "installCommand" | "source">),
  source: "uipkge",
  component: components[block.id as CommunicationBlockId],
  installCommand: `@kamod-ch/blocks/communication/${block.id}`,
}));

export const communicationBlocksById = communicationBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<CommunicationBlockId, CommunicationBlockDefinition>,
);
