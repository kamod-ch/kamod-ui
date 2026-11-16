import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import type { ConsentState, ConsentStorage } from "./consentStorage";
import { type ConsentCategory, ConsentManager, ConsentManagerTrigger, useConsent } from "./index";

const categories: ConsentCategory[] = [
  {
    id: "necessary",
    title: "Necessary",
    description: "Keeps the site working.",
    required: true,
    details: "Session and security.",
  },
  {
    id: "statistics",
    title: "Statistics",
    description: "Anonymous usage.",
    details: "Page views.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Ads from partners.",
  },
];

const savedState = (categoriesMap: Record<string, boolean>, version = "1"): ConsentState => ({
  version,
  decidedAt: "2026-11-16T00:00:00.000Z",
  categories: categoriesMap,
});

const memoryStorage = (initial: string | null = null) => {
  let value = initial;
  let reads = 0;
  const storage: ConsentStorage & { reads: number; snapshot: () => string | null } = {
    get reads() {
      return reads;
    },
    get snapshot() {
      return () => value;
    },
    get() {
      reads += 1;
      return value;
    },
    set(_key, next) {
      value = next;
    },
  };
  return storage;
};

const renderManager = (
  storage: ConsentStorage = memoryStorage(),
  props: Partial<Parameters<typeof ConsentManager>[0]> = {},
) =>
  render(
    <ConsentManager version="1" categories={categories} storage={storage} {...props}>
      <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
    </ConsentManager>,
  );

const clearScrollLock = () => {
  document.body.removeAttribute("data-kamod-scroll-lock-count");
  document.body.removeAttribute("data-kamod-scroll-lock-body-overflow");
  document.body.removeAttribute("data-kamod-scroll-lock-body-padding-right");
  document.documentElement.removeAttribute("data-kamod-scroll-lock");
  document.documentElement.removeAttribute("data-kamod-scroll-lock-html-overflow");
  document.documentElement.removeAttribute("data-kamod-scroll-lock-html-scrollbar-gutter");
  document.documentElement.style.overflow = "";
  document.documentElement.style.scrollbarGutter = "";
  document.documentElement.style.removeProperty("--kamod-scroll-lock-gutter");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};

