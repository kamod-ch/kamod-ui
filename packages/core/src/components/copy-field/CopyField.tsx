import { useId } from "preact/hooks";
import { cn } from "../../lib/utils";
import { CheckIcon, CopyIcon, useCopyToClipboard } from "../copyable";
import { Field, FieldDescription, FieldLabel } from "../field";
import { InputGroup, InputGroupButton, InputGroupInput } from "../input-group";
import type { CopyFieldProps } from "./copy-field-types";
import { truncateCopyFieldValue } from "./copy-field-utils";

export const CopyField = ({
  value,
  label,
  description,
  id: idProp,
  class: className,
  truncate = "middle",
  maxDisplayLength = 48,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  errorLabel,
  fallbackHint = "Text selected — press Ctrl+C or ⌘C to copy.",
  disabled = false,
  invalid = false,
}: CopyFieldProps) => {
  const generatedId = useId();
  const fieldId = idProp ?? generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const { status, errorMessage, isCopying, copy } = useCopyToClipboard();
  const displayValue = truncateCopyFieldValue(value, maxDisplayLength, truncate);
  const isTruncated = displayValue !== value;

  const selectForManualCopy = () => {
    const input = document.getElementById(fieldId) as HTMLInputElement | null;
    if (!input) return;
    input.focus();
    input.select();
    input.setSelectionRange(0, value.length);
  };

  const handleCopy = () => {
    if (disabled || isCopying) return;
    void copy(value, selectForManualCopy);
  };

  const showError = status === "error";
  const buttonLabel =
    status === "copied" ? copiedLabel : showError ? (errorLabel ?? copyLabel) : copyLabel;

  return (
    <Field
      class={cn("min-w-0 max-w-full", className)}
      invalid={invalid || showError}
      data-slot="copy-field"
    >
      {label ? <FieldLabel htmlFor={fieldId}>{label}</FieldLabel> : null}
      {description ? <FieldDescription id={hintId}>{description}</FieldDescription> : null}
      <InputGroup
        aria-describedby={
          [hintId, showError ? errorId : undefined].filter(Boolean).join(" ") || undefined
        }
      >
        <InputGroupInput
          id={fieldId}
          readOnly
          type="text"
          autoComplete="off"
          spellcheck={false}
          value={displayValue}
          title={isTruncated ? value : undefined}
          aria-invalid={showError || invalid || undefined}
          disabled={disabled}
          class="font-mono text-sm"
          onFocus={(event) => {
            event.currentTarget.select();
          }}
        />
        <InputGroupButton
          size="icon-sm"
          aria-label={buttonLabel}
          disabled={disabled || isCopying}
          data-copy-state={status}
          onClick={handleCopy}
        >
          {status === "copied" ? <CheckIcon /> : <CopyIcon />}
          <span class="sr-only">{buttonLabel}</span>
        </InputGroupButton>
      </InputGroup>
      {showError ? (
        <p id={errorId} role="alert" class="text-destructive text-xs" data-slot="copy-field-error">
          {errorMessage}
        </p>
      ) : null}
      {showError ? (
        <p class="text-muted-foreground text-xs" data-slot="copy-field-fallback-hint">
          {fallbackHint}
        </p>
      ) : null}
    </Field>
  );
};
