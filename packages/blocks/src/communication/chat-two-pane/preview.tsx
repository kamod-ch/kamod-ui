import { previewAuthors, previewConversations, previewMessages } from "../shared/fixtures";
import { ChatTwoPane } from "./chat-two-pane";

export const ChatTwoPanePreview = ({ mode }: { mode?: "desktop" | "mobile" | "collapsed" }) => (
  <div class={mode === "mobile" ? "max-w-[24rem] p-4" : "p-4"}>
    <ChatTwoPane
      selfId="self"
      authors={previewAuthors}
      conversations={previewConversations}
      messages={previewMessages}
      layout={mode === "mobile" ? "stack" : "split"}
      defaultActiveConversationId={mode === "mobile" ? null : "c1"}
    />
  </div>
);
