import { expect, it, vi } from "vitest";
import { createPreviewLoadQueue } from "./preview-load-queue";

function queue(limit = 1) {
  let pending: (() => void) | undefined;
  const cancel = vi.fn(() => (pending = undefined));
  const loads = createPreviewLoadQueue((callback) => {
    pending = callback;
    return cancel;
  }, limit);
  return {
    ...loads,
    cancel,
    drain: () => {
      const callback = pending;
      pending = undefined;
      callback?.();
    },
  };
}

it("starts at most two previews and resumes in order as slots are released", () => {
  const loads = queue(2);
  const started: number[] = [];
  const stops = [1, 2, 3, 4].map((id) => loads.enqueue(() => started.push(id)));
  expect(started).toEqual([]);
  loads.drain();
  expect(started).toEqual([1, 2]);
  loads.drain();
  expect(started).toEqual([1, 2]);
  stops[0]();
  stops[0]();
  loads.drain();
  expect(started).toEqual([1, 2, 3]);
  stops[1]();
  loads.drain();
  expect(started).toEqual([1, 2, 3, 4]);
  stops.forEach((stop) => stop());
});

it("drops passed-over previews and cancels idle work when the queue becomes empty", () => {
  const loads = queue();
  const start = vi.fn();
  const stop = loads.enqueue(start);
  stop();
  loads.drain();
  expect(start).not.toHaveBeenCalled();
  expect(loads.cancel).toHaveBeenCalledOnce();
});

it("cancelled active previews free their slots and cancelled queued work never starts", () => {
  const loads = queue(2);
  const started: number[] = [];
  const stops = [1, 2, 3, 4].map((id) => loads.enqueue(() => started.push(id)));
  loads.drain();
  stops[2]();
  stops[0]();
  loads.drain();
  expect(started).toEqual([1, 2, 4]);
  stops.forEach((stop) => stop());
});

it("a failed start cannot retain a slot or block later previews", () => {
  const loads = queue();
  const fail = loads.enqueue(() => {
    throw new Error("failed start");
  });
  const start = vi.fn();
  const stop = loads.enqueue(start);
  expect(loads.drain).toThrow("failed start");
  fail();
  loads.drain();
  expect(start).toHaveBeenCalledOnce();
  stop();
});

it("serializes preview startup by default until the active document is ready", () => {
  const loads = queue();
  const started: number[] = [];
  const first = loads.enqueue(() => started.push(1));
  const second = loads.enqueue(() => started.push(2));
  loads.drain();
  loads.drain();
  expect(started).toEqual([1]);
  first();
  loads.drain();
  expect(started).toEqual([1, 2]);
  second();
});
