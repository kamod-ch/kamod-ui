import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const tokensRoot = path.join(packageRoot, "tokens");
const generatedRoot = path.join(packageRoot, "src/generated");

const TYPES = new Set(["color", "dimension", "fontWeight", "number"]);
const COLOR_SPACES = {
  oklch: 3,
  srgb: 3,
};
const GROUP_KEYS = new Set(["$description", "$schema"]);
const TOKEN_KEYS = new Set(["$value", "$type", "$description", "$extensions"]);
const ALPHA_EXTENSION = "com.kamod.color-alpha";

export class TokenBuildError extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenBuildError";
  }
}

const fail = (message) => {
  throw new TokenBuildError(message);
};

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const isToken = (value) =>
  isObject(value) && (Object.hasOwn(value, "$value") || Object.hasOwn(value, "$ref"));

const aliasOf = (value) => {
  if (typeof value !== "string") return null;
  const match = value.match(/^\{([^{}]+)\}$/);
  return match ? match[1] : null;
};

const readJson = async (file) => {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    fail(`${path.relative(tokensRoot, file)} ist kein gültiges JSON (${error.message}).`);
  }
};

export const assertCssNameMap = (cssNames) => {
  const names = new Map();
  for (const [tokenPath, cssName] of Object.entries(cssNames)) {
    if (tokenPath.startsWith("$")) continue;
    if (typeof cssName !== "string" || !/^--[a-z0-9-]+$/.test(cssName)) {
      fail(`Die Zuordnung für ${tokenPath} ist kein öffentlicher CSS-Name (--name).`);
    }
    for (const [existingPath, existingName] of names) {
      if (existingName === cssName) {
        fail(`CSS-Name ${cssName} ist ${existingPath} und ${tokenPath} zugeordnet.`);
      }
    }
    names.set(tokenPath, cssName);
  }
  return names;
};

export const loadManifest = async () => {
  const manifest = await readJson(path.join(tokensRoot, "manifest.json"));
  const cssNames = assertCssNameMap(await readJson(path.join(tokensRoot, "css-names.json")));
  return { manifest, cssNames };
};

const mergeNodes = (target, source, file, origin, prefix = []) => {
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith("$")) {
      if (!GROUP_KEYS.has(key)) {
        fail(
          `Tokenpfad ${prefix.join(".") || "(Stamm)"} (${file}) enthält die unbekannte Eigenschaft ${key}.`,
        );
      }
      continue;
    }
    if (key.includes(".") || key.includes("{") || key.includes("}")) {
      fail(`Tokenname ${key} in ${file} enthält ein Zeichen, das Pfade oder Aliase bricht.`);
    }
    const tokenPath = [...prefix, key];
    const pathText = tokenPath.join(".");
    if (isToken(value)) {
      if (target[key] !== undefined) {
        const previous = origin.get(pathText);
        fail(
          `Tokenpfad ${pathText} ist in ${previous} und ${file} doppelt. Gleichnamige Tokens werden nicht überschrieben.`,
        );
      }
      for (const property of Object.keys(value)) {
        if (property.startsWith("$") && !TOKEN_KEYS.has(property)) {
          fail(`Tokenpfad ${pathText} (${file}) enthält die unbekannte Eigenschaft ${property}.`);
        }
      }
      if (Object.hasOwn(value, "$ref")) {
        fail(
          `Tokenpfad ${pathText} (${file}) verwendet $ref. Aliase haben die Form {gruppe.token}.`,
        );
      }
      target[key] = structuredClone(value);
      origin.set(pathText, file);
      continue;
    }
    if (!isObject(value)) {
      fail(`Tokenpfad ${pathText} (${file}) ist weder eine Gruppe noch ein Token.`);
    }
    if (target[key] !== undefined && isToken(target[key])) {
      fail(
        `Tokenpfad ${pathText} ist in ${origin.get(pathText)} ein Token und in ${file} eine Gruppe. Die Pfade kollidieren.`,
      );
    }
    target[key] ??= {};
    mergeNodes(target[key], value, file, origin, tokenPath);
  }
};

export const mergeTokenDocuments = (documents) => {
  const tree = {};
  const origin = new Map();
  for (const document of documents) {
    mergeNodes(tree, document.data, document.file, origin);
  }
  return { tree, origin };
};

