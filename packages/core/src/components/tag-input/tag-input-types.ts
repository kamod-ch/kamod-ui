export type TagInputTag = {
  id: string;
  value: string;
};

export type TagInputDuplicatePolicy = "reject" | "replace";

export type TagInputSeparator = "Enter" | "Tab" | "," | ";" | "|";

export type TagInputLabels = {
  removeTag?: (tag: TagInputTag) => string;
  inputPlaceholder?: string;
  invalidTag?: string;
};

export type TagInputValidationRules = {
  maxTags?: number;
  maxTagLength?: number;
  validate?: (value: string) => string | null;
};

export type TagInputProps = {
  value?: TagInputTag[];
  defaultValue?: TagInputTag[];
  onValueChange?: (tags: TagInputTag[]) => void;
  disabled?: boolean;
  invalid?: boolean;
  duplicatePolicy?: TagInputDuplicatePolicy;
  /** Key codes/chars that commit the current draft — comma is never implicit unless listed here. */
  separators?: TagInputSeparator[];
  /** Split pasted text into multiple tags (newlines/tabs always; configured separators when enabled). */
  enablePasteSplit?: boolean;
  validation?: TagInputValidationRules;
  labels?: TagInputLabels;
  id?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  class?: string;
};
