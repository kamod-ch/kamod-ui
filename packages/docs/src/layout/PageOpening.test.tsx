// @vitest-environment jsdom
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { PageOpening } from "./PageOpening";

function markup(startup: boolean, base = "/") {
  const root = document.createElement("div");
  root.innerHTML = renderToString(<PageOpening startup={startup} base={base} />);
  return root;
}

describe("shared page opening screen", () => {
  it("uses the same content and constellation before startup and during navigation", () => {
    const startup = markup(true);
    const navigation = markup(false);
    expect(startup.querySelector(".page-opening-content")!.textContent).toBe(
      navigation.querySelector(".page-opening-content")!.textContent,
    );
    expect(startup.querySelector(".page-loading-rocket")!.innerHTML).toBe(
      navigation.querySelector(".page-loading-rocket")!.innerHTML,
    );
    for (const root of [startup, navigation]) {
      expect(root.querySelector(".page-loading-brand")!.textContent).toBe("Kamod");
      expect(root.querySelector('.page-loading-brand [data-slot="spinner"]')).toBeNull();
    }
  });

  it("keeps the persistent startup overlay out of route landmarks and state selectors", () => {
    const startup = markup(true);
    expect(
      startup.querySelector("main, h1, #content, .page-state-shell, .page-state-loading"),
    ).toBeNull();
    const navigation = markup(false);
    expect(navigation.querySelector("main#content h1")!.textContent).toContain(
      "Opening Your Next Page",
    );
    expect(navigation.querySelector('.page-state-loading[aria-busy="true"]')).not.toBeNull();
  });

  it("resolves the home link and official symbol under a deployment base", () => {
    for (const startup of [true, false]) {
      const root = markup(startup, "/kamod-ui/");
      expect(root.querySelector('a[aria-label="Kamod UI home"]')!.getAttribute("href")).toBe(
        "/kamod-ui/",
      );
      for (const image of root.querySelectorAll(".kamod-icon__img")) {
        expect(image.getAttribute("src")).toMatch(/^\/kamod-ui\/kamod-icon(?:-dark)?\.svg$/);
      }
    }
  });
});
