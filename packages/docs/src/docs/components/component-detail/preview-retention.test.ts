import { expect, it, vi } from "vitest";
import { createPreviewRetention } from "./preview-retention";

it("evicts the oldest completed offscreen document when the cache fills", () => {
  const pool = createPreviewRetention(2);
  const evictions = [vi.fn(), vi.fn(), vi.fn()];
  const first = pool.retain(evictions[0], false);
  first.complete();
  const second = pool.retain(evictions[1], false);
  second.complete();
  const third = pool.retain(evictions[2], true);
  expect(evictions[0]).toHaveBeenCalledOnce();
  expect(evictions[1]).not.toHaveBeenCalled();
  expect(evictions[2]).not.toHaveBeenCalled();
  second.release();
  third.release();
});

it("keeps a recently revisited document and never aborts startup or visible examples", () => {
  const pool = createPreviewRetention(2);
  const firstEvicted = vi.fn();
  const secondEvicted = vi.fn();
  const first = pool.retain(firstEvicted, false);
  first.complete();
  const second = pool.retain(secondEvicted, false);
  second.complete();
  first.setVisible(true);
  first.setVisible(false);
  const thirdEvicted = vi.fn();
  const third = pool.retain(thirdEvicted, true);
  expect(secondEvicted).toHaveBeenCalledOnce();
  expect(firstEvicted).not.toHaveBeenCalled();
  const fourthEvicted = vi.fn();
  const fourth = pool.retain(fourthEvicted, true);
  expect(firstEvicted).toHaveBeenCalledOnce();
  expect(thirdEvicted).not.toHaveBeenCalled();
  expect(fourthEvicted).not.toHaveBeenCalled();
  third.release();
  fourth.release();
});

it("defers trimming protected documents until one finishes outside the viewport", () => {
  const pool = createPreviewRetention(1);
  const firstEvicted = vi.fn();
  const secondEvicted = vi.fn();
  const first = pool.retain(firstEvicted, false);
  const second = pool.retain(secondEvicted, true);
  expect(firstEvicted).not.toHaveBeenCalled();
  first.complete();
  expect(firstEvicted).toHaveBeenCalledOnce();
  expect(secondEvicted).not.toHaveBeenCalled();
  first.release();
  second.release();
});
