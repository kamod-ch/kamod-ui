import type { BrowserContext } from "@playwright/test";

/** Use the real clipboard in Chromium; WebKit cannot grant clipboard permissions in automation. */
export async function enableTestClipboard(context: BrowserContext, browserName: string) {
  if (browserName === "chromium") {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    return;
  }
  // Check the exact copy payload without relying on the operating system's permission dialog.
  await context.addInitScript(() => {
    let text = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          text = value;
        },
        readText: async () => text,
      },
    });
  });
}

/** Safari on macOS includes buttons in its focus order when Option-Tab is used. */
export const forwardTabKey = (browserName: string) =>
  browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab";
