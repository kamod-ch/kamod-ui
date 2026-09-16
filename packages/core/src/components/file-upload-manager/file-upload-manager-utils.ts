import type { UploadValidationErrorCode, UploadValidationRules } from "./file-upload-manager-types";

let entryCounter = 0;
let attemptCounter = 0;

export const createUploadEntryId = (): string => {
  entryCounter += 1;
  return `upload-${Date.now()}-${entryCounter}`;
};

export const createUploadAttemptId = (): string => {
  attemptCounter += 1;
  return `attempt-${Date.now()}-${attemptCounter}`;
};

export const formatUploadFileSize = (bytes: number, locale = "en"): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  const units = ["B", "KB", "MB", "GB"] as const;
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: unitIndex === 0 ? 0 : 1,
  }).format(value);
  return `${formatted} ${units[unitIndex]}`;
};

const matchesAcceptedType = (file: File, accepted: string): boolean => {
  const normalized = accepted.trim().toLowerCase();
  if (!normalized) return true;
  if (normalized.startsWith(".")) {
    return file.name.toLowerCase().endsWith(normalized);
  }
  if (normalized.endsWith("/*")) {
    const prefix = normalized.slice(0, -1);
    return file.type.toLowerCase().startsWith(prefix);
  }
  return file.type.toLowerCase() === normalized;
};

export type FileValidationResult =
  | { valid: true }
  | { valid: false; code: UploadValidationErrorCode; message: string };

export const validateUploadFile = (
  file: File,
  rules: UploadValidationRules | undefined,
  currentCount: number,
): FileValidationResult => {
  if (rules?.maxFiles !== undefined && currentCount >= rules.maxFiles) {
    return {
      valid: false,
      code: "max-files",
      message: `Maximum of ${rules.maxFiles} files allowed.`,
    };
  }

  if (rules?.maxFileSize !== undefined && file.size > rules.maxFileSize) {
    return {
      valid: false,
      code: "max-size",
      message: `File exceeds the ${formatUploadFileSize(rules.maxFileSize)} limit.`,
    };
  }

  if (rules?.acceptedTypes?.length) {
    const accepted = rules.acceptedTypes.some((type) => matchesAcceptedType(file, type));
    if (!accepted) {
      return {
        valid: false,
        code: "file-type",
        message: "File type is not allowed.",
      };
    }
  }

  return { valid: true };
};

export const validationRulesToAcceptAttr = (rules?: UploadValidationRules): string | undefined => {
  if (!rules?.acceptedTypes?.length) return undefined;
  return rules.acceptedTypes.join(",");
};

export const shouldCreatePreviewUrl = (file: File): boolean => file.type.startsWith("image/");
