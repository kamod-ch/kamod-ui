import { act, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { FileUploadItem } from "./FileUploadItem";
import { FileUploadList } from "./FileUploadList";
import type { UploadAdapter } from "./file-upload-manager-types";
import { validateUploadFile } from "./file-upload-manager-utils";
import { useUploadQueue } from "./use-upload-queue";

const createFile = (name: string, size = 128, type = "text/plain") => {
  const content = new Uint8Array(size);
  return new File([content], name, { type, lastModified: 1 });
};

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const QueueHarness = ({
  adapter,
  concurrency = 2,
  onChange,
  initialFiles,
}: {
  adapter: UploadAdapter;
  concurrency?: number;
  onChange?: ReturnType<typeof vi.fn>;
  initialFiles?: File[];
}) => {
  const [started, setStarted] = useState(false);
  const queue = useUploadQueue({ adapter, concurrency, onChange });

  const start = () => {
    if (started) return;
    setStarted(true);
    queue.enqueue(
      initialFiles ?? [createFile("one.txt"), createFile("two.txt"), createFile("three.txt")],
    );
  };

  return (
    <div>
      <button type="button" onClick={start}>
        Start uploads
      </button>
      <ul data-testid="queue-items">
        {queue.items.map((item) => (
          <li
            key={item.id}
            data-item-id={item.id}
            data-attempt-id={item.attemptId}
            data-status={item.status}
          >
            <span>{item.name}</span>
            <button type="button" data-cancel={item.id} onClick={() => queue.cancel(item.id)}>
              Cancel {item.name}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        data-action="retry"
        onClick={() => queue.retry(queue.items[0]?.id ?? "")}
      >
        Retry first
      </button>
      <button
        type="button"
        data-action="remove"
        onClick={() => queue.remove(queue.items[0]?.id ?? "")}
      >
        Remove first
      </button>
    </div>
  );
};

describe("file-upload-manager utils", () => {
  it("validates file size and count", () => {
    const file = createFile("large.txt", 2048);
    expect(validateUploadFile(file, { maxFileSize: 1024 }, 0).valid).toBe(false);
    expect(validateUploadFile(file, { maxFiles: 1 }, 1).valid).toBe(false);
  });

  it("treats same-named files as separate validation targets", () => {
    const a = createFile("report.pdf");
    const b = createFile("report.pdf");
    expect(validateUploadFile(a, { maxFiles: 2 }, 0).valid).toBe(true);
    expect(validateUploadFile(b, { maxFiles: 2 }, 1).valid).toBe(true);
  });
});

describe("useUploadQueue", () => {
  it("respects concurrency limits", async () => {
    const pending = [deferred<void>(), deferred<void>(), deferred<void>()];
    let call = 0;
    const adapter: UploadAdapter = async ({ signal }) => {
      const current = call;
      call += 1;
      await pending[current]?.promise;
      if (signal.aborted) {
        throw new DOMException("Upload aborted", "AbortError");
      }
      return { key: `file-${current}` };
    };

    render(<QueueHarness adapter={adapter} concurrency={2} />);
    fireEvent.click(screen.getByRole("button", { name: "Start uploads" }));

    await waitFor(() => {
      expect(document.querySelectorAll('[data-status="uploading"]').length).toBe(2);
      expect(document.querySelectorAll('[data-status="queued"]').length).toBe(1);
    });

    await act(async () => {
      pending[0]?.resolve();
      pending[1]?.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(document.querySelectorAll('[data-status="uploading"]').length).toBe(1);
    });

    await act(async () => {
      pending[2]?.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(document.querySelectorAll('[data-status="success"]').length).toBe(3);
    });
  });

  it("cancels queued and uploading entries", async () => {
    const gate = deferred<void>();
    const adapter: UploadAdapter = ({ signal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener(
          "abort",
          () => reject(new DOMException("Upload aborted", "AbortError")),
          { once: true },
        );
        gate.promise.then(() => resolve({ key: "done" }));
      });

    render(
      <QueueHarness
        adapter={adapter}
        concurrency={1}
        initialFiles={[createFile("queued.txt"), createFile("uploading.txt")]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Start uploads" }));

    await waitFor(() => {
      expect(document.querySelectorAll('[data-status="uploading"]').length).toBe(1);
      expect(document.querySelectorAll('[data-status="queued"]').length).toBe(1);
    });

    const queuedId = document.querySelector('[data-status="queued"]')?.getAttribute("data-item-id");
    const uploadingId = document
      .querySelector('[data-status="uploading"]')
      ?.getAttribute("data-item-id");

    fireEvent.click(document.querySelector(`[data-cancel="${queuedId}"]`)!);
    fireEvent.click(document.querySelector(`[data-cancel="${uploadingId}"]`)!);

    await waitFor(() => {
      expect(document.querySelectorAll('[data-status="canceled"]').length).toBe(2);
    });
  });

  it("retries with a new attempt id and ignores stale adapter results", async () => {
    const firstAttempt = deferred<void>();
    const secondAttempt = deferred<void>();
    let attempts = 0;

    const adapter: UploadAdapter = async () => {
      attempts += 1;
      if (attempts === 1) {
        await firstAttempt.promise;
        throw new Error("First attempt failed.");
      }
      await secondAttempt.promise;
      return { key: "ok" };
    };

    render(
      <QueueHarness adapter={adapter} concurrency={1} initialFiles={[createFile("retry.txt")]} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Start uploads" }));

    await waitFor(() => expect(document.querySelector('[data-status="uploading"]')).toBeTruthy());
    const firstAttemptId = document
      .querySelector("[data-attempt-id]")
      ?.getAttribute("data-attempt-id");

    await act(async () => {
      firstAttempt.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(document.querySelector('[data-status="error"]')).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: "Retry first" }));
    const secondAttemptId = document
      .querySelector("[data-attempt-id]")
      ?.getAttribute("data-attempt-id");
    expect(secondAttemptId).not.toBe(firstAttemptId);

    await waitFor(() => expect(document.querySelector('[data-status="uploading"]')).toBeTruthy());

    await act(async () => {
      firstAttempt.resolve();
      await Promise.resolve();
    });

    await act(async () => {
      secondAttempt.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(document.querySelector('[data-status="success"]')).toBeTruthy());
  });

  it("aborts before removing an uploading entry", async () => {
    const gate = deferred<void>();
    let aborted = false;
    const adapter: UploadAdapter = ({ signal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => {
          aborted = true;
          reject(new DOMException("Upload aborted", "AbortError"));
        });
        gate.promise.then(() => resolve({ key: "done" }));
      });

    render(
      <QueueHarness
        adapter={adapter}
        concurrency={1}
        initialFiles={[createFile("remove-me.txt")]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Start uploads" }));

    await waitFor(() => expect(document.querySelector('[data-status="uploading"]')).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: "Remove first" }));

    await waitFor(() => {
      expect(aborted).toBe(true);
      expect(document.querySelectorAll("[data-item-id]").length).toBe(0);
    });
  });

  it("does not call onChange after unmount", async () => {
    const gate = deferred<void>();
    const adapter: UploadAdapter = () => gate.promise.then(() => ({ key: "done" }));
    const onChange = vi.fn();

    const { unmount } = render(
      <QueueHarness
        adapter={adapter}
        concurrency={1}
        onChange={onChange}
        initialFiles={[createFile("cleanup.txt")]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start uploads" }));
    await waitFor(() => expect(onChange.mock.calls.length).toBeGreaterThan(0));

    const callsBeforeUnmount = onChange.mock.calls.length;
    unmount();

    await act(async () => {
      gate.resolve();
      await Promise.resolve();
    });

    expect(onChange.mock.calls.length).toBe(callsBeforeUnmount);
  });
});

describe("FileUploadItem", () => {
  it("renders validation errors per file", () => {
    render(
      <FileUploadList>
        <FileUploadItem
          entry={{
            id: "f1",
            attemptId: "a1",
            name: "toolarge.bin",
            size: 9999,
            status: "error",
            errorMessage: "File exceeds the 1 KB limit.",
          }}
        />
      </FileUploadList>,
    );

    expect(screen.getByText("File exceeds the 1 KB limit.")).toBeTruthy();
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("labels upload progress accessibly without spamming live region on progress ticks", () => {
    const { rerender } = render(
      <FileUploadList>
        <FileUploadItem
          entry={{
            id: "f1",
            attemptId: "a1",
            name: "photo.png",
            size: 500,
            status: "uploading",
            progress: 10,
          }}
        />
      </FileUploadList>,
    );

    const progress = screen.getByRole("progressbar", { name: /Upload progress for photo.png/i });
    expect(progress).toHaveAttribute("aria-valuenow", "10");

    rerender(
      <FileUploadList>
        <FileUploadItem
          entry={{
            id: "f1",
            attemptId: "a1",
            name: "photo.png",
            size: 500,
            status: "uploading",
            progress: 80,
          }}
        />
      </FileUploadList>,
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "80");
    expect(document.querySelectorAll('[aria-live="polite"]').length).toBe(1);
  });
});
