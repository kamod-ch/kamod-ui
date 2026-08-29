import type { CommunicationBlockId } from "@kamod-ch/blocks";
import aiLlmChat from "../../../blocks/src/communication/ai-llm-chat/ai-llm-chat.tsx?raw";
import chatThread from "../../../blocks/src/communication/chat-thread/chat-thread.tsx?raw";
import chatTwoPane from "../../../blocks/src/communication/chat-two-pane/chat-two-pane.tsx?raw";
import inbox from "../../../blocks/src/communication/inbox/inbox.tsx?raw";
import fixtures from "../../../blocks/src/communication/shared/fixtures.ts?raw";
import stream from "../../../blocks/src/communication/shared/stream.ts?raw";
import types from "../../../blocks/src/communication/shared/types.ts?raw";

const shared = {
  "components/types.ts": types,
  "components/fixtures.ts": fixtures,
};

const sources: Record<CommunicationBlockId, Record<string, string>> = {
  "chat-thread": { "components/chat-thread.tsx": chatThread, ...shared },
  "chat-two-pane": { "components/chat-two-pane.tsx": chatTwoPane, ...shared },
  inbox: { "components/inbox.tsx": inbox, ...shared },
  "ai-llm-chat": {
    "components/ai-llm-chat.tsx": aiLlmChat,
    "components/stream.ts": stream,
    ...shared,
  },
};

export const getCommunicationBlockSource = (id: CommunicationBlockId, fileLabel: string): string =>
  sources[id]?.[fileLabel] ?? Object.values(sources[id] ?? {})[0] ?? "";
