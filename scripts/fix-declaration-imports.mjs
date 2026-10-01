import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const outputDirectory = resolve(process.argv[2] ?? "dist");

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function declarationFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? declarationFiles(path)
        : Promise.resolve(entry.name.endsWith(".d.ts") ? [path] : []);
    }),
  );

  return files.flat();
}

async function runtimeSpecifier(file, specifier) {
  if (!specifier.startsWith(".") || /\.(?:[cm]?js|json|node)$/.test(specifier)) {
    return specifier;
  }

  const target = resolve(dirname(file), specifier);
  if (await isFile(`${target}.d.ts`)) {
    return `${specifier}.js`;
  }
  if (await isFile(join(target, "index.d.ts"))) {
    return `${specifier}/index.js`;
  }

  return specifier;
}

for (const file of await declarationFiles(outputDirectory)) {
  const source = await readFile(file, "utf8");
  const pattern = /\b(from\s*|import\s*(?:\(\s*)?|require\s*\(\s*)(["'])(\.[^"']*)\2/g;
  const matches = [...source.matchAll(pattern)];
  let rewritten = source;

  for (const match of matches.reverse()) {
    const specifier = match[3];
    const replacement = await runtimeSpecifier(file, specifier);
    if (replacement === specifier) continue;

    const start = match.index + match[0].lastIndexOf(specifier);
    rewritten = `${rewritten.slice(0, start)}${replacement}${rewritten.slice(start + specifier.length)}`;
  }

  if (rewritten !== source) {
    await writeFile(file, rewritten);
  }
}
