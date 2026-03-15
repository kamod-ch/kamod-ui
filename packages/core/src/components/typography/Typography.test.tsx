import { render, screen } from "@testing-library/preact";
import { Typography } from "./Typography";

describe("Typography", () => {
  it("renders paragraph by default", () => {
    render(<Typography>Default paragraph</Typography>);

    const el = screen.getByText("Default paragraph");
    expect(el.tagName).toBe("P");
    expect(el).toHaveAttribute("data-slot", "typography");
  });

  it("renders custom semantic element via as prop", () => {
    render(
      <Typography as="h3" variant="h3">
        Section title
      </Typography>
    );

    const el = screen.getByRole("heading", { level: 3, name: "Section title" });
    expect(el.tagName).toBe("H3");
    expect(el.className).toContain("text-2xl");
  });

  it("applies modern long-form variants", () => {
    render(
      <div>
        <Typography as="p" variant="large">
          Large copy
        </Typography>
        <Typography as="code" variant="inlineCode">
          inline
        </Typography>
        <Typography as="ul" variant="list">
          <li>Item</li>
        </Typography>
      </div>
    );

    expect(screen.getByText("Large copy").className).toContain("text-lg");
    expect(screen.getByText("inline").className).toContain("bg-muted");
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(list.className).toContain("list-disc");
  });

  it("merges custom classes with variant classes", () => {
    render(
      <Typography as="span" variant="muted" class="custom-utility">
        Helper text
      </Typography>
    );

    const el = screen.getByText("Helper text");
    expect(el.className).toContain("text-sm");
    expect(el.className).toContain("custom-utility");
  });

  it("keeps regression coverage for all variants", () => {
    const cases = [
      { text: "v-h1", as: "h1", variant: "h1", classToken: "text-4xl" },
      { text: "v-h2", as: "h2", variant: "h2", classToken: "text-3xl" },
      { text: "v-h3", as: "h3", variant: "h3", classToken: "text-2xl" },
      { text: "v-h4", as: "h4", variant: "h4", classToken: "text-xl" },
      { text: "v-p", as: "p", variant: "p", classToken: "leading-7" },
      { text: "v-quote", as: "blockquote", variant: "blockquote", classToken: "border-l-2" },
      { text: "v-code", as: "code", variant: "code", classToken: "bg-muted" },
      { text: "v-inline-code", as: "code", variant: "inlineCode", classToken: "bg-muted" },
      { text: "v-list", as: "ul", variant: "list", classToken: "list-disc" },
      { text: "v-table", as: "div", variant: "table", classToken: "w-full" },
      { text: "v-lead", as: "p", variant: "lead", classToken: "text-xl" },
      { text: "v-large", as: "p", variant: "large", classToken: "text-lg" },
      { text: "v-muted", as: "p", variant: "muted", classToken: "text-sm" },
      { text: "v-small", as: "small", variant: "small", classToken: "leading-none" }
    ] as const;

    render(
      <div>
        {cases.map((testCase) => (
          <Typography key={testCase.text} as={testCase.as} variant={testCase.variant}>
            {testCase.variant === "list" ? <li>{testCase.text}</li> : testCase.text}
          </Typography>
        ))}
      </div>
    );

    for (const testCase of cases) {
      const textNode = screen.getByText(testCase.text);
      const el = testCase.variant === "list" ? textNode.closest("ul") : textNode;
      expect(el).not.toBeNull();
      expect((el as HTMLElement).className).toContain(testCase.classToken);
    }
  });
});
