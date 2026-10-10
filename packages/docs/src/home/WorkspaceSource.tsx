import { ShowcaseCodePane } from "../docs/components/ShowcaseCodePane";
import workspaceSource from "./WorkspaceDemo.tsx?raw";
import { WorkspaceFootnote } from "./WorkspaceFootnote";

export default function WorkspaceSource() {
  return (
    <>
      <ShowcaseCodePane
        filename="workspace-demo.tsx"
        filePath="src/components/workspace-demo.tsx"
        code={workspaceSource}
      />
      <WorkspaceFootnote view="code" />
    </>
  );
}
