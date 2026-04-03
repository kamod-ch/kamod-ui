#!/usr/bin/env node
/**
 * One-shot codemod: rewrite @kamod-ui/core in doc strings to @/components/kamod-ui/<slug>.
 * Skips real import module specifiers and `pnpm add @kamod-ui/core`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const rewriteModulePath = path.join(ROOT, "apps/demo/src/docs/doc-snippet-rewrite.ts");
const rewriteSrc = fs.readFileSync(rewriteModulePath, "utf8");
const { outputText: rewriteJs } = ts.transpileModule(rewriteSrc, {
  compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2022 },
  fileName: "doc-snippet-rewrite.ts"
});
const rewriteTmp = path.join(ROOT, "tmp/doc-snippet-rewrite-run.mjs");
fs.mkdirSync(path.dirname(rewriteTmp), { recursive: true });
fs.writeFileSync(rewriteTmp, rewriteJs);

const { rewriteKamodCoreImportsInDocString } = await import(path.join(ROOT, "tmp/doc-snippet-rewrite-run.mjs"));

function collectDocSlugsLongestFirst() {
  const pagesDir = path.join(ROOT, "apps/demo/src/docs/pages");
  const slugs = [];
  for (const name of fs.readdirSync(pagesDir)) {
    if (!name.endsWith("-doc.tsx") && !name.endsWith("-doc.ts")) continue;
    const raw = fs.readFileSync(path.join(pagesDir, name), "utf8");
    const m = raw.match(/slug:\s*"([^"]+)"/);
    if (m) slugs.push(m[1]);
  }
  return [...new Set(slugs)].sort((a, b) => b.length - a.length);
}

const docSlugsLongestFirst = collectDocSlugsLongestFirst();

function quoteStringLiteral(content, preferSingle) {
  if (preferSingle) return `'${content.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  return JSON.stringify(content);
}

function escapeTemplateChunk(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function processSourceFile(filePath, slug) {
  const content = fs.readFileSync(filePath, "utf8");
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  /** @type {{ start: number; end: number; newText: string }[]} */
  const reps = [];

  function replaceStringLike(node) {
    const t = node.text;
    if (!t.includes("@kamod-ui/core")) return;
    if (t.trim() === "pnpm add @kamod-ui/core") return;
    const next = rewriteKamodCoreImportsInDocString(t, slug, docSlugsLongestFirst);
    if (next === t) return;
    if (ts.isStringLiteral(node)) {
      const q = content[node.getStart(sf)];
      const useSingle = q === "'";
      reps.push({
        start: node.getStart(sf),
        end: node.getEnd(sf),
        newText: quoteStringLiteral(next, useSingle)
      });
      return;
    }
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      reps.push({
        start: node.getStart(sf),
        end: node.getEnd(sf),
        newText: "`" + escapeTemplateChunk(next) + "`"
      });
      return;
    }
    if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const start = node.getStart(sf);
      const end = node.getEnd(sf);
      const tick = content[start] === "`" ? "`" : "";
      const suffix = ts.isTemplateHead(node) ? "${" : ts.isTemplateMiddle(node) ? "}${" : "`";
      const innerStart = start + (tick ? 1 : 0);
      const innerEnd = end - suffix.length;
      const newInner = escapeTemplateChunk(next);
      reps.push({ start: innerStart, end: innerEnd, newText: newInner });
    }
  }

  function visit(node, parent) {
    if (ts.isImportDeclaration(node)) {
      ts.forEachChild(node, (ch) => {
        if (ch === node.moduleSpecifier) return;
        visit(ch, node);
      });
      return;
    }
    if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      ts.forEachChild(node, (ch) => {
        if (ch === node.moduleSpecifier) return;
        visit(ch, node);
      });
      return;
    }

    if (ts.isStringLiteral(node)) {
      if (ts.isImportDeclaration(parent) && node === parent.moduleSpecifier) {
        return;
      }
      if (ts.isExportDeclaration(parent) && node === parent.moduleSpecifier) {
        return;
      }
      replaceStringLike(node);
      return;
    }

    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      replaceStringLike(node);
      return;
    }

    if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      replaceStringLike(node);
      return;
    }

    ts.forEachChild(node, (ch) => visit(ch, node));
  }

  visit(sf, undefined);

  reps.sort((a, b) => b.start - a.start);
  let out = content;
  for (const r of reps) {
    out = out.slice(0, r.start) + r.newText + out.slice(r.end);
  }
  return out;
}

const docsDir = path.join(ROOT, "apps/demo/src/docs");
const skipFiles = new Set([
  "doc-snippet-imports.ts",
  "doc-snippet-rewrite.ts",
  "registry.ts",
  "DocsComponentPage.tsx",
  "DocsShell.tsx",
  "create-generic-doc-page.tsx"
]);

function walk(dir) {
  const names = fs.readdirSync(dir, { withFileTypes: true });
  for (const n of names) {
    const p = path.join(dir, n.name);
    if (n.isDirectory()) walk(p);
    else if (n.name.endsWith(".tsx") || n.name.endsWith(".ts")) {
      const rel = path.relative(docsDir, p);
      if (skipFiles.has(n.name)) continue;
      const raw = fs.readFileSync(p, "utf8");
      const slugM = raw.match(/slug:\s*"([^"]+)"/);
      const slug = slugM?.[1];
      if (!slug) continue;
      const next = processSourceFile(p, slug);
      if (next !== raw) {
        fs.writeFileSync(p, next);
        console.log("updated", path.relative(ROOT, p));
      }
    }
  }
}

walk(docsDir);
console.log("done");
