import { withBasePath } from "../../base-path";
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
            <code class="docs-motion-catalog-path">{entry.packagePath}</code>
          </a>
        </li>
      ))}
    </ul>
  );
}
