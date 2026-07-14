import { z } from "zod";
import {
  MAX_LABEL_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PAYLOAD_ARRAY_LENGTH,
  MAX_PAYLOAD_DEPTH,
  MAX_PAYLOAD_KEYS,
  MAX_STRING_LENGTH,
} from "../constants";

const safePrimitive = z.union([
  z.string().max(MAX_STRING_LENGTH),
  z.number(),
  z.boolean(),
  z.null(),
]);

function safeJsonValue(depth: number): z.ZodType<unknown> {
  if (depth <= 0) return safePrimitive;
  return z.lazy(() =>
    z.union([
      safePrimitive,
      z.array(safeJsonValue(depth - 1)).max(MAX_PAYLOAD_ARRAY_LENGTH),
      z
        .record(z.string().max(MAX_NAME_LENGTH), safeJsonValue(depth - 1))
        .refine((obj) => Object.keys(obj).length <= MAX_PAYLOAD_KEYS, {
          message: `Object may have at most ${MAX_PAYLOAD_KEYS} keys`,
        }),
    ]),
  );
}

export const safePayloadSchema = safeJsonValue(MAX_PAYLOAD_DEPTH);

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("submit"),
    name: z.string().min(1).max(MAX_NAME_LENGTH),
  }),
  z.object({
    type: z.literal("event"),
    name: z.string().min(1).max(MAX_NAME_LENGTH),
    payload: safePayloadSchema.optional(),
  }),
  z.object({
    type: z.literal("navigate"),
    target: z.string().min(1).max(200),
  }),
]);

export type KamodOpenUIAction = z.infer<typeof actionSchema>;

export const optionalActionSchema = actionSchema.optional();

export const shortString = (max = MAX_LABEL_LENGTH) => z.string().min(1).max(max);
export const optionalShortString = (max = MAX_LABEL_LENGTH) => z.string().max(max).optional();

type TriggerActionFn = (
  humanReadableName: string,
  formName?: string,
  action?: { type: string; params?: Record<string, unknown> },
) => void;

/** Shared host-action dispatch used by OpenUI adapters with optionalActionSchema. */
export function fireOpenUIAction(
  triggerAction: TriggerActionFn,
  label: string,
  action: KamodOpenUIAction | undefined,
  extraParams?: Record<string, unknown>,
): void {
  if (!action) {
    if (extraParams) {
      triggerAction(label, undefined, { type: "event", params: extraParams });
      return;
    }
    triggerAction(label);
    return;
  }
  if (action.type === "navigate") {
    triggerAction(label, undefined, {
      type: "open_url",
      params: { url: action.target, ...extraParams },
    });
    return;
  }
  if (action.type === "submit") {
    triggerAction(label, action.name, {
      type: "submit",
      params: { name: action.name, ...extraParams },
    });
    return;
  }
  const base =
    action.payload && typeof action.payload === "object"
      ? (action.payload as Record<string, unknown>)
      : {};
  triggerAction(label, undefined, {
    type: action.name,
    params: { ...base, ...extraParams },
  });
}
