import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AiLlmChat } from "./ai-llm-chat";
import { ChatThread } from "./chat-thread";
import { ChatTwoPane } from "./chat-two-pane";
import { Inbox } from "./inbox";
import {
  previewConversations,
  previewFolders,
  previewInboxMessages,
  previewMessages,
} from "./shared/fixtures";

afterEach(() => cleanup());

describe("communication blocks", () => {
  it("sends chat text without inventing message ids", () => {
    const onSend = vi.fn();
    render(<ChatThread selfId="self" messages={previewMessages} onSend={onSend} />);
    fireEvent.input(screen.getByLabelText("Message"), { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("uses master/detail back on stacked chat layout", () => {
    const onActive = vi.fn();
    render(
      <ChatTwoPane
        selfId="self"
        conversations={previewConversations}
        messages={previewMessages}
        layout="stack"
        activeConversationId="c1"
        onActiveConversationChange={onActive}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Back/ }));
    expect(onActive).toHaveBeenCalledWith(null);
  });

  it("walks inbox panes on mobile and emits mail callbacks", () => {
    const onStar = vi.fn();
    const onArchive = vi.fn();
    const onReply = vi.fn();
    const onForward = vi.fn();
    const onCompose = vi.fn();
    render(
      <Inbox
        folders={previewFolders}
        messages={previewInboxMessages}
        layout="stack"
        defaultPane="reader"
        defaultSelectedId="mail-1"
        onStar={onStar}
        onArchive={onArchive}
        onReply={onReply}
        onForward={onForward}
        onCompose={onCompose}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Star" }));
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    fireEvent.click(screen.getByRole("button", { name: "Reply" }));
    fireEvent.click(screen.getByRole("button", { name: "Forward" }));
    expect(onStar).toHaveBeenCalledWith("mail-1", true);
    expect(onArchive).toHaveBeenCalledWith("mail-1");
    expect(onReply).toHaveBeenCalledWith("mail-1");
    expect(onForward).toHaveBeenCalledWith("mail-1");
  });

  it("streams assistant text and aborts with AbortSignal", async () => {
    const onStop = vi.fn();
    let captured: AbortSignal | undefined;
    const onSend = vi.fn(({ signal }: { signal: AbortSignal }) => {
      captured = signal;
      return (async function* () {
        yield "Hel";
        yield "lo";
        await new Promise(() => {
          /* hang until abort */
        });
      })();
    });
    const onMessagesChange = vi.fn();
    render(
      <AiLlmChat
        threads={[{ id: "t1", title: "Notes", updatedAt: "2026-08-14T12:00:00.000Z" }]}
        models={[{ id: "atlas", label: "Atlas" }]}
        messages={[]}
        defaultActiveThreadId="t1"
        now={new Date("2026-08-14T18:00:00.000Z")}
        onSend={onSend}
        onStop={onStop}
        onMessagesChange={onMessagesChange}
      />,
    );
    fireEvent.input(screen.getByLabelText("Prompt"), { target: { value: "Hi" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await screen.findByRole("button", { name: /Stop/ });
    fireEvent.click(screen.getByRole("button", { name: /Stop/ }));
    expect(onStop).toHaveBeenCalledWith("abort");
    expect(captured?.aborted).toBe(true);
    await waitFor(() => expect(onMessagesChange).toHaveBeenCalled());
  });

  it("renders assistant code as text, never HTML", () => {
    const { container } = render(
      <AiLlmChat
        threads={[{ id: "t1", title: "Notes", updatedAt: "2026-08-14T12:00:00.000Z" }]}
        messages={[
          {
            id: "a2",
            role: "assistant",
            content: [{ type: "code", language: "html", text: "<img src=x onerror=alert(1)>" }],
            createdAt: "2026-08-14T12:00:00.000Z",
          },
        ]}
        defaultActiveThreadId="t1"
      />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("<img src=x onerror=alert(1)>")).toBeTruthy();
  });

  it("imports communication modules without window access at load time", async () => {
    const mod = await import("./index");
    expect(mod.communicationBlocks).toHaveLength(4);
    expect(typeof mod.ChatThread).toBe("function");
    expect(typeof mod.AiLlmChat).toBe("function");
  });
});
