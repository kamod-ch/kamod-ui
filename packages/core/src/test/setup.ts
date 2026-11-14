import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

// Do not use `@testing-library/jest-dom/vitest` here: it resolves `vitest` from
// jest-dom's pnpm folder and can pick another workspace vitest (e.g. v4 in demo),
// so matchers would attach to the wrong `expect` while tests run on v3.
expect.extend(matchers);

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

// jsdom does not implement ResizeObserver; ScrollBar relies on it for thumb sizing.
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Embla carousel activates an IntersectionObserver during hydration.
globalThis.IntersectionObserver =
  IntersectionObserverStub as unknown as typeof IntersectionObserver;

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
