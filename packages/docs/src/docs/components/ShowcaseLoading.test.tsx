/** @vitest-environment jsdom */
import { cleanup, render } from "@testing-library/preact";
import { afterEach, expect, it } from "vitest";
import { ShowcaseLoading } from "./ShowcaseLoading";

afterEach(cleanup);

it("always follows explicit showcase appearance when its controls change", () => {
  const { getByRole, rerender } = render(
    <ShowcaseLoading view="preview" appearance={{ preset: "ocean", scheme: "dark" }} />,
  );
  expect(getByRole("status").textContent).toBe("Setting the scene...");
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

it("preserves the selected file as the only secondary line", () => {
  const { getByRole, queryByRole, container, rerender } = render(
    <ShowcaseLoading
      view="file"
      detail="src/components/example.tsx"
      appearance={{ preset: "ocean", scheme: "dark" }}
    />,
  );
  const status = getByRole("status");
  expect(status.textContent).toBe("Loading sourcesrc/components/example.tsx");
  expect(queryByRole("link")).toBeNull();
  expect(container.querySelectorAll("p")).toHaveLength(1);
  rerender(<ShowcaseLoading view="prompt" />);
  const caption = container.querySelector("p")!;
  expect(caption.textContent).toBe("Instructions & source");
  expect(getByRole("status").contains(caption)).toBe(false);
});
