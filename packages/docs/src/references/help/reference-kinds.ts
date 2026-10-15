import {
  BlocksIcon,
  BracesIcon,
  ComponentIcon,
  CpuIcon,
  FileCodeIcon,
  FileTextIcon,
  LayersIcon,
  LockKeyholeIcon,
  PackageIcon,
  Share2Icon,
  SparklesIcon,
  SquareFunctionIcon,
  TerminalIcon,
} from "@kamod-ch/icons/lucide";
import type { CodeReferenceHelpKind } from "../types";

/** One presentation entry per kind keeps the header, badge and optional contract in sync. */
export const referenceKinds = {
  component: { Icon: ComponentIcon, label: "Component", contract: "Props at a glance" },
  export: { Icon: Share2Icon, label: "Export", contract: "Declared shape" },
  type: { Icon: BracesIcon, label: "Type definition", contract: "Shape at a glance" },
  function: { Icon: SquareFunctionIcon, label: "Function", contract: "Arguments at a glance" },
  constant: { Icon: LockKeyholeIcon, label: "Constant", contract: "Value at a glance" },
  icon: { Icon: SparklesIcon, label: "Icon", contract: "Icon options" },
  module: { Icon: LayersIcon, label: "Module", contract: "Exported shape" },
  package: { Icon: PackageIcon, label: "Package", contract: "Exported shape" },
  file: { Icon: FileCodeIcon, label: "Source file", contract: "Exported shape" },
  command: { Icon: TerminalIcon, label: "Command", contract: "Invocation" },
  block: { Icon: BlocksIcon, label: "Block variant", contract: "Block contract" },
  technology: { Icon: CpuIcon, label: "Technology", contract: "Technology details" },
  page: { Icon: FileTextIcon, label: "Page / section", contract: "Page details" },
} satisfies Record<
  CodeReferenceHelpKind,
  { Icon: typeof ComponentIcon; label: string; contract: string }
>;
