/** Minimal stub so copied demo modules resolve in the starter without the docs app. */
export const APP_BASE_URL = import.meta.env.BASE_URL;

export function withBasePath(path: string): string {
  const base = APP_BASE_URL.endsWith("/") ? APP_BASE_URL.slice(0, -1) : APP_BASE_URL;
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base || base === "") return p;
  return `${base}${p}`;
}
