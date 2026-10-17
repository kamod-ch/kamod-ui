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

/** Check the current layout: responsive labels can turn a text button into an icon button. */
function hasVisibleLabel(element: Element): boolean {
  if (element.matches('svg, [hidden], .sr-only, [data-slot="tooltip-content"]')) return false;
  const style = getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (style.clip === "rect(0px, 0px, 0px, 0px)" || style.clipPath === "inset(50%)") return false;
  return Array.from(element.childNodes).some((node) =>
    node.nodeType === Node.TEXT_NODE
      ? !!node.textContent?.trim()
      : node instanceof Element && hasVisibleLabel(node),
  );
}

/** Hints explain unlabeled icons or authored context, never repeat prose or entered values. */
export function tooltipLabel(
  element: HTMLElement,
  originalTitle = element.getAttribute("title"),
): string {
  const authored = element.getAttribute("data-tooltip");
  if (authored) return authored === "off" ? "" : brief(authored);
  if (
    element.matches(
      'input, textarea, select, [contenteditable], [role="textbox"], [role="searchbox"], [role="combobox"], [role="slider"], [role="spinbutton"]',
    )
  )
    return "";

  const explicit = element.getAttribute("aria-label") || originalTitle;
  const labelledBy = element
    .getAttribute("aria-labelledby")
    ?.split(/\s+/)
    .map((id) => element.ownerDocument.getElementById(id)?.textContent ?? "")
    .join(" ");
  const label = explicit || labelledBy;
  // Do not manufacture generic "Open link" / "Activate control" hints.
  if (!label?.trim()) return "";
  if (hasVisibleLabel(element)) {
    // A full path/name is useful only when the visible version is actually clipped.
    const title = originalTitle;
    const clipped =
      title &&
      [element, ...element.querySelectorAll<HTMLElement>("span")].some(
        (node) =>
          node.clientWidth > 0 &&
          node.scrollWidth > node.clientWidth &&
          ["hidden", "clip"].includes(getComputedStyle(node).overflowX),
      );
    return clipped ? brief(title) : "";
  }
  return brief(label);
}
