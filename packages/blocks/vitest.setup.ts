const cssEscape = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);

if (typeof globalThis.CSS === "undefined") {
  Object.defineProperty(globalThis, "CSS", {
    value: { escape: cssEscape },
    configurable: true,
  });
} else if (typeof globalThis.CSS.escape !== "function") {
  globalThis.CSS.escape = cssEscape;
}

if (typeof Element !== "undefined" && typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = function scrollIntoView() {
    return undefined;
  };
}

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  });
}
