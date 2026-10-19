import { Slider } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const ControlledSliderPreview = () => {
  const [value, setValue] = useState(33);

  return (
    <div class="docs-slider-demo !p-3 w-full max-w-md">
      <div class="docs-slider-demo-head !mb-2">
        <span class="docs-slider-demo-label">Temperature</span>
        <span class="docs-slider-demo-value">{value}</span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={value}
        class="w-full"
        onValueChange={(v) => setValue(v[0] ?? 0)}
      />
      <div class="docs-slider-demo-scale" aria-hidden="true">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
};

/** Mirrors shadcn controlled example with a two-value range on a 0–1 scale. */
const ControlledRangePreview = () => {
  const [value, setValue] = useState([0.3, 0.7]);

  return (
    <div class="docs-slider-demo !p-3 w-full max-w-md">
      <div class="docs-slider-demo-head !mb-2">
        <span class="docs-slider-demo-label">Temperature</span>
        <span class="docs-slider-demo-value text-xs">
          {value.map((v) => v.toFixed(2)).join(", ")}
        </span>
      </div>
      <Slider min={0} max={1} step={0.01} value={value} onValueChange={setValue} class="w-full" />
    </div>
  );
};

const SLIDER_INSTALLATION_PREVIEW_CODE = `import { Slider } from "@/components/kamod-ui/slider";

export const Example = () => (
  <div class="docs-slider-demo !p-3 w-full max-w-md">
    <p class="docs-slider-demo-label !mb-2">Default</p>
    <Slider defaultValue={[33]} class="w-full" />
  </div>
);`;

const SliderInstallationPreview = () => (
  <div class="docs-slider-demo !p-3 w-full max-w-md">
    <p class="docs-slider-demo-label !mb-2">Default</p>
    <Slider defaultValue={[33]} class="w-full" />
  </div>
);

const BASIC_SLIDER_CODE = `import { Slider } from "@/components/kamod-ui/slider";

export const Example = () => (
  <div class="docs-slider-demo !p-3 w-full max-w-md">
    <p class="docs-slider-demo-label !mb-2">Basic</p>
    <Slider defaultValue={[33]} max={100} step={1} class="w-full" />
  </div>
);`;

export const sliderDocPage = createGenericDocPage({
  slug: "slider",
  title: "Slider",
  usageLabel: "Slider lets users pick numeric values from a range with modern visual feedback.",
  installationText:
    "Import Slider from `@/components/kamod-ui/slider`. The live preview below matches the kitchen sink default (single thumb, shadcn-style array defaultValue).",
  installationExample: {
    code: SLIDER_INSTALLATION_PREVIEW_CODE,
    renderPreview: () => <SliderInstallationPreview />,
  },
  usageText:
    "Pass `defaultValue` or `value` as a number or array (one thumb per entry). Use `onValueChange` for controlled updates.",
  exampleSections: [
    {
      id: "basic-slider",
      title: "Basic (Shadcn-Style Array)",
      text: "**Expose a Value that Users Can Understand.** Use an array containing one number for a single-thumb `Slider`, such as `defaultValue={[50]}`. The shared array-based value model also supports range and multi-thumb examples, so the control's data shape stays consistent as the pattern grows.\n\nProvide an accessible name and a visible value with units, and choose bounds that match the actual setting rather than the demonstration's arbitrary scale.",
      code: BASIC_SLIDER_CODE,
      renderPreview: () => (
        <div class="docs-slider-demo !p-3 w-full max-w-md">
          <p class="docs-slider-demo-label !mb-2">Basic</p>
          <Slider defaultValue={[33]} max={100} step={1} class="w-full" />
          <div class="docs-slider-demo-scale" aria-hidden="true">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      ),
    },
    {
      id: "range-slider",
      title: "Range",
      text: "**Explain the Lower and Upper Bounds Separately.** Pass two values to represent the lower and upper bounds of a range. The filled track between the thumbs visualizes that interval, while nearby labels should explain the units and the meaning of both boundaries.\n\nGive each endpoint a meaningful name, show the current interval in text and decide how the application handles adjacent or equal values before connecting the control to filtering or pricing logic.",
      code: `import { Slider } from "@/components/kamod-ui/slider";

export const Example = () => (
  <div class="docs-slider-demo !p-3 w-full max-w-md">
    <p class="docs-slider-demo-label !mb-2">Range</p>
    <Slider defaultValue={[25, 75]} max={100} step={1} class="w-full" />
  </div>
);`,
      renderPreview: () => (
        <div class="docs-slider-demo !p-3 w-full max-w-md">
          <p class="docs-slider-demo-label !mb-2">Range</p>
          <Slider defaultValue={[25, 75]} max={100} step={1} class="w-full" />
          <div class="docs-slider-demo-scale" aria-hidden="true">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      ),
    },
    {
      id: "multiple-thumbs",
      title: "Multiple Thumbs",
      text: "**Use Several Handles Only When Their Roles Are Clear.** Supply three or more values when the task needs several positions on one scale. Each thumb represents an entry in the array, so the surrounding explanation must distinguish their roles instead of presenting an ambiguous collection of handles.\n\nLabel the values distinctly, keep the ordering rules explicit and offer another input method when precise adjustments become difficult.",
      code: `import { Slider } from "@/components/kamod-ui/slider";

export const Example = () => (
  <div class="docs-slider-demo !p-3 w-full max-w-md">
    <p class="docs-slider-demo-label !mb-2">Multiple thumbs</p>
    <Slider defaultValue={[25, 50, 75]} max={100} step={1} class="w-full" />
  </div>
);`,
      renderPreview: () => (
        <div class="docs-slider-demo !p-3 w-full max-w-md">
          <p class="docs-slider-demo-label !mb-2">Multiple thumbs</p>
          <Slider defaultValue={[25, 50, 75]} max={100} step={1} class="w-full" />
          <div class="docs-slider-demo-scale" aria-hidden="true">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      ),
    },
    {
      id: "stepped-slider",
      title: "Stepped",
      text: "**Make Each Increment Meaningful.** Set `step` to restrict the slider to meaningful increments rather than every possible point on the scale. Align the step with the units shown to users so the displayed value and allowed adjustments describe the same precision.\n\nShow the current value, check the relationship between minimum, maximum and step, and verify keyboard adjustments alongside pointer dragging.",
      code: `import { Slider } from "@/components/kamod-ui/slider";

export const Example = () => (
  <div class="docs-slider-demo !p-3 w-full max-w-md">
    <p class="docs-slider-demo-label !mb-2">Stepped</p>
    <Slider defaultValue={[20]} min={0} max={100} step={10} class="w-full" />
  </div>
);`,
      renderPreview: () => (
        <div class="docs-slider-demo !p-3 w-full max-w-md">
          <p class="docs-slider-demo-label !mb-2">Stepped</p>
          <Slider defaultValue={[20]} min={0} max={100} step={10} class="w-full" />
          <div class="docs-slider-demo-scale" aria-hidden="true">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      ),
    },
    {
      id: "controlled-slider",
      title: "Controlled (Single)",
      text: "**Keep the Setting Synchronized with External State.** Pass a state-backed value array and update it through `onValueChange` for a controlled slider. Even one thumb produces a `number[]`, allowing another control or readout to share exactly the same selected value.\n\nAvoid firing expensive work for every drag update without considering the workflow, and distinguish live preview from committing a persisted preference.",
      code: `import { Slider } from "@/components/kamod-ui/slider";
import { useState } from "preact/hooks";

export const Example = () => {
  const [value, setValue] = useState(33);
  return (
    <div class="docs-slider-demo !p-3 w-full max-w-md">
      <div class="docs-slider-demo-head !mb-2">
        <span class="docs-slider-demo-label">Temperature</span>
        <span class="docs-slider-demo-value">{value}</span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={value}
        class="w-full"
        onValueChange={(v) => setValue(v[0] ?? 0)}
      />
    </div>
  );
};`,
      renderPreview: () => <ControlledSliderPreview />,
    },
    {
      id: "controlled-range-slider",
      title: "Controlled (Range)",
      text: "**Keep Fractional Endpoints Readable.** Control both range values in parent state and choose a fractional step when the measurement requires finer precision. The two thumbs describe one interval, so supporting readouts should use the same units and rounding conventions.\n\nTest the smallest and largest permitted intervals, including adjustments made with the keyboard. Check the submitted numbers against the displayed endpoints so formatting does not silently change the measurement the user chose.",
      code: `import { Slider } from "@/components/kamod-ui/slider";
import { useState } from "preact/hooks";

export const Example = () => {
  const [value, setValue] = useState([0.3, 0.7]);
  return (
    <div class="docs-slider-demo !p-3 w-full max-w-md">
      <div class="docs-slider-demo-head !mb-2">
        <span class="docs-slider-demo-label">Temperature</span>
        <span class="docs-slider-demo-value text-xs">
          {value.map((v) => v.toFixed(2)).join(", ")}
        </span>
      </div>
      <Slider min={0} max={1} step={0.01} value={value} onValueChange={setValue} class="w-full" />
    </div>
  );
};`,
      renderPreview: () => <ControlledRangePreview />,
    },
    {
      id: "disabled-slider",
      title: "Disabled",
      text: "**Explain Why the Value Cannot Change.** Set `disabled` on a single or range slider when its value is temporarily unavailable for editing. Keep the current position and explanation visible so the interface communicates the setting even while interaction is blocked.\n\nPlace prerequisites outside the control and restore the appropriate state when they are met; disabled appearance should not be the only explanation.",
      code: `import { Slider } from "@/components/kamod-ui/slider";

export const Example = () => (
  <div class="grid w-full max-w-md gap-4">
    <div class="docs-slider-demo !p-3">
      <p class="docs-slider-demo-label !mb-2">Disabled</p>
      <Slider defaultValue={[72]} disabled class="w-full" />
    </div>
    <div class="docs-slider-demo !p-3">
      <p class="docs-slider-demo-label !mb-2">Disabled range</p>
      <Slider defaultValue={[20, 80]} disabled class="w-full" />
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-full max-w-md gap-4">
          <div class="docs-slider-demo !p-3">
            <p class="docs-slider-demo-label !mb-2">Disabled</p>
            <Slider defaultValue={[72]} disabled class="w-full" />
          </div>
          <div class="docs-slider-demo !p-3">
            <p class="docs-slider-demo-label !mb-2">Disabled range</p>
            <Slider defaultValue={[20, 80]} disabled class="w-full" />
          </div>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "defaultValue", type: "number | number[]", defaultValue: "50 (single)" },
    { prop: "value", type: "number | number[]", defaultValue: "undefined" },
    { prop: "onValueChange", type: "(value: number[]) => void", defaultValue: "undefined" },
    { prop: "onValueCommit", type: "(value: number[]) => void", defaultValue: "undefined" },
    { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
    { prop: "min / max / step", type: "number", defaultValue: "0 / 100 / 1" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "onInput", type: "(event) => void", defaultValue: "undefined" },
    { prop: "class", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Provide a visible label or `aria-label`. For multi-thumb sliders, each thumb exposes a short default label; override via props spread to the first thumb where needed.",
});
