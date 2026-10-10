import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it, vi } from "vitest";
import { TypeDefinition } from "./TypeDefinition";

describe("TypeDefinition", () => {
  it("connects the disclosure to its panel and unmounts collapsed content", async () => {
    render(
      <TypeDefinition
        title="Navigation item"
        typeName="NavigationItem"
        headingId="navigation"
        headingLevel={4}
        titleMetadata="2 declared fields"
        triggerHint="TypeScript source"
      >
        <button type="button">Copy source</button>
      </TypeDefinition>,
    );
    const toggle = screen.getByRole("button", { name: "View Definition: NavigationItem" });
    expect(screen.getByRole("heading", { level: 4 })).toHaveAttribute("id", "navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("2 declared fields")).toBeVisible();
    expect(toggle).toContainElement(screen.getByText("TypeScript source"));
    expect(toggle.querySelector("button, a, [tabindex]")).toBeNull();
    expect(screen.queryByText("Copy source")).toBeNull();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Hide Definition: NavigationItem");
    expect(toggle).toContainElement(screen.getByText("TypeScript source"));
    expect(toggle).toHaveAttribute("aria-controls", "navigation-content");
    expect(document.getElementById("navigation-content")).toContainElement(
      screen.getByText("Copy source"),
    );
    fireEvent.click(toggle);
    await waitFor(() => expect(screen.queryByText("Copy source")).toBeNull());
  });

  it("delegates controlled changes to the owner and keeps labels synchronized", () => {
    const onOpenChange = vi.fn();
    const props = {
      title: "Options",
      typeName: "Options",
      onOpenChange,
      expandLabel: "Inspect",
      collapseLabel: "Close",
    };
    const { rerender } = render(
      <TypeDefinition {...props} open={false}>
        Definition
      </TypeDefinition>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Inspect: Options" }));
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    rerender(
      <TypeDefinition {...props} open>
        Definition
      </TypeDefinition>,
    );
    expect(screen.getByRole("button", { name: "Close: Options" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it("keeps generated IDs independent and header actions outside the trigger", () => {
    render(
      <>
        <TypeDefinition
          title="First"
          typeName="First"
          defaultOpen
          metadata="Required: name"
          headerAction={<a href="#source">Source</a>}
          data-testid="card"
          aria-label="First reference"
        >
          One
        </TypeDefinition>
        <TypeDefinition title="Second" typeName="Second">
          Two
        </TypeDefinition>
      </>,
    );
    const triggers = screen.getAllByRole("button");
    expect(triggers[0].getAttribute("aria-controls")).not.toBe(
      triggers[1].getAttribute("aria-controls"),
    );
    expect(triggers[0]).not.toContainElement(screen.getByRole("link"));
    expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "type-definition");
    expect(screen.getByTestId("card")).toHaveAttribute("aria-label", "First reference");
    expect(screen.getByText("Required: name")).toBeVisible();
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.queryByText("Two")).toBeNull();
  });

  it("renders deterministic explicit anchors and initial state without browser effects", () => {
    const html = renderToString(
      <TypeDefinition title="Server" typeName="Server" headingId="server-type" defaultOpen>
        <code>type Server = string;</code>
      </TypeDefinition>,
    );
    expect(html).toContain('aria-controls="server-type-content"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain("type Server = string;");
  });
});
