/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen, within } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it, vi } from "vitest";

const blobatarSpy = vi.hoisted(() => vi.fn());

vi.mock("@blobatar/preact", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@blobatar/preact")>();
  function Blobatar(props: Parameters<typeof actual.Blobatar>[0]) {
    blobatarSpy(props);
    return actual.Blobatar(props);
  }
  return { ...actual, Blobatar };
});

import { SmartAvatar } from "./SmartAvatar";

const PHOTO_SRC = "https://example.com/photo.jpg";

function hasUtilityClass(element: HTMLElement, utility: string): boolean {
  return new RegExp(`\\b${utility}\\b`).test(element.className);
}

function getAvatarRoot(container: Element): HTMLElement {
  const root = container.querySelector("[data-slot='avatar']");
  if (!root) {
    throw new Error("avatar root not found");
  }
  return root as HTMLElement;
}

function getFallback(container: Element): HTMLElement {
  const fallback = container.querySelector("[data-slot='avatar-fallback']");
  if (!fallback) {
    throw new Error("avatar fallback not found");
  }
  return fallback as HTMLElement;
}

function getFallbackBlobatarElement(fallback: HTMLElement): HTMLElement {
  const el = fallback.querySelector("img, svg");
  if (!el) {
    throw new Error("blobatar img/svg not found in fallback");
  }
  return el as HTMLElement;
}

describe("SmartAvatar blobatar fallback (real @blobatar/preact)", () => {
  it("shows the blobatar fallback when src is omitted", () => {
    const { container } = render(<SmartAvatar name="ada-lovelace" />);

    const fallback = getFallback(container);
    expect(hasUtilityClass(fallback, "hidden")).toBe(false);

    const blob = getFallbackBlobatarElement(fallback);
    expect(blob.tagName).toBe("IMG");
    expect(blob.getAttribute("src")).toMatch(/^data:image\/svg\+xml,/);
  });

  it("passes name as the blobatar seed", () => {
    const { container: first } = render(<SmartAvatar name="seed-alpha" />);
    const { container: second } = render(<SmartAvatar name="seed-beta" />);

    const firstSrc = getFallbackBlobatarElement(getFallback(first)).getAttribute("src");
    const secondSrc = getFallbackBlobatarElement(getFallback(second)).getAttribute("src");

    expect(firstSrc).toBeTruthy();
    expect(secondSrc).toBeTruthy();
    expect(firstSrc).not.toBe(secondSrc);
  });

  it("forwards supported blobatar options to the rendered fallback", () => {
    const { container: muted } = render(<SmartAvatar name="option-test" blobatar={{ hue: 30 }} />);
    const { container: vivid } = render(<SmartAvatar name="option-test" blobatar={{ hue: 210 }} />);

    const mutedSrc = getFallbackBlobatarElement(getFallback(muted)).getAttribute("src");
    const vividSrc = getFallbackBlobatarElement(getFallback(vivid)).getAttribute("src");

    expect(mutedSrc).not.toBe(vividSrc);
  });

  it("uses static img rendering by default", () => {
    const { container } = render(<SmartAvatar name="static-default" />);
    const fallback = getFallback(container);

    expect(fallback.querySelector("svg")).toBeNull();
    expect(fallback.querySelector("img")).not.toBeNull();
  });

  it("renders animated svg when blobatar.animate is hover or always", () => {
    const { container: hoverRoot } = render(
      <SmartAvatar name="anim-hover" blobatar={{ animate: "hover" }} />,
    );
    const { container: alwaysRoot } = render(
      <SmartAvatar name="anim-always" blobatar={{ animate: "always" }} />,
    );

    for (const container of [hoverRoot, alwaysRoot]) {
      const fallback = getFallback(container);
      const svg = fallback.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg?.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
      expect(fallback.querySelector("img")).toBeNull();
    }
  });

  it("merges a custom blobatar class with size-full", () => {
    const { container } = render(
      <SmartAvatar name="class-merge" blobatar={{ class: "ring-2 ring-primary" }} />,
    );

    const blob = getFallbackBlobatarElement(getFallback(container));
    expect(hasUtilityClass(blob, "size-full")).toBe(true);
    expect(blob.className).toContain("ring-2");
    expect(blob.className).toContain("ring-primary");
  });

  it("forwards name and blobatar options through to Blobatar", () => {
    blobatarSpy.mockClear();
    render(<SmartAvatar name="spy-seed" blobatar={{ hue: 120, background: "circle" }} />);

    expect(blobatarSpy).toHaveBeenCalled();
    const props = blobatarSpy.mock.calls.at(-1)?.[0];
    expect(props?.name).toBe("spy-seed");
    expect(props?.hue).toBe(120);
    expect(props?.background).toBe("circle");
    expect(props?.class).toMatch(/\bsize-full\b/);
  });
});

