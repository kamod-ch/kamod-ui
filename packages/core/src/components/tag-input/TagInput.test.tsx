import { fireEvent, render, screen } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { TagInput } from "./TagInput";
import type { TagInputProps, TagInputTag } from "./tag-input-types";

const ControlledTagInput = ({
  initial = [] as TagInputTag[],
  onValueChange,
  ...rest
}: Omit<TagInputProps, "value" | "defaultValue"> & {
  initial?: TagInputTag[];
  onValueChange?: (tags: TagInputTag[]) => void;
}) => {
  const [tags, setTags] = useState(initial);
  return (
    <TagInput
      value={tags}
      onValueChange={(next) => {
        setTags(next);
        onValueChange?.(next);
      }}
      labels={{ inputPlaceholder: "Add keyword" }}
      {...rest}
    />
  );
};

const getField = () => document.querySelector('[data-slot="tag-input-field"]') as HTMLInputElement;

describe("TagInput", () => {
  it("commits a tag on Enter", () => {
    const onValueChange = vi.fn();
    render(<ControlledTagInput onValueChange={onValueChange} />);
    const field = getField();
    fireEvent.input(field, { target: { value: "design" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ value: "design" })]);
    expect(screen.getByText("design")).toBeInTheDocument();
  });

  it("does not commit during IME composition", () => {
    const onValueChange = vi.fn();
    render(<ControlledTagInput onValueChange={onValueChange} />);
    const field = getField();
    fireEvent.input(field, { target: { value: "nihongo" } });
    fireEvent.compositionStart(field);
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.compositionEnd(field);
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalled();
  });

  it("shows validation errors and keeps invalid draft", () => {
    render(
      <ControlledTagInput
        validation={{ maxTagLength: 3 }}
        labels={{ invalidTag: "Duplicate tag" }}
      />,
    );
    const field = getField();
    fireEvent.input(field, { target: { value: "toolong" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(screen.getByRole("alert")).toHaveTextContent(/at most 3/);
    expect(field).toHaveValue("toolong");
  });

  it("rejects duplicate tags", () => {
    render(
      <ControlledTagInput
        initial={[{ id: "1", value: "alpha" }]}
        labels={{ invalidTag: "Duplicate tag" }}
      />,
    );
    const field = getField();
    fireEvent.input(field, { target: { value: "Alpha" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate tag");
    expect(screen.getAllByText("alpha")).toHaveLength(1);
  });

  it("splits pasted tags when enabled", () => {
    const onValueChange = vi.fn();
    render(
      <ControlledTagInput
        onValueChange={onValueChange}
        separators={[",", "Enter"]}
        enablePasteSplit
      />,
    );
    const field = getField();
    fireEvent.paste(field, {
      clipboardData: {
        getData: () => "one, two\nthree",
      },
    });
    expect(onValueChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ value: "one" }),
      expect.objectContaining({ value: "two" }),
      expect.objectContaining({ value: "three" }),
    ]);
  });

  it("removes one tag at a time with Backspace in an empty field", () => {
    render(
      <ControlledTagInput
        initial={[
          { id: "1", value: "one" },
          { id: "2", value: "two" },
          { id: "3", value: "three" },
        ]}
      />,
    );
    const field = getField();
    fireEvent.keyDown(field, { key: "Backspace" });
    expect(screen.queryByText("three")).not.toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    fireEvent.keyDown(field, { key: "Backspace" });
    expect(screen.queryByText("two")).not.toBeInTheDocument();
  });

  it("removes tags via labeled remove buttons", () => {
    render(<ControlledTagInput initial={[{ id: "1", value: "alpha" }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove tag alpha" }));
    expect(screen.queryByText("alpha")).not.toBeInTheDocument();
  });

  it("moves focus between tags with arrow keys when draft is empty", () => {
    render(
      <ControlledTagInput
        initial={[
          { id: "1", value: "one" },
          { id: "2", value: "two" },
        ]}
      />,
    );
    const field = getField();
    fireEvent.keyDown(field, { key: "ArrowLeft" });
    expect(screen.getByText("two").closest("[data-tag-id]")).toHaveAttribute(
      "data-focused",
      "true",
    );
    fireEvent.keyDown(field, { key: "ArrowLeft" });
    expect(screen.getByText("one").closest("[data-tag-id]")).toHaveAttribute(
      "data-focused",
      "true",
    );
  });
});
