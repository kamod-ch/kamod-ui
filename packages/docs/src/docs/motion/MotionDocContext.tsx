import { withBasePath } from "../../base-path";
import { PathDisplay } from "../components/PathDisplay";

type MotionDocContextProps = {
  coreSlug: string;
  coreTitle: string;
  replaces: string;
};

export function MotionDocContext({ coreSlug, coreTitle, replaces }: MotionDocContextProps) {
  return (
    <aside class="docs-motion-context" aria-label="Motion component context">
      <p>
        Motion-enhanced variant of{" "}
        <a href={withBasePath(`/docs/${coreSlug}/installation`)}>{coreTitle}</a>. Swap{" "}
        <code>{replaces}</code> for the matching export from{" "}
        <PathDisplay path={"@kamod-ch/ui-motion"} /> — keep the rest of the primitive tree from{" "}
        <PathDisplay path={"@kamod-ch/ui"} />.
      </p>
      <p class="docs-motion-context-meta">
        Requires <a href={withBasePath("/docs/ui-motion/installation")}>@kamod-ch/ui-motion</a> and
        peers.
      </p>
    </aside>
  );
}
