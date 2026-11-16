interface ImportMeta {
  glob(pattern: string | string[]): Record<string, () => Promise<Record<string, unknown>>>;
}

declare module "node:fs" {
  export function readFileSync(path: string, encoding: "utf8"): string;
  export function statSync(path: string): { isFile(): boolean };
}

declare module "node:path" {
  export function dirname(path: string): string;
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
}

declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
}
