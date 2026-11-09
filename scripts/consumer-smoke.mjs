#!/usr/bin/env node
/**
 * Pack workspace @kamod-ch/ui (and optional peers) and typecheck minimal consumer snippets
 * without docs aliases — mirrors documented copy paths, not npm registry installs.
 */
import { execSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function packPackage(relativeDir) {
  const cwd = join(root, relativeDir);
  const out = execSync("pnpm pack --pack-destination /tmp", { cwd, encoding: "utf8" }).trim();
  return out.split("\n").pop();
}

const uiTarball = packPackage("packages/core");
const themesTarball = packPackage("packages/themes");

const work = await mkdtemp(join(tmpdir(), "kamod-ui-consumer-smoke-"));
const consumer = join(work, "consumer");
await mkdir(join(consumer, "src"), { recursive: true });

await writeFile(
  join(consumer, "package.json"),
  JSON.stringify(
    {
      name: "kamod-ui-consumer-smoke",
      private: true,
      type: "module",
      dependencies: {
        "@kamod-ch/ui": `file:${uiTarball}`,
        "@kamod-ch/themes": `file:${themesTarball}`,
        "@preact/signals": "^2.11.4",
        preact: "^11.1.1",
      },
      devDependencies: {
        typescript: "^6.0.3",
      },
    },
    null,
    2,
  ),
);

await writeFile(
  join(consumer, "src", "App.tsx"),
  `import { Button } from "@kamod-ch/ui/button";
import { Input } from "@kamod-ch/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@kamod-ch/ui/dialog";
export function App() {
  return (
  <Dialog>
    <DialogTrigger>
      <Button>Open</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogTitle>Profile</DialogTitle>
      <Input placeholder="Name" />
    </DialogContent>
  </Dialog>
  );
}
`,
);

await writeFile(
  join(consumer, "src", "theme-only.tsx"),
  `/** Consumer without @kamod-ch/themes runtime — CSS import paths only. */
import "@kamod-ch/ui/theme.css";
import { Button } from "@kamod-ch/ui/button";
export const ready = () => <Button type="button">OK</Button>;
`,
);

await writeFile(
  join(consumer, "src", "css.d.ts"),
  `declare module "*.css" {\n  const href: string;\n  export default href;\n}\n`,
);

await writeFile(
  join(consumer, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        jsxImportSource: "preact",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ["src/**/*.ts", "src/**/*.tsx"],
    },
    null,
    2,
  ),
);

execSync("npm install --ignore-scripts", { cwd: consumer, stdio: "inherit" });
execSync("npx tsc -p tsconfig.json", { cwd: consumer, stdio: "inherit" });

await rm(work, { recursive: true, force: true });
console.log("consumer-smoke: packed @kamod-ch/ui + peers, typecheck OK (local pack, not registry)");
