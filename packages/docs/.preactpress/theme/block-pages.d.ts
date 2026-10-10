declare module "virtual:kamod-block-pages" {
  import type { ComponentType } from "preact";

  type PageModule = Record<string, ComponentType>;
  /** Eager modules are generated only in the synchronous server-rendering build. */
  export const pages: Record<string, PageModule>;
  /** Browser modules are fetched only when a block detail or preview route is rendered. */
  export const loaders: Record<string, () => Promise<PageModule>>;
}

declare module "virtual:kamod-block-guides" {
  const sources: Record<string, string>;
  export default sources;
}

declare module "virtual:kamod-theming-guide" {
  const source: string;
  export default source;
}

declare module "virtual:kamod-getting-started" {
  const source: string;
  export default source;
}

declare module "virtual:kamod-doc-pages" {
  type Doc = import("../../src/docs/types").DocPageModule;
  export const docs: Record<string, Doc>;
  export const loaders: Record<string, () => Promise<Doc>>;
}
