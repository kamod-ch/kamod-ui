import { cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import { useControllableState } from "./controllable";

afterEach(() => cleanup());

const Probe = ({
  value,
  defaultValue,
  onChange,
}: {
  value?: string;
  defaultValue: string;
  onChange?: (next: string) => void;
}) => {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange });
  return (
    <button type="button" onClick={() => setCurrent((previous) => `${previous}-next`)}>
      {current}
    </button>
  );
};

describe("useControllableState", () => {
  it("updates locally when uncontrolled", () => {
    const { getByRole } = render(<Probe defaultValue="idle" />);
    const button = getByRole("button");
    expect(button.textContent).toBe("idle");
    fireEvent.click(button);
    expect(button.textContent).toBe("idle-next");
  });

  it("emits onChange without rewriting controlled value", () => {
    const seen: string[] = [];
    const { getByRole, rerender } = render(
      <Probe value="open" defaultValue="idle" onChange={(next) => seen.push(next)} />,
    );
    fireEvent.click(getByRole("button"));
    expect(getByRole("button").textContent).toBe("open");
    expect(seen).toEqual(["open-next"]);
    rerender(<Probe value="open-next" defaultValue="idle" onChange={(next) => seen.push(next)} />);
    expect(getByRole("button").textContent).toBe("open-next");
  });
});
