import { ArrowUpRightIcon, FilesIcon } from "@kamod-ch/icons/lucide";
import { useTabs } from "@kamod-ch/ui/tabs";
import { PromptDocument } from "../blocks/PromptDocument";
import type { PreviewAppearance } from "../blocks/preview-appearance";
import workspaceSource from "./WorkspaceDemo.tsx?raw";
import { WorkspaceFootnote } from "./WorkspaceFootnote";

const workspacePrompt = `# Workspace preferences — set up and integrate

Build a **small, accessible preferences form** using the complete source below.
Keep the existing project's conventions and use **Preact**, TypeScript and Kamod UI.

## 1. Prepare the project
Inspect \`package.json\`, the app entry point and global styles first. Reuse the existing
\`@kamod-ch/ui\` theme setup and install only missing dependencies. Do not add React.

## 2. Add the composition
Save the source as \`src/components/workspace-demo.tsx\` and render \`<WorkspaceDemo />\`
on the intended screen. Preserve labels, native validation and keyboard operation.

## 3. Connect the save action
The included example keeps preferences in **local state**. Replace its submit handler
with the app's save operation when needed; show pending, success and error feedback.
Do not claim that preferences persist before a storage or service integration exists.

## 4. Check the result
Try an empty name, a name containing only spaces, and a valid name. Toggle product
updates with the keyboard. Check narrow screens, both color modes and long feedback.

## Source file
### src/components/workspace-demo.tsx
\`\`\`tsx
${workspaceSource.trim()}
\`\`\`
`;

/** Keep the home prompt focused on copying a complete setup request. */
export default function WorkspacePrompt({ appearance }: { appearance: PreviewAppearance }) {
  return (
    <>
      <PromptDocument
        appearance={appearance}
        prompt={workspacePrompt}
        mode="setup"
        display="code"
        sourceLabel={<WorkspaceSourceLink />}
        showWrapControl={false}
      />
      <WorkspaceFootnote view="prompt" />
    </>
  );
}

function WorkspaceSourceLink() {
  const { setValue } = useTabs();
  return (
    <button
      type="button"
      class="blocks-showcase-code-link home-workspace-source-link"
      onClick={() => setValue("code")}
    >
      <span class="blocks-prompt-source-count">
        <FilesIcon size={14} aria-hidden="true" />
        <span>
          <strong>1</strong> source file<span class="blocks-prompt-source-detail"> included</span>
        </span>
      </span>
      <ArrowUpRightIcon size={13} aria-hidden="true" />
    </button>
  );
}
