import { expect, test } from "@playwright/test";

for (const mode of ["desktop", "mobile"] as const) {
  test(`${mode} groups keep their measured height when expansion finishes`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: mode === "desktop" ? 1440 : 390, height: 900 });
    await page.goto("./docs/components", { waitUntil: "domcontentloaded" });
    if (mode === "mobile") {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
    }
    const area = page.locator(
      mode === "desktop" ? ".docs-sidebar-scroll" : ".site-navigation-body",
    );
    const groups = area.locator(".site-navigation-group");
    await expect(groups).toHaveCount(4);

    for (const group of await groups.all()) {
      const trigger = group.locator(".site-navigation-group-trigger");
      const panel = group.locator('[data-slot="collapsible-content"]');
      // Reopen as well as mounting: the original jump only appeared on subsequent opens.
      if ((await trigger.getAttribute("aria-expanded")) === "false") await trigger.click();
      await expect(panel).toHaveCSS("transition-property", "none");
      await trigger.click();
      await expect(panel).toHaveCount(0);

      const heights = await trigger.evaluate(
        (button) =>
          new Promise<{ before: number; after: number }>((resolve, reject) => {
            const root = button.closest(".site-navigation-group")!;
            const timeout = window.setTimeout(() => {
              root.removeEventListener("transitionend", onEnd, true);
              reject(
                new Error(
                  `Group did not settle: ${button.textContent} ${root.querySelector('[data-slot="collapsible-content"]')?.getAttribute("style")}`,
                ),
              );
            }, 5000);
            function measure(content: HTMLElement) {
              root.removeEventListener("transitionend", onEnd, true);
              window.clearTimeout(timeout);
              // Capture before the disclosure replaces its measured height with auto.
              const before = content.getBoundingClientRect().height;
              requestAnimationFrame(() => {
                resolve({ before, after: content.getBoundingClientRect().height });
              });
            }
            function onEnd(event: Event) {
              const content = event.target as HTMLElement;
              if (content.dataset.slot === "collapsible-content") measure(content);
            }
            root.addEventListener("transitionend", onEnd, true);
            button.click();
            // The disclosure may settle immediately when its measured and natural heights agree.
            void (async () => {
              for (let frame = 0; frame < 4; frame++) {
                await new Promise<void>((next) => requestAnimationFrame(() => next()));
              }
              const content = root.querySelector<HTMLElement>('[data-slot="collapsible-content"]');
              if (
                content?.style.height === "auto" &&
                getComputedStyle(content).transitionProperty === "none"
              ) {
                measure(content);
              }
            })();
          }),
      );
      expect(heights.before).toBeGreaterThan(0);
      expect(Math.abs(heights.after - heights.before)).toBeLessThanOrEqual(1);
      await trigger.click();
      await expect(panel).toHaveCount(0);
    }
  });
}
