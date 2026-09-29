import type {
  ParsedResizableItem,
  ResizablePanelDefinition,
  ResizableSizePercent,
} from "./resizable-types";

export const RESIZABLE_SIZE_UNIT = "percent" as const;
export const RESIZABLE_SIZE_SUM = 100;
const SIZE_TOLERANCE = 0.01;

export const sumResizableSizes = (sizes: readonly number[]): number =>
  sizes.reduce((total, size) => total + size, 0);

export const sizesApproximatelyEqual = (
  sizes: readonly number[],
  target = RESIZABLE_SIZE_SUM,
): boolean =>
  Math.abs(sumResizableSizes(sizes) - target) <= SIZE_TOLERANCE * Math.max(1, sizes.length);

export const normalizeResizableSizes = (
  sizes: readonly number[],
  count: number,
): ResizableSizePercent[] => {
  if (count <= 0) return [];
  if (sizes.length !== count) {
    throw new Error(`ResizablePanelGroup expected ${count} sizes, received ${sizes.length}.`);
  }
  const total = sumResizableSizes(sizes);
  if (total <= 0) {
    const even = RESIZABLE_SIZE_SUM / count;
    return Array.from({ length: count }, () => even);
  }
  return sizes.map((size) => (size / total) * RESIZABLE_SIZE_SUM);
};

export const createEvenSizes = (count: number): ResizableSizePercent[] => {
  if (count <= 0) return [];
  const even = RESIZABLE_SIZE_SUM / count;
  return Array.from({ length: count }, () => even);
};

export const validateResizableConstraints = (
  panels: readonly Pick<ResizablePanelDefinition, "id" | "minSize" | "maxSize">[],
): string | null => {
  for (const panel of panels) {
    if (panel.minSize > panel.maxSize) {
      return `ResizablePanel "${panel.id}": minSize (${panel.minSize}%) exceeds maxSize (${panel.maxSize}%).`;
    }
    if (panel.minSize < 0 || panel.maxSize > RESIZABLE_SIZE_SUM) {
      return `ResizablePanel "${panel.id}": minSize/maxSize must stay within 0–100 (%).`;
    }
  }

  const minSum = panels.reduce((total, panel) => total + panel.minSize, 0);
  if (minSum > RESIZABLE_SIZE_SUM + SIZE_TOLERANCE) {
    return `Resizable panel minSize values sum to ${minSum}% — cannot fit in 100%.`;
  }

  const maxSum = panels.reduce((total, panel) => total + panel.maxSize, 0);
  if (maxSum < RESIZABLE_SIZE_SUM - SIZE_TOLERANCE) {
    return `Resizable panel maxSize values sum to ${maxSum}% — cannot reach 100%.`;
  }

  return null;
};

export const resizeAdjacentPanels = (
  sizes: readonly number[],
  handleIndex: number,
  deltaPercent: number,
  panels: readonly Pick<ResizablePanelDefinition, "minSize" | "maxSize">[],
): number[] => {
  const leftIndex = handleIndex;
  const rightIndex = handleIndex + 1;
  if (rightIndex >= sizes.length || leftIndex < 0) return [...sizes];

  const transfer = deltaPercent;
  const leftPanel = panels[leftIndex]!;
  const rightPanel = panels[rightIndex]!;

  let nextLeft = sizes[leftIndex]! + transfer;
  nextLeft = Math.max(leftPanel.minSize, Math.min(leftPanel.maxSize, nextLeft));

  let actualTransfer = nextLeft - sizes[leftIndex]!;
  let nextRight = sizes[rightIndex]! - actualTransfer;
  nextRight = Math.max(rightPanel.minSize, Math.min(rightPanel.maxSize, nextRight));

  actualTransfer = sizes[rightIndex]! - nextRight;
  nextLeft = sizes[leftIndex]! + actualTransfer;
  nextLeft = Math.max(leftPanel.minSize, Math.min(leftPanel.maxSize, nextLeft));
  nextRight = sizes[rightIndex]! - (nextLeft - sizes[leftIndex]!);

  const next = [...sizes];
  next[leftIndex] = nextLeft;
  next[rightIndex] = nextRight;
  return next;
};

