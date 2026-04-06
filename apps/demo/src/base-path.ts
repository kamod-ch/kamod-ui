/** Vite `base` (always ends with `/`, or `/` for root). */
export const APP_BASE_URL = import.meta.env.BASE_URL;

/** Path prefix without trailing slash, e.g. `/kamod-ui`, or `""` at root. */
export function basePrefix(): string {
  const b = APP_BASE_URL;
  if (b === "/" || b === "") return "";
  return b.replace(/\/$/, "");
}

/** Full path for history and `<a href>` (app path like `/docs/foo`). */
export function withBasePath(path: string): string {
  const prefix = basePrefix();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!prefix) return p;
  if (p === "/") return `${prefix}/`;
  return `${prefix}${p}`;
}
