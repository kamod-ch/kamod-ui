declare module "virtual:kamod-component-api" {
  type Definition = import("./component-api").ComponentTypeDefinition;
  /** Populated only for synchronous static rendering. */
  export const sources: Record<string, Definition[]>;
  /** Each loader contains the declarations for one component folder. */
  export const loaders: Record<string, () => Promise<Definition[]>>;
}
