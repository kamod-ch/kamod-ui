import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "./Avatar";
import { AvatarBadge } from "./AvatarBadge";
import { AvatarFallback } from "./AvatarFallback";
import { AvatarImage } from "./AvatarImage";

const TEST_SRC = "https://example.com/avatar.jpg";

function hasUtilityClass(element: HTMLElement, utility: string): boolean {
  return new RegExp(`\\b${utility}\\b`).test(element.className);
}

function renderAvatarWithImage(
  options: {
    src?: string;
    size?: "sm" | "default" | "lg";
    onLoad?: (e: Event) => void;
    onError?: (e: Event) => void;
  } = {},
) {
  const { src = TEST_SRC, size, onLoad, onError } = options;
  return render(
    <Avatar size={size}>
      <AvatarImage src={src} alt="User avatar" onLoad={onLoad} onError={onError} />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>,
  );
}

describe("Avatar image state", () => {
  it("shows AvatarFallback initially while the image has not loaded", () => {
    renderAvatarWithImage();

    const fallback = screen.getByText("AB");
    const image = screen.getByAltText("User avatar");

    expect(hasUtilityClass(fallback, "hidden")).toBe(false);
    expect(hasUtilityClass(image, "invisible")).toBe(true);
  });

  it("hides the fallback and shows the image after load", () => {
    renderAvatarWithImage();

    const fallback = screen.getByText("AB");
    const image = screen.getByAltText("User avatar");

    fireEvent.load(image);

    expect(hasUtilityClass(fallback, "hidden")).toBe(true);
    expect(hasUtilityClass(image, "invisible")).toBe(false);
  });

  it("shows the fallback again after an image error", () => {
    renderAvatarWithImage();

    const fallback = screen.getByText("AB");
    const image = screen.getByAltText("User avatar");

    fireEvent.load(image);
    fireEvent.error(image);

    expect(hasUtilityClass(fallback, "hidden")).toBe(false);
    expect(hasUtilityClass(image, "invisible")).toBe(true);
  });

  it("resets to the loading state when src changes", () => {
    const { rerender } = renderAvatarWithImage({ src: TEST_SRC });

    const image = screen.getByAltText("User avatar");
    const fallback = screen.getByText("AB");

    fireEvent.load(image);
    expect(hasUtilityClass(fallback, "hidden")).toBe(true);

    rerender(
      <Avatar>
        <AvatarImage src="https://example.com/other.jpg" alt="User avatar" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );

    const nextImage = screen.getByAltText("User avatar");
    expect(hasUtilityClass(fallback, "hidden")).toBe(false);
    expect(hasUtilityClass(nextImage, "invisible")).toBe(true);

    fireEvent.load(nextImage);
    expect(hasUtilityClass(fallback, "hidden")).toBe(true);
    expect(hasUtilityClass(nextImage, "invisible")).toBe(false);
  });

  it("still invokes consumer onLoad and onError handlers", () => {
    const onLoad = vi.fn();
    const onError = vi.fn();

    renderAvatarWithImage({ onLoad, onError });

    const image = screen.getByAltText("User avatar");

    fireEvent.load(image);
    expect(onLoad).toHaveBeenCalledTimes(1);

    fireEvent.error(image);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});

describe("Avatar layout and sizing", () => {
  it("renders AvatarBadge outside the clipped media container", () => {
    render(
      <Avatar>
        <AvatarImage src={TEST_SRC} alt="User avatar" />
        <AvatarFallback>AB</AvatarFallback>
        <AvatarBadge>●</AvatarBadge>
      </Avatar>,
    );

    const root = screen.getByText("●").closest("[data-slot='avatar']") as HTMLElement;
    const mediaClip = root.querySelector(":scope > span") as HTMLElement;
    const badge = screen.getByText("●");

    expect(mediaClip.className).toContain("overflow-hidden");
    expect(mediaClip.contains(badge)).toBe(false);
    expect(badge.parentElement).toBe(root);
  });

  it.each([
    { size: "sm" as const, dataSize: "sm", sizeClass: "size-8" },
    { size: undefined, dataSize: "default", sizeClass: "size-10" },
    { size: "lg" as const, dataSize: "lg", sizeClass: "size-12" },
  ])("applies data-size and size classes for $dataSize", ({ size, dataSize, sizeClass }) => {
    renderAvatarWithImage({ size });

    const root = screen.getByAltText("User avatar").closest("[data-slot='avatar']") as HTMLElement;

    expect(root).toHaveAttribute("data-size", dataSize);
    expect(root.className).toContain(sizeClass);
  });
});
