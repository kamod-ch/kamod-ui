import type { ComponentChildren, HTMLAttributes } from "preact";
import type { CopyStatus } from "../copy-button";
import type { CodeLanguage } from "./code-language";
import type { CodeReferenceResolver } from "./code-references";
import type { CodeSyntaxTheme } from "./code-themes";

/** State and behavior supplied to a replacement import-folding control. */
export interface CodeImportControlContext {
  /** ID of the source element, for `aria-controls`. */
  codeId: string;
  collapsed: boolean;
  /** Number of complete leading import statements. */
  count: number;
  onCollapsedChange: (collapsed: boolean) => void;
  /** The standard accessible import button, available for composition. */
  defaultControl: ComponentChildren;
}

/** State and behavior supplied to a replacement line-wrap control. */
export interface CodeWrapControlContext {
  /** ID of the source element, for `aria-controls`. */
  codeId: string;
  wrapped: boolean;
  onWrappedChange: (wrapped: boolean) => void;
  /** The standard labeled wrap switch, available for composition. */
  defaultControl: ComponentChildren;
}

export type CodeCopyStatus = CopyStatus;

/** Clipboard state stays local to the action; replacing it never duplicates clipboard work. */
export interface CodeCopyActionContext {
  codeId: string;
  /** ID of Code's retained live status region, for `aria-describedby`. */
  statusId: string;
  status: CodeCopyStatus;
  /** Copy the original complete source, retaining success/error callbacks and stale-result guards. */
  copy: () => Promise<void>;
  /** The standard copy button. Its live region is rendered separately by Code. */
  defaultControl: ComponentChildren;
}

/** A read-only source viewer. Display preferences never modify `code` or clipboard text. */
export interface CodeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "class" | "className" | "onCopy"
> {
  /** Complete, unmodified source to display and copy. Never passed to an evaluator. */
  code: string;
  /** Grammar name, common fence alias, or filename. Recognized hints take precedence. */
  language?: string;
  /** Infer missing/generic languages from the filename and bounded syntax checks. */
  inferLanguage?: boolean;
  /** Enable deferred syntax coloring. False keeps escaped source, language metadata and reading controls. */
  highlight?: boolean;
  /**
   * Lightweight syntax palette. "theme" derives colors from application semantic tokens.
   * Kamod presets follow light/dark mode; Prism presets
   * also set a fixed source canvas. Headers, controls and semantic surface variants
   * retain application styling.
   */
  syntaxTheme?: CodeSyntaxTheme;
  /** Resolve imported symbols/module strings to verified destinations. Inherits CodeReferenceProvider; null disables links for this panel. Never changes clipboard text. */
  resolveReference?: CodeReferenceResolver | null;
  /** Optional exact source path in the joined header, with a responsive full-source line count; also informs language inference. */
  filePath?: string;
  /** Replace only the path presentation, retaining its language-inference metadata. */
  renderFilePath?: (filePath: string) => ComponentChildren;
  /** Customize the resolved language label in the automatic header (for example, a documentation link). */
  renderLanguage?: (language: CodeLanguage, label: string) => ComponentChildren;
  /** Content beside the supplied toolbar actions; never included in copied code. */
  toolbarContent?: ComponentChildren;
  /** Compose a custom header around the supplied copy/wrap actions. */
  renderToolbar?: (actions: ComponentChildren) => ComponentChildren;
  /** Show the header and its copy action. False retains eligible reading controls in a separate row. */
  showToolbar?: boolean;
  /** Custom document view. Copy still uses `code`; highlighting and reading controls are skipped. */
  renderedContent?: ComponentChildren;
  /** Optional placeholder while deferred coloring loads. Plain text and custom documents skip it; failures reveal readable source. */
  loadingContent?: ComponentChildren;
  /** Content immediately before the source/document, after reading controls. Never copied. */
  beforeCode?: ComponentChildren;
  /** Content immediately after the source/document. Never copied. */
  afterCode?: ComponentChildren;
  /** Initial wrapping preference. Changing it later does not reset the reader's choice. */
  defaultWrapped?: boolean;
  /** Controlled wrapping preference; also works when the wrap control is hidden. */
  wrapped?: boolean;
  /** Called when a reader requests a wrapping change, in controlled or uncontrolled mode. */
  onWrappedChange?: (wrapped: boolean) => void;
  /** Choose overflow-driven controls (default), always-visible eligible controls, or controls only for snippets with imports. The latter two avoid width observers. */
  readingControls?: "overflow" | "always" | "imports";
  /** Allow line wrapping for any language. False hides the switch; fixed/controlled wrapping still works. */
  showWrapControl?: boolean;
  /** Replace an eligible wrap control; return null to omit it. Retains the same state behavior. */
  renderWrapControl?: (context: CodeWrapControlContext) => ComponentChildren;
  /** Allow folding when leading static JS/TS or CSS imports leave a nonempty body. Visibility follows readingControls. */
  showImportControl?: boolean;
  /** Replace an eligible import control; return null to omit it while retaining folding state. */
  renderImportControl?: (context: CodeImportControlContext) => ComponentChildren;
  /** Initial import state, reapplied when the source changes. Copy remains complete. */
  defaultImportsCollapsed?: boolean;
  /** Controlled import preference. Applied only when showImportControl is true and folding is eligible. */
  importsCollapsed?: boolean;
  /** Called when a reader requests an import-folding change. Source-change resets do not call it. */
  onImportsCollapsedChange?: (collapsed: boolean) => void;
  /** Include the copy action and accessible success/error feedback. */
  showCopy?: boolean;
  /** Replace the copy button. Code retains its live status region and clipboard lifecycle. */
  renderCopyAction?: (context: CodeCopyActionContext) => ComponentChildren;
  /** Semantic surface treatment. All variants use the same reading controls. */
  variant?: "default" | "subtle" | "outline";
  /** Classes on the outer source-viewer container. */
  class?: string;
  /** Classes on the scrollable preformatted source element. */
  preClassName?: string;
  /** @deprecated Use `preClassName` for the source element or `class` for the root. */
  className?: string;
  /** Called after copying succeeds. Receives the original complete source. */
  onCopy?: (code: string) => void;
  /** Called if clipboard access is unavailable or rejected. No success is reported on failure. */
  onCopyError?: (error: unknown) => void;
}
