import { previewFolders, previewInboxMessages, previewLabels } from "../shared/fixtures";
import { Inbox } from "./inbox";

export const InboxPreview = ({ mode }: { mode?: "desktop" | "mobile" | "collapsed" }) => (
  <div class={mode === "mobile" ? "max-w-[24rem] p-4" : "p-4"}>
    <Inbox
      folders={previewFolders}
      labels={previewLabels}
      messages={previewInboxMessages}
      layout={mode === "mobile" ? "stack" : "split"}
      defaultPane="list"
    />
  </div>
);
