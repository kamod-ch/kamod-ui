import { signal, type Signal } from "@preact/signals";

type CreateControllableSignalOptions<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
};

export type ControllableSignal<T> = {
  state: Signal<T>;
  setState: (next: T) => void;
  isControlled: boolean;
};

export const createControllableSignal = <T>({
  value,
  defaultValue,
  onChange
}: CreateControllableSignalOptions<T>): ControllableSignal<T> => {
  const isControlled = value !== undefined;
  const local = signal<T>((value ?? defaultValue) as T);

  const setState = (next: T) => {
    if (!isControlled) {
      local.value = next;
    }
    onChange?.(next);
  };

  return {
    state: local,
    setState,
    isControlled
  };
};