describe("ConsentManager", () => {
  afterEach(() => {
    clearScrollLock();
    localStorage.removeItem("kamod-consent-test");
  });

  it("opens when nothing is stored and focuses the first action", async () => {
    renderManager();

    const dialog = await screen.findByRole("dialog", { name: "Your privacy, your choice" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.querySelector('[data-slot="dialog-close"]')).not.toBeInTheDocument();

    const accept = screen.getByRole("button", { name: "Accept all" });
    const necessary = screen.getByRole("button", { name: "Necessary only" });
    expect(accept).toHaveClass("w-full");
    expect(necessary).toHaveClass("w-full");
    expect(accept).toHaveAttribute("data-size", necessary.getAttribute("data-size") ?? "");
    expect(document.querySelector("[data-slot='consent-manager-actions']")).toHaveClass(
      "flex",
      "flex-col",
      "gap-2",
    );
    await waitFor(() => expect(accept).toHaveFocus());
  });

  it("stays closed when the stored decision matches the version", async () => {
    const storage = memoryStorage(
      JSON.stringify(savedState({ necessary: true, statistics: false, marketing: true })),
    );
    renderManager(storage);

    await waitFor(() => expect(storage.reads).toBeGreaterThan(0));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens again when the version changes", async () => {
    const storage = memoryStorage(
      JSON.stringify(savedState({ necessary: true, statistics: false, marketing: false })),
    );
    const { rerender } = renderManager(storage);

    await waitFor(() => expect(storage.reads).toBeGreaterThan(0));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <ConsentManager version="2" categories={categories} storage={storage}>
        <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
      </ConsentManager>,
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("ignores broken or foreign storage and does not crash when storage throws", async () => {
    const samples = ["{", "null", "[]", JSON.stringify({ hello: true }), JSON.stringify(null)];
    for (const sample of samples) {
      const { unmount } = renderManager(memoryStorage(sample));
      expect(await screen.findByRole("dialog")).toBeInTheDocument();
      unmount();
      clearScrollLock();
    }

    const throwing: ConsentStorage = {
      get() {
        throw new Error("blocked");
      },
      set() {
        throw new Error("blocked");
      },
    };
    const onConsentChange = vi.fn();
    renderManager(throwing, { onConsentChange });
    fireEvent.click(await screen.findByRole("button", { name: "Accept all" }));
    expect(onConsentChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close on Escape or an overlay click", async () => {
    renderManager();
    const dialog = await screen.findByRole("dialog");

    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.keyDown(dialog, { key: "Escape" });
    fireEvent.pointerDown(dialog);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dialog-close"]')).not.toBeInTheDocument();
  });

  it("saves accept-all, necessary-only, and the current selection once each", async () => {
    const acceptStorage = memoryStorage();
    const onAccept = vi.fn();
    const acceptView = renderManager(acceptStorage, { onConsentChange: onAccept });
    fireEvent.click(await screen.findByRole("button", { name: "Accept all" }));
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onAccept.mock.calls[0]?.[0].categories).toEqual({
      necessary: true,
      statistics: true,
      marketing: true,
    });
    expect(JSON.parse(acceptStorage.snapshot() ?? "").categories.marketing).toBe(true);
    acceptView.unmount();
    clearScrollLock();

    const rejectStorage = memoryStorage();
    const onReject = vi.fn();
    const rejectView = renderManager(rejectStorage, { onConsentChange: onReject });
    fireEvent.click(await screen.findByRole("button", { name: "Necessary only" }));
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onReject.mock.calls[0]?.[0].categories).toEqual({
      necessary: true,
      statistics: false,
      marketing: false,
    });
    rejectView.unmount();
    clearScrollLock();

    const saveStorage = memoryStorage();
    const onSave = vi.fn();
    renderManager(saveStorage, { onConsentChange: onSave });
    fireEvent.click(await screen.findByRole("button", { name: "Settings" }));
    fireEvent.click(screen.getByRole("switch", { name: "Statistics" }));
    fireEvent.click(screen.getByRole("button", { name: "Save selection" }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0]?.[0].categories).toEqual({
      necessary: true,
      statistics: true,
      marketing: false,
    });
    expect(onSave.mock.calls[0]?.[0].version).toBe("1");
    expect(onSave.mock.calls[0]?.[0].decidedAt).toEqual(expect.any(String));
  });

  it("keeps a required category on", async () => {
    renderManager();
    fireEvent.click(await screen.findByRole("button", { name: "Settings" }));

    const required = screen.getByRole("switch", { name: "Necessary" });
    expect(required).toBeDisabled();
    expect(required).toHaveAttribute("aria-checked", "true");
    fireEvent.click(required);
    expect(required).toHaveAttribute("aria-checked", "true");

    const statistics = screen.getByRole("switch", { name: "Statistics" });
    const disclosure = screen.getByRole("button", { name: /Statistics/ });
    expect(disclosure).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(statistics);
    expect(disclosure).toHaveAttribute("aria-expanded", "false");
    expect(statistics).toHaveAttribute("aria-checked", "true");
  });

  it("opens settings from the trigger with the saved decision", async () => {
    const storage = memoryStorage();
    renderManager(storage);
    fireEvent.click(await screen.findByRole("button", { name: "Accept all" }));

    const trigger = screen.getByRole("button", { name: "Cookie settings" });
    fireEvent.click(trigger);

    expect(await screen.findByRole("heading", { name: "Cookie settings" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Marketing" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("switch", { name: "Statistics" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Cookie settings" })).toHaveFocus(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Your privacy, your choice" })).toHaveFocus(),
    );
  });

  it("moves focus to the heading when opening settings from the summary", async () => {
    renderManager();
    fireEvent.click(await screen.findByRole("button", { name: "Settings" }));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Cookie settings" })).toHaveFocus(),
    );
  });

  it("persists the default localStorage adapter", async () => {
    render(
      <ConsentManager version="1" categories={categories} storageKey="kamod-consent-test">
        <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
      </ConsentManager>,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Necessary only" }));
    const stored = JSON.parse(localStorage.getItem("kamod-consent-test") ?? "null") as ConsentState;
    expect(stored.categories).toEqual({
      necessary: true,
      statistics: false,
      marketing: false,
    });
  });

  it("throws when useConsent is used outside the provider", () => {
    const Outside = () => {
      useConsent();
      return null;
    };
    expect(() => render(<Outside />)).toThrow("useConsent must be used within ConsentManager");
  });
});
