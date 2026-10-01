/** Small, independent examples; these complement rather than replace a variant's setup. */
export const guideExercises = [
  {
    slug: "getting-started",
    label: "Composition",
    title: "Give your content a place to live",
    description:
      "Create a small content wrapper inside your existing block. Keep the block’s sidebar and providers in place, then pass your own page content through children. Adjust the spacing here instead of adding padding to every child.",
    filePath: "src/components/PageSection.tsx",
    language: "tsx",
    code: `import type { ComponentChildren } from "preact";

export function PageSection({ children }: { children: ComponentChildren }) {
  return (
    <section class="min-w-0 space-y-6 p-4 sm:p-6">
      {children}
    </section>
  );
}`,
    check:
      "Render it in the block’s content area. Try a long heading and a wide table; keep horizontal scrolling local to the table, not the entire page. Reuse existing padding if the parent already provides it.",
    reference: "/blocks/getting-started",
    referenceLabel: "Integration guide",
  },
  {
    slug: "styles",
    label: "Actions",
    title: "Make the primary action easy to find",
    description:
      "Let the component’s variants establish the hierarchy. Keep one primary action and give the secondary action a quieter treatment. This reusable pair accepts real callbacks, so the example can connect to your app without hard-coded routes.",
    filePath: "src/components/EditorActions.tsx",
    language: "tsx",
    code: `import { Button } from "@kamod-ch/ui";

type EditorActionsProps = {
  onSave: () => void;
  onCancel: () => void;
};

export function EditorActions({ onSave, onCancel }: EditorActionsProps) {
  return (
    <div class="flex flex-wrap items-center gap-2">
      <Button type="button" size="sm" onClick={onSave}>Save changes</Button>
      <Button type="button" size="sm" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}`,
    check:
      "Connect both callbacks before using this in a screen. If saving is asynchronous, add pending and error handling in the owning component. For form submission, use the form’s submit handler and a submit button instead.",
    reference: "/docs/button/api-reference",
    referenceLabel: "Button reference",
  },
  {
    slug: "theming",
    label: "Surfaces",
    title: "Style a surface that follows your theme",
    description:
      "Use semantic tokens for a local content surface after your global theme import. Background and foreground belong together; a paired surface stays consistent when you change the preset or color scheme without a second set of hard-coded colors.",
    filePath: "src/app.css",
    language: "css",
    code: `.project-panel {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: clamp(1rem, 3vw, 1.5rem);
}

.project-panel__description {
  color: var(--muted-foreground);
}`,
    check:
      "Apply project-panel to a content container and project-panel__description to its supporting text. Check both schemes and your actual theme preset. Keep sidebar-specific surfaces on their own sidebar tokens.",
    reference: "/docs/theming/css-setup",
    referenceLabel: "CSS setup guide",
  },
] as const;
