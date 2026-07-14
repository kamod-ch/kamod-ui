import { createParser } from "@openuidev/react-lang";
import { render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { KAMOD_OPENUI_ADAPTER_VERSION } from "../constants";
import {
  CONTACT_FORM_LANG,
  DASHBOARD_LANG,
  EMPTY_STATE_LANG,
  SETTINGS_UI_LANG,
  SIMPLE_CARD_LANG,
  STATUS_CARD_LANG,
} from "../examples/fixtures";
import { kamodOpenUILibrary } from "../library/createLibrary";
import { createKamodOpenUISystemPrompt } from "../prompts";
import { KamodOpenUIRenderer } from "../renderer/KamodOpenUIRenderer";
import { actionSchema } from "../security/action";
import { validateNavigationTarget } from "../security/navigation";
import { spacingGapClass, toneToAlertVariant } from "../tokens/variants";

describe("tokens", () => {
  it("maps spacing and tone tokens", () => {
    expect(spacingGapClass.md).toBe("gap-4");
    expect(toneToAlertVariant.danger).toBe("error");
  });
});

describe("security", () => {
  it("validates action payloads", () => {
    expect(actionSchema.parse({ type: "event", name: "refresh" }).type).toBe("event");
    expect(() => actionSchema.parse({ type: "event", name: "" })).toThrow();
  });

  it("blocks dangerous navigation targets", () => {
    expect(validateNavigationTarget("javascript:alert(1)").allowed).toBe(false);
    expect(validateNavigationTarget("data:text/html,hi").allowed).toBe(false);
    expect(validateNavigationTarget("/settings").allowed).toBe(true);
    expect(validateNavigationTarget("https://evil.example", { allowExternal: false }).allowed).toBe(
      false,
    );
    expect(
      validateNavigationTarget("https://allowed.example", {
        allowExternal: true,
        allowedOrigins: ["https://allowed.example"],
      }).allowed,
    ).toBe(true);
  });
});

describe("library", () => {
  it("registers the expanded component set", () => {
    const names = Object.keys(kamodOpenUILibrary.components);
    expect(names).toEqual(
      expect.arrayContaining([
        "Stack",
        "Inline",
        "Grid",
        "Card",
        "Heading",
        "Text",
        "Divider",
        "Alert",
        "Badge",
        "Progress",
        "Skeleton",
        "Spinner",
        "Empty",
        "Avatar",
        "Label",
        "Tooltip",
        "Button",
        "Link",
        "Tabs",
        "Accordion",
        "Collapsible",
        "Form",
        "Field",
        "Input",
        "Textarea",
        "Select",
        "Checkbox",
        "Switch",
        "RadioGroup",
        "SubmitButton",
        "Dialog",
        "AlertDialog",
        "DatePicker",
        "Combobox",
        "RichSelect",
        "Slider",
        "Table",
        "DataTable",
        "Pagination",
        "Breadcrumb",
        "Popover",
        "HoverCard",
        "Dropdown",
        "Drawer",
        "Sheet",
        "ScrollArea",
        "Image",
        "Video",
        "InputOtp",
        "InputGroup",
        "SelectableCard",
        "Item",
        "ButtonGroup",
        "Toggle",
        "ToggleGroup",
        "Command",
        "Calendar",
        "Chart",
        "Toast",
        "Sonner",
        "Sidebar",
        "NavigationMenu",
        "Menubar",
        "ContextMenu",
        "AspectRatio",
        "Prose",
        "ThemeToggle",
        "Kbd",
        "LocaleSegmentGroup",
      ]),
    );
    expect(names.length).toBeGreaterThanOrEqual(60);
  });

  it("exposes adapter version", () => {
    expect(KAMOD_OPENUI_ADAPTER_VERSION).toBe("0.5.0");
  });
});

describe("prompts", () => {
  it("generates a system prompt from the library", () => {
    const prompt = createKamodOpenUISystemPrompt({ includeExamples: true });
    expect(prompt).toContain("Stack");
    expect(prompt).toContain("Form");
    expect(prompt.toLowerCase()).not.toContain("```");
  });
});

describe("parser fixtures", () => {
  const parser = createParser(kamodOpenUILibrary.toJSONSchema());

  it("parses status card example", () => {
    const result = parser.parse(STATUS_CARD_LANG);
    expect(result.root?.typeName).toBe("Stack");
    expect(result.meta.errors.filter((e) => e.code === "unknown-component")).toHaveLength(0);
  });

  it("parses contact form example", () => {
    const result = parser.parse(CONTACT_FORM_LANG);
    expect(result.root?.typeName).toBe("Form");
  });

  it("parses settings tabs example", () => {
    const result = parser.parse(SETTINGS_UI_LANG);
    expect(result.root?.typeName).toBe("Tabs");
  });

  it("parses empty state example", () => {
    const result = parser.parse(EMPTY_STATE_LANG);
    expect(result.root?.typeName).toBe("Stack");
    expect(result.meta.errors.filter((e) => e.code === "unknown-component")).toHaveLength(0);
  });

  it("parses dashboard example", () => {
    const result = parser.parse(DASHBOARD_LANG);
    expect(result.root?.typeName).toBe("Stack");
    const unknown = result.meta.errors.filter((e) => e.code === "unknown-component");
    expect(unknown, JSON.stringify(unknown)).toHaveLength(0);
  });

  it("reports unknown components", () => {
    const result = parser.parse(`root = NotARealComponent("x")`);
    expect(result.meta.errors.some((e) => e.code === "unknown-component")).toBe(true);
  });
});

describe("KamodOpenUIRenderer", () => {
  it("renders a simple card via preact/compat", () => {
    const { getByText } = render(<KamodOpenUIRenderer content={SIMPLE_CARD_LANG} />);
    expect(getByText("Welcome")).toBeTruthy();
    expect(getByText("Generated with @kamod-ch/openui.")).toBeTruthy();
  });

  it("renders status card content", () => {
    const { getByText } = render(<KamodOpenUIRenderer content={STATUS_CARD_LANG} />);
    expect(getByText("Healthy")).toBeTruthy();
    expect(getByText("All systems go")).toBeTruthy();
    expect(getByText("Refresh")).toBeTruthy();
  });

  it("invokes onAction for button events", async () => {
    const onAction = vi.fn();
    const { getByText } = render(
      <KamodOpenUIRenderer content={STATUS_CARD_LANG} onAction={onAction} />,
    );
    getByText("Refresh").click();
    expect(onAction).toHaveBeenCalled();
  });

  it("blocks external navigate by default", () => {
    const onError = vi.fn();
    const onAction = vi.fn();
    const lang = `root = Button("Go", "default", "md", false, { type: "navigate", target: "https://evil.example" })`;
    const { getByText } = render(
      <KamodOpenUIRenderer content={lang} onAction={onAction} onError={onError} />,
    );
    getByText("Go").click();
    expect(onAction).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });
});
