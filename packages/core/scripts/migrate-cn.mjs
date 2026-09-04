import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../src/components");

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(tsx|ts)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const CN_IMPORT = 'import { cn } from "../../lib/utils";';

function ensureCnImport(content) {
  if (content.includes('"../../lib/utils"')) {
    return content;
  }
  if (!content.includes("cn(")) {
    return content;
  }
  const lastImport = content.lastIndexOf("\nimport ");
  if (lastImport === -1) {
    return `${CN_IMPORT}\n${content}`;
  }
  const end = content.indexOf("\n", lastImport + 1);
  return `${content.slice(0, end + 1)}${CN_IMPORT}\n${content.slice(end + 1)}`;
}

function migrateContent(content) {
  let next = content;

  next = next.replace(
    /cn\((\w+)\(\{([^}]*?),\s*class:\s*className(?:\s+as\s+string\s+\|\s+undefined)?\s*\}\)\)/g,
    (_, fn, params) => {
      const cleaned = params.trim().replace(/,\s*$/, "");
      return cleaned ? `cn(${fn}({ ${cleaned} }), className)` : `cn(${fn}(), className)`;
    },
  );

  next = next.replace(
    /cn\((\w+)\(\{\s*class:\s*className(?:\s+as\s+string\s+\|\s+undefined)?\s*,\s*([^}]*)\}\)\)/g,
    (_, fn, params) => {
      const cleaned = params.trim().replace(/,\s*$/, "");
      return cleaned ? `cn(${fn}({ ${cleaned} }), className)` : `cn(${fn}(), className)`;
    },
  );

  next = next.replace(
    /class=\{(\w+)\(\{([^}]*?),\s*class:\s*className(?:\s+as\s+string\s+\|\s+undefined)?\s*\}\)\}/g,
    (_, fn, params) => {
      const cleaned = params.trim().replace(/,\s*$/, "");
      return cleaned
        ? `class={cn(${fn}({ ${cleaned} }), className)}`
        : `class={cn(${fn}(), className)}`;
    },
  );

  next = next.replace(
    /class=\{(\w+)\(\{\s*class:\s*className(?:\s+as\s+string\s+\|\s+undefined)?\s*,\s*([^}]*)\}\)\}/g,
    (_, fn, params) => {
      const cleaned = params.trim().replace(/,\s*$/, "");
      return cleaned
        ? `class={cn(${fn}({ ${cleaned} }), className)}`
        : `class={cn(${fn}(), className)}`;
    },
  );

  return next;
}

let changedFiles = 0;
for (const file of walk(root)) {
  const original = readFileSync(file, "utf8");
  let next = migrateContent(original);
  next = ensureCnImport(next);
  if (next !== original) {
    writeFileSync(file, next);
    changedFiles += 1;
    console.log(path.relative(root, file));
  }
}

console.log(`\nUpdated ${changedFiles} files.`);