const checkColor = (tokenPath, file, value) => {
  if (
    !isObject(value) ||
    typeof value.colorSpace !== "string" ||
    !Array.isArray(value.components)
  ) {
    fail(
      `Tokenpfad ${tokenPath} (${file}) hat Typ color, der Wert braucht colorSpace und components.`,
    );
  }
  const count = COLOR_SPACES[value.colorSpace];
  if (!count) {
    fail(
      `Tokenpfad ${tokenPath} (${file}) verwendet den Farbraum ${value.colorSpace}, den dieser Pilot nicht ausgibt.`,
    );
  }
  if (
    value.components.length !== count ||
    value.components.some((component) => typeof component !== "number")
  ) {
    fail(`Tokenpfad ${tokenPath} (${file}) braucht ${count} numerische Farbkomponenten.`);
  }
  if (value.colorSpace === "oklch") {
    const [lightness, chroma, hue] = value.components;
    if (lightness < 0 || lightness > 1 || chroma < 0 || hue < 0 || hue >= 360) {
      fail(`Tokenpfad ${tokenPath} (${file}) liegt außerhalb des OKLCH-Bereichs.`);
    }
  }
  if (
    value.colorSpace === "srgb" &&
    value.components.some((component) => component < 0 || component > 1)
  ) {
    fail(`Tokenpfad ${tokenPath} (${file}) liegt außerhalb des sRGB-Bereichs.`);
  }
  if (
    value.alpha !== undefined &&
    (typeof value.alpha !== "number" || value.alpha < 0 || value.alpha > 1)
  ) {
    fail(`Tokenpfad ${tokenPath} (${file}) hat einen Alpha-Wert außerhalb von 0 bis 1.`);
  }
  if (value.hex !== undefined && !/^#[0-9a-fA-F]{6}$/.test(value.hex)) {
    fail(`Tokenpfad ${tokenPath} (${file}) hat ein Hex, das nicht aus sechs Stellen besteht.`);
  }
};

const checkExplicitValue = (token) => {
  const { path: tokenPath, file, type, value } = token;
  if (type === "color") checkColor(tokenPath, file, value);
  if (type === "dimension") {
    if (
      !isObject(value) ||
      typeof value.value !== "number" ||
      (value.unit !== "px" && value.unit !== "rem")
    ) {
      fail(
        `Tokenpfad ${tokenPath} (${file}) hat Typ dimension, der Wert braucht eine Zahl und die Einheit px oder rem.`,
      );
    }
  }
  if (type === "fontWeight") {
    if (typeof value !== "number" || value < 1 || value > 1000) {
      fail(
        `Tokenpfad ${tokenPath} (${file}) hat Typ fontWeight, der Wert muss zwischen 1 und 1000 liegen.`,
      );
    }
  }
  if (type === "number" && typeof value !== "number") {
    fail(`Tokenpfad ${tokenPath} (${file}) hat Typ number, der Wert ist keine Zahl.`);
  }
};

const collectTokens = (tree, origin) => {
  const tokens = new Map();
  const walk = (node, prefix) => {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      const tokenPath = [...prefix, key].join(".");
      if (isToken(value)) {
        if (!TYPES.has(value.$type)) {
          fail(
            `Tokenpfad ${tokenPath} (${origin.get(tokenPath)}) hat den unbekannten Typ "${value.$type ?? ""}". Erlaubt sind color, dimension, fontWeight und number.`,
          );
        }
        const extensionKeys = value.$extensions ? Object.keys(value.$extensions) : [];
        for (const extension of extensionKeys) {
          if (extension !== ALPHA_EXTENSION) {
            fail(
              `Tokenpfad ${tokenPath} (${origin.get(tokenPath)}) verwendet die unbekannte Erweiterung ${extension}.`,
            );
          }
        }
        if (value.$extensions?.[ALPHA_EXTENSION] !== undefined) {
          const alpha = value.$extensions[ALPHA_EXTENSION];
          if (value.$type !== "color" || typeof alpha !== "number" || alpha < 0 || alpha > 1) {
            fail(
              `Tokenpfad ${tokenPath} (${origin.get(tokenPath)}) darf Deckkraft nur als color-Alpha zwischen 0 und 1 setzen.`,
            );
          }
        }
        tokens.set(tokenPath, {
          path: tokenPath,
          file: origin.get(tokenPath),
          type: value.$type,
          value: value.$value,
          alpha: value.$extensions?.[ALPHA_EXTENSION],
        });
        continue;
      }
      walk(value, [...prefix, key]);
    }
  };
  walk(tree, []);
  return tokens;
};

const resolveToken = (tokenPath, tokens, stack) => {
  const token = tokens.get(tokenPath);
  if (!token) return null;
  const alias = aliasOf(token.value);
  if (!alias) return token;
  if (stack.includes(tokenPath)) {
    fail(
      `Tokenpfad ${tokenPath} (${token.file}) bildet einen Zyklus: ${[...stack, tokenPath].join(" → ")}.`,
    );
  }
  if (!tokens.has(alias)) {
    fail(
      `Tokenpfad ${tokenPath} (${token.file}) verweist auf {${alias}}, diesen Token gibt es in dieser Kombination nicht.`,
    );
  }
  const resolved = resolveToken(alias, tokens, [...stack, tokenPath]);
  if (resolved.type !== token.type) {
    fail(
      `Tokenpfad ${tokenPath} (${token.file}) hat Typ ${token.type}, der Alias {${alias}} hat Typ ${resolved.type}.`,
    );
  }
  return { ...resolved, alpha: token.alpha ?? resolved.alpha };
};

