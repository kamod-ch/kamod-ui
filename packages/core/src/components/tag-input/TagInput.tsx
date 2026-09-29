import type { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { ChipFieldContainer } from "../chip-field/ChipFieldContainer";
import { RemovableChip } from "../chip-field/RemovableChip";
import type { TagInputProps, TagInputTag } from "./tag-input-types";
import {
  createTagId,
  mergeTagIntoList,
  normalizeTagValue,
  separatorTriggersCommit,
  splitPastedTagValues,
  syncTagsFromValueProp,
  validateTagCandidate,
} from "./tag-input-utils";

export const TagInput = ({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  disabled = false,
  invalid = false,
  duplicatePolicy = "reject",
  separators = ["Enter"],
  enablePasteSplit = true,
  validation,
  labels,
  id,
  class: className,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: TagInputProps) => {
  const isControlled = valueProp !== undefined;
  const [internalTags, setInternalTags] = useState<TagInputTag[]>(defaultValue);
  const tags = isControlled ? valueProp : internalTags;

  const [draft, setDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [focusedTagId, setFocusedTagId] = useState<string | null>(null);
  const composingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = id ? `${id}-error` : undefined;

  useEffect(() => {
    if (isControlled && valueProp) {
      setInternalTags((current) => syncTagsFromValueProp(current, valueProp));
    }
  }, [isControlled, valueProp]);

  const setTags = (next: TagInputTag[]) => {
    if (!isControlled) {
      setInternalTags(next);
    }
    onValueChange?.(next);
  };

  const commitDraft = (raw = draft): boolean => {
    const normalized = normalizeTagValue(raw);
    if (!normalized) {
      setDraft("");
      setErrorMessage(null);
      return false;
    }

    const validationError = validateTagCandidate(normalized, tags, validation);
    if (validationError) {
      setErrorMessage(validationError);
      return false;
    }

    const merged = mergeTagIntoList(tags, normalized, duplicatePolicy);
    if (merged.rejected) {
      setErrorMessage(labels?.invalidTag ?? "Tag already exists or is invalid.");
      return false;
    }

    setTags(merged.tags);
    setDraft("");
    setErrorMessage(null);
    return true;
  };

  const commitMany = (values: string[]) => {
    let next = tags;
    let hadError = false;

    for (const raw of values) {
      const normalized = normalizeTagValue(raw);
      if (!normalized) continue;
      const validationError = validateTagCandidate(normalized, next, validation);
      if (validationError) {
        hadError = true;
        setErrorMessage(validationError);
        continue;
      }
      const merged = mergeTagIntoList(next, normalized, duplicatePolicy);
      if (merged.rejected) {
        hadError = true;
        setErrorMessage(labels?.invalidTag ?? "Tag already exists or is invalid.");
        continue;
      }
      next = merged.tags;
    }

    if (next !== tags) {
      setTags(next);
      setDraft("");
      if (!hadError) {
        setErrorMessage(null);
      }
    }
  };

  const removeTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    setFocusedTagId(null);
    inputRef.current?.focus();
  };

  const removeLastTag = () => {
    if (tags.length === 0) return;
    const last = tags[tags.length - 1]!;
    removeTag(last.id);
  };

  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (composingRef.current) return;

    if (separatorTriggersCommit(event as unknown as KeyboardEvent, separators)) {
      event.preventDefault();
      commitDraft();
      return;
    }

    if (event.key === "Backspace" && draft === "" && !focusedTagId) {
      event.preventDefault();
      removeLastTag();
      return;
    }

    if (event.key === "Backspace" && draft === "" && focusedTagId) {
      event.preventDefault();
      removeTag(focusedTagId);
      return;
    }

    if (event.key === "ArrowLeft" && draft === "" && tags.length > 0) {
      event.preventDefault();
      const index = focusedTagId
        ? Math.max(0, tags.findIndex((tag) => tag.id === focusedTagId) - 1)
        : tags.length - 1;
      setFocusedTagId(tags[index]?.id ?? null);
      return;
    }

    if (event.key === "ArrowRight" && draft === "" && focusedTagId) {
      event.preventDefault();
      const index = tags.findIndex((tag) => tag.id === focusedTagId);
      const next = tags[index + 1];
      if (next) {
        setFocusedTagId(next.id);
      } else {
        setFocusedTagId(null);
        inputRef.current?.focus();
      }
    }

    if (event.key === "Delete" && focusedTagId) {
      event.preventDefault();
      removeTag(focusedTagId);
    }
  };

  const handlePaste = (event: JSX.TargetedClipboardEvent<HTMLInputElement>) => {
    if (!enablePasteSplit) return;
    const text = event.clipboardData?.getData("text/plain") ?? "";
    if (!text) return;
    const parts = splitPastedTagValues(text, separators);
    if (parts.length <= 1) return;
    event.preventDefault();
    commitMany(parts);
  };

  const describedBy =
    [ariaDescribedBy, errorMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <div data-slot="tag-input" class={cn("grid gap-1.5", className)}>
      <ChipFieldContainer
        id={id}
        role="group"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
        invalid={invalid || Boolean(errorMessage)}
      >
        {tags.map((tag) => {
          const removeLabel = labels?.removeTag?.(tag) ?? `Remove tag ${tag.value}`;
          const isFocused = focusedTagId === tag.id;
          return (
            <RemovableChip
              key={tag.id}
              data-tag-id={tag.id}
              data-focused={isFocused ? "true" : undefined}
              tabIndex={draft === "" ? 0 : -1}
              removeLabel={removeLabel}
              disabled={disabled}
              class={isFocused ? "ring-2 ring-ring/50" : undefined}
              onFocus={() => setFocusedTagId(tag.id)}
              onRemove={() => removeTag(tag.id)}
            >
              {tag.value}
            </RemovableChip>
          );
        })}
        <input
          ref={inputRef}
          data-slot="tag-input-field"
          type="text"
          class="placeholder:text-muted-foreground min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={draft}
          disabled={disabled}
          placeholder={tags.length === 0 ? labels?.inputPlaceholder : undefined}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={describedBy}
          onInput={(event) => {
            setDraft(event.currentTarget.value);
            if (errorMessage) {
              setErrorMessage(null);
            }
            setFocusedTagId(null);
          }}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setFocusedTagId(null)}
        />
      </ChipFieldContainer>
      {errorMessage ? (
        <p id={errorId} role="alert" class="text-destructive text-xs" data-slot="tag-input-error">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
