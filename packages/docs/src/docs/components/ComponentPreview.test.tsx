/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import { ComponentPreview } from "./ComponentPreview";

afterEach(cleanup);

describe("ComponentPreview", () => {
  it("renders the live demo and switches the raw module source between package import styles", async () => {
    const source = `import { Dialog } from "@kamod-ch/ui";\n\nexport function Example() {\n  return <Dialog />;\n}\n`;
    const view = render(
      <ComponentPreview source={source} filePath="src/docs/examples/dialog-basic.tsx">
        <p>Live dialog</p>
      </ComponentPreview>,
    );
    expect(screen.getByText("Live dialog")).toBeVisible();
    const live = view.container.querySelector(".component-preview-live");
    expect(live).toHaveAttribute("dir", "ltr");
    fireEvent.click(screen.getByRole("button", { name: "Dark preview" }));
    expect(live).toHaveClass("dark");
    fireEvent.click(screen.getByRole("button", { name: "Right to left" }));
    expect(live).toHaveAttribute("dir", "rtl");
    fireEvent.click(screen.getByRole("button", { name: "Reset preview" }));
    expect(view.container.querySelector(".component-preview-live")).toHaveAttribute("dir", "rtl");
    await waitFor(() =>
      expect(view.container.querySelector("pre code")?.textContent).toContain(
        'import { Dialog } from "@kamod-ch/ui";',
      ),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Subpath Import (@kamod-ch/ui/<component>)" }),
    );
    await waitFor(() =>
      expect(view.container.querySelector("pre code")?.textContent).toContain(
        'import { Dialog } from "@kamod-ch/ui/dialog";',
      ),
    );
    expect(view.container.querySelector("pre code")?.textContent).toContain(
      "export function Example()",
    );
  });
});
