import catalog from "virtual:kamod-code-references";
import { rootPackageName } from "./catalog/packages";

/** Exact checked-out entrypoint, then its verified package owner; never synthesize a subpath URL. */
export function packageSource(module: string): string | undefined {
  const root = rootPackageName(module);
  return Object.hasOwn(catalog.packageSources, module)
    ? catalog.packageSources[module]
    : Object.hasOwn(catalog.packageSources, root)
      ? catalog.packageSources[root]
      : undefined;
}
