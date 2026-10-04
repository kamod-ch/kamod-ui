import { withBasePath } from "../../base-path";
import { PathDisplay } from "../components/PathDisplay";
import { motionComponentEntries } from "./motion-doc-config";

export function MotionComponentCatalog() {
  return (
    <ul class="docs-motion-catalog">
      {motionComponentEntries.map((entry) => (
        <li key={entry.slug}>
          <a
            class="docs-motion-catalog-card"
            href={withBasePath(`/docs/${entry.slug}/installation`)}
          >
            <span class="docs-motion-catalog-label">{entry.navLabel}</span>
            <span class="docs-motion-catalog-summary">{entry.summary}</span>
            <PathDisplay class="docs-motion-catalog-path" path={entry.packagePath} />
          </a>
        </li>
      ))}
    </ul>
  );
}
