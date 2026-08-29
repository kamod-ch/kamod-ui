import { useState } from "preact/hooks";

export type ControllableStateOptions<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
};

export const useControllableState = <T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, (next: T | ((previous: T) => T)) => void] => {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled ? value : uncontrolled;

  const setValue = (next: T | ((previous: T) => T)) => {
    const resolved = typeof next === "function" ? (next as (previous: T) => T)(current) : next;
    if (!isControlled) setUncontrolled(resolved);
    onChange?.(resolved);
  };

  return [current, setValue];
};
