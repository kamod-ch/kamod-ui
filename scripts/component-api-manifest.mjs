import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import ts from "@typescript/typescript6";

const TYPE_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.InTypeAlias |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

/**
 * @param {string} coreRoot
 */
export function buildComponentApiManifest(coreRoot) {
  const packageJson = JSON.parse(readFileSync(join(coreRoot, "package.json"), "utf8"));
  const peers = Object.keys(packageJson.peerDependencies ?? {}).filter((name) => name !== "preact");
  const entries = exportEntries(coreRoot, packageJson.exports ?? {});
  const programEntries = entries.flatMap((entry) =>
    entry.source?.endsWith(".ts") || entry.source?.endsWith(".tsx") ? [entry.source] : [],
  );
  const options = compilerOptions(coreRoot);
  const program = ts.createProgram({ rootNames: programEntries, options });
  const checker = program.getTypeChecker();

  return {
    package: packageJson.name,
    exports: entries.map((entry) => describeExport(entry, { checker, program, coreRoot, peers })),
  };
}

/**
 * @param {string} coreRoot
 * @param {Record<string, unknown>} exportsField
 */
function exportEntries(coreRoot, exportsField) {
  return Object.keys(exportsField)
    .sort()
    .map((key) => {
      const published = publishedTarget(exportsField[key]);
      const source = sourceFileFor(coreRoot, published);
      const slug = key === "." ? "index" : key.replace(/^\.\//, "");
      return {
        export: key,
        specifier: `@kamod-ch/ui${key === "." ? "" : `/${slug}`}`,
        slug,
        published,
        source,
      };
    });
}

function publishedTarget(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (value);
  const target = record.import ?? record.default ?? record.require ?? record.types;
  return typeof target === "string" ? target : null;
}

function sourceFileFor(coreRoot, published) {
  if (!published?.startsWith("./dist/")) return null;
  let rel = published.slice("./dist/".length);
  if (rel.endsWith(".d.ts")) rel = `${rel.slice(0, -5)}.ts`;
  else if (rel.endsWith(".js")) rel = `${rel.slice(0, -3)}.ts`;
  const source = join(coreRoot, "src", rel);
  if (existsSync(source)) return source;
  const tsx = source.replace(/\.ts$/, ".tsx");
  return existsSync(tsx) ? tsx : null;
}

function compilerOptions(coreRoot) {
  const configPath = join(coreRoot, "tsconfig.json");
  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, coreRoot);
  return {
    ...parsed.options,
    noEmit: true,
    declaration: false,
    skipLibCheck: true,
  };
}

function describeExport(entry, context) {
  const size = measurePublished(context.coreRoot, entry.published);
  if (!entry.source || (!entry.source.endsWith(".ts") && !entry.source.endsWith(".tsx"))) {
    return {
      ...publicEntry(entry),
      signals: "none",
      signalsVia: null,
      size,
      peers: [],
      components: [],
    };
  }

  const sourceFile = context.program.getSourceFile(entry.source);
  const graph = sourceFile
    ? moduleGraph(sourceFile, context.program, context.coreRoot, context.peers)
    : { files: [], direct: false, via: null, peers: [] };
  const signals = graph.direct ? "direct" : graph.via ? "indirect" : "none";
  const peerSet = new Set(graph.peers);
  if (signals !== "none") peerSet.add("@preact/signals");

  return {
    ...publicEntry(entry),
    signals,
    signalsVia: signals === "indirect" ? graph.via : null,
    size,
    peers: [...peerSet].sort(),
    components: sourceFile ? exportedComponents(sourceFile, context.checker) : [],
  };
}

function publicEntry(entry) {
  return {
    export: entry.export,
    specifier: entry.specifier,
    slug: entry.slug,
  };
}

function moduleGraph(entryFile, program, coreRoot, peerNames) {
  const srcRoot = join(coreRoot, "src");
  const scope = entryScope(entryFile.fileName, srcRoot);
  const seen = new Set();
  const queue = [entryFile.fileName];
  const files = [];
  let direct = false;
  let via = null;
  const peers = new Set();

  while (queue.length > 0) {
    const fileName = queue.shift();
    if (!fileName || seen.has(fileName) || !fileName.startsWith(srcRoot)) continue;
    seen.add(fileName);
    files.push(fileName);
    const sourceFile = program.getSourceFile(fileName);
    if (!sourceFile) continue;
    const directory = componentDirectory(fileName, srcRoot);
    let importsSignals = false;
    for (const specifier of importSpecifiers(sourceFile)) {
      if (isSignalImport(specifier)) importsSignals = true;
      const peer = peerNames.find((name) => specifier === name || specifier.startsWith(`${name}/`));
      if (peer) peers.add(peer);
      if (!specifier.startsWith(".")) continue;
      const resolved = ts.resolveModuleName(
        specifier,
        fileName,
        program.getCompilerOptions(),
        ts.sys,
      ).resolvedModule;
      if (resolved?.resolvedFileName.startsWith(srcRoot)) queue.push(resolved.resolvedFileName);
    }
    if (!importsSignals) continue;
    if (fileName === scope || fileName.startsWith(`${scope}/`)) direct = true;
    else if (!via) via = directory ? basename(directory) : relative(srcRoot, dirname(fileName));
  }

  return { files, direct, via, peers: [...peers] };
}

