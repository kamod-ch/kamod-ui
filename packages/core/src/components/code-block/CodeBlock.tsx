import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { CheckIcon, CopyIcon, useCopyToClipboard } from "../copyable";
import type { CodeBlockProps } from "./code-block-types";
import { sanitizeCodeLanguage, splitCodeLines } from "./code-block-utils";
import { codeBlockHeader, codeBlockPre, codeBlockRoot } from "./code-block-variants";

export const CodeBlock = ({
  code,
  language,
  filename,
  showLineNumbers = false,
  wrap = false,
  showCopyButton = true,
  copyLabel = "Copy code",
  copiedLabel = "Copied",
  class: className,
}: CodeBlockProps) => {
  const { status, errorMessage, isCopying, copy } = useCopyToClipboard();
  const safeLanguage = sanitizeCodeLanguage(language);
  const lines = splitCodeLines(code);
  const showHeader = Boolean(filename || safeLanguage || showCopyButton);

  const handleCopy = () => {
    if (isCopying) return;
    void copy(code);
  };

  const buttonLabel = status === "copied" ? copiedLabel : copyLabel;

  return (
    <div data-slot="code-block" class={cn(codeBlockRoot(), className)}>
      {showHeader ? (
        <div class={codeBlockHeader()} data-slot="code-block-header">
          <div class="text-muted-foreground flex min-w-0 items-center gap-2">
            {filename ? (
              <span class="text-foreground truncate font-medium" data-slot="code-block-filename">
                {filename}
              </span>
            ) : null}
            {safeLanguage ? (
              <span
                class="bg-background rounded px-1.5 py-0.5 font-mono"
                data-slot="code-block-language"
              >
                {safeLanguage}
              </span>
            ) : null}
          </div>
          {showCopyButton ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              class="shrink-0"
              aria-label={buttonLabel}
              disabled={isCopying}
              data-copy-state={status}
              onClick={handleCopy}
            >
              {status === "copied" ? <CheckIcon /> : <CopyIcon />}
              <span>{buttonLabel}</span>
            </Button>
          ) : null}
        </div>
      ) : null}
      <pre class={codeBlockPre({ wrap })} data-slot="code-block-pre">
        {showLineNumbers ? (
          <code
            class={cn("grid gap-y-0", safeLanguage ? `language-${safeLanguage}` : undefined)}
            data-language={safeLanguage}
          >
            {lines.map((line, index) => (
              <span class="grid grid-cols-[auto_1fr] gap-x-4" key={`${index}-${line.length}`}>
                <span
                  aria-hidden="true"
                  class="text-muted-foreground select-none text-right tabular-nums"
                  data-slot="code-block-line-number"
                >
                  {index + 1}
                </span>
                <span class={wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"}>
                  {line || " "}
                </span>
              </span>
            ))}
          </code>
        ) : (
          <code
            class={cn(safeLanguage ? `language-${safeLanguage}` : undefined)}
            data-language={safeLanguage}
          >
            {code}
          </code>
        )}
      </pre>
      {status === "error" && errorMessage ? (
        <p
          role="alert"
          class="text-destructive border-border border-t px-3 py-2 text-xs"
          data-slot="code-block-error"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
