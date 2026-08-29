import { type DateFormatOptions, formatDayLabel, groupBy, toDateKey } from "../../shared";
import type { ChatMessage } from "./types";

export type ChatDayGroup = {
  dateKey: string;
  label: string;
  messages: ChatMessage[];
};

export const groupMessagesByDay = (
  messages: ChatMessage[],
  now: Date,
  options: DateFormatOptions = {},
): ChatDayGroup[] => {
  const buckets = groupBy(messages, (message) =>
    toDateKey(new Date(message.createdAt), options.timeZone),
  );
  return Object.keys(buckets)
    .sort()
    .map((dateKey) => {
      const items = buckets[dateKey as keyof typeof buckets] ?? [];
      const first = items[0];
      return {
        dateKey,
        label: first ? formatDayLabel(new Date(first.createdAt), now, options) : dateKey,
        messages: items,
      };
    });
};
