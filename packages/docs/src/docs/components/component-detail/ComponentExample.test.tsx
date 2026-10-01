/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { afterEach, describe, expect, it } from "vitest";
import { ComponentExample } from "./ComponentExample";

afterEach(cleanup);

function StatefulExample() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((value) => value + 1)}>Count {count}</button>;
}

describe("component example controls", () => {
  it("switches source, changes container width and resets only the demo state", () => {
    const { container } = render(
      <ComponentExample
        preview={<StatefulExample />}
        codeSnippet="const example = 1;"
        filePath="src/Example.tsx"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Count 0" }));
    expect(screen.getByRole("button", { name: "Count 1" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Narrow container" }));
    expect(container.querySelector(".component-example-canvas")?.getAttribute("data-narrow")).toBe(
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Reset example" }));
    expect(screen.getByRole("button", { name: "Count 0" })).toBeTruthy();
    expect(container.querySelector(".component-example-canvas")?.getAttribute("data-narrow")).toBe(
      "true",
    );
    fireEvent.click(screen.getByRole("tab", { name: "Code", exact: true }));
    expect(container.querySelector("pre code")?.textContent).toBe("const example = 1;");
    fireEvent.click(screen.getByRole("button", { name: "Reset example" }));
    expect(
      screen.getByRole("tab", { name: "Preview", exact: true }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByRole("button", { name: "Count 0" })).toBeTruthy();
  });
});
