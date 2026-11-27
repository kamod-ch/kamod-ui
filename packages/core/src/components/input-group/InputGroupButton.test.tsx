import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { InputGroupButton } from "./InputGroupButton";

describe("InputGroupButton", () => {
  it("keeps the button classes when a tooltip trigger repeats the consumer class", () => {
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <InputGroupButton
            type="button"
            size="icon-sm"
            variant="ghost"
            class="text-muted-foreground"
            aria-label="Info"
          >
            <svg class="size-4" />
          </InputGroupButton>
        </TooltipTrigger>
        <TooltipContent>Info</TooltipContent>
      </Tooltip>,
    );

    const el = screen.getByRole("button", { name: "Info" });
    expect(el.className).toContain("text-muted-foreground");
    expect(el.className).toContain("inline-flex");
    expect(el.className).toContain("items-center");
    expect(el.className).toContain("size-8");
    expect(el.className).toContain("rounded-full");
  });
});
