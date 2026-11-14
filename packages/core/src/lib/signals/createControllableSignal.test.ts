import { createControllableSignal } from "./createControllableSignal";

describe("createControllableSignal", () => {
  it("does not notify on creation or when the next value is identical", () => {
    const onChange = vi.fn();
    const control = createControllableSignal({ defaultValue: "alpha", onChange });

    expect(control.isControlled).toBe(false);
    expect(control.state.value).toBe("alpha");
    expect(onChange).not.toHaveBeenCalled();

    control.setState("alpha");
    expect(onChange).not.toHaveBeenCalled();

    control.setState("beta");
    expect(control.state.value).toBe("beta");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("beta");
  });

  it("keeps controlled updates external and applies them through sync", () => {
    const onChange = vi.fn();
    const control = createControllableSignal({
      value: "one",
      defaultValue: "fallback",
      onChange,
    });

    control.setState("two");
    expect(control.state.value).toBe("one");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("two");

    control.sync("two");
    expect(control.state.value).toBe("two");
    expect(onChange).toHaveBeenCalledTimes(1);

    control.sync("two");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("accepts a controlled undefined value", () => {
    const onChange = vi.fn();
    const control = createControllableSignal<string | undefined>({
      value: undefined,
      defaultValue: "fallback",
      controlled: true,
      onChange,
    });

    expect(control.isControlled).toBe(true);
    expect(control.state.value).toBeUndefined();
    expect(onChange).not.toHaveBeenCalled();

    control.setState(undefined);
    expect(onChange).not.toHaveBeenCalled();

    control.sync("chosen");
    expect(control.state.value).toBe("chosen");
    expect(onChange).not.toHaveBeenCalled();
  });
});
