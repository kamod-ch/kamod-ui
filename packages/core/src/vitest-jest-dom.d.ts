import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

// @testing-library/jest-dom@7 still augments Vitest's pre-v5 Assertion<T>
// shape. Vitest 5 uses Assertion<Result, Value>, so bridge the matchers here.
declare module "vitest" {
  interface Assertion<R, T> extends TestingLibraryMatchers<any, R> {}
}
