import {
  FileCode2Icon,
  FileTypeCssIcon,
  FileTypeHtmlIcon,
  FileTypeJpgIcon,
  FileTypeJsIcon,
  FileTypeJsxIcon,
  FileTypePngIcon,
  FileTypeSvgIcon,
  FileTypeTsIcon,
  FileTypeTsxIcon,
  FileTypeTxtIcon,
  JsonIcon,
  MarkdownIcon,
} from "@kamod-ch/icons/tabler/outline";

const icons: Record<string, typeof FileCode2Icon> = {
  ts: FileTypeTsIcon,
  tsx: FileTypeTsxIcon,
  js: FileTypeJsIcon,
  mjs: FileTypeJsIcon,
  cjs: FileTypeJsIcon,
  jsx: FileTypeJsxIcon,
  css: FileTypeCssIcon,
  html: FileTypeHtmlIcon,
  json: JsonIcon,
  md: MarkdownIcon,
  mdx: MarkdownIcon,
  svg: FileTypeSvgIcon,
  png: FileTypePngIcon,
  jpg: FileTypeJpgIcon,
  jpeg: FileTypeJpgIcon,
  txt: FileTypeTxtIcon,
};

export const fileIconForPath = (path: string) => {
  const extension = path.split(".").at(-1)?.toLowerCase() ?? "";
  return Object.hasOwn(icons, extension) ? icons[extension] : FileCode2Icon;
};

const fileTypes: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript JSX",
  js: "JavaScript",
  mjs: "JavaScript module",
  cjs: "CommonJS JavaScript",
  jsx: "JavaScript JSX",
  css: "CSS stylesheet",
  scss: "Sass stylesheet",
  html: "HTML document",
  json: "JSON data",
  md: "Markdown",
  mdx: "Markdown with JSX",
  svg: "SVG image",
  png: "PNG image",
  jpg: "JPEG image",
  jpeg: "JPEG image",
  txt: "Plain text",
  yaml: "YAML configuration",
  yml: "YAML configuration",
  sh: "Shell script",
  bash: "Bash script",
  toml: "TOML configuration",
};

export function fileTypeForPath(path: string) {
  const name = path.split(/[\\/]/).at(-1) ?? "";
  const extension = name.match(/\.([a-z\d]+)$/i)?.[1].toLowerCase();
  if (/^\.env(?:\.|$)/.test(name)) return "Environment configuration";
  if (/^Dockerfile(?:\.|$)/i.test(name)) return "Dockerfile";
  if (!extension) return "Extensionless file";
  return `${fileTypes[extension] ?? `${extension.toUpperCase()} file`} (.${extension})`;
}
