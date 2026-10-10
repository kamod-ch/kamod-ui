/** @vitest-environment jsdom */
import { cleanup, render } from "@testing-library/preact";
import { afterEach, expect, it } from "vitest";
import { ShowcaseLoading } from "./ShowcaseLoading";

afterEach(cleanup);

it("always follows explicit showcase appearance when its controls change", () => {
  const { getByRole, rerender } = render(
    <ShowcaseLoading view="preview" appearance={{ preset: "ocean", scheme: "dark" }} />,
  );
  for (const scheme of ["light", "dark"] as const) {
    rerender(
      <ShowcaseLoading
        view="file"
        detail="src/example.tsx"
        appearance={{ preset: "sunset", scheme }}
      />,
    );
    const loader = getByRole("status").closest<HTMLElement>(".showcase-loading")!;
    expect(loader.hasAttribute("data-theme-scope")).toBe(true);
    expect(loader.getAttribute("data-theme")).toBe("sunset");
    expect(loader.classList.contains("dark")).toBe(scheme === "dark");
    expect(loader.style.colorScheme).toBe(scheme);
  }
});

it("keeps reading guidance outside the concise live status and preserves the selected file", () => {
  const { getByRole } = render(
    <ShowcaseLoading
      view="file"
      detail="src/components/example.tsx"
      appearance={{ preset: "ocean", scheme: "dark" }}
    />,
  );
  const status = getByRole("status");
  expect(status.textContent).toBe("Loading sourcesrc/components/example.tsx");
  const guide = getByRole("link", { name: "Code" });
  expect(status.contains(guide)).toBe(false);
  expect(guide.getAttribute("href")).toContain("/docs/code/installation#code-reading-model");
});
