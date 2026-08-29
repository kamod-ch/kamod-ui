import { describe, expect, it } from "vitest";
import { communicationBlocks, communicationBlocksById } from "./registry";

describe("communication blocks registry", () => {
  it("registers four communication blocks with unique ids", () => {
    expect(communicationBlocks).toHaveLength(4);
    const ids = communicationBlocks.map((block) => block.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["chat-thread", "chat-two-pane", "inbox", "ai-llm-chat"]);
    for (const block of communicationBlocks) {
      expect(block.component).toBeTypeOf("function");
      expect(block.category).toBe("communication");
      expect(communicationBlocksById[block.id]).toBe(block);
    }
  });
});
