import { Code, type CodeProps, CodeReferenceProvider } from "@kamod-ch/ui/code";
import type { ComponentChildren } from "preact";
import { resolveCodeReference } from "./destinations";

/** Private documentation reader: infer verified import links without loading tooltip details. */
export function ReferenceCode(props: CodeProps) {
  return (
    <Code
      {...props}
      resolveReference={
        props.resolveReference === undefined ? resolveCodeReference : props.resolveReference
      }
    />
  );
}

/** Share the same resolver with direct core usages and isolated documentation previews. */
export function ReferenceCodeProvider({ children }: { children: ComponentChildren }) {
  return <CodeReferenceProvider resolve={resolveCodeReference}>{children}</CodeReferenceProvider>;
}
