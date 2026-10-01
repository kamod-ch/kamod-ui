/** Keep the path's origin and filename readable while intermediate directories shrink first. */
export function CodeFilePath({ path }: { path: string }) {
  const parts = path.split("/");
  const filename = parts.pop()!;
  const root = parts.length ? `${parts.shift()}/` : "";
  const middle = parts.join("/");
  return (
    <code
      class="docs-code-file-path"
      title={path}
      style={{ "--code-path-reserved": `${Math.min(root.length, 12) + (middle ? 2 : 0)}ch` }}
    >
      {root && <span class="docs-code-path-root">{root}</span>}
      {middle && <span class="docs-code-path-middle">{middle}</span>}
      <span class="docs-code-path-filename">
        {middle && "/"}
        {filename}
      </span>
    </code>
  );
}
