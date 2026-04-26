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