export const validateTokens = ({ tree, origin, cssNames }) => {
  const tokens = collectTokens(tree, origin);
  for (const token of tokens.values()) {
    const alias = aliasOf(token.value);
    if (
      token.value !== undefined &&
      typeof token.value !== "object" &&
      typeof token.value !== "number" &&
      !alias
    ) {
      fail(
        `Tokenpfad ${token.path} (${token.file}) hat einen Wert, der kein DTCG-Wert und kein Alias {pfad} ist.`,
      );
    }
    if (!alias) checkExplicitValue(token);
    const resolved = resolveToken(token.path, tokens, []);
    if (token.alpha !== undefined && resolved.value?.colorSpace !== "oklch" && alias) {
      const concrete = resolveToken(aliasOf(token.value), tokens, [token.path]);
      if (concrete?.value?.colorSpace !== "oklch") {
        fail(
          `Tokenpfad ${token.path} (${token.file}) setzt Deckkraft auf einer Farbe, die kein OKLCH ist.`,
        );
      }
    }
    const published = token.file.startsWith("semantic/") || token.file.startsWith("components/");
    if (published && !cssNames.has(token.path)) {
      fail(
        `Tokenpfad ${token.path} (${token.file}) hat keine Zuordnung zu einem öffentlichen CSS-Namen.`,
      );
    }
  }
  return tokens;
};

const formatAlpha = (alpha) => {
  const percent = alpha * 100;
  const nearest = Math.round(percent);
  if (Math.abs(percent - nearest) < 1e-6) return `${nearest}%`;
  return String(alpha);
};

const formatColor = (value) => {
  if (value.alpha === 0) return "transparent";
  if (value.hex && (value.alpha === undefined || value.alpha === 1)) return value.hex;
  if (value.colorSpace === "oklch") {
    const body = value.components.join(" ");
    if (value.alpha !== undefined && value.alpha !== 1)
      return `oklch(${body} / ${formatAlpha(value.alpha)})`;
    return `oklch(${body})`;
  }
  fail(`Die Farbe ${value.colorSpace} kann ohne Hex nicht als CSS ausgegeben werden.`);
};

const paintAlpha = (css, alpha) => {
  if (alpha === 0) return "transparent";
  if (alpha === 1) return css;
  const match = /^(oklch\([^/]+)\)/.exec(css);
  if (!match) fail(`Deckkraft lässt sich auf den aufgelösten Wert ${css} nicht anwenden.`);
  return `${match[1]} / ${formatAlpha(alpha)})`;
};

const cssValueTransform = (token) => {
  const alpha = token.$extensions?.[ALPHA_EXTENSION];
  const value = token.$value;
  if (typeof value === "string") return alpha === undefined ? value : paintAlpha(value, alpha);
  if (isObject(value) && value.colorSpace) {
    return formatColor(alpha === undefined ? value : { ...value, alpha });
  }
  if (isObject(value) && typeof value.value === "number" && typeof value.unit === "string") {
    return `${value.value}${value.unit}`;
  }
  if (typeof value === "number") return String(value);
  fail(`Tokenpfad ${token.path.join(".")} hat nach der Auflösung keinen CSS-Wert.`);
};

