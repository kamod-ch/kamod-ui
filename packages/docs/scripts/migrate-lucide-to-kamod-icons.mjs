#!/usr/bin/env node
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "../../..");
const iconsIndex = readFileSync(
  resolve(repoRoot, "../kamod-icons/packages/core/src/sets/lucide/index.ts"),
  "utf8",
);
const kamodExports = new Set(
  [...iconsIndex.matchAll(/export \{ (\w+) \}/g)].map((match) => match[1]),
);

const MANUAL = {
  AlignLeft: "TextAlignStartIcon",
  AlignRight: "TextAlignEndIcon",
  AlignCenter: "TextAlignCenterIcon",
  CheckCircle2: "CircleCheckIcon",
  AlertCircle: "CircleAlertIcon",
  AlertTriangle: "TriangleAlertIcon",
  Loader2: "LoaderCircleIcon",
  MoreHorizontal: "EllipsisIcon",
  HelpCircle: "CircleQuestionMarkIcon",
  Calendar: "CalendarIcon",
  Home: "HouseIcon",
  Check: "CheckIcon",
  X: "XIcon",
  Bot: "BotIcon",
  Bookmark: "BookmarkIcon",
  FileText: "FileTextIcon",
  FolderOpen: "FolderOpenIcon",
  Save: "SaveIcon",
  Trash2: "Trash2Icon",
  ExternalLink: "ExternalLinkIcon",
  Inbox: "InboxIcon",
  Bell: "BellIcon",
  Cloud: "CloudIcon",
  Folder: "FolderIcon",
  Clock: "ClockIcon",
  File: "FileIcon",
  Settings: "SettingsIcon",
  Info: "InfoIcon",
  Plus: "PlusIcon",
  Search: "SearchIcon",
  ArrowRight: "ArrowRightIcon",
  ArrowUp: "ArrowUpIcon",
  ArrowUpRight: "ArrowUpRightIcon",
  GitBranch: "GitBranchIcon",
  Bold: "BoldIcon",
  Italic: "ItalicIcon",
  Underline: "UnderlineIcon",
  ChevronDown: "ChevronDownIcon",
  ChevronRight: "ChevronRightIcon",
  ChevronsUpDown: "ChevronsUpDownIcon",
  RefreshCw: "RefreshCwIcon",
  ShieldAlert: "ShieldAlertIcon",
  BadgeCheck: "BadgeCheckIcon",
  Bluetooth: "BluetoothIcon",
  CircleFadingPlus: "CircleFadingPlusIcon",
  Dot: "DotIcon",
  EyeOff: "EyeOffIcon",
  FileCode: "FileCodeIcon",
  CornerDownLeft: "CornerDownLeftIcon",
  ArrowUpDown: "ArrowUpDownIcon",
  AudioLines: "AudioLinesIcon",
  Minus: "MinusIcon",
};

function resolveKamod(lucideName) {
  if (MANUAL[lucideName]) return MANUAL[lucideName];
  const direct = `${lucideName}Icon`;
  if (kamodExports.has(direct)) return direct;
  return `${lucideName}Icon`;
}

function parseImportSpecifiers(body) {
  const specs = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === "," && depth === 0) {
      specs.push(body.slice(start, i).trim());
      start = i + 1;
    }
  }
  specs.push(body.slice(start).trim());
  return specs.filter(Boolean);
}

function migrateFileContent(source) {
  const renameMap = new Map();
  let out = source;

  const snippetFixes = [
    [
      /import \{ Toaster, useToast \} from "lucide-preact"/g,
      'import { Toaster, useToast } from "@kamod-ch/ui/toast"',
    ],
    [
      /import \{ dismissSonner \} from "lucide-preact"/g,
      'import { dismissSonner } from "@kamod-ch/ui/sonner"',
    ],
    [
      /import \{ useDirection \} from "lucide-preact"/g,
      'import { useDirection } from "@kamod-ch/ui/direction"',
    ],
    [
      /import \{ REGEXP_ONLY_DIGITS_AND_CHARS \} from "lucide-preact"/g,
      'import { REGEXP_ONLY_DIGITS_AND_CHARS } from "@kamod-ch/ui/input-otp"',
    ],
    [
      /import \{ REGEXP_ONLY_DIGITS \} from "lucide-preact"/g,
      'import { REGEXP_ONLY_DIGITS } from "@kamod-ch/ui/input-otp"',
    ],
    [
      /import \{ ScrollBar \} from "lucide-preact"\s*\nimport \{ ScrollArea/g,
      "import { ScrollArea, ScrollBar",
    ],
    [/import \{ ScrollBar \} from "lucide-preact"\s*\nimport \{/g, "import { ScrollBar, "],
  ];
  for (const [pattern, replacement] of snippetFixes) out = out.replace(pattern, replacement);

  const importRe = /import\s+\{([^}]*)\}\s+from\s+["']lucide-preact["'];?/g;
  const replacements = [];
  let match;
  while ((match = importRe.exec(source)) !== null) {
    const specs = parseImportSpecifiers(match[1]);
    const nextNames = [];
    for (const spec of specs) {
      const aliasMatch = spec.match(/^(\w+)\s+as\s+(\w+)$/);
      const lucideName = aliasMatch ? aliasMatch[1] : spec.trim();
      const localName = aliasMatch ? aliasMatch[2] : lucideName;
      const kamod = resolveKamod(lucideName);
      if (aliasMatch && aliasMatch[2] === kamod) {
        nextNames.push(kamod);
        renameMap.set(lucideName, kamod);
        renameMap.set(localName, kamod);
      } else if (aliasMatch) {
        nextNames.push(`${kamod} as ${aliasMatch[2]}`);
        renameMap.set(lucideName, aliasMatch[2]);
      } else {
        nextNames.push(kamod);
        renameMap.set(lucideName, kamod);
      }
    }
    replacements.push({
      start: match.index,
      end: match.index + match[0].length,
      text: `import { ${nextNames.join(", ")} } from "@kamod-ch/icons/lucide";`,
    });
  }

  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i];
    out = out.slice(0, r.start) + r.text + out.slice(r.end);
  }

  const sortedKeys = [...renameMap.keys()].sort((a, b) => b.length - a.length);
  for (const from of sortedKeys) {
    const to = renameMap.get(from);
    const re = new RegExp(
      `(?<![A-Za-z0-9_])${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9_])`,
      "g",
    );
    out = out.replace(re, to);
  }

  out = out.replace(/from "lucide-preact"/g, 'from "@kamod-ch/icons/lucide"');
  return out;
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === "node_modules" || name === "dist") continue;
      walk(path, files);
    } else if (/\.tsx?$/.test(name)) files.push(path);
  }
  return files;
}

let changed = 0;
for (const file of walk(resolve(import.meta.dirname, "../src"))) {
  const before = readFileSync(file, "utf8");
  if (!before.includes("lucide-preact")) continue;
  const after = migrateFileContent(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`migrate-lucide: ${changed} files`);
