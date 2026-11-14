import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Switch } from "./switch";

const formOf = (container: Element) => container.querySelector("form") as HTMLFormElement;

describe("native form integration", () => {
  it("submits, validates, and resets a checkbox", async () => {
    const { container } = render(
      <form>
        <Checkbox name="agree" required aria-label="Agree" />
      </form>,
    );
    const form = formOf(container);
    const checkbox = screen.getByRole("checkbox", { name: "Agree" });

    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).get("agree")).toBeNull();

    fireEvent.click(checkbox);
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get("agree")).toBe("on");

    form.reset();
    await waitFor(() => expect(checkbox).not.toBeChecked());
    expect(new FormData(form).get("agree")).toBeNull();
    expect(form.checkValidity()).toBe(false);
  });

  it("submits, validates, and resets a switch", async () => {
    const { container } = render(
      <form>
        <Switch name="alerts" required aria-label="Alerts" />
      </form>,
    );
    const form = formOf(container);
    const control = screen.getByRole("switch", { name: "Alerts" });

    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).get("alerts")).toBeNull();

    fireEvent.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get("alerts")).toBe("on");

    form.reset();
    await waitFor(() => expect(control).toHaveAttribute("aria-checked", "false"));
    expect(new FormData(form).get("alerts")).toBeNull();
    expect(form.checkValidity()).toBe(false);
  });

  it("submits, validates, and resets a radio group", async () => {
    const { container } = render(
      <form>
        <RadioGroup name="plan" required>
          <RadioGroupItem value="a">Annual</RadioGroupItem>
          <RadioGroupItem value="b">Monthly</RadioGroupItem>
        </RadioGroup>
      </form>,
    );
    const form = formOf(container);

    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).get("plan")).toBeNull();

    fireEvent.click(screen.getByRole("radio", { name: "Monthly" }));
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get("plan")).toBe("b");

    form.reset();
    await waitFor(() => expect(screen.getByRole("radio", { name: "Monthly" })).not.toBeChecked());
    expect(new FormData(form).get("plan")).toBeNull();
    expect(form.checkValidity()).toBe(false);
  });

  it("submits, validates, and resets a select", async () => {
    const { container } = render(
      <form>
        <Select name="framework" required>
          <SelectTrigger aria-label="Framework">
            <SelectValue placeholder="Pick a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="preact">Preact</SelectItem>
            <SelectItem value="solid">Solid</SelectItem>
          </SelectContent>
        </Select>
      </form>,
    );
    const form = formOf(container);

    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).get("framework")).toBe("");

    fireEvent.click(screen.getByRole("button", { name: "Framework" }));
    fireEvent.click(screen.getByRole("option", { name: "Solid" }));
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get("framework")).toBe("solid");

    form.reset();
    await waitFor(() => expect(screen.getByText("Pick a framework")).toBeInTheDocument());
    expect(new FormData(form).get("framework")).toBe("");
    expect(form.checkValidity()).toBe(false);
  });
});
