import { previewAiMessages, previewAiModels, previewAiThreads } from "../shared/fixtures";
import { AiLlmChat } from "./ai-llm-chat";

async function* previewStream(text: string): AsyncIterable<string> {
  for (const word of text.split(" ")) {
    yield `${word} `;
  }
}

export const AiLlmChatPreview = ({ mode }: { mode?: "desktop" | "mobile" | "collapsed" }) => (
  <div class={mode === "mobile" ? "max-w-[24rem] p-4" : "p-4"}>
    <AiLlmChat
      threads={previewAiThreads}
      models={previewAiModels}
      messages={previewAiMessages}
      defaultActiveThreadId="t1"
      defaultActiveModelId="atlas"
      layout={mode === "mobile" ? "stack" : "split"}
      now={new Date("2026-08-14T18:00:00.000Z")}
      onSend={({ text }) => previewStream(`Echo: ${text}`)}
    />
  </div>
);
