export { TagInput, TagInput as default } from "./TagInput";
export type {
  TagInputDuplicatePolicy,
  TagInputLabels,
  TagInputProps,
  TagInputSeparator,
  TagInputTag,
  TagInputValidationRules,
} from "./tag-input-types";
export {
  createTagId,
  mergeTagIntoList,
  normalizeTagValue,
  separatorTriggersCommit,
  splitPastedTagValues,
  syncTagsFromValueProp,
  validateTagCandidate,
} from "./tag-input-utils";
