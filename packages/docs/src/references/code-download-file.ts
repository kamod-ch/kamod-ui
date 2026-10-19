import {
  type CodeLanguage,
  type CodeProps,
  codeLanguageForFile,
  normalizeCodeLanguage,
  resolveCodeLanguage,
} from "@kamod-ch/ui/code";

const formats: Record<CodeLanguage, { extension: string; mime: string }> = {
  text: { extension: "txt", mime: "text/plain" },
  typescript: { extension: "ts", mime: "text/typescript" },
  tsx: { extension: "tsx", mime: "text/typescript" },
  javascript: { extension: "js", mime: "text/javascript" },
  jsx: { extension: "jsx", mime: "text/javascript" },
  json: { extension: "json", mime: "application/json" },
  css: { extension: "css", mime: "text/css" },
  markup: { extension: "html", mime: "text/html" },
  markdown: { extension: "md", mime: "text/markdown" },
  bash: { extension: "sh", mime: "text/x-shellscript" },
  yaml: { extension: "yaml", mime: "application/yaml" },
  diff: { extension: "diff", mime: "text/x-diff" },
};

/** Source paths are labels: remove path and source-position metadata without rewriting their basename. */
const basename = (path?: string) =>
  path
    ?.trim()
    .replace(/[?#].*$/, "")
    .replace(/:\d+(?::\d+)?$/, "")
    .split(/[\\/]/)
    .at(-1) ?? "";

/** Match Code's language rules; an explicit or source filename always retains its exact clean basename. */
export function codeDownloadFile(
  {
    code,
    language,
    filePath,
    inferLanguage = true,
  }: Pick<CodeProps, "code" | "language" | "filePath" | "inferLanguage">,
  explicitFileName?: string,
) {
  const resolved = inferLanguage
    ? resolveCodeLanguage(code, language, filePath)
    : normalizeCodeLanguage(language);
  const fileName =
    basename(explicitFileName) || basename(filePath) || `snippet.${formats[resolved].extension}`;
  const extension = fileName.match(/\.([^./]+)$/)?.[1].toLowerCase();
  const fromFile = codeLanguageForFile(fileName);
  const mime =
    extension === "svg"
      ? "image/svg+xml"
      : extension === "xml"
        ? "application/xml"
        : extension === "txt" || extension === "text"
          ? "text/plain"
          : formats[fromFile === "text" ? resolved : fromFile].mime;
  return { fileName, mimeType: `${mime};charset=utf-8` };
}
