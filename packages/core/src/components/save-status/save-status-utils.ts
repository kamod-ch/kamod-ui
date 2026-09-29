import type { SaveStatusFormatOptions, SaveStatusState } from "./save-status-types";

export const toSaveStatusDateTime = (value: Date | string): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
};

/** Absolute Intl formatting — SSR-stable when locale/timeZone are fixed. */
export const formatSaveStatusDateTime = (
  value: Date | string,
  options: SaveStatusFormatOptions = {},
): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(options.locale ?? "en", {
    timeZone: options.timeZone,
    dateStyle: options.dateStyle ?? "medium",
    timeStyle: options.timeStyle ?? "short",
  }).format(date);
};

export const resolveSaveStatusDisplay = (
  status: SaveStatusState,
  hasUnsavedChanges = false,
): SaveStatusState => {
  if (hasUnsavedChanges && (status === "saved" || status === "pristine")) {
    return "dirty";
  }
  return status;
};
