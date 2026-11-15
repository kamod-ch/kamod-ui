/** @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import { ApiReference } from "./ApiReference";

afterEach(cleanup);

describe("ApiReference", () => {
  it("renders generated badges and prop rows for a core export", () => {
    render(<ApiReference component="button" />);
    expect(screen.getByLabelText("Subpath import")).toHaveTextContent("@kamod-ch/ui/button");
    expect(screen.getByLabelText("Signal status")).toHaveTextContent("Signals: none");
    expect(screen.getByLabelText("Bundle size")).toHaveTextContent(/gzip/);
    expect(screen.getByRole("row", { name: /variant/i })).toHaveTextContent('"default"');
    expect(screen.getByRole("row", { name: /asChild/ })).toHaveTextContent("false");
  });

  it("still renders an authored prop table", () => {
    render(
      <ApiReference
        sections={[
          { title: "Example", rows: [{ prop: "open", type: "boolean", defaultValue: "false" }] },
        ]}
      />,
    );
    expect(screen.getByRole("row", { name: /open/ })).toHaveTextContent("boolean");
  });
});
