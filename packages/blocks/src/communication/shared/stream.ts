export type AiSendPayload = {
  threadId: string;
  modelId: string;
  text: string;
  signal: AbortSignal;
};

export type AiSendResult = string | AsyncIterable<string>;

const isAsyncIterable = (value: unknown): value is AsyncIterable<string> =>
  typeof value === "object" && value != null && Symbol.asyncIterator in value;

export const consumeSendResult = async (
  result: AiSendResult | void,
  onDelta: (chunk: string) => void,
  signal: AbortSignal,
): Promise<string> => {
  if (result == null) return "";
  if (typeof result === "string") {
    onDelta(result);
    return result;
  }
  if (!isAsyncIterable(result)) return "";
  let assembled = "";
  for await (const chunk of result) {
    if (signal.aborted) break;
    assembled += chunk;
    onDelta(chunk);
  }
  return assembled;
};