export const setAdjacentPanelsExtreme = (
  sizes: readonly number[],
  handleIndex: number,
  extreme: "start" | "end",
  panels: readonly Pick<ResizablePanelDefinition, "minSize" | "maxSize">[],
): number[] => {
  const leftIndex = handleIndex;
  const rightIndex = handleIndex + 1;
  if (rightIndex >= sizes.length) return [...sizes];

  const leftPanel = panels[leftIndex]!;
  const rightPanel = panels[rightIndex]!;
  const pairTotal = sizes[leftIndex]! + sizes[rightIndex]!;

  let targetLeft =
    extreme === "start"
      ? leftPanel.minSize
      : Math.min(leftPanel.maxSize, pairTotal - rightPanel.minSize);

  let targetRight = pairTotal - targetLeft;
  if (targetRight < rightPanel.minSize) {
    targetRight = rightPanel.minSize;
    targetLeft = pairTotal - targetRight;
  } else if (targetRight > rightPanel.maxSize) {
    targetRight = rightPanel.maxSize;
    targetLeft = pairTotal - targetRight;
  }

  targetLeft = Math.max(leftPanel.minSize, Math.min(leftPanel.maxSize, targetLeft));
  targetRight = pairTotal - targetLeft;

  const next = [...sizes];
  next[leftIndex] = targetLeft;
  next[rightIndex] = targetRight;
  return next;
};

export const getHandleValueRange = (
  sizes: readonly number[],
  handleIndex: number,
  panels: readonly Pick<ResizablePanelDefinition, "minSize" | "maxSize">[],
): { min: number; max: number; now: number } => {
  const leftIndex = handleIndex;
  const rightIndex = handleIndex + 1;
  const pairTotal = sizes[leftIndex]! + sizes[rightIndex]!;
  const leftPanel = panels[leftIndex]!;
  const rightPanel = panels[rightIndex]!;

  const min = leftPanel.minSize;
  const max = Math.min(leftPanel.maxSize, pairTotal - rightPanel.minSize);

  return {
    min,
    max: Math.max(min, max),
    now: sizes[leftIndex]!,
  };
};

export const parseResizableChildren = (nodes: readonly unknown[]): ParsedResizableItem[] => {
  const items: ParsedResizableItem[] = [];
  let panelCount = 0;

  for (const node of nodes) {
    if (!node || typeof node !== "object" || !("type" in node)) continue;
    const element = node as { type: unknown; props?: Record<string, unknown> };
    const marker = element.type as {
      __kamodResizablePanel?: boolean;
      __kamodResizableHandle?: boolean;
    };

    if (marker.__kamodResizablePanel) {
      const props = element.props ?? {};
      items.push({
        kind: "panel",
        id: String(props.id ?? ""),
        minSize: Number(props.minSize ?? 0),
        maxSize: Number(props.maxSize ?? RESIZABLE_SIZE_SUM),
        children: props.children as ResizablePanelDefinition["children"],
        class: props.class as string | undefined,
      });
      panelCount += 1;
      continue;
    }

    if (marker.__kamodResizableHandle) {
      if (panelCount === 0) {
        throw new Error("ResizableHandle must follow a ResizablePanel.");
      }
      const props = element.props ?? {};
      items.push({
        kind: "handle",
        handleIndex: panelCount - 1,
        label: props.label as string | undefined,
        disabled: Boolean(props.disabled),
        class: props.class as string | undefined,
      });
    }
  }

  const parsedPanels = items.filter((item) => item.kind === "panel");
  const parsedHandles = items.filter((item) => item.kind === "handle");

  if (parsedPanels.length < 2) {
    throw new Error("ResizablePanelGroup requires at least two ResizablePanel children.");
  }
  if (parsedHandles.length !== parsedPanels.length - 1) {
    throw new Error(
      `ResizablePanelGroup expects ${parsedPanels.length - 1} ResizableHandle elements, received ${parsedHandles.length}.`,
    );
  }

  for (let index = 0; index < items.length; index += 1) {
    const expectedKind = index % 2 === 0 ? "panel" : "handle";
    if (items[index]?.kind !== expectedKind) {
      throw new Error(
        "ResizablePanelGroup children must alternate ResizablePanel and ResizableHandle.",
      );
    }
  }

  for (const panel of parsedPanels) {
    if (!panel.id) {
      throw new Error("Each ResizablePanel requires a stable id prop.");
    }
  }

  const constraintError = validateResizableConstraints(parsedPanels);
  if (constraintError) {
    throw new Error(constraintError);
  }

  return items;
};

export const pixelDeltaToPercent = (deltaPixels: number, containerSize: number): number => {
  if (containerSize <= 0) return 0;
  return (deltaPixels / containerSize) * RESIZABLE_SIZE_SUM;
};