const renderPart = async ({ tokens, selector, paths, cssNames }) => {
  const directory = await mkdtemp(path.join(tmpdir(), "kamod-tokens-"));
  try {
    const sd = new StyleDictionary(
      {
        usesDtcg: true,
        source: [],
        tokens,
        log: { warnings: "disabled", verbosity: "silent" },
        platforms: {
          css: {
            transforms: ["kamod/css-value"],
            buildPath: `${directory}/`,
            files: [{ destination: "part.css", format: "kamod/css", options: { selector, paths } }],
          },
        },
      },
      { init: false },
    );
    sd.registerTransform({
      name: "kamod/css-value",
      type: "value",
      transitive: true,
      filter: () => true,
      transform: cssValueTransform,
    });
    sd.registerFormat({
      name: "kamod/css",
      format({ dictionary, options }) {
        const byPath = new Map(dictionary.allTokens.map((token) => [token.path.join("."), token]));
        const allow = options.paths ? new Set(options.paths) : null;
        const lines = [];
        for (const [tokenPath, cssName] of cssNames) {
          if (allow && !allow.has(tokenPath)) continue;
          const token = byPath.get(tokenPath);
          if (!token) {
            if (allow)
              fail(`Tokenpfad ${tokenPath} fehlt in dieser Kombination, die Ausgabe erwartet ihn.`);
            continue;
          }
          // A component alias of a public variable is resolved on the component,
          // not baked here. A value on :root would be computed before a nested
          // container can override the target variable.
          const alias = aliasOf(token.original?.$value);
          const root = token.path?.[0];
          if (
            (root === "button" || root === "field" || root === "badge" || root === "card") &&
            alias &&
            cssNames.has(alias)
          ) {
            continue;
          }
          lines.push(`  ${cssName}: ${token.$value};`);
        }
        const selectorText = Array.isArray(options.selector)
          ? options.selector.join(",\n")
          : options.selector;
        return `${selectorText} {\n${lines.join("\n")}\n}\n`;
      },
    });
    await sd.init();
    await sd.buildAllPlatforms();
    return await readFile(path.join(directory, "part.css"), "utf8");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
};

const loadCombination = async (files) => {
  const documents = [];
  for (const file of files) {
    documents.push({ file, data: await readJson(path.join(tokensRoot, file)) });
  }
  return mergeTokenDocuments(documents);
};

const normalizeParts = (output) =>
  output.parts ?? [
    { brand: output.brand, mode: output.mode, selector: output.selector, paths: output.paths },
  ];

export const generateOutputs = async () => {
  const { manifest, cssNames } = await loadManifest();
  const cache = new Map();
  const seenPaths = new Set();

  const combinationFor = async (brand, mode) => {
    const key = `${brand}/${mode}`;
    if (cache.has(key)) return cache.get(key);
    const files = manifest.combinations?.[brand]?.[mode];
    if (!files) fail(`Die Kombination ${brand}/${mode} ist im Manifest nicht definiert.`);
    const merged = await loadCombination(files);
    validateTokens({ ...merged, cssNames });
    for (const tokenPath of merged.origin.keys()) seenPaths.add(tokenPath);
    const value = { ...merged, files };
    cache.set(key, value);
    return value;
  };

  const outputs = [];
  for (const output of manifest.outputs) {
    const blocks = [];
    for (const [index, part] of normalizeParts(output).entries()) {
      const combination = await combinationFor(part.brand, part.mode);
      const css = await renderPart({
        tokens: combination.tree,
        selector: part.selector,
        paths: part.paths,
        cssNames,
      });
      const sources = combination.files.join(", ");
      const header = [
        index === 0 ? "/* Generated by @kamod-ch/themes build:tokens. Do not edit. */" : null,
        `/* brand: ${part.brand} */`,
        `/* mode: ${part.mode} */`,
        `/* sources: ${sources} */`,
        "",
      ]
        .filter((line) => line !== null)
        .join("\n");
      blocks.push(`${header}${css}`);
    }
    outputs.push({ file: output.file, contents: `${blocks.join("\n")}` });
  }

  for (const tokenPath of cssNames.keys()) {
    if (!seenPaths.has(tokenPath)) {
      fail(
        `CSS-Name ${cssNames.get(tokenPath)} ist ${tokenPath} zugeordnet, dieser Pfad fehlt in jeder Kombination.`,
      );
    }
  }
  return outputs;
};

const listGeneratedFiles = async () => {
  const files = [];
  const walk = async (directory) => {
    let entries = [];
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(full);
      else files.push(path.relative(packageRoot, full));
    }
  };
  await walk(generatedRoot);
  return files.sort();
};

export const checkTokens = async () => {
  const expected = await generateOutputs();
  const messages = [];
  const expectedGenerated = new Set(
    expected.map((output) => output.file).filter((file) => file.startsWith("src/generated/")),
  );
  for (const output of expected) {
    const full = path.join(packageRoot, output.file);
    let current;
    try {
      current = await readFile(full, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") {
        messages.push(`fehlend: ${output.file}`);
        continue;
      }
      throw error;
    }
    if (current !== output.contents) messages.push(`veraltet: ${output.file}`);
  }
  for (const file of await listGeneratedFiles()) {
    if (!expectedGenerated.has(file)) messages.push(`überzählig: ${file}`);
  }
  return messages;
};

export const buildTokens = async () => {
  const outputs = await generateOutputs();
  for (const output of outputs) {
    const full = path.join(packageRoot, output.file);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, output.contents);
  }
  return outputs.map((output) => output.file);
};

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const command = process.argv[2];
  try {
    if (command === "build") {
      const files = await buildTokens();
      console.log(files.map((file) => `geschrieben: ${file}`).join("\n"));
    } else if (command === "check") {
      const messages = await checkTokens();
      if (messages.length > 0) {
        console.error(messages.join("\n"));
        process.exitCode = 1;
      }
    } else {
      fail("Verwendung: node scripts/tokens/build-tokens.mjs build|check");
    }
  } catch (error) {
    if (error instanceof TokenBuildError) {
      console.error(error.message);
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}
