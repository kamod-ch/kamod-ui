import { type ComponentChildren, createContext } from "preact";
import type { CodeReferenceResolver } from "./code-references";

export const CodeReferenceContext = createContext<CodeReferenceResolver | null>(null);

/** Share a stable source destination resolver without coupling Code to a router or repository. */
export function CodeReferenceProvider({
  resolve,
  children,
}: {
  resolve: CodeReferenceResolver;
  children: ComponentChildren;
}) {
  return <CodeReferenceContext.Provider value={resolve}>{children}</CodeReferenceContext.Provider>;
}