function entryScope(fileName, srcRoot) {
  return (
    componentDirectory(fileName, srcRoot) ??
    (dirname(fileName) === srcRoot ? fileName : dirname(fileName))
  );
}

function componentDirectory(fileName, srcRoot) {
  const components = join(srcRoot, "components");
  if (!fileName.startsWith(`${components}/`)) return null;
  const [name] = relative(components, fileName).split("/");
  return name ? join(components, name) : null;
}

function importSpecifiers(sourceFile) {
  /** @type {string[]} */
  const specifiers = [];
  sourceFile.forEachChild((node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }
  });
  return specifiers;
}

function isSignalImport(specifier) {
  return (
    specifier === "@preact/signals" ||
    specifier.startsWith("@preact/signals/") ||
    /(^|\/)lib\/signals(\/|$)/.test(specifier)
  );
}

function exportedComponents(sourceFile, checker) {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) return [];
  return checker
    .getExportsOfModule(moduleSymbol)
    .flatMap((exported) => {
      if (!/^[A-Z]/.test(exported.name)) return [];
      const symbol =
        exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
      const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
      if (!declaration) return [];
      const signature = checker
        .getTypeOfSymbolAtLocation(symbol, declaration)
        .getCallSignatures()[0];
      const parameter = signature?.getDeclaration()?.parameters[0];
      if (!parameter) return [];
      const owner = parameter.getSourceFile();
      const propsType = checker.getTypeOfSymbolAtLocation(parameter.symbol, parameter);
      const propsName = annotationName(parameter) ?? "Props";
      const implementation = signature.getDeclaration();
      const bound = bindingDefaults(parameter, owner);
      const nullish = implementation
        ? nullishDefaults(implementation, implementation.getSourceFile())
        : new Map();
      const implementationFile = declaration.getSourceFile();
      const defaults = defaultVariants(implementationFile);
      const variants = variantUnions(implementationFile);
      const props = localProperties(propsType, checker, owner.fileName, boundNames(parameter))
        .map((prop) => ({
          name: prop.name,
          optional: prop.optional,
          type:
            prop.type === "any" && variants.has(prop.name) ? variants.get(prop.name) : prop.type,
          default:
            bound.get(prop.name) ||
            nullish.get(prop.name) ||
            defaults.get(prop.name) ||
            prop.jsDefault ||
            null,
          description: prop.description,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      return [
        {
          name: exported.name,
          propsType: propsName,
          props,
        },
      ];
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function annotationName(parameter) {
  const typeNode = parameter.type;
  if (!typeNode || !ts.isTypeReferenceNode(typeNode)) return null;
  const name = typeNode.typeName.getText();
  return name.length <= 80 ? name : null;
}

function boundNames(parameter) {
  const names = new Set();
  if (!ts.isObjectBindingPattern(parameter.name)) return names;
  for (const element of parameter.name.elements) {
    if (!ts.isBindingElement(element)) continue;
    const property = element.propertyName ?? element.name;
    if (ts.isIdentifier(property)) names.add(property.text);
  }
  return names;
}

function localProperties(type, checker, fileName, keepNames) {
  const srcRoot = fileName.includes("/src/")
    ? fileName.slice(0, fileName.indexOf("/src/") + 4)
    : dirname(fileName);
  const parts = type.isUnion() ? type.types : [type];
  /** @type {Map<string, { name: string, type: string, optional: boolean, description: string, jsDefault: string, seen: number }>} */
  const byName = new Map();
  for (const part of parts) {
    const names = new Set();
    for (const prop of part.getProperties()) {
      if (prop.name.startsWith("__") || prop.name === "prototype") continue;
      const declarations = prop.getDeclarations() ?? [];
      const declaredHere = declarations.some((declaration) =>
        declaration.getSourceFile().fileName.startsWith(srcRoot),
      );
      if (!declaredHere && !keepNames.has(prop.name)) continue;
      names.add(prop.name);
      const declaration = prop.valueDeclaration ?? declarations[0];
      const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
      const optional = (prop.flags & ts.SymbolFlags.Optional) !== 0;
      const text = displayType(
        checker.typeToString(propType, declaration, TYPE_FLAGS).replace(/\s+/g, " "),
        optional,
      );
      const docs = prop.getDocumentationComment?.(checker) ?? [];
      const tags = prop.getJsDocTags?.() ?? [];
      const defaultTag = tags.find((tag) => tag.name === "default");
      const current = byName.get(prop.name);
      byName.set(prop.name, {
        name: prop.name,
        type: text.length > 220 ? `${text.slice(0, 217)}...` : text,
        optional: current?.optional || (prop.flags & ts.SymbolFlags.Optional) !== 0,
        description:
          docs
            .map((part) => part.text)
            .join("")
            .replace(/\s+/g, " ")
            .trim() ||
          current?.description ||
          "",
        jsDefault:
          (defaultTag
            ? (defaultTag.text ?? [])
                .map((part) => part.text)
                .join("")
                .trim()
            : "") ||
          current?.jsDefault ||
          "",
        seen: (current?.seen ?? 0) + 1,
      });
    }
    for (const entry of byName.values()) {
      if (!names.has(entry.name)) entry.optional = true;
    }
  }
  return [...byName.values()].map((entry) => ({
    ...entry,
    optional: parts.length > 1 && entry.seen < parts.length ? true : entry.optional,
  }));
}

function displayType(text, optional) {
  const compact = text.trim();
  return optional ? compact.replace(/\s*\|\s*undefined$/, "") : compact;
}

function bindingDefaults(parameter, sourceFile) {
  const defaults = new Map();
  if (!ts.isObjectBindingPattern(parameter.name)) return defaults;
  for (const element of parameter.name.elements) {
    const property = element.propertyName ?? element.name;
    if (!ts.isBindingElement(element) || !element.initializer || !ts.isIdentifier(property))
      continue;
    if (!isLiteralDefault(element.initializer)) continue;
    defaults.set(property.text, element.initializer.getText(sourceFile));
  }
  return defaults;
}

function nullishDefaults(node, sourceFile) {
  const defaults = new Map();
  const visit = (current) => {
    if (
      ts.isBinaryExpression(current) &&
      current.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken &&
      ts.isIdentifier(current.left) &&
      isLiteralDefault(current.right)
    ) {
      defaults.set(current.left.text, current.right.getText(sourceFile));
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  return defaults;
}

function variantUnions(sourceFile) {
  const unions = new Map();
  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(sourceFile) === "variants" &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const group of node.initializer.properties) {
        if (!ts.isPropertyAssignment(group) || !ts.isObjectLiteralExpression(group.initializer))
          continue;
        const keys = group.initializer.properties.flatMap((property) => {
          if (!property.name) return [];
          const raw = property.name.getText(sourceFile).replace(/^['"]|['"]$/g, "");
          return raw ? [JSON.stringify(raw)] : [];
        });
        if (keys.length > 0) unions.set(group.name.getText(sourceFile), keys.join(" | "));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return unions;
}

function defaultVariants(sourceFile) {
  const defaults = new Map();
  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(sourceFile) === "defaultVariants" &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const property of node.initializer.properties) {
        if (!ts.isPropertyAssignment(property) || !isLiteralDefault(property.initializer)) continue;
        defaults.set(property.name.getText(sourceFile), property.initializer.getText(sourceFile));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return defaults;
}

function isLiteralDefault(node) {
  return (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isNumericLiteral(node) ||
    node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword ||
    node.kind === ts.SyntaxKind.NullKeyword
  );
}

function measurePublished(coreRoot, published) {
  if (!published) return { min: 0, gzip: 0 };
  const file = join(coreRoot, published);
  if (!existsSync(file)) return { min: 0, gzip: 0 };
  if (file.endsWith(".css")) {
    const css = readFileSync(file);
    return { min: css.length, gzip: gzipSync(css).length };
  }
  const files = [...collectDistFiles(file, join(coreRoot, "dist"))];
  const source = Buffer.concat(files.map((name) => readFileSync(name)));
  return { min: source.length, gzip: gzipSync(source).length };
}

function collectDistFiles(filePath, distRoot, seen = new Set()) {
  const abs = resolve(filePath);
  if (seen.has(abs) || !existsSync(abs) || !abs.startsWith(distRoot)) return seen;
  const rel = relative(distRoot, abs);
  if (
    ["preact", "@preact/signals"].some((prefix) => rel === prefix || rel.startsWith(`${prefix}/`))
  )
    return seen;
  seen.add(abs);
  if (!abs.endsWith(".js")) return seen;
  const code = readFileSync(abs, "utf8");
  for (const match of code.matchAll(/from\s+["'](\.\.?\/[^"']+)["']/g)) {
    collectDistFiles(resolve(abs, "..", match[1]), distRoot, seen);
  }
  return seen;
}

/**
 * @param {string} coreRoot
 * @param {string} manifestPath
 * @param {string} markdownPath
 */
export function outputsAreCurrent(coreRoot, manifestPath, markdownPath) {
  if (!existsSync(manifestPath) || !existsSync(markdownPath) || !existsSync(join(coreRoot, "dist")))
    return false;
  const outputTime = Math.min(statSync(manifestPath).mtimeMs, statSync(markdownPath).mtimeMs);
  const sources = [join(coreRoot, "package.json"), join(coreRoot, "tsconfig.json")];
  collectSourceFiles(join(coreRoot, "src"), sources);
  return sources.every((file) => statSync(file).mtimeMs <= outputTime);
}

function collectSourceFiles(dir, files) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) collectSourceFiles(file, files);
    else if (/\.(ts|tsx|css)$/.test(entry.name)) files.push(file);
  }
}
