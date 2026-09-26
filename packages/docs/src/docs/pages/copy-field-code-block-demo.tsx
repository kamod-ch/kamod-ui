import { CodeBlock } from "@kamod-ch/ui/code-block";
import { CopyField } from "@kamod-ch/ui/copy-field";
import { useEffect, useState } from "preact/hooks";

const LONG_ID = "org_01J9X4K2M8QZ6R3T5Y7W0P9N2L4H6B8D0F2";

const SHELL = `curl -X POST https://api.example.com/v1/events \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"type":"invoice.paid"}'`;

const MULTILINE = `export const config = {
  region: "eu-central-1",
  retries: 3,
};`;

export const CopyFieldExamplesDemo = () => (
  <div class="grid max-w-xl gap-4">
    <CopyField
      label="Webhook URL"
      value="https://hooks.example.com/v1/inbound/9f3c2a1b-7d4e-5b6a-8c9d-0e1f2a3b4c5d"
      truncate="middle"
      copyLabel="Copy URL"
      copiedLabel="URL copied"
    />
    <CopyField
      label="Organization ID"
      value={LONG_ID}
      maxDisplayLength={24}
      truncate="middle"
      copyLabel="Copy ID"
    />
  </div>
);

export const CodeBlockPlainDemo = () => (
  <CodeBlock
    code={MULTILINE}
    language="typescript"
    filename="config.ts"
    showLineNumbers
    class="max-w-full"
  />
);

export const CodeBlockShellDemo = () => (
  <CodeBlock
    code={SHELL}
    language="bash"
    filename="send-event.sh"
    showLineNumbers
    copyLabel="Copy command"
  />
);

/** Demo-only clipboard failure simulation — not part of the primitives. */
export const ClipboardErrorDemo = () => {
  const [simulateFailure, setSimulateFailure] = useState(false);

  useEffect(() => {
    if (!simulateFailure) return;
    const previous = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("Clipboard blocked in demo")),
      },
    });
    return () => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: previous,
      });
    };
  }, [simulateFailure]);

  return (
    <div class="grid max-w-xl gap-3">
      <label class="text-sm">
        <input
          type="checkbox"
          checked={simulateFailure}
          onInput={(event) => setSimulateFailure(event.currentTarget.checked)}
        />{" "}
        Simulate clipboard failure
      </label>
      <CopyField
        label="Token"
        value="demo_token_abcdef0123456789"
        copyLabel="Copy token"
        fallbackHint="Token selected — copy manually with Ctrl+C or ⌘C."
      />
      <CodeBlock code={'echo "clipboard failure demo"'} language="bash" copyLabel="Copy command" />
    </div>
  );
};
