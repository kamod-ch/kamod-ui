import manifest from "./generated/component-api.json";

export type ComponentApiProp = {
  name: string;
  type: string;
  optional: boolean;
  default: string | null;
  description: string;
};

export type ComponentApiComponent = {
  name: string;
  propsType: string;
  props: ComponentApiProp[];
};

export type ComponentApiExport = {
  export: string;
  specifier: string;
  slug: string;
  signals: "direct" | "indirect" | "none";
  signalsVia: string | null;
  size: { min: number; gzip: number };
  peers: string[];
  components: ComponentApiComponent[];
};

const entries = manifest.exports as ComponentApiExport[];

export function componentApiExport(slug: string) {
  return entries.find((entry) => entry.slug === slug);
}

export function componentApiExports() {
  return entries;
}
