import { inlineCodeExplanation } from "../layout/tooltips/inline-code-glossary";
import { packageReferenceHelp } from "../layout/tooltips/package-reference-help";
import { inlineSourceReference, referenceAttributes } from "./inline-references";
import { sourceReferenceHelp } from "./source-reference-target";

const excluded =
  'pre, .docs-code-wrap, button, summary, [role="button"], [contenteditable], [data-slot="tooltip"], [data-slot="popover"], [data-application-tooltip], [data-tooltip], [data-code-help="off"], .component-example-canvas';
const marker = "data-inline-code-help";
const ignoredContent =
  "pre, .docs-code-wrap, [data-application-tooltip], .component-example-canvas";

/** Read a prepared code term or an explicitly authored resource link; no DOM scans. */
export function inlineCodeHelp(target: HTMLElement) {
  if (sourceReferenceHelp(target)) return;
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
    const target =
      code.closest<HTMLAnchorElement>("a[href]") ??
      code.querySelector<HTMLAnchorElement>("a[href]") ??
      code;
    if (target !== code && target.textContent?.trim() !== code.textContent?.trim()) return;
    const source = code.hasAttribute("data-code-help")
      ? undefined
      : inlineSourceReference(term, target.getAttribute("href") ?? undefined);
    if (!source && !inlineCodeExplanation(term)) return;
    if (!previous && sourceReferenceHelp(target)) return;
    if (owned.has(target)) restore(target);
    const attributes = new Map<string, string | null>();
    const set = (name: string, value: string) => {
      attributes.set(name, target.getAttribute(name));
      target.setAttribute(name, value);
    };
    set(marker, term);
    if (source) {
      const request = { ...source, href: target.getAttribute("href") ?? source.href };
      set(
        "class",
        `${target.getAttribute("class") ?? ""} kamod-code-reference docs-inline-source-reference`.trim(),
      );
      for (const [name, value] of Object.entries(referenceAttributes(request)))
        if (value !== undefined) set(name, value);
    }
    if (target === code) {
      if (!target.hasAttribute("tabindex")) set("tabindex", "0");
      set("role", "button");
      set("aria-haspopup", "dialog");
      set("aria-expanded", "false");
    }
    owned.set(target, { code, term, attributes });
    targetByCode.set(code, target);
  };
  const scanRoot = (node: Node) => {
    const element = node instanceof HTMLElement ? node : node.parentElement;
    return !element || element.closest(ignoredContent)
      ? null
      : (element.closest<HTMLElement>("code") ?? element);
  };
  const scan = (node: Node) => {
    const root = scanRoot(node);
    if (!root) return;
    if (root.tagName === "CODE") enhance(root);
    else root.querySelectorAll<HTMLElement>("code").forEach(enhance);
  };
  scan(doc.body);
  const observer = new MutationObserver((records) => {
    const changed = new Set<HTMLElement>();
    const removed = new Set<HTMLElement>();
    const queue = (node: Node) => {
      const root = scanRoot(node);
      if (root) changed.add(root);
    };
    for (const record of records) {
      const element =
        record.target instanceof Element ? record.target : record.target.parentElement;
      // Highlighting replaces thousands of token nodes, none of which can own
      // prose hints. Do not scan them or sweep unrelated references for removals.
      if (element?.closest(ignoredContent)) continue;
      if (record.type === "childList") {
        for (const node of record.removedNodes) if (node instanceof HTMLElement) removed.add(node);
        if (record.target instanceof Element && record.target.closest("code")) queue(record.target);
        else for (const node of record.addedNodes) queue(node);
      } else queue(record.target);
    }
    // One prose edit can emit several records for the same term. Enhance it once per batch.
    changed.forEach(scan);
    // Inspect only removed code trees. Unrelated counters/icons must not sweep every
    // enhanced reference on a long page, while route changes still release detached terms.
    for (const element of removed) {
      const codes =
        element.tagName === "CODE" ? [element] : element.querySelectorAll<HTMLElement>("code");
      for (const code of codes) {
        const target = targetByCode.get(code);
        if (target && (!target.isConnected || !code.isConnected)) restore(target);
      }
    }
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
