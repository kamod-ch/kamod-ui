import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { ConsentManager, ConsentManagerTrigger } from "./index";
import type { ConsentCategory } from "./useConsent";

const categories: ConsentCategory[] = [
  {
    id: "necessary",
    title: "Necessary",
    description: "Keeps the site working.",
    required: true,
  },
  {
    id: "statistics",
    title: "Statistics",
    description: "Anonymous usage.",
  },
];

const throwingStorage = {
  get() {
    throw new Error("storage during render");
  },
  set() {
    throw new Error("storage during render");
  },
};

const parseHtml = (html: string) => new DOMParser().parseFromString(html, "text/html");

describe("ConsentManager SSR", () => {
  it("does not read storage during render", () => {
    expect(() =>
      renderToString(
        <ConsentManager version="1" categories={categories} storage={throwingStorage}>
          <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
        </ConsentManager>,
      ),
    ).not.toThrow();
  });

  it("renders the same dialog markup and label relationship on repeated server renders", () => {
    const tree = (
      <ConsentManager open version="1" categories={categories} storage={throwingStorage}>
        <ConsentManagerTrigger>Cookie settings</ConsentManagerTrigger>
      </ConsentManager>
    );
    const first = renderToString(tree);
    const second = renderToString(tree);
    expect(first).toBe(second);

    const doc = parseHtml(first);
    const title = doc.querySelector('[data-slot="dialog-title"]');
    const dialog = doc.querySelector('[role="dialog"]');
    expect(title?.id).toBeTruthy();
    expect(dialog?.getAttribute("aria-labelledby")).toBe(title?.id);
    expect(dialog?.getAttribute("aria-describedby")).toBe(
      doc.querySelector('[data-slot="dialog-description"]')?.id,
    );
    expect(doc.querySelector('[data-slot="dialog-close"]')).toBeNull();
    expect(doc.querySelector('[data-slot="consent-manager-summary"]')).toBeTruthy();
  });
});
