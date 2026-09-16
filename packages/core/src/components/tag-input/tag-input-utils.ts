import type {
  TagInputDuplicatePolicy,
  TagInputSeparator,
  TagInputTag,
  TagInputValidationRules,
} from "./tag-input-types";

let tagIdCounter = 0;

export const createTagId = (): string => {
  tagIdCounter += 1;
  return `tag-${Date.now()}-${tagIdCounter}`;
};

/** Trim edges and collapse internal whitespace — explicit normalization policy. */
export const normalizeTagValue = (raw: string): string => raw.trim().replace(/\s+/g, " ");

export const separatorTriggersCommit = (
  event: KeyboardEvent,
  separators: TagInputSeparator[],
): boolean => {
  if (event.key === "Enter" && separators.includes("Enter")) return true;
  if (event.key === "Tab" && separators.includes("Tab")) return true;
  if (event.key === "," && separators.includes(",")) return true;
  if (event.key === ";" && separators.includes(";")) return true;
  if (event.key === "|" && separators.includes("|")) return true;
  return false;
};

const splitPatternForSeparators = (separators: TagInputSeparator[]): RegExp => {
  const parts = ["\\n", "\\r", "\\t"];
  if (separators.includes(",")) parts.push(",");
  if (separators.includes(";")) parts.push(";");
  if (separators.includes("|")) parts.push("\\|");
  return new RegExp(`${parts.join("|")}`);
};

export const splitPastedTagValues = (text: string, separators: TagInputSeparator[]): string[] =>
  text.split(splitPatternForSeparators(separators)).map(normalizeTagValue).filter(Boolean);

export const validateTagCandidate = (
  value: string,
  tags: TagInputTag[],
  rules?: TagInputValidationRules,
): string | null => {
  if (!value) {
    return "Tag cannot be empty.";
  }
  if (rules?.maxTagLength !== undefined && value.length > rules.maxTagLength) {
    return `Tag must be at most ${rules.maxTagLength} characters.`;
  }
  if (rules?.maxTags !== undefined && tags.length >= rules.maxTags) {
    return `Maximum of ${rules.maxTags} tags allowed.`;
  }
  return rules?.validate?.(value) ?? null;
};

export const mergeTagIntoList = (
  tags: TagInputTag[],
  rawValue: string,
  duplicatePolicy: TagInputDuplicatePolicy,
): { tags: TagInputTag[]; rejected?: boolean } => {
  const value = normalizeTagValue(rawValue);
  if (!value) {
    return { tags, rejected: true };
  }

  const existingIndex = tags.findIndex(
    (tag) => tag.value.localeCompare(value, undefined, { sensitivity: "accent" }) === 0,
  );

  if (existingIndex !== -1) {
    if (duplicatePolicy === "reject") {
      return { tags, rejected: true };
    }
    const next = tags.filter((_, index) => index !== existingIndex);
    return { tags: [...next, { id: createTagId(), value }] };
  }

  return { tags: [...tags, { id: createTagId(), value }] };
};

export const syncTagsFromValueProp = (
  previous: TagInputTag[],
  nextValues: TagInputTag[],
): TagInputTag[] => {
  const used = new Set<string>();
  return nextValues.map((tag) => {
    const preserved = previous.find(
      (candidate) => candidate.id === tag.id && candidate.value === tag.value,
    );
    if (preserved) {
      used.add(preserved.id);
      return preserved;
    }
    const byValue = previous.find(
      (candidate) =>
        !used.has(candidate.id) &&
        candidate.value === tag.value &&
        nextValues.filter((entry) => entry.value === tag.value).length === 1,
    );
    if (byValue) {
      used.add(byValue.id);
      return { id: byValue.id, value: tag.value };
    }
    return { id: tag.id || createTagId(), value: tag.value };
  });
};