describe("SmartAvatar photo loading", () => {
  it("renders AvatarImage and toggles fallback visibility on load and error", () => {
    const { container } = render(
      <SmartAvatar name="photo-user" src={PHOTO_SRC} label="Photo user" />,
    );

    const fallback = getFallback(container);
    const image = container.querySelector("[data-slot='avatar-image']") as HTMLImageElement;

    expect(image).not.toBeNull();
    expect(image.getAttribute("src")).toBe(PHOTO_SRC);
    expect(hasUtilityClass(fallback, "hidden")).toBe(false);
    expect(hasUtilityClass(image, "invisible")).toBe(true);

    fireEvent.load(image);
    expect(hasUtilityClass(fallback, "hidden")).toBe(true);
    expect(hasUtilityClass(image, "invisible")).toBe(false);

    fireEvent.error(image);
    expect(hasUtilityClass(fallback, "hidden")).toBe(false);
    expect(hasUtilityClass(image, "invisible")).toBe(true);
  });
});

describe("SmartAvatar layout and Kamod props", () => {
  it("forwards Avatar size to the Kamod root", () => {
    const { container } = render(<SmartAvatar name="sized" size="lg" />);
    const root = getAvatarRoot(container);

    expect(root).toHaveAttribute("data-size", "lg");
    expect(root.className).toContain("size-12");
  });

  it("keeps badge as AvatarBadge outside the clipped media container", () => {
    const { container } = render(
      <SmartAvatar name="badged" badge={<span data-testid="badge-dot">●</span>} />,
    );

    const root = getAvatarRoot(container);
    const mediaClip = root.querySelector(":scope > span") as HTMLElement;
    const badge = screen.getByTestId("badge-dot").closest("[data-slot='avatar-badge']");

    expect(badge).not.toBeNull();
    expect(mediaClip.className).toContain("overflow-hidden");
    expect(mediaClip.contains(badge)).toBe(false);
    expect(badge?.parentElement).toBe(root);
  });
});

describe("SmartAvatar accessibility", () => {
  it("exposes a single stable accessible image name when label is set", () => {
    const { container } = render(
      <SmartAvatar name="a11y-labelled" src={PHOTO_SRC} label="Klaus Zahiragic" />,
    );

    const labelled = screen.getByRole("img", { name: "Klaus Zahiragic" });
    expect(labelled).toBe(getAvatarRoot(container));

    const fallbackBlob = getFallbackBlobatarElement(getFallback(container));
    expect(fallbackBlob.getAttribute("aria-hidden")).toBe("true");

    const photo = container.querySelector("[data-slot='avatar-image']") as HTMLImageElement;
    expect(photo.getAttribute("alt")).toBe("");
    expect(photo.getAttribute("aria-hidden")).toBe("true");

    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("keeps the composition decorative when label is omitted", () => {
    const { container } = render(<SmartAvatar name="a11y-decorative" src={PHOTO_SRC} />);
    const root = getAvatarRoot(container);

    expect(root.getAttribute("role")).toBeNull();
    expect(root.getAttribute("aria-label")).toBeNull();
    expect(within(container as HTMLElement).queryByRole("img")).toBeNull();

    const fallbackBlob = getFallbackBlobatarElement(getFallback(container));
    expect(fallbackBlob.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("SmartAvatar SSR", () => {
  it("serializes markup with preact-render-to-string", () => {
    const html = renderToString(<SmartAvatar name="ssr-user" label="SSR user" />);

    expect(html).toContain('data-slot="avatar"');
    expect(html).toContain('aria-label="SSR user"');
    expect(html).toMatch(/<img|<svg/);
  });
});
