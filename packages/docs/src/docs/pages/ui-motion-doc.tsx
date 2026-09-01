import { CodeBlock } from "../components/CodeBlock";
import { PackageFeatureGrid } from "../components/package-teaser";
import { MotionComponentCatalog } from "../motion/MotionComponentCatalog";
import type { DocPageModule } from "../types";
import { MOTION_COMMAND } from "./create-motion-doc-page";

const quickStartCode = `import {
  MotionDialogPortal,
  MotionDialogOverlay,
  MotionDialogContent,
} from "@kamod-ch/ui-motion/dialog";
import { Dialog, DialogTitle, DialogTrigger } from "@kamod-ch/ui/dialog";

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <MotionDialogPortal>
    <MotionDialogOverlay />
    <MotionDialogContent>
      <DialogTitle>Settings</DialogTitle>
    </MotionDialogContent>
  </MotionDialogPortal>
</Dialog>`;

export const uiMotionDocPage: DocPageModule = {
  slug: "ui-motion",
  title: "UI Motion",
  navGroup: "packages",
  command: MOTION_COMMAND,
  usageLabel: "Optional motion wrappers for Kamod UI primitives.",
  packagePath: "@kamod-ch/ui-motion",
  usageImportSnippet: `import { MotionDialogContent } from "@kamod-ch/ui-motion/dialog";`,
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Add @kamod-ch/ui-motion with @kamod-ch/motion, @kamod-ch/ui, preact, and motion. Core @kamod-ch/ui stays motion-free — install motion only when you need animated enter/exit.",
    },
    {
      id: "usage",
      title: "When to use",
      text: "Use motion wrappers when you need Presence-managed exit animations and preset-driven motion. Keep core components for CSS-only transitions and zero extra dependencies.",
    },
    {
      id: "components",
      title: "Components",
      text: "Each wrapper has a dedicated docs page under Motion in the sidebar.",
    },
    {
      id: "api-reference",
      title: "API Reference",
      text: "Subpath exports mirror Kamod UI primitives. Open a component page below for props and live previews.",
    },
    {
      id: "accessibility",
      title: "Accessibility Notes",
      text: "Motion wrappers do not replace focus traps, aria-modal, dismiss layers, or keyboard behavior from @kamod-ch/ui. @kamod-ch/motion presets honor prefers-reduced-motion.",
    },
  ],
  renderMain: (context) => (
    <>
      {context.renderTitleRow()}
      <section class="docs-package-teaser" aria-label="UI Motion overview">
        <p class="docs-package-teaser-eyebrow">Optional add-on</p>
        <h2 class="docs-package-teaser-headline">Animate Kamod UI without changing its core</h2>
        <p class="docs-package-teaser-lead">
          Swap content components for motion variants — dialog, sheet, alert dialog, accordion,
          collapsible, and tabs indicator — while keeping triggers, titles, and actions from
          @kamod-ch/ui.
        </p>
      </section>
      <PackageFeatureGrid
        features={[
          {
            title: "Composition, not fork",
            text: "Motion pages wrap existing primitives. Dialog roots, triggers, and a11y hooks stay unchanged.",
          },
          {
            title: "Exit animations",
            text: "Presence keeps nodes mounted through close animations — something CSS-only core content cannot do.",
          },
          {
            title: "Preset-driven",
            text: "Animations come from @kamod-ch/motion presets. Do not mix tw-animate classes on the same nodes.",
          },
        ]}
      />
      {context.sections.map((section) => (
        <section key={section.id} id={section.id} class="docs-section">
          <h2>{section.title}</h2>
          <p class="docs-copy">{section.text}</p>
          {section.id === "installation" ? context.renderSectionExtraContent(section.id) : null}
          {section.id === "usage" ? (
            <CodeBlock code={quickStartCode} language="tsx" className="docs-tab-code" />
          ) : null}
          {section.id === "components" ? <MotionComponentCatalog /> : null}
        </section>
      ))}
    </>
  ),
};
