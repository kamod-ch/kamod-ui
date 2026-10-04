const controls = [
  "a[href]",
  "button",
  "summary",
  "input:not([type=hidden])",
  "select",
  "textarea",
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="slider"]',
  '[role="combobox"]',
  '[role^="menuitem"]',
  '[role="option"]',
  '[role="treeitem"]',
  '[role="spinbutton"]',
  '[role="textbox"]',
  '[role="searchbox"]',
  '[contenteditable="true"]',
  "[data-tooltip]",
].join(",");

/** Find the nearest control, leaving explicitly authored tooltips and opt-outs alone. */
export function tooltipTarget(target: EventTarget | null): HTMLElement | null {
  const element = target instanceof Element ? target.closest<HTMLElement>(controls) : null;
  if (
    !element ||
    element.closest('[data-slot="tooltip"], [data-tooltip="off"], [inert], [aria-hidden="true"]')
  )
    return null;
  return element;
}

const brief = (text: string) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 90 ? `${normalized.slice(0, 87).trimEnd()}…` : normalized;
};

/** Read names, never entered values: hints must not expose passwords or other form data. */
export function tooltipLabel(element: HTMLElement): string {
  const explicit =
    element.getAttribute("data-tooltip") ||
    element.getAttribute("aria-label") ||
    element.getAttribute("title");
  if (explicit) return brief(explicit);
  const labelledBy = element
    .getAttribute("aria-labelledby")
    ?.split(/\s+/)
    .map((id) => element.ownerDocument.getElementById(id)?.textContent ?? "")
    .join(" ");
  if (labelledBy?.trim()) return brief(labelledBy);
  if (element.isContentEditable || element.getAttribute("contenteditable") === "true")
    return "Edit text";
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    const label = Array.from(element.labels ?? [])
      .map((node) => node.textContent)
      .join(" ");
    if (label.trim()) return brief(label);
    if (
      element instanceof HTMLInputElement &&
      ["submit", "reset", "button"].includes(element.type)
    ) {
      return brief(element.value || (element.type === "reset" ? "Reset form" : "Submit form"));
    }
    return brief(
      element.getAttribute("placeholder") ||
        (element instanceof HTMLSelectElement ? "Choose an option" : "Edit field"),
    );
  }
  // Prefer a card's heading to its entire description, and omit decorative/hidden descendants.
  const copy = (element.querySelector("h2, h3, h4, h5, h6") ?? element).cloneNode(
    true,
  ) as HTMLElement;
  copy
    .querySelectorAll('svg, [aria-hidden="true"], [hidden], [data-slot="tooltip-content"]')
    .forEach((node) => node.remove());
  const name = brief(
    copy.textContent || element.querySelector("img[alt]")?.getAttribute("alt") || "",
  );
  if (!name) return element.matches("a[href]") ? "Open link" : "Activate control";
  if (element.getAttribute("role") === "tab") return brief(`Show ${name}`);
  if (element.hasAttribute("aria-expanded") || element.tagName === "SUMMARY") {
    const expanded =
      element.getAttribute("aria-expanded") === "true" ||
      element.parentElement?.matches("details[open]");
    return brief(`${expanded ? "Collapse" : "Expand"} ${name}`);
  }
  return name;
}
