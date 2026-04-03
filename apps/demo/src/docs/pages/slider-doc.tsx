import { Slider } from "@kamod-ui/core";
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
    renderPreview: () => <SliderInstallationPreview />
  },
  usageText:
    "Pass `defaultValue` or `value` as a number or array (one thumb per entry). Use `onValueChange` for controlled updates.",
  exampleSections: [
    {
      id: "basic-slider",
      title: "Basic (shadcn-style array)",
      text: "Single thumb using array syntax, matching the Radix/shadcn API.",
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
      )
    },
    {
      id: "range-slider",
      title: "Range",
      text: "Two values produce a range slider with a filled track between the thumbs.",
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
      )
    },
    {
      id: "multiple-thumbs",
      title: "Multiple thumbs",
      text: "Use three or more values for multiple thumbs along the same track.",
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
      )
    },
    {
      id: "stepped-slider",
      title: "Stepped",
      text: "Use step values for discrete increments.",
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
      )
    },
    {
      id: "controlled-slider",
      title: "Controlled (single)",
      text: "Store the value in state; `onValueChange` receives a number array (length 1 for a single thumb).",
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
      renderPreview: () => <ControlledSliderPreview />
    },
    {
      id: "controlled-range-slider",
      title: "Controlled (range)",
      text: "Controlled range on a fractional scale, similar to the shadcn docs demo.",
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
      renderPreview: () => <ControlledRangePreview />
    },
    {
      id: "disabled-slider",
      title: "Disabled",
      text: "Disable interaction for single or range sliders.",
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
      )
    }
  ],
  apiRows: [
    { prop: "defaultValue", type: "number | number[]", defaultValue: "50 (single)" },
    { prop: "value", type: "number | number[]", defaultValue: "undefined" },
    { prop: "onValueChange", type: "(value: number[]) => void", defaultValue: "undefined" },
    { prop: "onValueCommit", type: "(value: number[]) => void", defaultValue: "undefined" },
    { prop: "orientation", type: "\"horizontal\" | \"vertical\"", defaultValue: "\"horizontal\"" },
    { prop: "min / max / step", type: "number", defaultValue: "0 / 100 / 1" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
    { prop: "onInput", type: "(event) => void", defaultValue: "undefined" },
    { prop: "class", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText:
    "Provide a visible label or `aria-label`. For multi-thumb sliders, each thumb exposes a short default label; override via props spread to the first thumb where needed."
});
