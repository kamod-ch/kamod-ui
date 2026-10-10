import { BookOpenIcon, CodeIcon, FileTextIcon, PackageIcon } from "@kamod-ch/icons/lucide";
import type { InlineCodeExplanation } from "./inline-code-glossary";

const contents = [
  {
    Icon: PackageIcon,
    title: "Choose & install",
    text: "When to use the package, approach tradeoffs and the installation command.",
  },
  {
    Icon: CodeIcon,
    title: "Build a first example",
    text: "Imports, step-by-step snippets and a complete worked example with its expected result.",
  },
  {
    Icon: FileTextIcon,
    title: "Integrate & troubleshoot",
    text: "State ownership, browser or server considerations, common symptoms and what to check.",
  },
  {
    Icon: BookOpenIcon,
    title: "Keep the sources handy",
    text: "Links to the full documentation, GitHub and npm, plus attribution where included.",
  },
];

/** Reuse the delegated help surface; no extra tooltip instances or listeners per download. */
export function packageReferenceHelp(target: HTMLElement): InlineCodeExplanation | undefined {
  const title = target.dataset.packageReference;
  const filename = target.getAttribute("download");
  if (!title || !filename) return;
  return {
    path: { label: filename },
    href: target.dataset.referenceDocs,
    description: (
      <>
        <strong>The {title} guide, ready to take with you.</strong> Save one editable Markdown file
        for your project notes, a teammate or a coding assistant.
      </>
    ),
    details: (
      <div class="package-reference-help">
        <div class="package-reference-help-summary">
          <span>
            <strong>One file</strong> · <code>.md</code>
          </span>
          <span>Read offline · Edit freely</span>
        </div>
        <h4>Inside the reference</h4>
        <dl class="package-reference-help-contents">
          {contents.map(({ Icon, title, text }) => (
            <div key={title}>
              <dt>
                <Icon size={14} aria-hidden="true" />
                <strong>{title}</strong>
              </dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        <p class="package-reference-help-note">
          <strong>Every view, the same file.</strong> Plain Text, Code and Markdown only change the
          on-page display. Download always includes the complete reference.
        </p>
        <p class="reference-help-description">
          Open it in your editor or Markdown reader. When adapting an example, compare its imports
          and APIs with your installed package version; the full documentation is linked below.
        </p>
      </div>
    ),
  };
}
