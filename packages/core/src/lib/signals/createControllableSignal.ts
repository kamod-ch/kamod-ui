import { type Signal, signal, untracked } from "@preact/signals";

export type ControllableSignal<T> = {
  state: Signal<T>;
  setState: (next: T) => void;
  isControlled: boolean;
  /** Apply an external value without notifying `onChange`. */
  sync: (next: T) => void;
};

export type ControllableSignalOptions<T> = {
  /**
   * Current controlled value. `undefined` means uncontrolled unless `controlled` is set,
   * so a value of type `T | undefined` can still be controlled.
   */
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
  /** Keep `value: undefined` in controlled mode when `T` includes `undefined`. */
  controlled?: boolean;
};

export const createControllableSignal = <T>({
  value,
  defaultValue,
  onChange,
  controlled,
}: ControllableSignalOptions<T>): ControllableSignal<T> => {
  const isControlled = controlled ?? value !== undefined;
  const local = signal<T>((isControlled ? value : defaultValue) as T);

  const setState = (next: T) => {
    const current = untracked(() => local.value);
    if (Object.is(current, next)) return;
    if (!isControlled) local.value = next;
    onChange?.(next);
  };

  const sync = (next: T) => {
    if (
      Object.is(
        untracked(() => local.value),
        next,
      )
    )
      return;
    local.value = next;
  };

  return {
    state: local,
    setState,
    isControlled,
    sync,
  };
};
