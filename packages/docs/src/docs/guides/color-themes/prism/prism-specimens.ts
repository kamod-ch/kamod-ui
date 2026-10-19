/** The same short, runnable-looking sources make palette comparisons fair. */
export const prismSpecimens = {
  tsx: {
    label: "TSX",
    fileName: "ReviewQueue.tsx",
    description: "Component tags, typed props, comments and a small state change.",
    code: `import { useState } from "preact/hooks";

type Review = { title: string; count?: number };

// Keep the next useful action close to the content.
export function ReviewQueue({ title, count = 3 }: Review) {
  const [open, setOpen] = useState(false);

  return (
    <section aria-label={title} data-open={open}>
      <h2>{title}</h2>
      <button disabled={count === 0} onClick={() => setOpen(!open)}>
        {open ? "Close review" : \`Review \${count} changes\`}
      </button>
    </section>
  );
}`,
  },
  css: {
    label: "CSS",
    fileName: "review-queue.css",
    description: "Selectors, custom properties, functions and a responsive rule.",
    code: `/* A quiet surface with one clear action. */
.review-queue {
  --space: 1rem;
  display: grid;
  gap: var(--space);
  padding: calc(var(--space) * 1.5);
  color: var(--foreground);
  background: color-mix(in oklab, var(--primary) 5%, var(--background));
}

.review-queue[data-open="true"] { border-color: currentColor; }

@media (width >= 48rem) {
  .review-queue { grid-template-columns: 1fr auto; }
}`,
  },
  json: {
    label: "JSON",
    fileName: "review-queue.json",
    description: "Property names, strings, numbers, booleans and nested data.",
    code: `{
  "project": "Documentation",
  "release": "1.4.0",
  "ready": true,
  "pending": 3,
  "reviewers": ["Design", "Engineering"],
  "checks": {
    "keyboard": "passed",
    "appearance": "review",
    "blocker": null
  }
}`,
  },
} as const;

export type PrismSpecimenLanguage = keyof typeof prismSpecimens;

/** A docs-local adapter works without adding a new public Code syntaxTheme value. */
export const prismScopeRecipe = (id: string) => `import { Code } from "@kamod-ch/ui/code";
import "./prism-${id}.css";

export function ThemedSnippet({ code }: { code: string }) {
  return (
    <div data-prism-theme="${id}">
      <Code code={code} language="tsx" syntaxTheme="default" />
    </div>
  );
}`;
