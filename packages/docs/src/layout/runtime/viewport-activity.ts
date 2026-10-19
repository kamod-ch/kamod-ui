type Subscription = { visible: boolean; update: (active: boolean) => void };
type Controller = ReturnType<typeof createController>;
const controllers = new WeakMap<Document, Controller>();

/** Share one viewport observer and visibility listener per document; never poll for activity. */
function createController(doc: Document) {
  const entries = new Map<Element, Subscription>();
  const notify = (entry: Subscription) => entry.update(entry.visible && !doc.hidden);
  const visibility = () => entries.forEach(notify);
  const observer =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (changes) => {
            for (const change of changes) {
              const entry = entries.get(change.target);
              if (!entry) continue;
              entry.visible = change.isIntersecting;
              notify(entry);
            }
          },
          { rootMargin: "100px" },
        );
  doc.addEventListener("visibilitychange", visibility);
  return {
    observe(node: Element, update: Subscription["update"]) {
      const entry = { visible: !observer, update };
      entries.set(node, entry);
      notify(entry);
      observer?.observe(node);
      return () => {
        if (entries.get(node) !== entry) return;
        observer?.unobserve(node);
        entries.delete(node);
        if (entries.size) return;
        observer?.disconnect();
        doc.removeEventListener("visibilitychange", visibility);
        controllers.delete(doc);
      };
    },
  };
}

/** Activity includes nearby content, but excludes hidden tabs and display:none panels. */
export function observeViewportActivity(node: Element, update: Subscription["update"]) {
  const doc = node.ownerDocument;
  let controller = controllers.get(doc);
  if (!controller) {
    controller = createController(doc);
    controllers.set(doc, controller);
  }
  return controller.observe(node, update);
}
