import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const docsRoot = fileURLToPath(new URL("..", import.meta.url));

// Keep upstream branding, with the same stable font-loading policy as the site.
execFileSync("kamod-brand-sync-docs", ["--target", "public"], {
  cwd: docsRoot,
  stdio: "inherit",
});
const stylesheet = new URL("../public/styles/logo.css", import.meta.url);
const css = readFileSync(stylesheet, "utf8");
const stable = css.replaceAll("&display=swap", "&display=optional");
if (stable !== css) writeFileSync(stylesheet, stable);
