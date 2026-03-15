import "@testing-library/jest-dom/vitest";

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

// jsdom does not implement ResizeObserver; ScrollBar relies on it for thumb sizing.
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
