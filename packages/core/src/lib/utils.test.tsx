import { cn } from "./utils";

describe("cn", () => {
  it("merges simple strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores null, undefined, and false", () => {
    expect(cn("foo", null, undefined, false, "bar")).toBe("foo bar");
  });

  it("merges object and array inputs", () => {
    expect(cn(["foo", { bar: true, baz: false }], { qux: true })).toBe("foo bar qux");
  });

  it("merges conditional classes", () => {
    const active = true;
    const disabled = false;
    expect(cn("base", active && "active", disabled && "disabled")).toBe("base active");
  });

  it("resolves conflicting padding utilities in favor of the later class", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("resolves conflicting text size utilities in favor of the later class", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
    expect(cn("text-lg", "text-sm")).toBe("text-sm");
  });

  it("resolves responsive variants in favor of the later class", () => {
    expect(cn("md:p-2", "md:p-4")).toBe("md:p-4");
    expect(cn("lg:text-sm", "lg:text-lg")).toBe("lg:text-lg");
  });

  it("resolves hover and focus-visible variants in favor of the later class", () => {
    expect(cn("hover:bg-primary", "hover:bg-secondary")).toBe("hover:bg-secondary");
    expect(cn("focus-visible:ring-2", "focus-visible:ring-4")).toBe("focus-visible:ring-4");
  });

  it("resolves dark mode variants in favor of the later class", () => {
    expect(cn("dark:bg-background", "dark:bg-muted")).toBe("dark:bg-muted");
    expect(cn("dark:text-foreground", "dark:text-muted-foreground")).toBe(
      "dark:text-muted-foreground",
    );
  });

  it("preserves arbitrary values and resolves conflicts for the same property", () => {
    expect(cn("top-[13px]", "top-[17px]")).toBe("top-[17px]");
    expect(cn("w-[calc(100%-1rem)]", "foo")).toBe("w-[calc(100%-1rem)] foo");
  });

  it("preserves css-variable-based classes and resolves token conflicts", () => {
    expect(cn("bg-[var(--primary)]", "bg-[var(--secondary)]")).toBe("bg-[var(--secondary)]");
    expect(cn("text-[var(--foreground)]", "underline")).toBe("text-[var(--foreground)] underline");
  });

  it("lets later classes win across mixed input shapes", () => {
    expect(cn("p-2 text-sm", { "text-lg": true }, ["md:p-4", "md:p-2"])).toBe("p-2 text-lg md:p-2");
  });
});
