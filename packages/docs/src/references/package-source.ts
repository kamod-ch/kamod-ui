import catalog from "virtual:kamod-code-references";
import { rootPackageName } from "./catalog/packages";

/** A specific verified export destination, without silently falling back to its package owner. */
export function packageEntrypointSource(module: string): string | undefined {
  return Object.hasOwn(catalog.packageSources, module) ? catalog.packageSources[module] : undefined;
}

/** Exact checked-out entrypoint, then its verified package owner; never synthesize a subpath URL. */
export function packageSource(module: string): string | undefined {
  return packageEntrypointSource(module) ?? packageEntrypointSource(rootPackageName(module));
}
