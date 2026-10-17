/** Private source/context facts, requested only after a reference tooltip opens. */
export type CodeReferenceHelpKind =
  | "component"
  | "export"
  | "type"
  | "function"
  | "constant"
  | "icon"
  | "module"
  | "package"
  | "file"
  | "command"
  | "block"
  | "technology"
  | "page";

export type CodeReferenceHelpLink = { label: string; href: string };

export type CodeReferenceHelpField = {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
  /** Source owners shown beside the same row in the full documentation table. */
  owners?: CodeReferenceHelpLink[];
};

/** Authored sections may share one chapter while retaining their own text, snippet and destination. */
export type CodeReferenceHelpExcerpt = {
  title: string;
  description?: string;
  code?: { language: string; value: string; caption?: string };
  source?: CodeReferenceHelpLink;
};

/** Saved source excerpts; only the open reference loads and renders these bounded miniatures. */
export type CodeReferenceHelpSection = {
  title: string;
  detail?: string;
  source?: CodeReferenceHelpLink;
  description?: string;
  code?: { language: string; value: string; caption?: string };
  rows?: { label: string; value: string }[];
  fields?: CodeReferenceHelpField[];
  contractName?: string;
  excerpts?: CodeReferenceHelpExcerpt[];
  definitions?: {
    name: string;
    code: string;
    source?: CodeReferenceHelpLink;
    filePath?: string;
    description?: string;
    exported?: boolean;
    fields?: CodeReferenceHelpField[];
  }[];
  note?: string;
};

/** All destinations are verified against source, authored guides or installed package metadata. */
export type CodeReferenceHelp = {
  kind: CodeReferenceHelpKind;
  name: string;
  module: string;
  originLabel?: string;
  description: string;
  detail?: string;
  signature?: string;
  source?: CodeReferenceHelpLink;
  docs?: CodeReferenceHelpLink;
  related?: (CodeReferenceHelpLink & { kind: "type" | "props" | "guide" | "source" })[];
  fields?: CodeReferenceHelpField[];
  facts?: { label: string; value: string }[];
  sections?: CodeReferenceHelpSection[];
};

/** Keep aliases tied to their original exports; label is the exact visible source token. */
export type CodeReferenceHelpRequest = {
  module: string;
  imported?: string;
  local?: string;
  filePath?: string;
  /** Build-index identity for an inline family; never inferred from a source-code token. */
  referenceId?: string;
  href: string;
  label: string;
};

export type CodeReferenceSourceSymbol = {
  name: string;
  kind: "component" | "type" | "function" | "constant";
  file: string;
  description: string;
  signature?: string;
  declaration?: string;
  exported?: boolean;
  typeNames: string[];
  fields?: CodeReferenceHelpField[];
  typeId?: string;
};

export type CodeReferenceSourceModule = {
  slug: string;
  /** Verified repository folder, or implementation file for a single-file utility. */
  sourcePath?: string;
  title: string;
  description: string;
  propsTitles: string[];
  symbols: CodeReferenceSourceSymbol[];
  sections?: CodeReferenceHelpSection[];
};

export type CodeReferencePackage = {
  name: string;
  description: string;
  repository?: string;
  homepage?: string;
  license?: string;
  private?: boolean;
};

export type CodeReferenceHelpCatalog = {
  packages: Record<string, CodeReferencePackage>;
  loaders: Record<string, () => Promise<CodeReferenceSourceModule>>;
  packageLoaders?: Record<string, () => Promise<Record<string, CodeReferenceSourceSymbol[]>>>;
  inlineLoaders?: Record<string, () => Promise<Record<string, CodeReferenceHelp>>>;
};

/** Only identities and destinations are eager; descriptions and contracts stay in lazy chunks. */
export type InlineReferenceIndex = {
  aliases: Record<string, [id: string, origin: string, href: string]>;
  routes: Record<string, string[]>;
  commands: Record<string, string>;
};
