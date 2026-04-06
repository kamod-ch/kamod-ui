import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(new URL("../../../", import.meta.url).pathname);
const foundationPath = resolve(repoRoot, "apps/demo/src/styles/foundation.css");
const stylesDir = resolve(repoRoot, "apps/demo/src/styles");
const themeFiles = [
  "themes/kamod.css",
  "themes/shadcn.css",
  "themes/ocean.css",
  "themes/sunset.css",
  "themes/cursor-warm.css",
  "themes/voltage.css",
  "themes/watson.css",
  "themes/professional.css"
];

const foundationCss =
  readFileSync(foundationPath, "utf8") +
  "\n" +
  themeFiles.map((rel) => readFileSync(resolve(stylesDir, rel), "utf8")).join("\n");

const presetChecks = {
  kamod: "minimal",
  shadcn: "font",
  ocean: "full",
  sunset: "full",
  "cursor-warm": "full",
  voltage: "full",
  watson: "full",
  professional: "full"
};

const requiredColorTokens = [
  "--background",
  "--foreground",
  "--card",
  "--primary",
  "--muted",
  "--border",
  "--input",
  "--outline"
];
const requiredFontTokens = ["--font-sans", "--font-mono"];

const extractBlock = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = foundationCss.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));
  return match?.[1] ?? "";
};

const validatePreset = (preset, mode) => {
  const lightBlock = extractBlock(`:root[data-theme="${preset}"]`);
  const darkBlock = extractBlock(`.dark[data-theme="${preset}"]`);

  const colorLight = requiredColorTokens.filter((token) => !lightBlock.includes(token));
  const colorDark = requiredColorTokens.filter((token) => !darkBlock.includes(token));
  const fontLight = requiredFontTokens.filter((token) => !lightBlock.includes(token));
  const fontDark = requiredFontTokens.filter((token) => !darkBlock.includes(token));

  const missingLight = mode === "full" ? colorLight : mode === "font" ? fontLight : [];
  const missingDark = mode === "full" ? colorDark : mode === "font" ? fontDark : [];
  const requiresDarkBlock = mode === "full" || mode === "font";

  return {
    preset,
    mode,
    hasLight: Boolean(lightBlock.trim()),
    hasDark: requiresDarkBlock ? Boolean(darkBlock.trim()) : true,
    missingLight,
    missingDark
  };
};

const results = Object.entries(presetChecks).map(([preset, mode]) => validatePreset(preset, mode));
const hasErrors = results.some(
  (item) => !item.hasLight || !item.hasDark || item.missingLight.length > 0 || item.missingDark.length > 0
);

const checklist = `# Theme Regression Checklist

Generated: ${new Date().toISOString()}

## Static token validation
${results
  .map((result) => {
    const status =
      result.hasLight &&
      result.hasDark &&
      result.missingLight.length === 0 &&
      result.missingDark.length === 0
        ? "PASS"
        : "FAIL";
    return `- [${status === "PASS" ? "x" : " "}] \`${result.preset}\` (${status}, mode: ${result.mode})
  - light block: ${result.hasLight ? "ok" : "missing"}
  - dark block: ${result.hasDark ? "ok" : "missing"}
  - missing light tokens: ${result.missingLight.length ? result.missingLight.join(", ") : "none"}
  - missing dark tokens: ${result.missingDark.length ? result.missingDark.join(", ") : "none"}`;
  })
  .join("\n")}

## Manual visual QA (per preset + light/dark)
- [ ] Button: default / outline / destructive
- [ ] Input: background, border, focus ring, placeholder readability
- [ ] Card: surface separation from page background
- [ ] Dialog: overlay contrast + content readability
- [ ] Select: trigger/content contrast and hover states
- [ ] Topbar + Sidebar: border contrast and active item visibility
- [ ] Code blocks: monospace readability and syntax contrast
`;

mkdirSync(resolve(repoRoot, "tmp"), { recursive: true });
const checklistPath = resolve(repoRoot, "tmp/theme-regression-checklist.md");
writeFileSync(checklistPath, checklist, "utf8");

if (hasErrors) {
  console.error("Theme regression static checks failed. See tmp/theme-regression-checklist.md");
  process.exit(1);
}

console.log("Theme regression static checks passed.");
console.log("Checklist written to tmp/theme-regression-checklist.md");
