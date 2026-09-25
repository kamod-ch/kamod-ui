declare module "virtual:kamod-block-pages" {
  import type { ComponentType } from "preact";

  type PageModule = Record<string, ComponentType>;
  /** Eager modules are generated only in the synchronous server-rendering build. */
  export const pages: Record<string, PageModule>;
  /** Browser modules are fetched only when a block detail or preview route is rendered. */
  export const loaders: Record<string, () => Promise<PageModule>>;
}
