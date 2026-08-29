import { previewAuthors, previewMessages } from "../shared/fixtures";
import { ChatThread } from "./chat-thread";

export const ChatThreadPreview = () => (
  <div class="p-4">
    <ChatThread
      selfId="self"
      peer={previewAuthors.ada}
      authors={previewAuthors}
      messages={previewMessages}
    />
  </div>
);
