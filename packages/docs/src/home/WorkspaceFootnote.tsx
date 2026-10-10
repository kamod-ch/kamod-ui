import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../base-path";

const notes = {
  code: {
    lead: "Small form.",
    link: "Give Save a real job.",
    href: "/docs/forms",
  },
  prompt: {
    lead: "Brief your AI.",
    link: "Start on solid ground.",
    href: "/docs/getting-started",
  },
};

/** Matching, fixed-position footnotes outside each view's scrolling content. */
export function WorkspaceFootnote({ view }: { view: keyof typeof notes }) {
  const { lead, link, href } = notes[view];
  return (
    <div class="home-workspace-footnote">
      {lead}{" "}
      <a href={withBasePath(href)}>
        {link}
        <ArrowUpRightIcon size={11} aria-hidden="true" />
      </a>
    </div>
  );
}
