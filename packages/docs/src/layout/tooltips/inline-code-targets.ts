import { inlineCodeExplanation } from "./inline-code-glossary";
import { packageReferenceHelp } from "./package-reference-help";

const excluded =
  'pre, .docs-code-wrap, button, summary, [role="button"], [contenteditable], [data-slot="tooltip"], [data-slot="popover"], [data-application-tooltip], [data-tooltip], [data-code-help="off"], .component-example-canvas';
const marker = "data-inline-code-help";
const ignoredContent =
  "pre, .docs-code-wrap, [data-application-tooltip], .component-example-canvas";

/** Read a prepared code term or an explicitly authored resource link; no DOM scans. */
export function inlineCodeHelp(target: HTMLElement) {
  const download = packageReferenceHelp(target);
  if (download) return download;
  const { referenceTitle, referenceDescription, referencePath } = target.dataset;
  const href = target.getAttribute("href");
  if (referenceTitle && referenceDescription && href)
    return {
      description: referenceDescription,
      path: { label: referencePath ?? referenceTitle, href },
      href,
      linkLabel: href,
    };
  const term = target.getAttribute(marker);
  return term ? inlineCodeExplanation(term, target.getAttribute("href")) : undefined;
}

/**
 * Enhance prose from both JSX and Markdown without wrapping or rewriting its text.
 * Observe only added/changed subtrees; one shared controller renders the active hint.
 * data-code-help="key" chooses an explicit glossary entry; "off" opts out a subtree.
 */
export function connectInlineCode(doc: Document) {
  const owned = new Map<
    HTMLElement,
    { code: HTMLElement; term: string; attributes: Map<string, string | null> }
  >();
  const targetByCode = new WeakMap<HTMLElement, HTMLElement>();
  const restore = (target: HTMLElement) => {
    const state = owned.get(target);
    if (!state) return;
    for (const [name, value] of state.attributes) {
      if (value === null) target.removeAttribute(name);
      else target.setAttribute(name, value);
    }
    owned.delete(target);
    targetByCode.delete(state.code);
  };
  const enhance = (code: HTMLElement) => {
    const previousTarget = targetByCode.get(code);
    const previous = previousTarget ? owned.get(previousTarget) : undefined;
    // Our own button role is allowed on a previously enhanced term.
    const boundary = code.closest(excluded);
    const allowed =
      !boundary ||
      (boundary === previousTarget &&
        !code.parentElement?.closest(excluded) &&
        !code.matches('[data-tooltip], [data-code-help="off"]'));
    if (!allowed) {
      if (previousTarget) restore(previousTarget);
      return;
    }
    const term = code.getAttribute("data-code-help") ?? code.textContent?.trim() ?? "";
    if (previous && previous.term === term) return;
    if (previousTarget) restore(previousTarget);
    if (!inlineCodeExplanation(term)) return;
    const target =
      code.closest<HTMLAnchorElement>("a[href]") ??
      code.querySelector<HTMLAnchorElement>("a[href]") ??
      code;
    if (target !== code && target.textContent?.trim() !== code.textContent?.trim()) return;
    if (owned.has(target)) restore(target);
    const attributes = new Map<string, string | null>();
    const set = (name: string, value: string) => {
      attributes.set(name, target.getAttribute(name));
      target.setAttribute(name, value);
    };
    set(marker, term);
    if (target === code) {
      if (!target.hasAttribute("tabindex")) set("tabindex", "0");
      set("role", "button");
      set("aria-haspopup", "dialog");
      set("aria-expanded", "false");
    }
    owned.set(target, { code, term, attributes });
    targetByCode.set(code, target);
  };
  const scan = (node: Node) => {
    const element = node instanceof HTMLElement ? node : node.parentElement;
    if (!element || element.closest(ignoredContent)) return;
    const code = element.closest<HTMLElement>("code");
    if (code) enhance(code);
    else element.querySelectorAll<HTMLElement>("code").forEach(enhance);
  };
  scan(doc.body);
  const observer = new MutationObserver((records) => {
    let removed = false;
    for (const record of records) {
      const element =
        record.target instanceof Element ? record.target : record.target.parentElement;
      // Highlighting replaces thousands of token nodes, none of which can own
      // prose hints. Do not scan them or sweep unrelated references for removals.
      if (element?.closest(ignoredContent)) continue;
      if (record.type === "childList") {
        removed ||= record.removedNodes.length > 0;
        if (record.target instanceof Element && record.target.closest("code")) scan(record.target);
        else record.addedNodes.forEach(scan);
      } else scan(record.target);
    }
    // Drop removed terms so client-side navigation cannot retain detached page trees.
    if (removed)
      for (const [target, { code }] of owned)
        if (!target.isConnected || !code.isConnected) restore(target);
  });
  observer.observe(doc.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["data-code-help", "data-tooltip"],
  });
  return () => {
    observer.disconnect();
    for (const target of owned.keys()) restore(target);
  };
}
