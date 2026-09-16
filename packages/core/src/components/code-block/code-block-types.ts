export type CodeBlockProps = {
  /** Raw source copied to the clipboard — without line numbers or headers. */
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  /** When false (default), preserve whitespace and scroll horizontally. */
  wrap?: boolean;
  showCopyButton?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  class?: string;
};
