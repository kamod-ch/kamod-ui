import type { ComponentType } from "preact";

export type UipkgeBlockCategory =
  | "auth"
  | "commerce"
  | "communication"
  | "dashboard"
  | "marketing"
  | "app-sidebar";

export type CatalogBlockFileKind =
  | "component"
  | "support"
  | "registry"
  | "page"
  | "asset"
  | "fixture"
  | "test";

export type CatalogBlockFile = {
  path: string;
  label: string;
  kind: CatalogBlockFileKind;
};

export type CatalogBlockDefinition<Id extends string = string> = {
  id: Id;
  title: string;
  description: string;
  category: UipkgeBlockCategory;
  source: "uipkge";
  catalogUrl: string;
  /** Previewed as `<Preview />`; block defaults supply the public props. */
  component: ComponentType<any>;
  files: CatalogBlockFile[];
  dependencies: string[];
  uiComponents: string[];
  tags: string[];
  features: string[];
  preview: { height: number; fullWidth: boolean };
  installCommand: string;
};
