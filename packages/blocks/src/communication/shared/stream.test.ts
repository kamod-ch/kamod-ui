import { describe, expect, it } from "vitest";
import { consumeSendResult } from "./stream";

describe("consumeSendResult", () => {
  it("stops iterating when the abort signal fires", async () => {
    const controller = new AbortController();
    async function* stream() {
      yield "a";
      controller.abort();
      yield "b";
    }
    const chunks: string[] = [];
    const text = await consumeSendResult(
      stream(),
      (chunk) => chunks.push(chunk),
      controller.signal,
    );
    expect(chunks).toEqual(["a"]);
    expect(text).toBe("a");
  });
});
