import type { CopyFieldTruncate } from "./copy-field-types";

export const truncateCopyFieldValue = (
  value: string,
  maxDisplayLength: number,
  mode: CopyFieldTruncate,
): string => {
  if (mode === false || value.length <= maxDisplayLength) {
    return value;
  }

  if (mode === "end") {
    return `${value.slice(0, Math.max(1, maxDisplayLength - 1))}…`;
  }

  const keep = Math.max(2, maxDisplayLength - 1);
  const startLength = Math.ceil(keep / 2);
  const endLength = Math.floor(keep / 2);
  return `${value.slice(0, startLength)}…${value.slice(value.length - endLength)}`;
};
