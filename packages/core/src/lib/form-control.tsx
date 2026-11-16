import type { JSX, RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";

/** Restore component state when a parent `<form>` fires `reset`. */
export const useFormReset = (nodeRef: RefObject<HTMLElement | null>, onReset: () => void) => {
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;

  useEffect(() => {
    const form = nodeRef.current?.closest("form");
    if (!form) return;
    const handleReset = () => {
      onResetRef.current();
    };
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [nodeRef]);
};

type InputAttr<Key extends keyof JSX.IntrinsicElements["input"]> =
  JSX.IntrinsicElements["input"][Key];

export type FormMirrorInputProps = {
  name?: InputAttr<"name">;
  value?: InputAttr<"value">;
  checked?: InputAttr<"checked">;
  disabled?: InputAttr<"disabled">;
  required?: InputAttr<"required">;
  type?: "text" | "checkbox" | "radio";
  defaultValue?: InputAttr<"defaultValue">;
  defaultChecked?: InputAttr<"defaultChecked">;
  slot?: string;
  onReset?: () => void;
};

/**
 * Visually hidden native field so custom controls participate in FormData,
 * constraint validation, and form reset. `sr-only` keeps the control rendered,
 * which `display: none` would exclude from `checkValidity()`.
 */
export const FormMirrorInput = ({
  name,
  value = "",
  checked = false,
  disabled,
  required,
  type = "text",
  defaultValue = "",
  defaultChecked = false,
  slot = "form-control",
  onReset,
}: FormMirrorInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  useFormReset(ref, () => onReset?.());

  if (type === "text") {
    return (
      <input
        ref={ref}
        type="text"
        aria-hidden="true"
        tabIndex={-1}
        class="sr-only"
        data-slot={slot}
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        onChange={() => {}}
      />
    );
  }

  return (
    <input
      ref={ref}
      type={type}
      aria-hidden="true"
      tabIndex={-1}
      class="sr-only"
      data-slot={slot}
      name={name}
      value={value == null || value === "" ? "on" : value}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      required={required}
      onChange={() => {}}
    />
  );
};
