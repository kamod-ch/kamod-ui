/** Source facts extracted at build time, requested only after a code-reference tooltip opens. */
export type CodeReferenceHelpKind =
  | "component"
  | "export"
  | "type"
  | "function"
  | "constant"
  | "icon"
  | "module"
  | "package"
  | "file";

export type CodeReferenceHelpLink = { label: string; href: string };

export type CodeReferenceHelpField = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

/** All destinations are verified against source, authored guides or installed package metadata. */
export type CodeReferenceHelp = {
  kind: CodeReferenceHelpKind;
  name: string;
  module: string;
  description: string;
  detail?: string;
  signature?: string;
  source?: CodeReferenceHelpLink;
  docs?: CodeReferenceHelpLink;
  related?: (CodeReferenceHelpLink & { kind: "type" | "props" | "guide" | "source" })[];
  fields?: CodeReferenceHelpField[];
};

/** Keep aliases tied to their original exports; label is the exact visible source token. */
export type CodeReferenceHelpRequest = {
  module: string;
  imported?: string;
  local?: string;
  filePath?: string;
  href: string;
  label: string;
};

export type CodeReferenceSourceSymbol = {
  name: string;
  kind: "component" | "type" | "function" | "constant";
  file: string;
  description: string;
  signature?: string;
  typeNames: string[];
  fields?: CodeReferenceHelpField[];
  typeId?: string;
};

export type CodeReferenceSourceModule = {
  slug: string;
  title: string;
  description: string;
  propsTitles: string[];
  symbols: CodeReferenceSourceSymbol[];
};

export type CodeReferencePackage = {
  name: string;
  description: string;
  repository?: string;
  homepage?: string;
  license?: string;
};

export type CodeReferenceHelpCatalog = {
  packages: Record<string, CodeReferencePackage>;
  loaders: Record<string, () => Promise<CodeReferenceSourceModule>>;
  packageLoaders?: Record<string, () => Promise<Record<string, CodeReferenceSourceSymbol[]>>>;
};
