import { signal } from "@preact/signals";

export const createRovingFocus = (count: number, initialIndex = -1) => {
  const activeIndex = signal(initialIndex);

  const clamp = (index: number) => {
    if (count <= 0) return -1;
    if (index < 0) return count - 1;
    if (index >= count) return 0;
    return index;
  };

  return {
    activeIndex,
    moveNext: () => {
      activeIndex.value = clamp(activeIndex.value + 1);
    },
    movePrev: () => {
      activeIndex.value = clamp(activeIndex.value - 1);
    },
    moveFirst: () => {
      activeIndex.value = count > 0 ? 0 : -1;
    },
    moveLast: () => {
      activeIndex.value = count > 0 ? count - 1 : -1;
    },
    set: (index: number) => {
      activeIndex.value = clamp(index);
    }
  };
};
